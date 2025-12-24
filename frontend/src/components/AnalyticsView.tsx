"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts";
import {
    TrendingUp,
    Users,
    Eye,
    MousePointerClick,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Instagram,
    Twitter,
    Youtube
} from "lucide-react";

// --- Mock Data ---

const OVERVIEW_DATA = [
    { name: 'Mon', views: 4000, engagement: 2400 },
    { name: 'Tue', views: 3000, engagement: 1398 },
    { name: 'Wed', views: 2000, engagement: 9800 },
    { name: 'Thu', views: 2780, engagement: 3908 },
    { name: 'Fri', views: 1890, engagement: 4800 },
    { name: 'Sat', views: 2390, engagement: 3800 },
    { name: 'Sun', views: 3490, engagement: 4300 },
];

const PLATFORM_DATA = [
    { name: 'Instagram', value: 45, color: '#E1306C' },
    { name: 'YouTube', value: 30, color: '#FF0000' },
    { name: 'TikTok', value: 15, color: '#000000' },
    { name: 'X', value: 10, color: '#1DA1F2' },
];

const CAMPAIGNS_PERFORMANCE = [
    { id: 1, name: "Summer Launch", platform: "Instagram", reach: "1.2M", roi: "+240%", status: "active" },
    { id: 2, name: "Tech Review", platform: "YouTube", reach: "850K", roi: "+180%", status: "active" },
    { id: 3, name: "Crypto Hype", platform: "X", reach: "400K", roi: "-10%", status: "paused" },
];

// --- Components ---

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
    <div className="p-6 rounded-3xl bg-[#0B0B15]/50 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                <Icon size={16} />
                {title}
            </div>
            <div className="text-3xl font-bold text-white font-heading mb-2">{value}</div>
            <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change} vs last month
            </div>
        </div>
    </div>
);

export function AnalyticsView() {
    const [timeRange, setTimeRange] = useState("7d");

    return (
        <div className="space-y-6 pb-12">

            {/* Header Controls */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Performance Overview</h2>
                <div className="flex bg-[#0B0B15] p-1 rounded-xl border border-white/10">
                    {["24h", "7d", "30d", "90d"].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Reach"
                    value="2.4M"
                    change="12%"
                    isPositive={true}
                    icon={Eye}
                    color="text-blue-500"
                />
                <StatCard
                    title="Engagement"
                    value="145K"
                    change="8.5%"
                    isPositive={true}
                    icon={MousePointerClick}
                    color="text-purple-500"
                />
                <StatCard
                    title="Active Creators"
                    value="32"
                    change="4"
                    isPositive={true}
                    icon={Users}
                    color="text-pink-500"
                />
                <StatCard
                    title="Total Spent"
                    value="$12.5K"
                    change="2.1%"
                    isPositive={false}
                    icon={DollarSign}
                    color="text-green-500"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Area Chart: Growth */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0B0B15]/50 border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-purple-400" />
                        Engagement Growth
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={OVERVIEW_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4c1d95', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorEng)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Platform Split */}
                <div className="p-6 rounded-3xl bg-[#0B0B15]/50 border border-white/5 backdrop-blur-sm flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">Platform Share</h3>
                    <div className="flex-1 min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PLATFORM_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {PLATFORM_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">4</div>
                                <div className="text-[10px] text-gray-500 bg-black/20 px-2 rounded-full uppercase">Platforms</div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 space-y-3">
                        {PLATFORM_DATA.map(p => (
                            <div key={p.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-gray-300">{p.name}</span>
                                </div>
                                <span className="font-bold text-white">{p.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Performance Table */}
            <div className="rounded-3xl bg-[#0B0B15]/50 border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Top Performing Campaigns</h3>
                    <button className="text-xs text-purple-400 hover:text-purple-300 font-bold uppercase transition-colors">View All</button>
                </div>
                <div className="p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                <th className="p-4 font-medium">Campaign</th>
                                <th className="p-4 font-medium">Platform</th>
                                <th className="p-4 font-medium">Reach</th>
                                <th className="p-4 font-medium">ROI</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {CAMPAIGNS_PERFORMANCE.map(camp => (
                                <tr key={camp.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{camp.name}</td>
                                    <td className="p-4 text-gray-300">{camp.platform}</td>
                                    <td className="p-4 text-white">{camp.reach}</td>
                                    <td className={`p-4 font-bold ${camp.roi.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                        {camp.roi}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${camp.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
