'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import escrowArtifact from '@/utils/CreatorConnectEscrow.json';
import { Sparkles, Zap, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';
import RoleSelector from './components/RoleSelector';

import { ESCROW_CONTRACT_ADDRESS } from '@/constants';

const CONTRACT_ADDRESS = ESCROW_CONTRACT_ADDRESS;

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: escrowArtifact.abi,
    functionName: 'nextCampaignId',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-400" />
            <span className="text-xl font-bold gradient-text">Creator Connect</span>
          </Link>
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="animate-fadeInUp space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">Programmable Money</span>
              <br />
              <span className="text-white">for Creator Deals</span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              AI-powered verification meets blockchain escrow. Launch campaigns, submit content, and get paid instantly with MNEE tokens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/create"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover-lift transition-smooth glow-purple"
              >
                Launch Campaign
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 glass rounded-full font-semibold text-lg hover-lift transition-smooth"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="glass p-8 rounded-2xl hover-lift transition-smooth text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {nextId !== undefined ? (nextId as bigint).toString() : '0'}
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Active Campaigns</div>
            </div>
            <div className="glass p-8 rounded-2xl hover-lift transition-smooth text-center">
              <div className="text-4xl font-bold gradient-text-accent mb-2">AI</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Powered Verification</div>
            </div>
            <div className="glass p-8 rounded-2xl hover-lift transition-smooth text-center">
              <div className="text-4xl font-bold gradient-text mb-2">Instant</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Payment Release</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Why Creator Connect?</span>
            </h2>
            <p className="text-xl text-slate-400">The future of brand-creator collaborations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'AI-Powered Verification',
                description: 'Automated content verification using advanced AI agents ensures quality and compliance.',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-400/10'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Secure Escrow',
                description: 'Smart contract escrow protects both brands and creators with transparent fund management.',
                color: 'text-blue-400',
                bgColor: 'bg-blue-400/10'
              },
              {
                icon: <Sparkles className="w-10 h-10" />,
                title: 'Instant Payments',
                description: 'Get paid immediately upon verification with MNEE tokens. No waiting, no delays.',
                color: 'text-purple-400',
                bgColor: 'bg-purple-400/10'
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Creator Discovery',
                description: 'Brands find the perfect creators. Creators discover exciting opportunities.',
                color: 'text-pink-400',
                bgColor: 'bg-pink-400/10'
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: 'Campaign Analytics',
                description: 'Track performance, engagement, and ROI with comprehensive analytics.',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-400/10'
              },
              {
                icon: <CheckCircle className="w-10 h-10" />,
                title: 'Automated Workflows',
                description: 'Streamlined processes from campaign creation to payment release.',
                color: 'text-green-400',
                bgColor: 'bg-green-400/10'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-8 rounded-2xl hover-lift transition-smooth animate-fadeInUp h-full flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-slate-400">Simple, transparent, and automated</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Brands */}
            <div className="glass-strong p-12 rounded-3xl h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold gradient-text">For Brands</h3>
              </div>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Create Campaign', desc: 'Define your requirements, budget, and deliverables' },
                  { step: '02', title: 'Fund Escrow', desc: 'Deposit MNEE tokens into secure smart contract' },
                  { step: '03', title: 'AI Verifies', desc: 'Automated verification of submitted content' },
                  { step: '04', title: 'Auto-Pay', desc: 'Instant payment release upon approval' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="text-5xl font-bold gradient-text-accent opacity-40 flex-shrink-0 w-20">{item.step}</div>
                    <div className="pt-2">
                      <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Creators */}
            <div className="glass-strong p-12 rounded-3xl h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold gradient-text">For Creators</h3>
              </div>

              <div className="space-y-8">
                {[
                  { step: '01', title: 'Browse Campaigns', desc: 'Discover opportunities that match your style' },
                  { step: '02', title: 'Enroll & Create', desc: 'Join campaigns and create amazing content' },
                  { step: '03', title: 'Submit Work', desc: 'Upload your content for AI verification' },
                  { step: '04', title: 'Get Paid', desc: 'Receive instant MNEE payment upon approval' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="text-5xl font-bold gradient-text opacity-40 flex-shrink-0 w-20">{item.step}</div>
                    <div className="pt-2">
                      <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection (for connected users) */}
      {isConnected && <RoleSelector />}

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-gradient"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl font-bold">
                <span className="gradient-text">Ready to Get Started?</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Join the future of creator-brand collaborations powered by programmable money
              </p>
              <div className="pt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold gradient-text">Creator Connect</span>
              </div>
              <p className="text-slate-400">Programmable money for creator brand deals</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Platform</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">For Brands</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">For Creators</a></li>
                <li><a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-purple-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">GitHub</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>Built for MNEE Hackathon 2025 • Powered by AI & Blockchain</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
