"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateCampaignWizard } from "@/components/CreateCampaignWizard";
import { StatCard } from "@/components/StatCard";
import {
    Users,
    Target,
    Wallet,
    Zap,
    Plus,
    Download,
    Calendar,
    Settings as SettingsIcon,
    Play,
    ExternalLink,
    ShieldCheck,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useBalance
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { ESCROW_ADDRESS, ESCROW_ABI, MOCK_MNEE_ADDRESS, MOCK_MNEE_ABI } from "@/constants";

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [role, setRole] = useState<"brand" | "creator">("brand");
    const [newCampaign, setNewCampaign] = useState({ details: "", reward: "50", maxCreators: "2" });
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [activeTab, setActiveTab] = useState<"active" | "all">("active");

    const { writeContract, data: hash, isPending: isPosting, error: writeError } = useWriteContract();

    // 1. Get total number of campaigns
    const { data: campaignCount, refetch: refetchCount } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "nextCampaignId",
    });

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    // 2. Fetch all campaigns in one go
    const campaignIndices = typeof campaignCount === 'bigint' ? Array.from({ length: Number(campaignCount) }, (_, i) => i) : [];

    // Preparation for useReadContracts (Simplified for demo, just getting basic stats)
    // In a real app we'd use useReadContracts mapping over campaignIndices
    const [realCampaigns, setRealCampaigns] = useState<any[]>([]);

    const { data: mneeBalance, refetch: refetchBalance } = useReadContract({
        address: MOCK_MNEE_ADDRESS,
        abi: MOCK_MNEE_ABI,
        functionName: "balanceOf",
        args: [address!],
        query: {
            enabled: !!address,
        }
    });

    // Handle Fetching (Demo helper)
    // Since useReadContracts with dynamic length is tricky in hooks, 
    // we'll fetch a fixed set or use individual reads for the hackathon demo.
    const { data: latestCampaign, isLoading: isLoadingCampaigns, refetch: refetchLatest } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "campaigns",
        args: [typeof campaignCount === 'bigint' && campaignCount > 0n ? campaignCount - 1n : 0n],
        query: {
            enabled: typeof campaignCount === 'bigint' && campaignCount > 0n,
        }
    });

    // Handle Create Campaign Flow
    const [step, setStep] = useState<"idle" | "approving" | "creating">("idle");

    const handleCreateCampaign = async () => {
        if (!isConnected) return alert("Please connect wallet");
        try {
            setStep("approving");
            const totalRequired = parseEther(newCampaign.reward) * BigInt(newCampaign.maxCreators);

            writeContract({
                address: MOCK_MNEE_ADDRESS,
                abi: MOCK_MNEE_ABI,
                functionName: "approve",
                args: [ESCROW_ADDRESS, totalRequired],
            });
        } catch (e) {
            console.error(e);
            setStep("idle");
        }
    };

    // React to confirmation for steps
    React.useEffect(() => {
        if (isConfirmed && step === "approving") {
            setStep("creating");
            writeContract({
                address: ESCROW_ADDRESS,
                abi: ESCROW_ABI,
                functionName: "createCampaign",
                args: [newCampaign.details, parseEther(newCampaign.reward), BigInt(newCampaign.maxCreators)],
            });
        } else if (isConfirmed && step === "creating") {
            setStep("idle");
            refetchBalance();
            refetchCount();
            refetchLatest();
            alert("Campaign successfully launched! 🚀");
        }
    }, [isConfirmed, step]);

    const handleEnroll = (id: number) => {
        writeContract({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "enroll",
            args: [BigInt(id)],
        });
    };

    const handleSubmit = async (id: number) => {
        writeContract({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "submitContent",
            args: [BigInt(id), submissionUrl],
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                {/* Role Switcher & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white capitalize">{role} Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Currently connected as <span className="text-primary font-medium">{role === 'brand' ? 'Advertiser' : 'Content Creator'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 glass rounded-2xl border border-white/5">
                        <button
                            onClick={() => setRole("brand")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                role === "brand" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Brand View
                        </button>
                        <button
                            onClick={() => setRole("creator")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                role === "creator" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Creator View
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={role === 'brand' ? "Active Campaigns" : "Enrolled Campaigns"}
                        value={role === 'brand' ? "12" : "3"}
                        trend={{ value: "12%", isUp: true }}
                        icon={<Target className="w-5 h-5" />}
                        className="bg-primary/10 border-primary/20"
                    />
                    <StatCard
                        title="MNEE Balance"
                        value={mneeBalance !== undefined ? `${Number(formatEther(mneeBalance as bigint)).toFixed(0)} MNEE` : "0 MNEE"}
                        icon={<Wallet className="w-5 h-5" />}
                    />
                    <StatCard
                        title={role === 'brand' ? "Total Payouts" : "Total Earnings"}
                        value={role === 'brand' ? "4.2k" : "850"}
                        trend={{ value: "8%", isUp: true }}
                        icon={<Zap className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Performance Score"
                        value="98%"
                        icon={<ShieldCheck className="w-5 h-5" />}
                    />
                </div>

                {/* Action Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-bold text-white">
                                    {role === 'brand' ? 'Recent Campaigns' : 'Available Opportunities'}
                                </h3>
                                <div className="flex items-center gap-1">
                                    {['active', 'all'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={cn(
                                                "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                                activeTab === tab ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
                                            )}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {role === 'brand' && (
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-white/90 transition-all">
                                    <Plus className="w-4 h-4" />
                                    New Campaign
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {isLoadingCampaigns ? (
                                <div className="flex flex-col items-center justify-center p-12 glass border border-white/5 rounded-3xl">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                    <p className="text-muted-foreground">Fetching campaigns from blockchain...</p>
                                </div>
                            ) : campaignCount && Number(campaignCount) > 0 ? (
                                // Mapping over actual indices. For now we show the latest one as proof of concept
                                [Number(campaignCount) - 1].map((idx) => {
                                    const c = latestCampaign as any;
                                    if (!c) return null;
                                    // The tuple indices for Campaign struct
                                    const [id, brand, details, reward, max, dep, paid, active, time] = c;

                                    return (
                                        <div key={idx} className="group p-6 rounded-3xl glass border border-white/5 hover:border-primary/20 transition-all duration-300">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary font-bold">
                                                        #{Number(id)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">{details || "Tech Review Campaign"}</h4>
                                                        <p className="text-xs text-muted-foreground">Reward per creator: <span className="text-primary font-bold">{formatEther(reward)} MNEE</span></p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                                    active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                                )}>
                                                    {active ? "Active" : "Completed"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    <span>Slots: <span className="text-white">{Number(max)} creators max</span></span>
                                                </div>

                                                <div className="flex items-center gap-3 mt-2">
                                                    {role === 'creator' ? (
                                                        <div className="flex-1 flex flex-col gap-3">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    placeholder="Submit Instagram/YouTube URL..."
                                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                                                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                                                />
                                                                <button
                                                                    onClick={() => handleSubmit(Number(id))}
                                                                    disabled={isPosting || isConfirming}
                                                                    className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                                                                >
                                                                    {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={async () => {
                                                                    const res = await fetch("/api/verify", {
                                                                        method: "POST",
                                                                        body: JSON.stringify({
                                                                            campaignId: Number(id),
                                                                            creatorAddress: address,
                                                                            contentUrl: submissionUrl
                                                                        }),
                                                                    });
                                                                    const data = await res.json();
                                                                    alert(data.message || data.error);
                                                                }}
                                                                className="w-full py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold text-xs hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                                Verify with AI Agent
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                                                            <div className="flex -space-x-3">
                                                                {[1, 2, 3].map(n => (
                                                                    <div key={n} className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-slate-700 flex items-center justify-center text-[10px] font-bold shadow-xl">
                                                                        U{n}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                                                                View Submissions
                                                                <ExternalLink className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-12 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-muted-foreground text-sm">
                                    No campaigns found. Launch one!
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Create Campaign UI (for Brand) */}
                        {role === 'brand' && (
                            <div className="col-span-1 border border-transparent">
                                <CreateCampaignWizard onSuccess={() => {
                                    refetchCount();
                                    refetchLatest();
                                    alert("Campaign Launched Successfully!");
                                }} />
                            </div>
                        )}

                        {/* AI Agent Status Card - Cyberpunk Version */}
                        <div className="p-8 rounded-3xl relative overflow-hidden group border border-primary/20">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent z-0" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 relative">
                                            <ShieldCheck className="w-5 h-5 text-white" />
                                            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white font-heading">AI Verification Agent</h3>
                                            <p className="text-[10px] text-primary/80 font-mono uppercase tracking-wider">v2.4.0 Online</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Active</span>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-black/20 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">System Status</span>
                                        <span className="text-white font-mono">OPERATIONAL</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary to-purple-500 h-full w-[98%] shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                                    </div>
                                    <p className="text-[10px] text-blue-300 font-mono leading-relaxed mt-2">
                                        &gt; Initializing neural verification... <br />
                                        &gt; Smart Contracts: CONNECTED <br />
                                        &gt; MNEE Liquidity: STABLE
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
                        </div>

                        {/* Recent Notifications */}
                        <div className="p-8 rounded-3xl glass border border-white/5 space-y-6">
                            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            <div className="space-y-4">
                                {[
                                    { text: "Payment of 50 MNEE released for #221", time: "2m ago", icon: <CheckCircle2 className="text-emerald-400" /> },
                                    { text: "New campaign 'Winter Collection' live", time: "1h ago", icon: <Target className="text-blue-400" /> },
                                    { text: "Creator 'Alice' enrolled in Tech Review", time: "3h ago", icon: <Users className="text-indigo-400" /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="mt-1 w-5 h-5 flex-shrink-0">{item.icon}</div>
                                        <div>
                                            <p className="text-xs text-white leading-snug">{item.text}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
