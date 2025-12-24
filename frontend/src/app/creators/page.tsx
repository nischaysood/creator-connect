"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreatorCard } from "@/components/CreatorCard";
import { Search, Filter } from "lucide-react";

// Mock Data for Demo
const MOCK_CREATORS = [
    {
        id: "1",
        name: "Alex Rivera",
        handle: "arivera_tech",
        niche: ["Tech", "Reviews", "Gadgets"],
        platform: "YouTube" as const,
        followers: "1.2M",
        engagement: "8.5%",
        aiScore: 98,
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: "2",
        name: "Sarah Chen",
        handle: "sarahc_style",
        niche: ["Fashion", "Lifestyle", "Travel"],
        platform: "Instagram" as const,
        followers: "850K",
        engagement: "12.2%",
        aiScore: 95,
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: "3",
        name: "Darius J.",
        handle: "dj_beats",
        niche: ["Music", "Production", "Vlog"],
        platform: "TikTok" as const,
        followers: "2.5M",
        engagement: "15%",
        aiScore: 92,
        imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: "4",
        name: "Crypto King",
        handle: "cryptoking_eth",
        niche: ["Crypto", "Finance", "Web3"],
        platform: "X" as const,
        followers: "420K",
        engagement: "5.4%",
        aiScore: 99,
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: "5",
        name: "Elena G.",
        handle: "elena_gaming",
        niche: ["Gaming", "Streaming", "Cosplay"],
        platform: "YouTube" as const,
        followers: "3.1M",
        engagement: "9.8%",
        aiScore: 96,
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: "6",
        name: "Dr. Fitness",
        handle: "fit_doc",
        niche: ["Health", "Fitness", "Science"],
        platform: "Instagram" as const,
        followers: "600K",
        engagement: "11%",
        aiScore: 94,
        imageUrl: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&q=80&w=200&h=200"
    }
];

export default function CreatorsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInvite = (name: string) => {
        alert(`Invitation sent to ${name}!`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Discover Creators</h1>
                        <p className="text-gray-400">Find and collaborate with AI-verified talent for your campaigns.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search creators..."
                                className="pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0B15] border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50 w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-[#0B0B15] border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Creators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_CREATORS
                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.handle.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((creator) => (
                            <CreatorCard
                                key={creator.id}
                                creator={creator}
                                onInvite={() => handleInvite(creator.name)}
                            />
                        ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
