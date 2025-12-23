"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Target,
    Users,
    Calendar,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    Wallet
} from "lucide-react";

const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Target },
    { name: "Creators", href: "/creators", icon: Users },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNav = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 glass-dark border-r border-white/5 fixed left-0 top-0 z-50">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Wallet className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-heading">
                        Creator<span className="text-primary">Connect</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                    Menu
                </div>
                {mainNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.name === "Campaigns" && (
                                <span className="ml-auto text-[10px] bg-primary-foreground/10 text-primary-foreground px-1.5 py-0.5 rounded-full">
                                    12+
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-4 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                    General
                </div>
                {bottomNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 mt-4 group">
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-white/90">Upgrade to Pro</p>
                        <p className="text-[10px] text-white/50 mt-1">Get advanced AI analytics</p>
                        <button className="w-full mt-3 bg-white text-slate-900 text-xs font-bold py-2 rounded-lg hover:bg-white/90 transition-colors">
                            Go Premium
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
                </div>
            </div>
        </div>
    );
}
