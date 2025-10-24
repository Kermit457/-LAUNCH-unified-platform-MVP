"use client"

import { useState } from 'react'
import {
  Rocket, Video, Upload, X, Edit, Trash2,
  MessageCircle, Users, Settings, ChevronRight,
  Plus, Check, AlertCircle
} from 'lucide-react'

export default function BrandComparePage() {
  const [showComparison, setShowComparison] = useState<'before' | 'after' | 'both'>('both')
  const [activeSection, setActiveSection] = useState<'colors' | 'buttons' | 'components'>('colors')
  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#D1FD0A] via-[#D1FD0A] to-[#00FFFF] bg-clip-text text-transparent">
          Complete Design System Preview
        </h1>
        <p className="text-xl text-zinc-400">
          OWNED Brand Guide vs ICM Motion Current - All Components
        </p>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setActiveSection('colors')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeSection === 'colors'
                ? 'bg-[#D1FD0A] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            1. Brand Colors
          </button>
          <button
            onClick={() => setActiveSection('buttons')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeSection === 'buttons'
                ? 'bg-[#D1FD0A] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            2. Button System
          </button>
          <button
            onClick={() => setActiveSection('components')}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              activeSection === 'components'
                ? 'bg-[#D1FD0A] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            3. Components
          </button>
        </div>

        {/* Comparison Toggle (for buttons section) */}
        {activeSection === 'buttons' && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowComparison('before')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                showComparison === 'before'
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Show Before Only
            </button>
            <button
              onClick={() => setShowComparison('both')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                showComparison === 'both'
                  ? 'bg-[#00FF88] text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setShowComparison('after')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                showComparison === 'after'
                  ? 'bg-green-500 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Show After Only
            </button>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="max-w-[1920px] mx-auto">
        {activeSection === 'colors' && <ColorsSection />}
        {/* {activeSection === 'buttons' && <ButtonsSection showComparison={showComparison} />} */}
        {/* {activeSection === 'components' && <ComponentsSection />} */}
      </div>
    </div>
  )
}

// SECTION 1: BRAND COLORS
function ColorsSection() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto mb-12"></div>

      {/* EXACT FIGMA COLOR SWATCHES */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-5 gap-6">

          {/* Color 1: Black */}
          <div className="flex flex-col items-center">
            <div
              className="w-full h-[718px] rounded-[10px] border"
              style={{
                background: '#0F0F0F',
                borderColor: '#515151',
                borderWidth: '1px'
              }}
            />
            <div className="mt-6 text-center">
              <div
                className="text-[44px] leading-[44px] font-medium mb-3"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#FFFFFF'
                }}
              >
                BLACK
              </div>
              <div
                className="text-[12px] leading-[13px] font-medium"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#EAE8E4'
                }}
              >
                #0F0F0F<br/>
                RGB (15, 15, 15)<br/>
                CMYK (0, 0, 0, 94)
              </div>
            </div>
          </div>

          {/* Color 2: Lime */}
          <div className="flex flex-col items-center">
            <div
              className="w-full h-[718px] rounded-[10px]"
              style={{ background: '#D1FD0A' }}
            />
            <div className="mt-6 text-center">
              <div
                className="text-[44px] leading-[44px] font-medium mb-3"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#FFFFFF'
                }}
              >
                LIME
              </div>
              <div
                className="text-[12px] leading-[13px] font-medium"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#EAE8E4'
                }}
              >
                #D1FD0A<br/>
                RGB (73, 59, 197)<br/>
                CMYK (63, 70, 0, 23)
              </div>
            </div>
          </div>

          {/* Color 3: Lime */}
          <div className="flex flex-col items-center">
            <div
              className="w-full h-[718px] rounded-[10px]"
              style={{ background: '#D1FD0A' }}
            />
            <div className="mt-6 text-center">
              <div
                className="text-[44px] leading-[44px] font-medium mb-3"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                LIME
              </div>
              <div
                className="text-[12px] leading-[13px] font-medium"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                #D1FD0A<br/>
                RGB (209, 253, 10)<br/>
                CMYK (17, 0, 96, 1)
              </div>
            </div>
          </div>

          {/* Color 4: Gray */}
          <div className="flex flex-col items-center">
            <div
              className="w-full h-[718px] rounded-[10px]"
              style={{ background: '#9C9C9C' }}
            />
            <div className="mt-6 text-center">
              <div
                className="text-[44px] leading-[44px] font-medium mb-3"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                GRAY
              </div>
              <div
                className="text-[12px] leading-[13px] font-medium"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                #9C9C9C<br/>
                RGB (156, 156, 156)<br/>
                CMYK (0, 0, 0, 39)
              </div>
            </div>
          </div>

          {/* Color 5: White */}
          <div className="flex flex-col items-center">
            <div
              className="w-full h-[718px] rounded-[10px]"
              style={{ background: '#FFFFFF' }}
            />
            <div className="mt-6 text-center">
              <div
                className="text-[44px] leading-[44px] font-medium mb-3"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                WHITE
              </div>
              <div
                className="text-[12px] leading-[13px] font-medium"
                style={{
                  fontFamily: 'Helvetica Now Text, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111111'
                }}
              >
                #FFFFFF<br/>
                RGB (255, 255, 255)<br/>
                CMYK (0, 0, 0, 0)
              </div>
            </div>
          </div>

        </div>

        {/* Comparison with ICM */}
        <div className="mt-16 pt-16 border-t border-zinc-800">
          <h2 className="text-4xl font-bold mb-8">ICM Motion Current Colors</h2>
          <div className="grid grid-cols-5 gap-6">

            {/* ICM Black */}
            <div className="flex flex-col items-center">
              <div
                className="w-full h-[400px] rounded-[10px]"
                style={{ background: '#0a0a0a' }}
              />
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold mb-2">BLACK</div>
                <div className="text-sm text-zinc-400">
                  #0a0a0a<br/>
                  (Current ICM)
                </div>
              </div>
            </div>

            {/* ICM Lime */}
            <div className="flex flex-col items-center">
              <div
                className="w-full h-[400px] rounded-[10px]"
                style={{ background: '#D1FD0A' }}
              />
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold mb-2">LIME</div>
                <div className="text-sm text-zinc-400">
                  #D1FD0A<br/>
                  (Current ICM)
                </div>
              </div>
            </div>

            {/* ICM Green */}
            <div className="flex flex-col items-center">
              <div
                className="w-full h-[400px] rounded-[10px]"
                style={{ background: '#00FF88' }}
              />
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold mb-2 text-black">GREEN</div>
                <div className="text-sm text-zinc-600">
                  #00FF88<br/>
                  (Current ICM)
                </div>
              </div>
            </div>

            {/* ICM Cyan */}
            <div className="flex flex-col items-center">
              <div
                className="w-full h-[400px] rounded-[10px]"
                style={{ background: '#00FFFF' }}
              />
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold mb-2 text-black">CYAN</div>
                <div className="text-sm text-zinc-600">
                  #00FFFF<br/>
                  (Current ICM)
                </div>
              </div>
            </div>

            {/* ICM Zinc */}
            <div className="flex flex-col items-center">
              <div
                className="w-full h-[400px] rounded-[10px]"
                style={{ background: '#71717a' }}
              />
              <div className="mt-6 text-center">
                <div className="text-2xl font-bold mb-2">GRAY</div>
                <div className="text-sm text-zinc-400">
                  #71717a<br/>
                  zinc-500 (Current ICM)
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16 pt-16 border-t border-zinc-800">
          <h2 className="text-4xl font-bold mb-8">Recommendation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-green-400">✅ Keep from ICM</h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#00FF88] font-bold">●</span>
                  <span><strong>#00FF88 → #00FFFF gradient</strong> (established brand recognition)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-500 font-bold">●</span>
                  <span><strong>Zinc grays</strong> for UI elements</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#D1FD0A' }}>➕ Add from OWNED</h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span style={{ color: '#D1FD0A' }} className="font-bold">●</span>
                  <span><strong>#D1FD0A Lime</strong> for premium features, badges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#D1FD0A' }} className="font-bold">●</span>
                  <span><strong>#D1FD0A Lime</strong> for highlights, new items, achievements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white font-bold">●</span>
                  <span><strong>#0F0F0F Black</strong> replace #0a0a0a (slightly darker)</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Example Usage */}
          <div className="mt-12 bg-gradient-to-r from-lime-500/10 to-cyan-500/10 border border-lime-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Example: Hybrid Design System</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="space-y-3">
                <div className="text-sm font-bold text-zinc-400 uppercase">Primary CTA</div>
                <button
                  className="w-full px-6 py-4 rounded-xl font-bold text-black"
                  style={{ background: 'linear-gradient(to right, #00FF88, #00FFFF)' }}
                >
                  Launch Token
                </button>
                <div className="text-xs text-zinc-500">ICM gradient (keep)</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-bold text-zinc-400 uppercase">Premium Badge</div>
                <button
                  className="w-full px-6 py-4 rounded-xl font-bold text-white"
                  style={{ background: '#D1FD0A' }}
                >
                  Premium Feature
                </button>
                <div className="text-xs text-zinc-500">OWNED lime (add)</div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-bold text-zinc-400 uppercase">New Alert</div>
                <button
                  className="w-full px-6 py-4 rounded-xl font-bold"
                  style={{ background: '#D1FD0A', color: '#111111' }}
                >
                  NEW! Check this out
                </button>
                <div className="text-xs text-zinc-500">OWNED lime (add)</div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

