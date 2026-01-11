import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// CONFIGURATION
// ============================================

// Hardhat Account #1 - Verifier agent
const PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' as `0x${string}`;
const account = privateKeyToAccount(PRIVATE_KEY);

const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545')
}).extend(publicActions);

// Gemini API - Get your key from https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// ============================================
// TYPES
// ============================================

interface PlatformInfo {
    platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'unknown';
    contentType: 'video' | 'post' | 'reel' | 'short' | 'unknown';
    contentId: string | null;
    username: string | null;
    isValid: boolean;
}

interface OEmbedResult {
    exists: boolean;
    title?: string;
    author?: string;
    thumbnail?: string;
    html?: string;
    error?: string;
}

interface GeminiAnalysis {
    isContentAppropriate: boolean;
    isBrandSafe: boolean;
    hasSponsorship: boolean;
    contentDescription: string;
    detectedHashtags: string[];
    confidenceScore: number;
    brandMentions: string[];
    warnings: string[];
}

interface VerificationResult {
    verified: boolean;
    score: number;
    reason: string;
    aiAnalysis?: GeminiAnalysis;
    details: {
        platform: string;
        contentType: string;
        contentId: string | null;
        contentExists: boolean;
        title?: string;
        author?: string;
        thumbnail?: string;
    };
}

// ============================================
// PLATFORM DETECTION
// ============================================

function parseSocialUrl(url: string): PlatformInfo {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const pathname = urlObj.pathname;

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            let videoId: string | null = null;
            if (hostname.includes('youtu.be')) videoId = pathname.slice(1).split('?')[0];
            else if (pathname.includes('/watch')) videoId = urlObj.searchParams.get('v');
            else if (pathname.includes('/shorts/')) {
                videoId = pathname.split('/shorts/')[1]?.split('?')[0];
                return { platform: 'youtube', contentType: 'short', contentId: videoId, username: null, isValid: !!videoId };
            }
            return { platform: 'youtube', contentType: 'video', contentId: videoId, username: null, isValid: !!videoId && videoId.length >= 11 };
        }

        if (hostname.includes('instagram.com')) {
            const reelMatch = pathname.match(/\/reel\/([A-Za-z0-9_-]+)/);
            const postMatch = pathname.match(/\/p\/([A-Za-z0-9_-]+)/);
            if (reelMatch) return { platform: 'instagram', contentType: 'reel', contentId: reelMatch[1], username: null, isValid: true };
            if (postMatch) return { platform: 'instagram', contentType: 'post', contentId: postMatch[1], username: null, isValid: true };
            return { platform: 'instagram', contentType: 'unknown', contentId: null, username: null, isValid: false };
        }

        if (hostname.includes('tiktok.com')) {
            const videoMatch = pathname.match(/\/video\/(\d+)/);
            const userMatch = pathname.match(/\/@([A-Za-z0-9_.]+)/);
            if (videoMatch) return { platform: 'tiktok', contentType: 'video', contentId: videoMatch[1], username: userMatch?.[1] || null, isValid: true };
            return { platform: 'tiktok', contentType: 'unknown', contentId: null, username: userMatch?.[1] || null, isValid: false };
        }

        if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            const tweetMatch = pathname.match(/\/([A-Za-z0-9_]+)\/status\/(\d+)/);
            if (tweetMatch) return { platform: 'twitter', contentType: 'post', contentId: tweetMatch[2], username: tweetMatch[1], isValid: true };
            return { platform: 'twitter', contentType: 'unknown', contentId: null, username: null, isValid: false };
        }

        return { platform: 'unknown', contentType: 'unknown', contentId: null, username: null, isValid: false };
    } catch {
        return { platform: 'unknown', contentType: 'unknown', contentId: null, username: null, isValid: false };
    }
}

// ============================================
// OEMBED VALIDATION
// ============================================

async function validateWithOEmbed(url: string, platform: string): Promise<OEmbedResult> {
    try {
        let oembedUrl: string | null = null;
        if (platform === 'youtube') oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        else if (platform === 'twitter') oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
        else if (platform === 'tiktok') oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
        else if (platform === 'instagram') return { exists: true, title: 'Instagram Post', author: 'Instagram User' };

        if (!oembedUrl) return { exists: false, error: 'No oEmbed available' };

        const response = await fetch(oembedUrl, { headers: { 'User-Agent': 'CreatorConnect/1.0' } });
        if (!response.ok) return { exists: false, error: `HTTP ${response.status}` };

        const data = await response.json();
        return {
            exists: true,
            title: data.title || data.author_name,
            author: data.author_name,
            thumbnail: data.thumbnail_url,
            html: data.html
        };
    } catch {
        return { exists: true, title: 'Unable to fetch metadata' };
    }
}

