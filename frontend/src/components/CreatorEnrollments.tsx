"use client";

import React from "react";
import {
    CheckCircle2,
    Clock,
    Zap,
    ExternalLink,
    Wallet,
    Loader2
} from "lucide-react";
import { formatEther } from "viem";
import { cn } from "@/lib/utils";
import SubmitWorkModal from "./SubmitWorkModal";

interface CreatorEnrollmentsProps {
    enrollments: any[]; // Array of { campaign, enrollmentData }
    onRefetch: () => void;
}

export function CreatorEnrollments({ enrollments, onRefetch }: CreatorEnrollmentsProps) {
    const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    My Active Campaigns
                </h3>
                <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {enrollments.length} Campaigns Enrolled
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {enrollments.length === 0 ? (
                    <div className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <p className="text-gray-400">You haven't joined any campaigns yet.</p>
                    </div>
                ) : (
                    enrollments.map((item, idx) => {
                        const { campaign, enrollment } = item;
                        let meta = {
                            name: "Campaign #" + campaign.id,
                            desc: "Create content for this brand."
                        };
                        try {
                            const parsed = JSON.parse(campaign.details);
                            if (parsed.name) meta = { ...meta, ...parsed };
                        } catch (e) { }

                        const isPaid = enrollment.isPaid;
                        const isVerified = enrollment.isVerified;
                        const hasSubmitted = enrollment.submissionUrl && enrollment.submissionUrl.length > 0;

                        return (
                            <div
                                key={idx}
                                className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                {/* Hover Detail Layer */}
                                <div className="absolute inset-0 bg-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                        {meta.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{meta.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-cyan-400 font-bold text-sm">
                                                {formatEther(campaign.rewardPerCreator)} MNEE
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <div className="relative group/tooltip">
                                                <span className="text-gray-500 text-xs uppercase tracking-widest font-bold cursor-help hover:text-white transition-colors">
                                                    Details →
                                                </span>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-2xl bg-slate-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] text-xs text-gray-300 leading-relaxed translate-y-2 group-hover/tooltip:translate-y-0">
                                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                                        <p className="font-bold text-white uppercase tracking-widest text-[10px]">Campaign Brief</p>
                                                    </div>
                                                    <p className="font-light italic line-clamp-4">"{meta.desc}"</p>
                                                    {/* Tooltip Arrow */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 md:gap-8 relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 text-center md:text-left">Status</span>
                                        {isPaid ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                                <CheckCircle2 className="w-4 h-4" /> Paid
                                            </span>
                                        ) : isVerified ? (
                                            <span className="flex items-center gap-1.5 text-blue-400 font-bold text-sm bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                                                <CheckCircle2 className="w-4 h-4" /> Verified
                                            </span>
                                        ) : hasSubmitted ? (
                                            <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                                <Clock className="w-4 h-4 animate-pulse" /> In Review
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-gray-400 font-bold text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                Joined
                                            </span>
                                        )}
                                    </div>

                                    {!isPaid && (
                                        <button
                                            onClick={() => setSelectedCampaign(campaign)}
                                            className={cn(
                                                "px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 relative overflow-hidden group/btn",
                                                hasSubmitted
                                                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                                    : "bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/20"
                                            )}
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                            <span className="relative flex items-center gap-2">
                                                {hasSubmitted ? "Update Work" : "Submit Work"}
                                                <ExternalLink className="w-4 h-4" />
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedCampaign && (
                <SubmitWorkModal
                    isOpen={!!selectedCampaign}
                    onClose={() => {
                        setSelectedCampaign(null);
                        onRefetch();
                    }}
                    campaignId={BigInt(selectedCampaign.id)}
                    campaignTitle={selectedCampaign.details ? JSON.parse(selectedCampaign.details).name : "Campaign"}
                />
            )}
        </div>
    );
}