function ColorsComparison() {
  return (
    <div className="space-y-12">

      {/* PRIMARY BRAND COLORS */}
      <Section title="1. PRIMARY BRAND COLORS">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* OWNED/Figma Colors */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-lime-400">
              OWNED (Figma Brand Guide)
            </h3>
            <div className="space-y-3">
              <ColorSwatch
                name="Main Lime"
                hex="#4037C0"
                usage="Primary brand color, backgrounds"
                variable="owned-lime"
              />
              <ColorSwatch
                name="Blue"
                hex="#4BA0EC"
                usage="Social/Twitter blue, links"
                variable="owned-blue"
              />
              <ColorSwatch
                name="Light Blue"
                hex="#3B88E8"
                usage="Accent elements"
                variable="owned-light-blue"
              />
              <ColorSwatch
                name="Yellow"
                hex="#F2FFBD"
                usage="Highlights, call-outs"
                variable="owned-yellow"
              />
              <ColorSwatch
                name="Black"
                hex="#040203"
                usage="Pure black, text"
                variable="owned-black"
              />
              <ColorSwatch
                name="Background"
                hex="#17202A"
                usage="Dark backgrounds"
                variable="owned-background"
              />
            </div>
          </div>

          {/* ICM Current Colors */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FFFF]">
              ICM Motion (Current Implementation)
            </h3>
            <div className="space-y-3">
              <ColorSwatch
                name="ICM Green"
                hex="#00FF88"
                usage="Primary gradient start, CTAs"
                variable="icm-green"
              />
              <ColorSwatch
                name="ICM Cyan"
                hex="#00FFFF"
                usage="Primary gradient end, accents"
                variable="icm-cyan"
              />
              <ColorSwatch
                name="ICM Lime"
                hex="#D1FD0A"
                usage="Secondary gradient (unused)"
                variable="icm-lime"
              />
              <ColorSwatch
                name="ICM Lime"
                hex="#B8E008"
                usage="Secondary gradient (unused)"
                variable="icm-lime"
              />
              <ColorSwatch
                name="Black"
                hex="#0a0a0a"
                usage="Backgrounds"
                variable="background"
              />
              <ColorSwatch
                name="Zinc variations"
                hex="#27272a - #f4f4f5"
                usage="Grays, borders, cards"
                variable="zinc-*"
              />
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            Color System Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-green-400 mb-2">✅ Matches</h5>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>• Both use dark backgrounds (#040203 vs #0a0a0a - very close)</li>
                <li>• Both use vibrant accent colors</li>
                <li>• Both use high-contrast approach</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-red-400 mb-2">❌ Conflicts</h5>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>• OWNED uses lime/blue (#4037C0), ICM uses green/cyan (#00FF88)</li>
                <li>• Different gradient systems (OWNED: lime→blue vs ICM: green→cyan)</li>
                <li>• OWNED has yellow accent (#F2FFBD), ICM doesn't</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* GRAYSCALE COMPARISON */}
      <Section title="2. GRAYSCALE & NEUTRALS">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* OWNED Grays */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-lime-400">OWNED Grays</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-[#F6F3F3] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#F6F3F3'}}></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#F6F3F3</div>
                  <div className="text-xs text-gray-600">Gray 50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#EBECE7] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#EBECE7'}}></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#EBECE7</div>
                  <div className="text-xs text-gray-600">Gray 100</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#D9D9D9] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#D9D9D9'}}></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#D9D9D9</div>
                  <div className="text-xs text-gray-600">Gray 200</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#8A98A4] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#8A98A4'}}></div>
                <div className="flex-1">
                  <div className="font-bold">#8A98A4</div>
                  <div className="text-xs text-zinc-400">Twitter Gray</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#3A444C] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#3A444C'}}></div>
                <div className="flex-1">
                  <div className="font-bold">#3A444C</div>
                  <div className="text-xs text-zinc-400">Lines/Borders</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1C2733] p-3 rounded-lg">
                <div className="w-12 h-12 rounded" style={{background: '#1C2733'}}></div>
                <div className="flex-1">
                  <div className="font-bold">#1C2733</div>
                  <div className="text-xs text-zinc-400">Cards/UI</div>
                </div>
              </div>
            </div>
          </div>

          {/* ICM Grays (Zinc) */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FFFF]">ICM Grays (Zinc)</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-50"></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#fafafa</div>
                  <div className="text-xs text-gray-600">zinc-50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-100 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-100"></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#f4f4f5</div>
                  <div className="text-xs text-gray-600">zinc-100</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-200 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-200"></div>
                <div className="flex-1">
                  <div className="font-bold text-black">#e4e4e7</div>
                  <div className="text-xs text-gray-600">zinc-200</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-400 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-400"></div>
                <div className="flex-1">
                  <div className="font-bold">#a1a1aa</div>
                  <div className="text-xs text-zinc-300">zinc-400</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-700 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-700"></div>
                <div className="flex-1">
                  <div className="font-bold">#3f3f46</div>
                  <div className="text-xs text-zinc-400">zinc-700</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg">
                <div className="w-12 h-12 rounded bg-zinc-900"></div>
                <div className="flex-1">
                  <div className="font-bold">#18181b</div>
                  <div className="text-xs text-zinc-400">zinc-900 (cards)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* RECOMMENDATIONS */}
      <Section title="3. RECOMMENDATIONS">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecommendationCard
            title="Keep ICM Green/Cyan"
            status="recommend"
            reason="Already established in brand, users recognize it"
          >
            <div className="h-24 rounded-lg bg-gradient-to-r from-[#00FF88] to-[#00FFFF]"></div>
          </RecommendationCard>

          <RecommendationCard
            title="Add OWNED Lime as Secondary"
            status="consider"
            reason="Use for specific features or premium tiers"
          >
            <div className="h-24 rounded-lg bg-[#4037C0]"></div>
          </RecommendationCard>

          <RecommendationCard
            title="Adopt OWNED Yellow for Highlights"
            status="recommend"
            reason="Great for tooltips, new badges, achievements"
          >
            <div className="h-24 rounded-lg bg-[#F2FFBD]"></div>
          </RecommendationCard>
        </div>
      </Section>
    </div>
  )
}

