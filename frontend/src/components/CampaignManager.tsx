"use client";

import React, { useState } from "react";
import {
    X,
    Users,
    Zap,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Loader2
} from "lucide-react";
import { formatEther } from "viem";
import { cn } from "@/lib/utils";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/constants";

interface CampaignManagerProps {
    id: number;
    campaign: any;
    onClose: () => void;
}

export function CampaignManager({ id, campaign, onClose }: CampaignManagerProps) {
    const [activeTab, setActiveTab] = useState<"submissions" | "analytics" | "settings">("submissions");
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    // Fetch Enrollments
    const { data: enrollments, refetch } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "getCampaignEnrollments",
        args: [BigInt(id)],
    });

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    React.useEffect(() => {
        if (isConfirmed) {
            setVerifyingId(null);
            refetch();
            alert("Transaction Confirmed!");
        }
    }, [isConfirmed, refetch]);

    const handleVerify = (creatorAddress: string) => {
        setVerifyingId(creatorAddress);
        writeContract({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "verifyAndRelease",
            args: [BigInt(id), creatorAddress as `0x${string}`, true],
        });
    };

    // Parse Metadata
    let meta = { name: "Campaign #" + id, desc: "" };
    try {
        meta = JSON.parse(campaign[2]);
    } catch (e) {
        meta.name = campaign[2] || `Campaign #${id}`;
    }

    // @ts-ignore
    const submissionsList = (enrollments as any[]) || [];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-5xl h-[80vh] bg-[#05050A] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className="h-20 border-b border-white/5 bg-white/5 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                            #{id}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{meta.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {submissionsList.length} Creators</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="flex items-center gap-1 text-emerald-400"><Zap className="w-3 h-3" /> Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-black/20 rounded-lg p-1">
                            {["submissions", "analytics", "settings"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                                        activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-8">

                    {activeTab === "submissions" && (
                        <div className="space-y-6">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Creator Submissions</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search creator..."
                                        className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 w-64"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="w-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5 text-xs text-gray-400 uppercase tracking-widest">
                                            <th className="p-4 font-medium">Creator</th>
                                            <th className="p-4 font-medium">Submission</th>
                                            <th className="p-4 font-medium">Status</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {submissionsList.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                                    No creators have joined this campaign yet.
                                                </td>
                                            </tr>
                                        )}
                                        {submissionsList.map((sub: any, idx: number) => (
                                            <SubmissionRow
                                                key={idx}
                                                sub={sub}
                                                onVerify={() => handleVerify(sub.creator)}
                                                isPendingTx={isPending && verifyingId === sub.creator}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                    {activeTab === "analytics" && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Analytics Coming Soon</h3>
                            <p className="text-gray-400 max-w-md">
                                Detailed breakdown of engagement, ROI, and audience demographics will be available in the next update.
                            </p>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="max-w-xl space-y-6">
                            <h3 className="text-xl font-bold text-white">Campaign Settings</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-red-400">Pause Campaign</h4>
                                        <p className="text-xs text-gray-400">Temporarily stop new creators from joining.</p>
                                    </div>
                                    <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors">
                                        Pause
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function SubmissionRow({ sub, onVerify, isPendingTx }: { sub: any, onVerify: () => void, isPendingTx: boolean }) {
    const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
    const [aiResult, setAiResult] = useState<any>(null);

    const runAiAnalysis = async () => {
        setAiStatus('analyzing');
        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                body: JSON.stringify({ url: sub.submissionUrl, campaignId: "123" }), // mock ID
            });
            const data = await res.json();
            setAiStatus('success');
            setAiResult(data);
        } catch (e) {
            setAiStatus('error');
        }
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500" />
                    <div className="flex flex-col">
                        <span className="font-mono text-gray-300 text-xs">{sub.creator.substring(0, 6)}...{sub.creator.substring(38)}</span>
                        {aiResult && (
                            <span className={cn(
                                "text-[10px] font-bold mt-1",
                                aiResult.verified ? "text-green-400" : "text-red-400"
                            )}>
                                AI Score: {aiResult.score}/100
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className="p-4">
                {sub.submissionUrl ? (
                    <div className="flex flex-col gap-1">
                        <a href={sub.submissionUrl} target="_blank" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            View Content
                        </a>
                        {aiStatus === 'idle' && !sub.isPaid && (
                            <button
                                onClick={runAiAnalysis}
                                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                                <Zap className="w-3 h-3" />
                                Run AI Analysis
                            </button>
                        )}
                        {aiStatus === 'analyzing' && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                            </span>
                        )}
                        {aiResult && (
                            <span className="text-[10px] text-gray-500">
                                {aiResult.reason.substring(0, 30)}...
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-500 italic">Not submitted</span>
                )}
            </td>
            <td className="p-4">
                {sub.isPaid ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Paid & Verified
                    </span>
                ) : sub.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Verified (Unpaid)
                    </span>
                ) : sub.submissionUrl ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20">
                        <Clock className="w-3 h-3 animate-pulse" /> Pending Review
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-400 text-xs font-bold border border-gray-500/20">
                        Joined
                    </span>
                )}
            </td>
            <td className="p-4 text-right">
                {!sub.isPaid && sub.submissionUrl && (
                    <button
                        onClick={onVerify}
                        disabled={isPendingTx}
                        className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isPendingTx ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            "Verify & Pay"
                        )}
                    </button>
                )}
            </td>
        </tr>
    );
}
