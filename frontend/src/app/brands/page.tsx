"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BrandCard } from "@/components/BrandCard";
import { Search, Filter, Rocket, Star, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { useReadContract, useReadContracts } from "wagmi";
import { ESCROW_ADDRESS, ESCROW_ABI } from "@/constants";

// Mock Data for Brands
const MOCK_BRANDS = [
    {
        id: "b1",
        name: "EcoTrend",
        logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Sustainable fashion for the conscious consumer. Join us in making the world greener.",
        location: "Stockholm, SE",
        website: "ecotrend.com",
        activeCampaigns: 4,
        verified: true,
        category: "Fashion"
    },
    {
        id: "b2",
        name: "VoltEnergy",
        logo: "https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Clean energy solutions for a sustainable future. Empowering communities worldwide.",
        location: "Berlin, DE",
        website: "voltenergy.io",
        activeCampaigns: 2,
        verified: true,
        category: "Tech"
    },
    {
        id: "b3",
        name: "PureHydrate",
        logo: "https://images.unsplash.com/photo-1548919973-5dea594ca2c4?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Performance hydration for professional athletes. Science-backed recovery.",
        location: "Los Angeles, US",
        website: "purehydrate.fit",
        activeCampaigns: 7,
        verified: false,
        category: "Health"
    },
    {
        id: "b4",
        name: "MetaGlow",
        logo: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Next-gen skincare using advanced AI analysis. Beauty meets precision.",
        location: "Seoul, KR",
        website: "metaglow.ai",
        activeCampaigns: 3,
        verified: true,
        category: "Beauty"
    },
    {
        id: "b5",
        name: "GameNexus",
        logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Building the ultimate ecosystem for competitive gamers. Join the Nexus.",
        location: "Seattle, US",
        website: "gamenexus.gg",
        activeCampaigns: 12,
        verified: true,
        category: "Gaming"
    },
    {
        id: "b6",
        name: "BrewMaster",
        logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=100&h=100",
        mission: "Artisan coffee roasted in small batches. From farm to cup with love.",
        location: "Portland, US",
        website: "brewmaster.coffee",
        activeCampaigns: 1,
        verified: false,
        category: "Food"
    }
];

export default function BrandsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 1. Get all profile addresses
    const { data: profileAddresses } = useReadContract({
        address: ESCROW_ADDRESS as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "getAllProfileAddresses",
    });

    // 2. Fetch all profiles
    const { data: profilesData, isLoading } = useReadContracts({
        contracts: (profileAddresses || []).map((addr) => ({
            address: ESCROW_ADDRESS as `0x${string}`,
            abi: ESCROW_ABI,
            functionName: "profiles",
            args: [addr],
        }))
    });

    const brands = (profilesData || [])
        .map(res => res.result)
        .filter((p: any) => p && (p.exists || p[5]) && (p.role === "brand" || p[4] === "brand"))
        .map((p: any) => ({
            id: p.wallet || p[0],
            name: p.name || p[1],
            logo: p.avatar || p[3],
            mission: p.bio || p[2],
            location: "On-Chain",
            website: "verified.eth",
            activeCampaigns: 0,
            verified: true,
            category: "Verified Brand"
        }));

    if (!mounted) return null;

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-8 relative">
                {/* Hero Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-purple-500/20 to-transparent">
                        <div className="h-full p-6 rounded-[22px] bg-[#05050a] border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">Trustless</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Verified Partners</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-transparent">
                        <div className="h-full p-6 rounded-[22px] bg-[#05050a] border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">Instant</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Smart Contracts</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent">
                        <div className="h-full p-6 rounded-[22px] bg-[#05050a] border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">100k+</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Potential Deals</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Star className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                            </div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">Discover Brands</h1>
                        </div>
                        <p className="text-gray-400">Partner with industry leaders and innovative startups on-chain.</p>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search industry, name..."
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

                {/* Brands Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBrands.map((brand) => (
                        <BrandCard
                            key={brand.id}
                            brand={brand}
                        />
                    ))}

                    {/* Placeholder for "More coming soon" */}
                    <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-white/10 text-center space-y-4 min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-white font-bold">New Brands Daily</p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Stay Tuned</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
