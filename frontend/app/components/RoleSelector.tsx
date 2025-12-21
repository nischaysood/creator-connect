'use client';

import { useRouter } from 'next/navigation';
import { Building2, Sparkles } from 'lucide-react';

export default function RoleSelector() {
    const router = useRouter();

    const roles = [
        {
            id: 'brand',
            title: "I'm a Brand",
            description: 'Launch campaigns and manage creator partnerships',
            icon: <Building2 className="w-12 h-12" />,
            gradient: 'from-blue-600 to-blue-400',
            path: '/brand/dashboard'
        },
        {
            id: 'creator',
            title: "I'm a Creator",
            description: 'Browse opportunities and earn with your content',
            icon: <Sparkles className="w-12 h-12" />,
            gradient: 'from-purple-600 to-purple-400',
            path: '/creator/dashboard'
        }
    ];

    return (
        <section className="relative py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Choose Your Path</span>
                    </h2>
                    <p className="text-xl text-slate-400">How would you like to use Creator Connect?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => router.push(role.path)}
                            className="group glass-strong p-10 rounded-3xl hover-lift transition-smooth text-left relative overflow-hidden"
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                            <div className="relative z-10">
                                <div className={`text-transparent bg-gradient-to-r ${role.gradient} bg-clip-text mb-4`}>
                                    {role.icon}
                                </div>

                                <h3 className="text-3xl font-bold mb-3">{role.title}</h3>
                                <p className="text-slate-400 text-lg mb-6">{role.description}</p>

                                <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${role.gradient} rounded-full font-semibold`}>
                                    Get Started
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
