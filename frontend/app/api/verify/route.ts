import { NextResponse } from 'next/server';
import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';

// Hardhat Account #1 Private Key (Agent)
const AGENT_PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
import { ESCROW_CONTRACT_ADDRESS } from '@/constants';

export async function POST(request: Request) {
    try {
        const { campaignId, creatorAddress, submissionUrl } = await request.json();

        if (!campaignId || !creatorAddress || !submissionUrl) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // --- AI Verification Logic (Mock) ---
        console.log(`[Agent] Verifying submission: ${submissionUrl} for Campaign ${campaignId}`);

        // Simulate AI check: Must be a valid URL and contain "instagram.com" or "youtube.com"
        const isValidUrl = submissionUrl.includes('instagram.com') || submissionUrl.includes('youtube.com');
        const isMockPass = !submissionUrl.includes('fail'); // Allow forcing failure for demo

        const verificationResult = isValidUrl && isMockPass;
        const verificationReason = verificationResult
            ? 'Content verified: Matching platform requirements.'
            : 'Verification failed: Invalid platform or content.';

        console.log(`[Agent] Result: ${verificationResult} (${verificationReason})`);

        if (!verificationResult) {
            return NextResponse.json({ success: false, message: verificationReason });
        }

        // --- On-Chain Settlement ---
        const account = privateKeyToAccount(AGENT_PRIVATE_KEY);
        const client = createWalletClient({
            account,
            chain: hardhat,
            transport: http('http://127.0.0.1:8545')
        });

        const publicClient = createPublicClient({
            chain: hardhat,
            transport: http('http://127.0.0.1:8545')
        });

        console.log('[Agent] Submitting transaction to smart contract...');

        // Call verifyAndRelease(campaignId, creator, isValid)
        const { request: txRequest } = await publicClient.simulateContract({
            address: ESCROW_CONTRACT_ADDRESS as `0x${string}`,
            abi: escrowArtifact.abi,
            functionName: 'verifyAndRelease',
            args: [BigInt(campaignId), creatorAddress, true],
            account
        });

        const hash = await client.writeContract(txRequest);

        console.log(`[Agent] Transaction sent: ${hash}`);

        return NextResponse.json({
            success: true,
            message: 'Verified and paid!',
            txHash: hash
        });

    } catch (error: any) {
        console.error('[Agent] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
