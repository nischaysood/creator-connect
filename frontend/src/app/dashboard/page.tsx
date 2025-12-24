"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateCampaignWizard } from "@/components/CreateCampaignWizard";
import { CampaignFlipCard } from "@/components/CampaignFlipCard";
import { CampaignManager } from "@/components/CampaignManager";
import { StatCard } from "@/components/StatCard";
import {
    Users,
    Target,
    Wallet,
    Zap,
    Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useReadContracts,
    useWaitForTransactionReceipt,
} from "wagmi";
import { formatEther } from "viem";
import { ESCROW_ADDRESS, ESCROW_ABI, MOCK_MNEE_ADDRESS, MOCK_MNEE_ABI } from "@/constants";

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [role, setRole] = useState<"brand" | "creator">("brand");
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

    const { writeContract, data: hash } = useWriteContract();

    // 1. Get total number of campaigns
    const { data: campaignCount, refetch: refetchCount } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "nextCampaignId",
    });

    const numCampaigns = Number(campaignCount || 0);

    // 2. Fetch ALL campaigns
    const { data: campaignsData, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContracts({
        contracts: Array.from({ length: numCampaigns }, (_, i) => ({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "campaigns",
            args: [BigInt(i)],
        }))
    });

    // 3. User Balance
    const { data: mneeBalance } = useReadContract({
        address: MOCK_MNEE_ADDRESS,
        abi: MOCK_MNEE_ABI,
        functionName: "balanceOf",
        args: [address!],
        query: { enabled: !!address }
    });

    // Handle Transactions
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isConfirmed) {
            refetchCount();
            refetchCampaigns();
        }
    }, [isConfirmed, refetchCount, refetchCampaigns]);

    const handleJoin = (id: number) => {
        if (role === 'brand') {
            // As a brand, clicking the card opens the manager
            const campaign = campaignsData?.[id]?.result;
            if (campaign) setSelectedCampaign(campaign);
        } else {
            // As creator, join contract
            writeContract({
                address: ESCROW_ADDRESS,
                abi: ESCROW_ABI,
                functionName: "enroll",
                args: [BigInt(id)],
            });
        }
    };

    const handleSubmit = () => {
        // This is handled inside Campaign Manager or a specific Submission Modal
        // Placeholder for now
    };

    // Filter valid campaigns
    const activeCampaigns = campaignsData?.map((res, index) => {
        // Contract returns tuple: [id, brand, details, rewardPerCreator, maxCreators, totalDeposited, totalPaid, isActive, createdAt]
        if (res.result) return res.result;
        return null;
    }).filter(c => c !== null) // Filter failed fetches
        .reverse() || []; // Newest first

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 relative">
                {/* WIZARD MODAL */}
                {isWizardOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsWizardOpen(false)}
                        />
                        <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 h-[90vh] overflow-y-auto">
                            <CreateCampaignWizard onSuccess={() => {
                                setIsWizardOpen(false);
                                refetchCount();
                                refetchCampaigns();
                                alert("Campaign Launched Successfully!");
                            }} />
                            <button
                                onClick={() => setIsWizardOpen(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* CAMPAIGN MANAGER MODAL */}
                {selectedCampaign && (
                    <CampaignManager
                        id={Number(selectedCampaign[0])}
                        campaign={selectedCampaign}
                        onClose={() => setSelectedCampaign(null)}
                    />
                )}

                {/* Role Switcher & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white capitalize">{role} Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Connected as <span className="text-primary font-medium">{role === 'brand' ? 'Advertiser' : 'Content Creator'}</span>
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
                            Brand
                        </button>
                        <button
                            onClick={() => setRole("creator")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                role === "creator" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            Creator
                        </button>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Active Campaigns"
                        value={numCampaigns.toString()}
                        trend={{ value: "+2", isUp: true }}
                        icon={<Target className="w-5 h-5 text-primary" />}
                    />
                    <StatCard
                        title="Total Creators"
                        value="12K"
                        trend={{ value: "+8%", isUp: true }}
                        icon={<Users className="w-5 h-5 text-primary" />}
                    />
                    <StatCard
                        title="Wallet Balance"
                        value={`${mneeBalance ? Number(formatEther(mneeBalance as bigint)).toFixed(2) : '0'} MNEE`}
                        icon={<Wallet className="w-5 h-5 text-primary" />}
                    />
                    <StatCard
                        title="AI Verifications"
                        value="1.2K"
                        trend={{ value: "+15%", isUp: true }}
                        icon={<Zap className="w-5 h-5 text-primary" />}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            {role === 'brand' ? 'Your Campaigns' : 'Available Campaigns'}
                        </h2>
                        {role === 'brand' && (
                            <button
                                onClick={() => setIsWizardOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                            >
                                <Plus className="w-4 h-4" />
                                New Campaign
                            </button>
                        )}
                    </div>

                    {isLoadingCampaigns ? (
                        <div className="p-20 flex flex-col items-center justify-center text-gray-500">
                            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                            <p>Loading Campaigns...</p>
                        </div>
                    ) : activeCampaigns.length === 0 ? (
                        <div className="p-12 glass border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Target className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No Active Campaigns</h3>
                            <p className="text-gray-400 max-w-sm mb-6">
                                {role === 'brand' ? "Launch your first campaign to start attracting creators." : "Check back later for new opportunities."}
                            </p>
                            {role === 'brand' && (
                                <button onClick={() => setIsWizardOpen(true)} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold">Create Campaign</button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* @ts-ignore */}
                            {activeCampaigns.map((campaign: any) => (
                                <CampaignFlipCard
                                    key={Number(campaign[0])}
                                    id={Number(campaign[0])}
                                    campaign={campaign}
                                    role={role}
                                    onJoin={() => handleJoin(Number(campaign[0]))}
                                    onSubmit={() => handleSubmit()}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
