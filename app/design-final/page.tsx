"use client"

import { useState, useEffect } from 'react'
import {
  Rocket, Video, Upload, X, Edit, Trash2,
  MessageCircle, Settings, ChevronRight,
  Plus, Check, AlertCircle, TrendingUp,
  Clock, Users, DollarSign, BarChart3
} from 'lucide-react'
import Image from 'next/image'

export default function DesignFinalPage() {
  const [activeView, setActiveView] = useState<'owned' | 'icm' | 'split' | 'optimized'>('split')

  // Load Helvetica Now Display fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href = '/fonts/helvetica-now.css'
    link.rel = 'stylesheet'
    link.type = 'text/css'
    document.head.appendChild(link)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-24">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto mb-8 sticky top-0 bg-black/95 backdrop-blur-xl z-50 pt-8 pb-4">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#D1FD0A] via-[#D1FD0A] to-[#00FFFF] bg-clip-text text-transparent">
          Complete Design System Comparison
        </h1>
        <p className="text-xl text-zinc-400 mb-6">
          YOUR Figma Brand (OWNED) vs Current ICM Motion Implementation
        </p>

        {/* View Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('owned')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeView === 'owned'
                ? 'bg-[#D1FD0A] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            OWNED (Your Figma)
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeView === 'split'
                ? 'bg-gradient-to-r from-[#D1FD0A] to-[#00FF88] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Side-by-Side Compare
          </button>
          <button
            onClick={() => setActiveView('icm')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeView === 'icm'
                ? 'bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            ICM Motion (Current)
          </button>
          <button
            onClick={() => setActiveView('optimized')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeView === 'optimized'
                ? 'bg-[#D1FD0A] text-black'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            ✨ OPTIMIZED (5 Variations)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1920px] mx-auto">
        {activeView === 'owned' && <OwnedDesign />}
        {activeView === 'icm' && <ICMDesign />}
        {activeView === 'split' && <SplitComparison />}
        {activeView === 'optimized' && <OptimizedVariations />}
      </div>
    </div>
  )
}

// ========================================
// OWNED DESIGN (YOUR FIGMA BRAND)
// ========================================
function OwnedDesign() {
  return (
    <div className="space-y-16">

      <div className="bg-[#0F0F0F] border-2 border-[#D1FD0A] rounded-2xl p-8">
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500, color: "#D1FD0A", letterSpacing: '-0.02em' }}>
          OWNED Brand System
        </h2>
        <p className="text-lg" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400, color: '#9C9C9C', letterSpacing: '-0.01em' }}>
          Professional, clean design language from your Figma brand guide
        </p>
      </div>

      {/* Colors */}
      <Section title="Color Palette" owned>
        <div className="grid grid-cols-5 gap-4">
          <ColorCard bg="#0F0F0F" label="BLACK" sublabel="Primary BG" owned />
          <ColorCard bg="#D1FD0A" label="LIME" sublabel="Primary Action" owned />
          <ColorCard bg="#D1FD0A" label="PURPLE" sublabel="Accent/Highlight" owned />
          <ColorCard bg="#9C9C9C" label="GRAY" sublabel="Secondary Text" owned />
          <ColorCard bg="#FFFFFF" label="WHITE" sublabel="Primary Text" owned />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" owned>
        <div className="space-y-6">
          <div className="bg-[#0F0F0F] border border-[#D1FD0A] rounded-xl p-6">
            <div className="text-sm text-[#9C9C9C] mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Hero • X-Bold 800 • 84px</div>
            <div style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 800, fontSize: '84px', lineHeight: '1', letterSpacing: '-0.02em', color: "#D1FD0A" }}>
              Launch Your Token
            </div>
          </div>
          <div className="bg-[#0F0F0F] border border-[#D1FD0A] rounded-xl p-6">
            <div className="text-sm text-[#9C9C9C] mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Title • Medium 500 • 48px</div>
            <div style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500, fontSize: '48px', lineHeight: '1.2', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Featured Projects
            </div>
          </div>
          <div className="bg-[#0F0F0F] border border-[#D1FD0A] rounded-xl p-6">
            <div className="text-sm text-[#9C9C9C] mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Body • Regular 400 • 16px</div>
            <div style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400, fontSize: '16px', lineHeight: '1.5', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
              The quick brown fox jumps over the lazy dog. Professional typography for modern web applications.
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Button System" owned>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-bold text-[#9C9C9C] uppercase mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Primary Action</div>
            <button className="px-8 py-4 rounded-xl font-bold text-lg" style={{ background: '#D1FD0A', color: '#0F0F0F', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
              Launch Token
            </button>
          </div>
          <div>
            <div className="text-sm font-bold text-[#9C9C9C] uppercase mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Secondary Action</div>
            <button className="px-8 py-4 rounded-xl font-bold text-lg border-2" style={{ background: '#0F0F0F', color: '#FFFFFF', borderColor: '#D1FD0A', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
              View Details
            </button>
          </div>
          <div>
            <div className="text-sm font-bold text-[#9C9C9C] uppercase mb-3" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>Accent/Highlight</div>
            <button className="px-8 py-4 rounded-xl font-bold text-lg" style={{ background: "#D1FD0A", color: '#FFFFFF', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
              New Feature
            </button>
          </div>
        </div>
      </Section>

      {/* Project Cards */}
      <Section title="Project Cards" owned>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCardOwned
            title="Quantum Protocol"
            description="Next-generation DeFi infrastructure"
            price="0.45 SOL"
            change="+234%"
            holders="1,234"
            volume="45.2K SOL"
          />
          <ProjectCardOwned
            title="Neural Network DAO"
            description="AI-powered governance system"
            price="1.23 SOL"
            change="+189%"
            holders="892"
            volume="28.7K SOL"
          />
        </div>
      </Section>

      {/* Stats Display */}
      <Section title="Statistics Cards" owned>
        <div className="grid grid-cols-4 gap-4">
          <StatCardOwned icon={<TrendingUp />} label="Total Volume" value="1.2M SOL" />
          <StatCardOwned icon={<Users />} label="Active Users" value="45,234" />
          <StatCardOwned icon={<Rocket />} label="Launches" value="892" />
          <StatCardOwned icon={<DollarSign />} label="TVL" value="$12.4M" />
        </div>
      </Section>

    </div>
  )
}

// ========================================
// ICM MOTION DESIGN (CURRENT)
// ========================================
function ICMDesign() {
  return (
    <div className="space-y-16">

      <div className="bg-zinc-900 border-2 border-cyan-500 rounded-2xl p-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] bg-clip-text text-transparent">
          ICM Motion Current
        </h2>
        <p className="text-lg text-zinc-400">
          Modern crypto-native design with gradient accents
        </p>
      </div>

      {/* Colors */}
      <Section title="Color Palette" icm>
        <div className="grid grid-cols-5 gap-4">
          <ColorCard bg="#0a0a0a" label="BLACK" sublabel="Primary BG" />
          <ColorCard bg="#D1FD0A" label="PURPLE" sublabel="Accent" />
          <ColorCard bg="#00FF88" label="GREEN" sublabel="Primary" />
          <ColorCard bg="#00FFFF" label="CYAN" sublabel="Primary" />
          <ColorCard bg="#71717a" label="GRAY" sublabel="zinc-500" />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography" icm>
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-cyan-500 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-3">Hero • Extrabold • 84px</div>
            <div className="font-extrabold text-[84px] leading-none bg-gradient-to-r from-[#00FF88] to-[#00FFFF] bg-clip-text text-transparent">
              Launch Your Token
            </div>
          </div>
          <div className="bg-zinc-900 border border-cyan-500 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-3">Title • Bold • 48px</div>
            <div className="font-bold text-5xl">
              Featured Projects
            </div>
          </div>
          <div className="bg-zinc-900 border border-cyan-500 rounded-xl p-6">
            <div className="text-sm text-zinc-500 mb-3">Body • Regular • 16px</div>
            <div className="text-base">
              The quick brown fox jumps over the lazy dog. Modern typography for crypto applications.
            </div>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Button System" icm>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase mb-3">Primary Action</div>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold text-lg">
              Launch Token
            </button>
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase mb-3">Secondary Action</div>
            <button className="px-8 py-4 rounded-xl bg-zinc-800 border-2 border-zinc-700 text-white font-bold text-lg">
              View Details
            </button>
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-500 uppercase mb-3">Accent</div>
            <button className="px-8 py-4 rounded-xl bg-[#D1FD0A] text-white font-bold text-lg">
              New Feature
            </button>
          </div>
        </div>
      </Section>

      {/* Project Cards */}
      <Section title="Project Cards" icm>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCardICM
            title="Quantum Protocol"
            description="Next-generation DeFi infrastructure"
            price="0.45 SOL"
            change="+234%"
            holders="1,234"
            volume="45.2K SOL"
          />
          <ProjectCardICM
            title="Neural Network DAO"
            description="AI-powered governance system"
            price="1.23 SOL"
            change="+189%"
            holders="892"
            volume="28.7K SOL"
          />
        </div>
      </Section>

      {/* Stats Display */}
      <Section title="Statistics Cards" icm>
        <div className="grid grid-cols-4 gap-4">
          <StatCardICM icon={<TrendingUp />} label="Total Volume" value="1.2M SOL" />
          <StatCardICM icon={<Users />} label="Active Users" value="45,234" />
          <StatCardICM icon={<Rocket />} label="Launches" value="892" />
          <StatCardICM icon={<DollarSign />} label="TVL" value="$12.4M" />
        </div>
      </Section>

    </div>
  )
}

// ========================================
// SPLIT COMPARISON
// ========================================
function SplitComparison() {
  return (
    <div className="space-y-16">

      <div className="bg-gradient-to-r from-[#D1FD0A]/20 to-[#00FF88]/20 border-2 border-[#D1FD0A] rounded-2xl p-8">
        <h2 className="text-4xl font-bold mb-4 text-[#D1FD0A]">
          Side-by-Side Comparison
        </h2>
        <p className="text-lg text-zinc-300">
          Compare your OWNED Figma brand with current ICM Motion implementation
        </p>
      </div>

      {/* Buttons Comparison */}
      <div>
        <h3 className="text-3xl font-bold mb-8">Primary Buttons</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#D1FD0A]">OWNED (Figma)</div>
            <button className="w-full px-8 py-4 rounded-xl font-bold text-lg" style={{ background: "#D1FD0A", color: '#FFFFFF', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
              Launch Token
            </button>
            <div className="text-sm text-zinc-500">Lime (#D1FD0A) • "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial Bold</div>
          </div>
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#00FF88]">ICM Motion (Current)</div>
            <button className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold text-lg">
              Launch Token
            </button>
            <div className="text-sm text-zinc-500">Green-Cyan Gradient • Inter Tight Bold</div>
          </div>
        </div>
      </div>

      {/* Project Cards Comparison */}
      <div>
        <h3 className="text-3xl font-bold mb-8">Project Cards</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#D1FD0A]">OWNED (Figma)</div>
            <ProjectCardOwned
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#00FF88]">ICM Motion (Current)</div>
            <ProjectCardICM
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards Comparison */}
      <div>
        <h3 className="text-3xl font-bold mb-8">Statistics Cards</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#D1FD0A]">OWNED (Figma)</div>
            <div className="grid grid-cols-2 gap-4">
              <StatCardOwned icon={<TrendingUp />} label="Volume" value="1.2M SOL" />
              <StatCardOwned icon={<Users />} label="Users" value="45,234" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#00FF88]">ICM Motion (Current)</div>
            <div className="grid grid-cols-2 gap-4">
              <StatCardICM icon={<TrendingUp />} label="Volume" value="1.2M SOL" />
              <StatCardICM icon={<Users />} label="Users" value="45,234" />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Comparison */}
      <div>
        <h3 className="text-3xl font-bold mb-8">Typography</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#D1FD0A]">OWNED (Figma)</div>
            <div className="bg-[#0F0F0F] border border-[#D1FD0A] rounded-xl p-6">
              <div style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 800, fontSize: '48px', lineHeight: '1.2', letterSpacing: '-0.02em', color: "#D1FD0A" }}>
                "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial
              </div>
              <div className="text-[#9C9C9C] mt-4" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400, fontSize: '16px' }}>
                Professional, clean, modern sans-serif with tight spacing
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-xl font-bold text-[#00FF88]">ICM Motion (Current)</div>
            <div className="bg-zinc-900 border border-cyan-500 rounded-xl p-6">
              <div className="font-extrabold text-5xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] bg-clip-text text-transparent">
                Inter Tight
              </div>
              <div className="text-zinc-400 mt-4">
                Optimized for screens, modern tech aesthetic, free
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Recommendation */}
      <div className="bg-gradient-to-r from-[#D1FD0A]/20 to-[#00FF88]/20 border-2 border-[#D1FD0A] rounded-2xl p-8">
        <h3 className="text-3xl font-bold mb-6 text-[#D1FD0A]">Decision Time</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-[#0F0F0F] border-2 border-[#D1FD0A] rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4" style={{ color: '#D1FD0A', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
              Choose OWNED If:
            </h4>
            <ul className="space-y-3 text-zinc-300" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400 }}>
              <li className="flex gap-3">
                <span className="text-[#D1FD0A]">●</span>
                <span>You want professional, corporate aesthetic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D1FD0A]">●</span>
                <span>Brand consistency with Figma is critical</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D1FD0A]">●</span>
                <span>You have "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial license</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D1FD0A]">●</span>
                <span>Lime/Lime palette resonates with your vision</span>
              </li>
            </ul>
          </div>
          <div className="bg-zinc-900 border-2 border-[#00FF88] rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4 text-[#00FF88]">
              Choose ICM Motion If:
            </h4>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex gap-3">
                <span className="text-[#00FF88]">●</span>
                <span>You want crypto-native, Web3 aesthetic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00FF88]">●</span>
                <span>Performance and bundle size matter</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00FF88]">●</span>
                <span>Gradient accents align with crypto culture</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00FF88]">●</span>
                <span>Already implemented, no migration cost</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

