"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Instagram,
    Twitter,
    Youtube,
    Music2,
    Hash,
    Clock,
    Users,
    CheckCircle2,
    ArrowRight,
    Play,
    ShieldCheck,
    FileVideo,
    Mic2
} from "lucide-react";
import { formatEther } from "viem";
import { cn } from "@/lib/utils";
import SubmitWorkModal from "./SubmitWorkModal";

interface CampaignFlipCardProps {
    id: number;
    campaign: any; // Raw contract struct
    role: "brand" | "creator";
    isEnrolled?: boolean;
    onJoin: () => void;
    onSubmit: () => void;
}

export function CampaignFlipCard({ id, campaign, role, isEnrolled, onJoin, onSubmit }: CampaignFlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // Destructure contract data
    const detailsRaw = campaign[2];
    const reward = campaign[3];
    const maxCreators = Number(campaign[4]);
    const deadline = Number(campaign[9]);
    const isExpired = deadline > 0 && Date.now() / 1000 > deadline;

    // TODO: We need a way to check if the CURRENT user has already enrolled in THIS campaign
    // For MVP, we might pass a "hasEnrolled" prop or assume if onSubmit is passed it's possible
    // But currently `onSubmit` is just a placeholder callback. 

    // Start with default values, try to parse JSON
    let meta = {
        name: "Campaign #" + id,
        desc: "Create content for this brand.",
        platform: "Instagram",
        type: "Reel",
        tags: [] as string[]
    };

    try {
        const parsed = JSON.parse(detailsRaw);
        if (parsed.name) meta = parsed;
    } catch (e) {
        // Fallback for old text-only campaigns
        meta.name = detailsRaw || `Campaign #${id}`;
        meta.desc = detailsRaw;
    }

    const PlatformIcon = {
        "Instagram": Instagram,
        "X (Twitter)": Twitter,
        "YouTube Shorts": Youtube,
        "TikTok": Play
    }[meta.platform] || Instagram;

    const accentColor = role === 'creator' ? 'cyan' : 'purple';
    const accentClass = role === 'creator' ? 'from-cyan-500 to-blue-600' : 'from-purple-500 to-indigo-600';
    const accentText = role === 'creator' ? 'text-cyan-400' : 'text-purple-400';
    const accentBg = role === 'creator' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400';
    const accentBorder = role === 'creator' ? 'border-cyan-500/20' : 'border-purple-500/20';
    const accentHover = role === 'creator' ? 'hover:shadow-cyan-500/25' : 'hover:shadow-purple-500/25';
    const accentBtn = role === 'creator' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500';

    return (
        <>
            <div
                className="group h-[340px] w-full perspective-1000 cursor-pointer"
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
            >
                <motion.div
                    className="relative w-full h-full transition-all duration-500"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* === FRONT OF CARD === */}
                    <div
                        className="absolute inset-0 rounded-3xl p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between shadow-xl"
                        style={{ backfaceVisibility: "hidden" }}
                    >

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br", accentClass)}>
                                    {meta.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">{meta.name}</h3>
                                    <p className="text-xs text-gray-400">by Brand {campaign[1].toString().substring(0, 6)}...</p>
                                </div>
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
                                isExpired
                                    ? "bg-red-500/20 text-red-400 border-red-500/20"
                                    : "bg-green-500/20 text-green-400 border-green-500/20"
                            )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isExpired ? "bg-red-500" : "bg-green-500")}></span>
                                {isExpired ? "Ended" : "Active"}
                            </div>
                        </div>

                        {/* Reward - Big & Bold */}
                        <div className="py-2">
                            <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">Reward</div>
                            <div className="text-4xl font-bold text-white font-outfit tracking-tight">
                                {formatEther(reward)} <span className={cn("text-xl", accentText)}>MNEE</span>
                            </div>
                        </div>

                        {/* Requirements Summary */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="p-2 rounded-lg bg-white/5 text-pink-500">
                                    <PlatformIcon className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{meta.platform} • {meta.type}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="p-2 rounded-lg bg-white/5 text-blue-400">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="font-medium">AI Verified Content</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="p-2 rounded-lg bg-white/5 text-yellow-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="font-medium">
                                    {isExpired ? "Campaign Ended" : `${Math.ceil((deadline - Date.now() / 1000) / 86400)} Days Left`}
                                </span>
                            </div>
                        </div>

                        {/* Hover Hint */}
                        <div className={cn("pt-4 border-t border-white/5 flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-widest transition-colors", role === 'creator' ? 'group-hover:text-cyan-400' : 'group-hover:text-purple-400')}>
                            Hover for Details
                        </div>
                    </div>

                    {/* === BACK OF CARD === */}
                    <div
                        className={cn("absolute inset-0 rounded-3xl p-5 bg-[#0e0e1b] border flex flex-col shadow-xl",
                            role === 'creator' ? 'border-cyan-500/30' : 'border-purple-500/30'
                        )}
                        style={{
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden"
                        }}
                    >
                        {/* Back Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Campaign Brief</h4>
                            <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", accentBg, accentBorder)}>
                                STRICT
                            </div>
                        </div>

                        {/* Description - Scrollable if long */}
                        <div className="flex-1 overflow-hidden relative mb-4">
                            <div className="text-xs text-gray-300 leading-relaxed font-light h-full overflow-y-auto pr-1">
                                <p className="mb-2 font-medium text-white">{meta.desc}</p>
                                <p className="opacity-80">Follow all brand guidelines. Ensure high quality video and clear audio. Verification by AI Agent required for payout.</p>
                            </div>
                            {/* Fade at bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#0e0e1b] to-transparent pointer-events-none"></div>
                        </div>

                        {/* Detailed Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-bold">
                                    <FileVideo className="w-3 h-3 text-pink-500" /> Format
                                </div>
                                <div className="text-xs text-white">9:16 Vertical</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-bold">
                                    <Clock className="w-3 h-3 text-blue-500" /> Duration
                                </div>
                                <div className="text-xs text-white">Min 15s</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-bold">
                                    <Mic2 className="w-3 h-3 text-yellow-500" /> Audio
                                </div>
                                <div className="text-xs text-white">Trending</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-bold">
                                    <Users className="w-3 h-3 text-green-500" /> Spots
                                </div>
                                <div className="text-xs text-white">8 / {maxCreators} Left</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2">
                            {role === 'creator' ? (
                                <>
                                    <button
                                        disabled={isEnrolled || isExpired}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onJoin();
                                        }}
                                        className={cn(
                                            "w-full py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2",
                                            (isEnrolled || isExpired)
                                                ? "bg-slate-700 cursor-not-allowed opacity-50"
                                                : cn(accentBtn, accentHover)
                                        )}
                                    >
                                        <div className={cn("w-2 h-2 rounded-full bg-white", (!isEnrolled && !isExpired) && "animate-pulse")} />
                                        {isEnrolled ? "Already Applied" : isExpired ? "Deadline Passed" : "Apply Now"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsSubmitModalOpen(true);
                                        }}
                                        className="w-full py-2 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        Submitted Content? Click Here
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onJoin(); // In brand mode, this opens the manager
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    Manage Campaign
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {isSubmitModalOpen && (
                <SubmitWorkModal
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    campaignId={BigInt(id)}
                    campaignTitle={meta.name}
                />
            )}
        </>
    );
}
