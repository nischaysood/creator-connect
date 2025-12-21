'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { useAccount, useReadContract } from 'wagmi';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';
import { ESCROW_CONTRACT_ADDRESS } from '@/constants';
import Link from 'next/link';
import { Plus, TrendingUp, Users, DollarSign, Eye } from 'lucide-react';

const CONTRACT_ADDRESS = ESCROW_CONTRACT_ADDRESS;

export default function BrandDashboard() {
    const { address } = useAccount();

    const { data: nextId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: escrowArtifact.abi,
        functionName: 'nextCampaignId',
    });

    // Mock data for demonstration - in production, filter by brand address
    const totalCampaigns = nextId ? Number(nextId) : 0;
    const activeCampaigns = Math.floor(totalCampaigns * 0.6);
    const totalSpent = totalCampaigns * 1000; // Mock calculation

    return (
        <DashboardLayout role="brand">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text">Brand Dashboard</span>
                </h1>
                <p className="text-xl text-slate-400">
                    Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-1">{totalCampaigns}</div>
                    <div className="text-slate-400">Total Campaigns</div>
                </div>

                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-1">{activeCampaigns}</div>
                    <div className="text-slate-400">Active Campaigns</div>
                </div>

                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-1">{totalSpent}</div>
                    <div className="text-slate-400">MNEE Allocated</div>
                </div>
            </div>

            {/* Create Campaign CTA */}
            <div className="glass-strong p-8 rounded-3xl mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Ready to launch a new campaign?</h2>
                        <p className="text-slate-400">Create campaigns, set budgets, and let AI handle verification</p>
                    </div>
                    <Link
                        href="/create"
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full font-semibold hover-lift transition-smooth glow-blue whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Create Campaign
                    </Link>
                </div>
            </div>

            {/* Campaign List */}
            <div className="glass-strong p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Your Campaigns</h2>
                    <div className="text-sm text-slate-400">
                        {totalCampaigns} {totalCampaigns === 1 ? 'campaign' : 'campaigns'}
                    </div>
                </div>

                <div className="space-y-4">
                    {totalCampaigns > 0 ? (
                        Array.from({ length: totalCampaigns }).map((_, i) => (
                            <div
                                key={i}
                                className="glass p-6 rounded-2xl hover-glow transition-smooth"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">Campaign #{i}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${i % 3 === 0 ? 'bg-green-600/20 text-green-400' :
                                                    i % 3 === 1 ? 'bg-blue-600/20 text-blue-400' :
                                                        'bg-slate-600/20 text-slate-400'
                                                }`}>
                                                {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Completed'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{Math.floor(Math.random() * 10) + 1} creators enrolled</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>{1000 + i * 100} MNEE</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/campaign/${i}`}
                                        className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover-lift transition-smooth"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                            <p className="text-slate-400 mb-6">Create your first campaign to get started</p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full font-semibold hover-lift transition-smooth"
                            >
                                <Plus className="w-5 h-5" />
                                Create Campaign
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
