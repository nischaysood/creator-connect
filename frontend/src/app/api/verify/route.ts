import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { url, campaignId, requirements } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // SIMULATED AI AGENT BEHAVIOR
        // In a real app, this would use Puppeteer/Playwright to scrape the content
        // and an LLM to verify it against the requirements.

        console.log(`[AI Agent] Analyzing content at: ${url} for campaign ${campaignId}`);

        // Mock analysis delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Basic heuristic checks simulation
        const isSocialMedia = url.includes('twitter.com') || url.includes('instagram.com') || url.includes('youtube.com') || url.includes('tiktok.com');

        // Deterministic mock result based on URL length to allow for testing both success and failure
        // If URL contains "fail", we return a low score.
        const shouldFail = url.toLowerCase().includes('fail');

        if (!isSocialMedia) {
            return NextResponse.json({
                verified: false,
                score: 0,
                reason: 'URL must be from a supported social platform (Twitter, Instagram, YouTube, TikTok).'
            });
        }

        if (shouldFail) {
            return NextResponse.json({
                verified: false,
                score: 45,
                reason: 'Content does not appear to match campaign requirements. Missing required hashtag #Ad.'
            });
        }

        return NextResponse.json({
            verified: true,
            score: 95,
            reason: 'Content verified! • High engagement detected • Required hashtags found • Brand safe'
        });

    } catch (error) {
        console.error('AI Verify Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
