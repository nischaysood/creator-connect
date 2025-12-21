'use client';

import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'brand' | 'creator';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const { address, isConnected } = useAccount();
    const router = useRouter();

    // Redirect if not connected
    if (!isConnected) {
        router.push('/');
        return null;
    }

    const gradientClass = role === 'brand'
        ? 'from-blue-600 to-blue-400'
        : 'from-purple-600 to-purple-400';

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                <span className="text-xl font-bold gradient-text">Creator Connect</span>
                            </Link>

                            <div className="flex items-center gap-2">
                                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${gradientClass} text-sm font-semibold`}>
                                    {role === 'brand' ? '🏢 Brand' : '✨ Creator'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover-lift transition-smooth text-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Switch Role
                            </Link>
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-24 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