function TypographyComparison() {
  return (
    <div className="space-y-12">

      <Section title="1. FONT FAMILIES">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* OWNED Fonts */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-lime-400">OWNED (Figma)</h3>
            <div className="space-y-4">
              <FontSample
                name="Helvetica Neue"
                usage="Primary UI font"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              />
              <FontSample
                name="Helvetica Now Text"
                usage="Body text, descriptions"
                style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
              />
              <FontSample
                name="Aeonik"
                usage="Headlines, featured text"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              />
              <FontSample
                name="Arboria"
                usage="Special content"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              />
            </div>
          </div>

          {/* ICM Fonts */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FFFF]">ICM Motion (Current)</h3>
            <div className="space-y-4">
              <FontSample
                name="Inter Tight"
                usage="Primary font, all UI"
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}
              />
              <FontSample
                name="Inter"
                usage="Fallback font"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-yellow-400 mb-2">⚠️ Font Decision Needed</h4>
          <p className="text-zinc-300 mb-4">
            OWNED brand uses Helvetica family, but ICM uses Inter Tight. These are different font systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 p-4 rounded-lg">
              <h5 className="font-bold text-lime-400 mb-2">Option 1: Keep Inter Tight</h5>
              <ul className="text-sm space-y-1 text-zinc-400">
                <li>✅ Already implemented</li>
                <li>✅ Modern, web-optimized</li>
                <li>✅ Excellent readability</li>
                <li>❌ Doesn't match OWNED brand</li>
              </ul>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <h5 className="font-bold text-lime-400 mb-2">Option 2: Switch to Helvetica</h5>
              <ul className="text-sm space-y-1 text-zinc-400">
                <li>✅ Matches OWNED brand</li>
                <li>✅ Classic, professional</li>
                <li>❌ Needs font loading setup</li>
                <li>❌ Re-style entire app</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section title="2. FONT SIZES (Figma → Tailwind)">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SizeCard figma="10.37px" tailwind="text-[10px]" label="xs" />
            <SizeCard figma="11.17px" tailwind="text-[11px]" label="sm" />
            <SizeCard figma="12.765px" tailwind="text-[13px]" label="base" />
            <SizeCard figma="14px" tailwind="text-sm" label="md" />
            <SizeCard figma="15.96px" tailwind="text-base" label="lg" />
            <SizeCard figma="16px" tailwind="text-base" label="xl" />
            <SizeCard figma="19.15px" tailwind="text-lg" label="2xl" />
            <SizeCard figma="25.08px" tailwind="text-2xl" label="3xl" />
          </div>
        </div>
      </Section>
    </div>
  )
}

