import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, hexToBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/constants";

// Hardhat Account #1 private key (Agent)
const AGENT_PRIVATE_KEY = (process.env.AGENT_PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d") as `0x${string}`;

const account = privateKeyToAccount(AGENT_PRIVATE_KEY);

const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
});

const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
});

export async function POST(req: NextRequest) {
    try {
        const { campaignId, creatorAddress, contentUrl } = await req.json();

        console.log(`[AI Agent] Verifying content for campaign ${campaignId}, creator ${creatorAddress}`);
        console.log(`[AI Agent] URL: ${contentUrl}`);

        // AI Simulation: Check if URL contains instagram or youtube
        const isMockVerified = contentUrl.includes("instagram.com") || contentUrl.includes("youtube.com");

        if (!isMockVerified) {
            return NextResponse.json({
                success: false,
                message: "AI Agent could not verify the content. Ensure it's a valid Instagram or YouTube link."
            }, { status: 400 });
        }

        // Call verifyAndRelease on the escrow contract
        const { request } = await publicClient.simulateContract({
            account,
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "verifyAndRelease",
            args: [BigInt(campaignId), creatorAddress, true],
        });

        const hash = await client.writeContract(request);

        return NextResponse.json({
            success: true,
            txHash: hash,
            message: "AI Agent successfully verified the content and released payment!"
        });

    } catch (error: any) {
        console.error("[AI Agent] Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Unknown error during verification"
        }, { status: 500 });
    }
}
