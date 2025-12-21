'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';
import ierc20Artifact from '@/utils/IERC20.json';

import { ESCROW_CONTRACT_ADDRESS, MNEE_ADDRESS as MNEE_ADDR } from '@/constants';

const ESCROW_ADDRESS = ESCROW_CONTRACT_ADDRESS;
const MNEE_ADDRESS = MNEE_ADDR;

export default function CreateCampaign() {
    const [details, setDetails] = useState('');
    const [reward, setReward] = useState('');
    const [maxCreators, setMaxCreators] = useState(1);

    const totalCost = reward ? parseEther(reward) * BigInt(maxCreators) : BigInt(0);

    // 1. Approve
    const { data: approveHash, writeContract: writeApprove, isPending: isApproving } = useWriteContract();
    const { isLoading: isWaitingApprove, isSuccess: isApproved } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    // 2. Create
    const { data: createHash, writeContract: writeCreate, isPending: isCreating } = useWriteContract();
    const { isLoading: isWaitingCreate, isSuccess: isCreated } = useWaitForTransactionReceipt({
        hash: createHash,
    });

    const handleApprove = () => {
        writeApprove({
            address: MNEE_ADDRESS,
            abi: ierc20Artifact.abi,
            functionName: 'approve',
            args: [ESCROW_ADDRESS, totalCost],
        });
    };

    const handleCreate = () => {
        writeCreate({
            address: ESCROW_ADDRESS,
            abi: escrowArtifact.abi,
            functionName: 'createCampaign',
            args: [details, reward ? parseEther(reward) : BigInt(0), BigInt(maxCreators)],
        });
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8 flex justify-center items-center">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6">
                    Launch Campaign
                </h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1">Campaign Details</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                            rows={3}
                            placeholder="Requirements..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Reward Per Creator (MNEE)</label>
                        <input
                            type="number"
                            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="50"
                            value={reward}
                            onChange={(e) => setReward(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Max Creators</label>
                        <input
                            type="number"
                            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-blue-500"
                            value={maxCreators}
                            onChange={(e) => setMaxCreators(Number(e.target.value))}
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            disabled={isApproving || isWaitingApprove || isApproved}
                            onClick={handleApprove}
                            className={`w-full py-3 rounded-lg font-bold transition ${isApproved
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                } disabled:opacity-50`}
                        >
                            {isApproving || isWaitingApprove ? 'Approving...' : isApproved ? 'Approved ✅' : '1. Approve MNEE'}
                        </button>

                        <button
                            disabled={isCreating || isWaitingCreate || !isApproved}
                            onClick={handleCreate}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold disabled:opacity-50"
                        >
                            {isCreating || isWaitingCreate ? 'Creating...' : '2. Create Campaign'}
                        </button>

                        {isCreated && (
                            <div className="p-3 bg-green-900/50 border border-green-800 rounded text-green-200 text-center">
                                Campaign Created!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