function ComponentsComparison() {
  return (
    <div className="space-y-12">

      <Section title="1. BUTTONS - Side by Side">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* OWNED Style */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-lime-400">OWNED Style (Figma)</h3>
            <div className="space-y-4">
              <button
                className="w-full px-6 py-3 rounded-[11px] text-white font-bold"
                style={{ background: '#4037C0' }}
              >
                Primary Button (Lime)
              </button>
              <button
                className="w-full px-6 py-3 rounded-[11px] text-white font-bold"
                style={{ background: '#4BA0EC' }}
              >
                Secondary Button (Blue)
              </button>
              <button
                className="w-full px-6 py-3 rounded-[11px] border-2 text-white font-bold"
                style={{ borderColor: '#3A444C', background: '#1C2733' }}
              >
                Ghost Button
              </button>
            </div>
          </div>

          {/* ICM Style */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FFFF]">ICM Style (Current)</h3>
            <div className="space-y-4">
              <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold">
                Primary Button (Green→Cyan)
              </button>
              <button className="w-full px-6 py-3 rounded-xl bg-zinc-800 border-2 border-zinc-700 text-white font-bold">
                Secondary Button
              </button>
              <button className="w-full px-6 py-3 rounded-xl border-2 border-zinc-700 text-white font-bold bg-transparent">
                Ghost Button
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="2. CARDS">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* OWNED Card */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-lime-400">OWNED Card</h3>
            <div
              className="p-6 rounded-[11px]"
              style={{ background: '#1C2733', border: '1px solid #3A444C' }}
            >
              <h4 className="font-bold text-lg mb-2">Card Title</h4>
              <p className="text-sm" style={{ color: '#8A98A4' }}>
                This is a card using OWNED brand colors from Figma.
                Background: #1C2733, Border: #3A444C
              </p>
              <button
                className="mt-4 px-4 py-2 rounded-[11px] text-white font-bold"
                style={{ background: '#4037C0' }}
              >
                Action
              </button>
            </div>
          </div>

          {/* ICM Card */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#00FFFF]">ICM Card</h3>
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Card Title</h4>
              <p className="text-sm text-zinc-400">
                This is a card using ICM current styling.
                Background: zinc-900/60, Border: zinc-800
              </p>
              <button className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold">
                Action
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="3. HYBRID APPROACH (Recommended)">
        <div className="bg-gradient-to-r from-lime-500/10 to-cyan-500/10 border border-lime-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6">Best of Both Worlds</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-bold text-[#00FFFF] mb-2">Keep from ICM:</h4>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>✅ Green/Cyan gradient (brand recognition)</li>
                <li>✅ Inter Tight font (modern, readable)</li>
                <li>✅ Rounded-xl borders (16px)</li>
                <li>✅ Zinc color scale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lime-400 mb-2">Adopt from OWNED:</h4>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>✅ Lime accent (#4037C0) for premium features</li>
                <li>✅ Yellow highlights (#F2FFBD) for new/important</li>
                <li>✅ Blue for social (#4BA0EC)</li>
                <li>✅ Card background (#1C2733) - darker, more contrast</li>
              </ul>
            </div>
          </div>

          {/* Example Hybrid Button */}
          <div className="bg-black/40 p-6 rounded-xl">
            <h4 className="font-bold mb-4">Example: Hybrid Primary Button</h4>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#00FFFF] text-black font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all">
              ICM Gradient + OWNED Shadows
            </button>
          </div>
        </div>
      </Section>
    </div>
  )
}

// Helper Components

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      {children}
    </div>
  )
}

function ColorSwatch({ name, hex, usage, variable }: {
  name: string
  hex: string
  usage: string
  variable: string
}) {
  return (
    <div className="flex items-center gap-4 bg-black/40 p-3 rounded-lg">
      <div
        className="w-16 h-16 rounded-lg border border-white/10 flex-shrink-0"
        style={{ background: hex }}
      ></div>
      <div className="flex-1">
        <div className="font-bold">{name}</div>
        <div className="text-sm text-zinc-400">{hex}</div>
        <div className="text-xs text-zinc-500">{usage}</div>
        <div className="text-xs text-lime-400 font-mono">{variable}</div>
      </div>
    </div>
  )
}

function FontSample({ name, usage, style }: {
  name: string
  usage: string
  style: React.CSSProperties
}) {
  return (
    <div className="bg-black/40 p-4 rounded-lg">
      <div className="font-bold mb-1">{name}</div>
      <div className="text-xs text-zinc-500 mb-3">{usage}</div>
      <div style={style} className="text-2xl">
        The quick brown fox jumps over the lazy dog
      </div>
      <div style={style} className="text-base mt-2 text-zinc-400">
        AaBbCcDd 0123456789
      </div>
    </div>
  )
}

function SizeCard({ figma, tailwind, label }: {
  figma: string
  tailwind: string
  label: string
}) {
  return (
    <div className="bg-black/40 p-4 rounded-lg">
      <div className="text-xs text-zinc-500 uppercase mb-2">{label}</div>
      <div className="font-bold text-lime-400">{figma}</div>
      <div className="text-sm text-[#00FFFF] font-mono">{tailwind}</div>
    </div>
  )
}

function RecommendationCard({ title, status, reason, children }: {
  title: string
  status: 'recommend' | 'consider' | 'avoid'
  reason: string
  children: React.ReactNode
}) {
  const statusColors = {
    recommend: 'border-green-500/50 bg-green-500/10',
    consider: 'border-yellow-500/50 bg-yellow-500/10',
    avoid: 'border-red-500/50 bg-red-500/10',
  }

  const statusIcons = {
    recommend: <Check className="w-5 h-5 text-green-400" />,
    consider: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    avoid: <X className="w-5 h-5 text-red-400" />,
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-4">
        {statusIcons[status]}
        <h4 className="font-bold">{title}</h4>
      </div>
      {children}
      <p className="text-sm text-zinc-400 mt-4">{reason}</p>
    </div>
  )
}
