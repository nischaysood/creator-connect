'use client';

import DashboardLayout from '@/app/components/DashboardLayout';
import { useAccount, useReadContract } from 'wagmi';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';
import { ESCROW_CONTRACT_ADDRESS } from '@/constants';
import Link from 'next/link';
import { Sparkles, TrendingUp, DollarSign, CheckCircle, Clock, Search } from 'lucide-react';

const CONTRACT_ADDRESS = ESCROW_CONTRACT_ADDRESS;

export default function CreatorDashboard() {
    const { address } = useAccount();

    const { data: nextId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: escrowArtifact.abi,
        functionName: 'nextCampaignId',
    });

    const totalCampaigns = nextId ? Number(nextId) : 0;

    // Mock data for demonstration
    const enrolledCampaigns = Math.min(Math.floor(totalCampaigns * 0.4), totalCampaigns);
    const completedSubmissions = Math.floor(enrolledCampaigns * 0.6);
    const totalEarned = completedSubmissions * 500; // Mock calculation

    return (
        <DashboardLayout role="creator">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="gradient-text-accent">Creator Dashboard</span>
                </h1>
                <p className="text-xl text-slate-400">
                    Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text-accent mb-1">{enrolledCampaigns}</div>
                    <div className="text-slate-400">Enrolled Campaigns</div>
                </div>

                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text-accent mb-1">{completedSubmissions}</div>
                    <div className="text-slate-400">Completed Submissions</div>
                </div>

                <div className="glass-strong p-6 rounded-2xl hover-lift transition-smooth">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold gradient-text-accent mb-1">{totalEarned}</div>
                    <div className="text-slate-400">MNEE Earned</div>
                </div>
            </div>

            {/* Available Campaigns */}
            <div className="glass-strong p-8 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Available Campaigns</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Search className="w-4 h-4" />
                        {totalCampaigns} opportunities
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {totalCampaigns > 0 ? (
                        Array.from({ length: Math.min(totalCampaigns, 4) }).map((_, i) => (
                            <div
                                key={i}
                                className="glass p-6 rounded-2xl hover-lift transition-smooth"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Campaign #{i}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full font-semibold">
                                                {500 + i * 100} MNEE
                                            </span>
                                            <span className="text-slate-400">per submission</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm mb-4">
                                    Create engaging content showcasing the brand's product. AI verification ensures quality.
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-slate-500">
                                        {Math.floor(Math.random() * 5) + 1} creators enrolled
                                    </div>
                                    <Link
                                        href={`/campaign/${i}`}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-semibold text-sm hover-lift transition-smooth"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-12">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No campaigns available</h3>
                            <p className="text-slate-400">Check back soon for new opportunities!</p>
                        </div>
                    )}
                </div>

                {totalCampaigns > 4 && (
                    <div className="mt-6 text-center">
                        <button className="px-6 py-3 glass rounded-xl hover-lift transition-smooth">
                            View All Campaigns
                        </button>
                    </div>
                )}
            </div>

            {/* My Campaigns */}
            <div className="glass-strong p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">My Campaigns</h2>
                    <div className="text-sm text-slate-400">
                        {enrolledCampaigns} enrolled
                    </div>
                </div>

                <div className="space-y-4">
                    {enrolledCampaigns > 0 ? (
                        Array.from({ length: enrolledCampaigns }).map((_, i) => {
                            const statuses = ['completed', 'pending', 'in-progress'];
                            const status = statuses[i % 3];

                            return (
                                <div
                                    key={i}
                                    className="glass p-6 rounded-2xl hover-glow transition-smooth"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">Campaign #{i}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'completed' ? 'bg-green-600/20 text-green-400' :
                                                        status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                                                            'bg-blue-600/20 text-blue-400'
                                                    }`}>
                                                    {status === 'completed' ? (
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Completed
                                                        </span>
                                                    ) : status === 'pending' ? (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Under Review
                                                        </span>
                                                    ) : (
                                                        'In Progress'
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{500 + i * 50} MNEE</span>
                                                </div>
                                                {status === 'completed' && (
                                                    <div className="text-green-400">✓ Payment received</div>
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/campaign/${i}`}
                                            className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover-lift transition-smooth"
                                        >
                                            {status === 'in-progress' ? 'Submit Content' : 'View Details'}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No enrolled campaigns</h3>
                            <p className="text-slate-400 mb-6">Browse available campaigns to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
