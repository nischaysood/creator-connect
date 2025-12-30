import { NextResponse } from 'next/server';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/constants';

const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;
const account = PRIVATE_KEY ? privateKeyToAccount(PRIVATE_KEY) : undefined;

const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545')
}).extend(publicActions);

export async function POST(req: Request) {
    try {
        const { url, campaignId, creatorAddress } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        if (!creatorAddress) {
            return NextResponse.json({ error: 'Creator address is required' }, { status: 400 });
        }

        console.log(`[AI Agent] Analyzing content at: ${url} for campaign ${campaignId}`);

        // Mock analysis delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Basic heuristic checks simulation
        const isSocialMedia = url.includes('twitter.com') || url.includes('instagram.com') || url.includes('youtube.com') || url.includes('tiktok.com');
        const shouldFail = url.toLowerCase().includes('fail');

        if (!isSocialMedia) {
            return NextResponse.json({
                verified: false,
                score: 0,
                reason: 'URL must be from a supported social platform.'
            });
        }

        if (shouldFail) {
            return NextResponse.json({
                verified: false,
                score: 45,
                reason: 'Content missing required hashtag #Ad.'
            });
        }

        // --- ON-CHAIN PAYOUT ---
        let txHash = null;
        if (PRIVATE_KEY && campaignId && creatorAddress) {
            try {
                txHash = await client.writeContract({
                    address: ESCROW_ADDRESS,
                    abi: ESCROW_ABI,
                    functionName: 'verifyAndRelease',
                    args: [BigInt(campaignId), creatorAddress, true],
                    account: account!,
                });
                console.log(`[AI Agent] Payout triggered! Tx: ${txHash}`);
            } catch (contractError) {
                console.error('[AI Agent] Contract Payout Error:', contractError);
            }
        }

        return NextResponse.json({
            verified: true,
            score: 95,
            reason: 'Content verified! • High engagement detected • Required hashtags found',
            txHash
        });

    } catch (error) {
        console.error('AI Verify Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
