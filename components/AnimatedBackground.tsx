'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(-45deg, #0a0a0a, #1a1a2e, #0f0f23, #1a1a1a)',
          backgroundSize: '400% 400%',
          animation: 'gradient-wave 15s ease infinite'
        }}
      />

      {/* Blob 1 - Top Left - Pink/Lime */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(147, 51, 234, 0.4) 50%, transparent 70%)',
          animation: 'blob-float 20s ease-in-out infinite'
        }}
      />

      {/* Blob 2 - Top Right - Lime/Blue */}
      <div
        className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 70%)',
          animation: 'blob-float-alt 25s ease-in-out infinite',
          animationDelay: '5s'
        }}
      />

      {/* Blob 3 - Bottom Left - Blue/Cyan */}
      <div
        className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 70%)',
          animation: 'blob-pulse 18s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />

      {/* Blob 4 - Bottom Right - Pink */}
      <div
        className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.7) 0%, rgba(219, 39, 119, 0.3) 50%, transparent 70%)',
          animation: 'blob-float 22s ease-in-out infinite',
          animationDelay: '8s'
        }}
      />

      {/* Additional ambient blobs for depth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
          animation: 'blob-pulse 30s ease-in-out infinite',
          animationDelay: '10s'
        }}
      />
    </div>
  )
}