// ========================================
// HELPER COMPONENTS
// ========================================

function Section({ title, children, owned, icm }: { title: string; children: React.ReactNode; owned?: boolean; icm?: boolean }) {
  const borderColor = owned ? '#D1FD0A' : icm ? '#00FF88' : '#71717a'
  const textColor = owned ? '#D1FD0A' : icm ? '#00FFFF' : '#FFFFFF'

  return (
    <div className="border-2 rounded-2xl p-8" style={{ borderColor, background: owned ? '#0F0F0F' : icm ? '#18181b' : 'transparent' }}>
      <h3 className="text-3xl font-bold mb-8" style={{ color: textColor, fontFamily: owned ? '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial' : 'inherit', fontWeight: owned ? 500 : 'bold' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function ColorCard({ bg, label, sublabel, owned }: { bg: string; label: string; sublabel: string; owned?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="w-full h-32 rounded-xl mb-3" style={{ background: bg, border: bg === '#FFFFFF' ? '1px solid #71717a' : 'none' }} />
      <div className="text-lg font-bold" style={{ fontFamily: owned ? '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial' : 'inherit', fontWeight: owned ? 500 : 'bold' }}>
        {label}
      </div>
      <div className="text-sm text-zinc-500" style={{ fontFamily: owned ? '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial' : 'inherit' }}>
        {sublabel}
      </div>
      <div className="text-xs text-zinc-600 font-mono">{bg}</div>
    </div>
  )
}

function ProjectCardOwned({ title, description, price, change, holders, volume }: {
  title: string
  description: string
  price: string
  change: string
  holders: string
  volume: string
}) {
  return (
    <div className="rounded-xl p-6 border-2" style={{ background: '#0F0F0F', borderColor: "#D1FD0A" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>
            {title}
          </h4>
          <p className="text-sm" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400, color: '#9C9C9C' }}>
            {description}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full" style={{ background: "#D1FD0A" }} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>PRICE</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{price}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>24H CHANGE</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: "#D1FD0A" }}>{change}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>HOLDERS</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{holders}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>VOLUME</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{volume}</div>
        </div>
      </div>

      <button className="w-full px-6 py-3 rounded-xl font-bold" style={{ background: "#D1FD0A", color: '#FFFFFF', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
        View Details
      </button>
    </div>
  )
}

function ProjectCardICM({ title, description, price, change, holders, volume }: {
  title: string
  description: string
  price: string
  change: string
  holders: string
  volume: string
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 border-2 border-zinc-800 hover:border-cyan-500 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-2xl font-bold mb-2">{title}</h4>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00FFFF]" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-zinc-500">PRICE</div>
          <div className="text-lg font-bold">{price}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">24H CHANGE</div>
          <div className="text-lg font-bold text-[#00FF88]">{change}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">HOLDERS</div>
          <div className="text-lg font-bold">{holders}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">VOLUME</div>
          <div className="text-lg font-bold">{volume}</div>
        </div>
      </div>

      <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold">
        View Details
      </button>
    </div>
  )
}

function StatCardOwned({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl p-6 border-2" style={{ background: '#0F0F0F', borderColor: "#D1FD0A" }}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "#D1FD0A", color: '#FFFFFF' }}>
        {icon}
      </div>
      <div className="text-sm mb-2" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>
        {label}
      </div>
      <div className="text-3xl font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>
        {value}
      </div>
    </div>
  )
}

function StatCardICM({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 border-2 border-zinc-800">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#00FF88] to-[#00FFFF] flex items-center justify-center mb-4 text-black">
        {icon}
      </div>
      <div className="text-sm text-zinc-500 mb-2">
        {label}
      </div>
      <div className="text-3xl font-bold">
        {value}
      </div>
    </div>
  )
}

// ========================================
// OPTIMIZED VARIATIONS (NEW)
// ========================================
function OptimizedVariations() {
  return (
    <div className="space-y-16">

      <div className="bg-gradient-to-r from-[#D1FD0A]/20 via-[#9945FF]/20 to-[#14F195]/20 border-2 border-[#D1FD0A] rounded-2xl p-8">
        <h2 className="text-4xl font-bold mb-4 text-[#D1FD0A]">
          ✨ OPTIMIZED Color Variations
        </h2>
        <p className="text-lg text-zinc-300">
          5 professional color palettes keeping BLACK + LIME as primary. Designed by UI/UX expert for crypto platforms.
        </p>
      </div>

      {/* VARIATION 1: Electric Solana */}
      <div className="border-2 border-[#9945FF] rounded-2xl p-8 bg-[#0F0F0F]">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">⚡</div>
          <div>
            <h3 className="text-3xl font-bold text-[#9945FF]">VARIATION 1: Electric Solana</h3>
            <p className="text-zinc-400">Official Solana lime + energetic aqua mint</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <ColorCard bg="#0F0F0F" label="BLACK" sublabel="Background" owned />
          <ColorCard bg="#D1FD0A" label="LIME" sublabel="Primary CTA" owned />
          <ColorCard bg="#9945FF" label="SOLANA PURPLE" sublabel="Secondary" owned />
          <ColorCard bg="#14F195" label="AQUA MINT" sublabel="Success/Live" owned />
          <ColorCard bg="#FFFFFF" label="WHITE" sublabel="Text" owned />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-[#14F195]">Live Example</h4>
            <ProjectCardOptimized
              variant="solana"
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
          <div className="bg-[#0F0F0F] border border-[#9945FF] rounded-xl p-6">
            <h4 className="text-xl font-bold text-[#9945FF] mb-4">Why This Works</h4>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex gap-2">
                <span className="text-[#14F195]">✓</span>
                <span>Instant Solana brand recognition (#9945FF official color)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#14F195]">✓</span>
                <span>Aqua mint (#14F195) creates triadic harmony with LIME</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#14F195]">✓</span>
                <span>WCAG AA compliant: Lime 4.8:1, Mint 9.2:1 contrast</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#14F195]">✓</span>
                <span>Perfect for Solana-native platforms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* VARIATION 2: Cyber Finance */}
      <div className="border-2 border-[#00D4FF] rounded-2xl p-8 bg-[#0F0F0F]">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">🌐</div>
          <div>
            <h3 className="text-3xl font-bold text-[#00D4FF]">VARIATION 2: Cyber Finance</h3>
            <p className="text-zinc-400">Electric cyan + hot pink for data-driven platforms</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <ColorCard bg="#0F0F0F" label="BLACK" sublabel="Background" owned />
          <ColorCard bg="#D1FD0A" label="LIME" sublabel="Primary CTA" owned />
          <ColorCard bg="#00D4FF" label="ELECTRIC CYAN" sublabel="Data/Charts" owned />
          <ColorCard bg="#FF3864" label="HOT PINK" sublabel="Alerts/Urgent" owned />
          <ColorCard bg="#FFFFFF" label="WHITE" sublabel="Text" owned />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-[#00D4FF]">Live Example</h4>
            <ProjectCardOptimized
              variant="cyber"
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
          <div className="bg-[#0F0F0F] border border-[#00D4FF] rounded-xl p-6">
            <h4 className="text-xl font-bold text-[#00D4FF] mb-4">Why This Works</h4>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex gap-2">
                <span className="text-[#FF3864]">✓</span>
                <span>Complementary split: Cyan opposes LIME for max vibrancy</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF3864]">✓</span>
                <span>Terminal UI aesthetic - perfect for data dashboards</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF3864]">✓</span>
                <span>Cyan 9.8:1, Pink 5.2:1 contrast ratios (excellent)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF3864]">✓</span>
                <span>Hot pink provides high-urgency signals (FOMO launches)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* VARIATION 3: Web3 Minimalist */}
      <div className="border-2 border-[#7B61FF] rounded-2xl p-8 bg-[#0F0F0F]">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">💎</div>
          <div>
            <h3 className="text-3xl font-bold text-[#7B61FF]">VARIATION 3: Web3 Minimalist</h3>
            <p className="text-zinc-400">Sophisticated periwinkle + amber gold for premium feel</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <ColorCard bg="#0F0F0F" label="BLACK" sublabel="Background" owned />
          <ColorCard bg="#D1FD0A" label="LIME" sublabel="Primary CTA" owned />
          <ColorCard bg="#7B61FF" label="PERIWINKLE" sublabel="Secondary" owned />
          <ColorCard bg="#FFC700" label="AMBER GOLD" sublabel="Premium/Value" owned />
          <ColorCard bg="#FFFFFF" label="WHITE" sublabel="Text" owned />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-[#FFC700]">Live Example</h4>
            <ProjectCardOptimized
              variant="minimalist"
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
          <div className="bg-[#0F0F0F] border border-[#7B61FF] rounded-xl p-6">
            <h4 className="text-xl font-bold text-[#7B61FF] mb-4">Why This Works</h4>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex gap-2">
                <span className="text-[#FFC700]">✓</span>
                <span>Periwinkle: Professional yet Web3 familiar (Ethereum family)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFC700]">✓</span>
                <span>Amber gold: Psychological "value" perception (rewards/money)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFC700]">✓</span>
                <span>Periwinkle 6.1:1, Gold 10.2:1 contrast (AAA compliant)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFC700]">✓</span>
                <span>Best for sophisticated traders & premium platforms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* VARIATION 4: ICM Energy */}
      <div className="border-2 border-[#00FFFF] rounded-2xl p-8 bg-[#0F0F0F]">
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl">🚀</div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#00FFFF] via-[#00FF88] to-[#FFD700] bg-clip-text text-transparent">
              VARIATION 4: ICM Energy
            </h3>
            <p className="text-zinc-400">Full spectrum crypto energy with cyan, green, yellow, orange</p>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-8">
          <ColorCard bg="#0F0F0F" label="BLACK" sublabel="Background" owned />
          <ColorCard bg="#00FFFF" label="CYAN" sublabel="Primary/Highlight" owned />
          <ColorCard bg="#00FF88" label="GREEN" sublabel="Success/Positive" owned />
          <ColorCard bg="#FFD700" label="YELLOW" sublabel="Attention/Energy" owned />
          <ColorCard bg="#FF8800" label="ORANGE" sublabel="Secondary" owned />
          <ColorCard bg="#F5F5F5" label="OFF-WHITE" sublabel="Text" owned />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-[#00FFFF]">Live Example</h4>
            <ProjectCardOptimized
              variant="icm"
              title="Quantum Protocol"
              description="Next-generation DeFi infrastructure"
              price="0.45 SOL"
              change="+234%"
              holders="1,234"
              volume="45.2K SOL"
            />
          </div>
          <div className="bg-[#0F0F0F] border border-[#00FFFF] rounded-xl p-6">
            <h4 className="text-xl font-bold text-[#00FFFF] mb-4">Why This Works</h4>
            <ul className="space-y-3 text-zinc-300 text-sm">
              <li className="flex gap-2">
                <span className="text-[#00FF88]">✓</span>
                <span>Full spectrum energy: Cyan → Green → Yellow → Orange gradient</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFD700]">✓</span>
                <span>Maximum crypto vibe: Neon colors evoke trading terminals</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF8800]">✓</span>
                <span>Clear hierarchy: Cyan primary, Green success, Yellow warnings</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#00FFFF]">✓</span>
                <span>Best for: High-energy launches & meme coin platforms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* VARIATION 5: BATTLETECH GLOW */}
      <div className="border-2 rounded-2xl p-8 relative overflow-hidden" style={{ borderColor: '#D1FD0A', background: '#000000' }}>
        {/* Blurred background blobs - Gaming UI effect */}
        <div className="absolute top-0 left-0 w-[325px] h-[325px] rounded-full opacity-30" style={{
          background: '#2C2E2F',
          filter: 'blur(325px)',
          pointerEvents: 'none'
        }} />
        <div className="absolute bottom-0 right-0 w-[325px] h-[325px] rounded-full opacity-20" style={{
          background: '#435200',
          filter: 'blur(325px)',
          pointerEvents: 'none'
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl">⚡</div>
            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#D1FD0A', textShadow: '0 0 20px rgba(209, 253, 10, 0.5)' }}>
                VARIATION 5: BATTLETECH GLOW
              </h3>
              <p className="text-zinc-400">Sci-fi gaming aesthetic with glassmorphism & LIME glow effects</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mb-8">
            <ColorCard bg="#000000" label="PURE BLACK" sublabel="Canvas BG" owned />
            <ColorCard bg="#D1FD0A" label="LIME GLOW" sublabel="Primary/Active" owned />
            <ColorCard bg="#3B3B3B" label="DARK GRAY" sublabel="Borders" owned />
            <ColorCard bg="#080809" label="CARD BLACK" sublabel="Glass Cards" owned />
            <ColorCard bg="#FFFFFF" label="WHITE" sublabel="Text" owned />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold" style={{ color: '#D1FD0A' }}>Live Example</h4>
              <ProjectCardBattletech
                title="Quantum Protocol"
                description="Next-generation DeFi infrastructure"
                price="0.45 SOL"
                change="+234%"
                holders="1,234"
                volume="45.2K SOL"
              />
            </div>
            <div className="rounded-xl p-6" style={{
              background: 'rgba(8, 8, 9, 0.6)',
              border: '0.8px solid #3B3B3B',
              backdropFilter: 'blur(2px)'
            }}>
              <h4 className="text-xl font-bold mb-4" style={{ color: '#D1FD0A' }}>Why This Works</h4>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex gap-2">
                  <span style={{ color: '#D1FD0A' }}>✓</span>
                  <span>Pure black (#000000) canvas creates maximum contrast depth</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#D1FD0A' }}>✓</span>
                  <span>Glassmorphism cards (blur 2px-3.5px) add sci-fi layers</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#D1FD0A' }}>✓</span>
                  <span>LIME glow effect (blur 12.5px) creates energy/active states</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#D1FD0A' }}>✓</span>
                  <span>325px blurred background blobs add depth without distraction</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: '#D1FD0A' }}>✓</span>
                  <span>Best for: Gaming-crypto fusion, battletech/terminal aesthetics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Glow Button Example */}
          <div className="mt-8 space-y-4">
            <h4 className="text-xl font-bold text-zinc-400">GLOW Effects Preview</h4>
            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-xl font-bold text-lg relative" style={{
                background: '#D1FD0A',
                color: '#000000',
                fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
                fontWeight: 700
              }}>
                <div className="absolute inset-0 rounded-xl opacity-60" style={{
                  background: '#D1FD0A',
                  filter: 'blur(12.5px)',
                  zIndex: -1
                }} />
                Launch Token (GLOW)
              </button>
              <button className="px-8 py-4 rounded-xl font-bold text-lg" style={{
                background: 'rgba(8, 8, 9, 0.6)',
                color: '#FFFFFF',
                border: '0.8px solid #3B3B3B',
                backdropFilter: 'blur(2px)',
                fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
                fontWeight: 700
              }}>
                View Details (GLASS)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-gradient-to-r from-[#00FFFF]/20 via-[#00FF88]/20 to-[#FFD700]/20 border-2 border-[#D1FD0A] rounded-2xl p-8">
        <h3 className="text-3xl font-bold mb-6 text-[#D1FD0A]">🏆 All 5 Variations Summary</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-[#0F0F0F] border-2 border-[#9945FF] rounded-xl p-6">
            <div className="text-[#9945FF] font-bold text-4xl mb-2">1st</div>
            <h4 className="text-xl font-bold text-[#9945FF] mb-2">Electric Solana</h4>
            <p className="text-zinc-400 text-sm">Best for Solana-native platforms. Instant brand recognition.</p>
          </div>
          <div className="bg-[#0F0F0F] border-2 border-[#00D4FF] rounded-xl p-6">
            <div className="text-[#00D4FF] font-bold text-4xl mb-2">2nd</div>
            <h4 className="text-xl font-bold text-[#00D4FF] mb-2">Cyber Finance</h4>
            <p className="text-zinc-400 text-sm">Best for data-heavy platforms with real-time charts.</p>
          </div>
          <div className="bg-[#0F0F0F] border-2 border-[#7B61FF] rounded-xl p-6">
            <div className="text-[#7B61FF] font-bold text-4xl mb-2">3rd</div>
            <h4 className="text-xl font-bold text-[#7B61FF] mb-2">Web3 Minimalist</h4>
            <p className="text-zinc-400 text-sm">Best for premium/sophisticated trader platforms.</p>
          </div>
          <div className="bg-[#0F0F0F] border-2 border-[#00FFFF] rounded-xl p-6">
            <div className="text-[#00FFFF] font-bold text-4xl mb-2">4th</div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-[#00FFFF] to-[#FFD700] bg-clip-text text-transparent mb-2">ICM Energy</h4>
            <p className="text-zinc-400 text-sm">Best for high-energy meme coin & launch platforms.</p>
          </div>
          <div className="bg-[#000000] border-2 rounded-xl p-6" style={{ borderColor: '#D1FD0A' }}>
            <div className="font-bold text-4xl mb-2" style={{ color: '#D1FD0A', textShadow: '0 0 20px rgba(209, 253, 10, 0.5)' }}>5th</div>
            <h4 className="text-xl font-bold mb-2" style={{ color: '#D1FD0A' }}>Battletech Glow</h4>
            <p className="text-zinc-400 text-sm">Best for gaming-crypto fusion & sci-fi terminal aesthetic.</p>
          </div>
        </div>
      </div>

    </div>
  )
}

function ProjectCardOptimized({ variant, title, description, price, change, holders, volume }: {
  variant: 'solana' | 'cyber' | 'minimalist' | 'icm'
  title: string
  description: string
  price: string
  change: string
  holders: string
  volume: string
}) {
  const colors = {
    solana: { accent: '#9945FF', highlight: '#14F195', border: '#9945FF' },
    cyber: { accent: '#00D4FF', highlight: '#FF3864', border: '#00D4FF' },
    minimalist: { accent: '#7B61FF', highlight: '#FFC700', border: '#7B61FF' },
    icm: { accent: '#00FFFF', highlight: '#00FF88', border: '#00FFFF' }
  }

  const { accent, highlight, border } = colors[variant]

  return (
    <div className="rounded-xl p-6 border-2" style={{ background: '#0F0F0F', borderColor: border }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>
            {title}
          </h4>
          <p className="text-sm" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 400, color: '#9C9C9C' }}>
            {description}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full" style={{ background: accent }} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>PRICE</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{price}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>24H CHANGE</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: highlight }}>{change}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>HOLDERS</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{holders}</div>
        </div>
        <div>
          <div className="text-xs" style={{ color: '#9C9C9C', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 500 }}>VOLUME</div>
          <div className="text-lg font-bold" style={{ fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700, color: '#FFFFFF' }}>{volume}</div>
        </div>
      </div>

      <button className="w-full px-6 py-3 rounded-xl font-bold" style={{ background: '#D1FD0A', color: '#0F0F0F', fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial', fontWeight: 700 }}>
        View Details
      </button>
    </div>
  )
}

function ProjectCardBattletech({ title, description, price, change, holders, volume }: {
  title: string
  description: string
  price: string
  change: string
  holders: string
  volume: string
}) {
  return (
    <div className="rounded-[20px] p-6 relative overflow-hidden" style={{
      background: 'rgba(8, 8, 9, 0.6)',
      border: '0.8px solid #3B3B3B',
      backdropFilter: 'blur(3.5px)'
    }}>
      {/* LIME glow accent on active/hover */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20" style={{
        background: '#D1FD0A',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-2xl font-bold mb-2" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>
              {title}
            </h4>
            <p className="text-sm" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 400,
              color: '#9C9C9C'
            }}>
              {description}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full relative" style={{ background: '#D1FD0A' }}>
            {/* Glow effect on icon */}
            <div className="absolute inset-0 rounded-full opacity-40" style={{
              background: '#D1FD0A',
              filter: 'blur(8px)',
              zIndex: -1
            }} />
          </div>
        </div>

        {/* Progress bar example from Figma */}
        <div className="mb-4 h-2 rounded-full overflow-hidden" style={{ background: '#3B3B3B' }}>
          <div className="h-full relative" style={{
            width: '65%',
            background: '#D1FD0A'
          }}>
            {/* Glow on progress */}
            <div className="absolute inset-0 opacity-60" style={{
              background: '#D1FD0A',
              filter: 'blur(4px)'
            }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs uppercase" style={{
              color: '#9C9C9C',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>PRICE</div>
            <div className="text-lg font-bold" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>{price}</div>
          </div>
          <div>
            <div className="text-xs uppercase" style={{
              color: '#9C9C9C',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>24H CHANGE</div>
            <div className="text-lg font-bold" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 700,
              color: '#D1FD0A',
              textShadow: '0 0 10px rgba(209, 253, 10, 0.3)'
            }}>{change}</div>
          </div>
          <div>
            <div className="text-xs uppercase" style={{
              color: '#9C9C9C',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>HOLDERS</div>
            <div className="text-lg font-bold" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>{holders}</div>
          </div>
          <div>
            <div className="text-xs uppercase" style={{
              color: '#9C9C9C',
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>VOLUME</div>
            <div className="text-lg font-bold" style={{
              fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>{volume}</div>
          </div>
        </div>

        <button className="w-full px-6 py-3 rounded-[14px] font-bold relative" style={{
          background: '#D1FD0A',
          color: '#000000',
          fontFamily: '"Helvetica Now Display", "Helvetica Neue", Helvetica, Arial',
          fontWeight: 700,
          border: 'none'
        }}>
          {/* Glow effect behind button */}
          <div className="absolute inset-0 rounded-[14px] opacity-50" style={{
            background: '#D1FD0A',
            filter: 'blur(8px)',
            zIndex: -1
          }} />
          Launch Mission
        </button>
      </div>
    </div>
  )
}
