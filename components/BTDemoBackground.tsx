'use client';

/**
 * BTDemo Background Component
 * Adds the signature background blobs for depth
 */
export function BTDemoBackground() {
  return (
    <>
      {/* Top-left blob */}
      <div
        className="fixed top-0 left-0 w-[325px] h-[325px] pointer-events-none z-0"
        style={{
          background: '#2C2E2F',
          filter: 'blur(325px)',
          opacity: 0.3
        }}
      />

      {/* Bottom-right blob */}
      <div
        className="fixed bottom-0 right-0 w-[325px] h-[325px] pointer-events-none z-0"
        style={{
          background: '#435200',
          filter: 'blur(325px)',
          opacity: 0.2
        }}
      />
    </>
  );
}