// ============================================
// GEMINI AI ANALYSIS
// ============================================

async function analyzeWithGemini(
    thumbnailUrl: string | undefined,
    title: string,
    campaignRequirements?: string
): Promise<GeminiAnalysis> {
    const defaultResult: GeminiAnalysis = {
        isContentAppropriate: true,
        isBrandSafe: true,
        hasSponsorship: false,
        contentDescription: 'Unable to analyze',
        detectedHashtags: [],
        confidenceScore: 60,
        brandMentions: [],
        warnings: []
    };

    if (!genAI) {
        console.error('[Gemini] ❌ API key not configured!');
        throw new Error('Gemini API key is required. Add GEMINI_API_KEY to your .env file.');
    }

    try {
        console.log('[Gemini] Starting content analysis...');
        console.log('[Gemini] Title:', title);
        console.log('[Gemini] Campaign Requirements:', campaignRequirements || 'None');

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Campaign requirements matching prompt
        const prompt = `You are a content verification AI for an influencer marketing platform.

TASK: Analyze if the creator's content matches the brand's campaign requirements.

CONTENT TITLE: "${title}"

${campaignRequirements ? `BRAND REQUIREMENTS: ${campaignRequirements}` : 'BRAND REQUIREMENTS: General social media promotion'}

ANALYZE AND RESPOND WITH ONLY VALID JSON (no markdown, no code blocks):
{
    "requirementMatch": 0-100 (how well content matches brand requirements),
    "isContentAppropriate": true/false (no harmful/offensive content),
    "isBrandSafe": true/false (safe for brand association),
    "hasSponsorship": true/false (contains #ad #sponsored #paid etc),
    "contentDescription": "brief description of content",
    "matchedRequirements": ["list of requirements that were met"],
    "missedRequirements": ["list of requirements NOT met"],
    "confidenceScore": 0-100 (your confidence in this analysis),
    "recommendation": "APPROVE" or "REJECT" or "REVIEW",
    "reason": "1 sentence explaining your decision"
}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log('[Gemini] Analysis response:', responseText);

        // Parse JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);

            // Calculate if should be paid based on requirement match
            const shouldPay = parsed.requirementMatch >= 60 &&
                parsed.isBrandSafe !== false &&
                parsed.isContentAppropriate !== false;

            console.log('[Gemini] Requirement Match:', parsed.requirementMatch);
            console.log('[Gemini] Recommendation:', parsed.recommendation);
            console.log('[Gemini] Should Pay:', shouldPay);

            return {
                isContentAppropriate: parsed.isContentAppropriate ?? true,
                isBrandSafe: parsed.isBrandSafe ?? true,
                hasSponsorship: parsed.hasSponsorship ?? false,
                contentDescription: parsed.contentDescription || title,
                detectedHashtags: parsed.matchedRequirements || [],
                confidenceScore: parsed.requirementMatch || 50,
                brandMentions: parsed.missedRequirements || [],
                warnings: shouldPay ? [] : [`❌ ${parsed.reason || 'Requirements not met'}`]
            };
        }

        return defaultResult;
    } catch (error: any) {
        console.error('[Gemini] Analysis error:', error.message);
        return { ...defaultResult, warnings: ['⚠️ AI analysis temporarily unavailable'] };
    }
}

// ============================================
// COMPREHENSIVE VERIFICATION
// ============================================

async function verifyContent(url: string, campaignRequirements?: string): Promise<VerificationResult> {
    const platformInfo = parseSocialUrl(url);
    console.log(`[Verifier] Platform:`, platformInfo);

    if (platformInfo.platform === 'unknown') {
        return {
            verified: false, score: 0,
            reason: '❌ URL is not from a supported platform',
            details: { platform: 'unknown', contentType: 'unknown', contentId: null, contentExists: false }
        };
    }

    if (!platformInfo.isValid) {
        return {
            verified: false, score: 15,
            reason: `❌ Invalid ${platformInfo.platform} URL`,
            details: { platform: platformInfo.platform, contentType: platformInfo.contentType, contentId: null, contentExists: false }
        };
    }

    const oembedResult = await validateWithOEmbed(url, platformInfo.platform);
    if (!oembedResult.exists) {
        return {
            verified: false, score: 25,
            reason: '❌ Content not found or is private',
            details: { platform: platformInfo.platform, contentType: platformInfo.contentType, contentId: platformInfo.contentId, contentExists: false }
        };
    }

    // Gemini AI Analysis
    console.log('[Verifier] Running Gemini AI analysis...');
    const aiAnalysis = await analyzeWithGemini(
        oembedResult.thumbnail,
        oembedResult.title || '',
        campaignRequirements
    );

    // Calculate score
    let score = 35; // Base
    const reasons: string[] = [];

    // Platform (+15-20)
    if (platformInfo.platform === 'youtube') { score += 20; reasons.push('✅ YouTube'); }
    else if (platformInfo.platform === 'tiktok') { score += 18; reasons.push('✅ TikTok'); }
    else { score += 15; reasons.push(`✅ ${platformInfo.platform}`); }

    // Content type (+5-10)
    if (['video', 'reel', 'short'].includes(platformInfo.contentType)) { score += 10; reasons.push('🎬 Video'); }

    // AI Analysis scores
    if (aiAnalysis.hasSponsorship) { score += 20; reasons.push('✅ #Ad disclosure found'); }
    else { score -= 5; reasons.push('⚠️ No #Ad disclosure'); }

    if (aiAnalysis.isBrandSafe) { score += 10; reasons.push('✅ Brand safe'); }
    else { score -= 20; reasons.push('❌ Brand safety issue'); }

    if (aiAnalysis.isContentAppropriate) { score += 5; }
    else { score -= 25; reasons.push('❌ Inappropriate content'); }

    // Confidence bonus
    if (aiAnalysis.confidenceScore >= 80) { score += 10; }
    else if (aiAnalysis.confidenceScore >= 60) { score += 5; }

    // Title/author
    if (oembedResult.title) {
        reasons.push(`📝 "${oembedResult.title.substring(0, 30)}..."`);
    }

    score = Math.min(99, Math.max(0, score));
    const verified = score >= 60 && aiAnalysis.isBrandSafe && aiAnalysis.isContentAppropriate;

    return {
        verified,
        score,
        reason: reasons.join(' • '),
        aiAnalysis,
        details: {
            platform: platformInfo.platform,
            contentType: platformInfo.contentType,
            contentId: platformInfo.contentId,
            contentExists: true,
            title: oembedResult.title,
            author: oembedResult.author,
            thumbnail: oembedResult.thumbnail
        }
    };
}

// ============================================
// API HANDLER
// ============================================

export async function POST(req: Request) {
    try {
        const { url, campaignId, creatorAddress, campaignRequirements } = await req.json();

        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        if (!creatorAddress) return NextResponse.json({ error: 'Creator address required' }, { status: 400 });

        console.log(`\n${'═'.repeat(60)}`);
        console.log(`[AI Agent] 🤖 GEMINI-POWERED VERIFICATION`);
        console.log(`[AI Agent] Campaign: ${campaignId} | Creator: ${creatorAddress.slice(0, 10)}...`);
        console.log(`[AI Agent] URL: ${url}`);
        console.log(`[AI Agent] Gemini API: ${genAI ? '✅ Active' : '⚠️ Not configured'}`);
        console.log(`${'═'.repeat(60)}`);

        const result = await verifyContent(url, campaignRequirements);
        console.log(`[AI Agent] Score: ${result.score}/100 | Verified: ${result.verified}`);

        if (!result.verified) {
            console.log(`[AI Agent] ❌ VERIFICATION FAILED`);
            return NextResponse.json(result);
        }

        // On-chain payout
        let txHash = null;
        if (campaignId !== undefined) {
            try {
                console.log(`[AI Agent] ✅ VERIFIED - Triggering payout...`);
                txHash = await client.writeContract({
                    address: ESCROW_ADDRESS as `0x${string}`,
                    abi: ESCROW_ABI,
                    functionName: 'verifyAndRelease',
                    args: [BigInt(campaignId), creatorAddress as `0x${string}`, true],
                    account,
                });
                console.log(`[AI Agent] 💰 PAYOUT TX: ${txHash}`);
            } catch (err: any) {
                console.error('[AI Agent] Payout Error:', err.message);
            }
        }

        console.log(`${'═'.repeat(60)}\n`);
        return NextResponse.json({ ...result, txHash });

    } catch (error) {
        console.error('[AI Agent] Fatal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
