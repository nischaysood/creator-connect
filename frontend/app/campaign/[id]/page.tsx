'use client';

import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';
import Link from 'next/link';

import { ESCROW_CONTRACT_ADDRESS } from '@/constants';

const ESCROW_ADDRESS = ESCROW_CONTRACT_ADDRESS;

export default function CampaignDetails() {
    const params = useParams();
    const id = params.id;
    const { address, isConnected } = useAccount();
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');

    // 1. Fetch Campaign
    const { data: campaign, error: campaignError, isLoading: isCampaignLoading } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: escrowArtifact.abi,
        functionName: 'campaigns',
        args: [BigInt(id as string)],
    });

    // 2. Fetch Enrollments
    const { data: enrollments } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: escrowArtifact.abi,
        functionName: 'getCampaignEnrollments',
        args: [BigInt(id as string)],
    });

    const myEnrollment = (enrollments as any[])?.find((e: any) => e.creator === address);
    const isEnrolled = !!myEnrollment;
    const isCreatorVerified = myEnrollment?.isVerified;
    const isPaid = myEnrollment?.isPaid;

    // 3. Enroll Action
    const { data: enrollHash, writeContract: writeEnroll, isPending: isEnrolling } = useWriteContract();
    const { isLoading: isWaitingEnroll } = useWaitForTransactionReceipt({ hash: enrollHash });

    // 4. Submit Action
    const { data: submitHash, writeContract: writeSubmit, isPending: isSubmitting } = useWriteContract();
    const { isLoading: isWaitingSubmit } = useWaitForTransactionReceipt({ hash: submitHash });

    const handleEnroll = () => {
        writeEnroll({
            address: ESCROW_ADDRESS,
            abi: escrowArtifact.abi,
            functionName: 'enroll',
            args: [BigInt(id as string)],
        });
    };

    const handleSubmit = () => {
        writeSubmit({
            address: ESCROW_ADDRESS,
            abi: escrowArtifact.abi,
            functionName: 'submitContent',
            args: [BigInt(id as string), submissionUrl],
        });
    };

    const handleVerify = async () => {
        if (!myEnrollment?.submissionUrl) return;
        setVerificationStatus('Verifying with AI Agent...');

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: id,
                    creatorAddress: address,
                    submissionUrl: myEnrollment.submissionUrl
                })
            });
            const data = await res.json();
            if (data.success) {
                setVerificationStatus('Verified & Paid! 🚀 Check wallet.');
                setVerificationStatus(`Failed: ${data.message || data.error}`);
            }
        } catch (e) {
            setVerificationStatus('Error contacting agent.');
        }
    };

    if (isCampaignLoading) return <div className="p-8 text-white">Loading campaign data...</div>;
    if (campaignError) return <div className="p-8 text-red-400">Error loading campaign: {campaignError.message}</div>;
    if (!campaign) return <div className="p-8 text-white">Campaign not found.</div>;

    const campaignData = campaign as any; // Cast for simpler access

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-400 hover:underline mb-6 block">← Back to Dashboard</Link>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Campaign #{id.toString()}</h1>
                            <p className="text-slate-400">Brand: {campaignData[1]}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">{Number(campaignData[3]) / 1e18} MNEE</p>
                            <p className="text-slate-500">Reward Per Creator</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <p>{campaignData[2]}</p>
                    </div>

                    {!isConnected ? (
                        <div className="text-yellow-500">Connect wallet to interact</div>
                    ) : (
                        <div className="border-t border-slate-800 pt-6">
                            {!isEnrolled ? (
                                <button
                                    disabled={isEnrolling || isWaitingEnroll}
                                    onClick={handleEnroll}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-lg transition disabled:opacity-50"
                                >
                                    {isEnrolling || isWaitingEnroll ? 'Enrolling...' : 'Enroll as Creator'}
                                </button>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                        <p className="font-bold text-purple-300">✅ You are enrolled in this campaign</p>
                                    </div>

                                    {!isCreatorVerified && !isPaid && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-slate-400 mb-1">Submit Content URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white"
                                                    placeholder="https://instagram.com/reel/..."
                                                    value={submissionUrl}
                                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                                />
                                                <button
                                                    disabled={isSubmitting || isWaitingSubmit}
                                                    onClick={handleSubmit}
                                                    className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold disabled:opacity-50"
                                                >
                                                    {isSubmitting || isWaitingSubmit ? 'Submitting...' : 'Submit Link On-Chain'}
                                                </button>
                                            </div>

                                            {myEnrollment?.submissionUrl && (
                                                <div className="mt-4">
                                                    <p className="mb-2">Submitted Link: <span className="text-blue-400">{myEnrollment.submissionUrl}</span></p>
                                                    <button
                                                        onClick={handleVerify}
                                                        className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg font-bold text-black hover:opacity-90"
                                                    >
                                                        ✨ Verify with AI Agent & Get Paid
                                                    </button>
                                                </div>
                                            )}
                                            {verificationStatus && <p className="mt-2 font-mono text-yellow-300">{verificationStatus}</p>}
                                        </div>
                                    )}

                                    {isPaid && (
                                        <div className="p-6 bg-green-900/40 border border-green-500 rounded-lg text-center">
                                            <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Payment Received!</h2>
                                            <p>The AI Agent verified your submission and released funds.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
