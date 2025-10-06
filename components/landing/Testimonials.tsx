"use client"

import { landingData } from '@/lib/landingData'

export function Testimonials() {
  const { testimonials, press } = landingData

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-fuchsia-950/10 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            What Builders & Creators Are Saying
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl hover:border-fuchsia-500/50 transition-all"
            >
              {/* Quote */}
              <blockquote className="text-zinc-300 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-zinc-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Press Mentions */}
        <div className="text-center">
          <div className="text-sm text-zinc-500 uppercase tracking-wide mb-6">Featured In</div>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {press.map((item) => (
              <div key={item.outlet} className="text-center">
                <div className="text-xl font-bold text-white/70 mb-2">{item.outlet}</div>
                <div className="text-sm text-zinc-500 italic">"{item.quote}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
