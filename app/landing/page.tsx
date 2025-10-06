"use client"

import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { SuccessStories } from '@/components/landing/SuccessStories'
import { ICMCCMExplainer } from '@/components/landing/ICMCCMExplainer'
import { PlatformFeatures } from '@/components/landing/PlatformFeatures'
import { Testimonials } from '@/components/landing/Testimonials'
import { NetworkSection } from '@/components/landing/NetworkSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Success Stories */}
      <SuccessStories />

      {/* ICM + CCM Explainer */}
      <ICMCCMExplainer />

      {/* Platform Features */}
      <PlatformFeatures />

      {/* Testimonials & Press */}
      <Testimonials />

      {/* Network Section */}
      <NetworkSection />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
