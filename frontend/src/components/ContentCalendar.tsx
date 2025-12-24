"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Instagram,
    Twitter,
    Youtube,
    Video,
    Mic,
    MoreHorizontal
} from "lucide-react";

// Mock Data
const EVENTS = [
    { id: 1, day: 5, title: "Tech Review Reel", type: "content", platform: "Instagram", status: "scheduled" },
    { id: 2, day: 12, title: "Brand Meeting", type: "meeting", platform: "Google Meet", status: "done" },
    { id: 3, day: 15, title: "Crypto Update", type: "content", platform: "X", status: "draft" },
    { id: 4, day: 22, title: "Gaming Stream", type: "live", platform: "YouTube", status: "scheduled" },
    { id: 5, day: 28, title: "Monthly Recap", type: "content", platform: "TikTok", status: "planned" },
];

export function ContentCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "Instagram": return <Instagram size={12} />;
            case "X": return <Twitter size={12} />;
            case "YouTube": return <Youtube size={12} />;
            default: return <Video size={12} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled": return "bg-purple-500";
            case "done": return "bg-green-500";
            case "draft": return "bg-yellow-500";
            case "planned": return "bg-blue-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col glass-panel rounded-3xl p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-heading">
                            {monthNames[currentDate.getMonth()]} <span className="text-gray-500">{currentDate.getFullYear()}</span>
                        </h2>
                        <p className="text-sm text-gray-400">Manage your content schedule</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#0B0B15] p-1 rounded-xl border border-white/5">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-bold text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Days Grid Header */}
                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-sm font-bold text-gray-500 uppercase tracking-widest">{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-4">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="opacity-0" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = EVENTS.filter(e => e.day === day);
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

                        return (
                            <motion.div
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                whileHover={{ scale: 0.98 }}
                                className={`
                                    relative p-3 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between
                                    ${selectedDate === day
                                        ? "bg-purple-500/20 border-purple-500/50 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]"
                                        : "bg-[#0B0B15]/50 border-white/5 hover:border-white/10 hover:bg-[#0B0B15]"}
                                    ${isToday ? "ring-1 ring-purple-500" : ""}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-bold ${isToday ? "text-purple-400" : "text-gray-400 group-hover:text-white"}`}>
                                        {day}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    )}
                                </div>

                                <div className="space-y-1 mt-2">
                                    {dayEvents.map(event => (
                                        <div key={event.id} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/5 border border-white/5">
                                            <div className={`${getStatusColor(event.status)} w-1 h-3 rounded-full`} />
                                            <span className="text-[10px] text-gray-300 truncate font-medium">{event.title}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white text-black transition-all hover:scale-110">
                                    <Plus size={12} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar / Details Panel */}
            <div className="w-80 flex flex-col gap-6">
                {/* Quick Add */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-2">Create New</h3>
                    <p className="text-sm text-purple-100 mb-6 opacity-80">Schedule content or meetings.</p>
                    <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg shadow-black/20">
                        + Add Event
                    </button>
                </div>

                {/* Upcoming / Selected Details */}
                <div className="flex-1 glass-panel rounded-3xl p-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                        {selectedDate ? `Events for ${monthNames[currentDate.getMonth()]} ${selectedDate}` : "Upcoming"}
                    </h3>

                    <div className="space-y-4">
                        {(selectedDate ? EVENTS.filter(e => e.day === selectedDate) : EVENTS).map(event => (
                            <div key={event.id} className="p-4 rounded-2xl bg-[#0B0B15] border border-white/5 hover:border-purple-500/30 transition-colors group">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors`}>
                                            {getPlatformIcon(event.platform)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{event.title}</h4>
                                            <p className="text-xs text-gray-500">{event.platform} • 10:00 AM</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(event.status)}/20 text-${getStatusColor(event.status).replace("bg-", "")}-400 border border-${getStatusColor(event.status).replace("bg-", "")}-500/20`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {(selectedDate && EVENTS.filter(e => e.day === selectedDate).length === 0) && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No events scheduled.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
