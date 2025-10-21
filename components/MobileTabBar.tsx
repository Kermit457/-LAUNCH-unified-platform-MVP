"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItems, isNavItemActive } from "@/config/nav";
import { useWallet } from "@/contexts/WalletContext";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { connected } = useWallet();

  // Get nav items from centralized config
  const navItems = getNavItems({ authenticated: connected });

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className="md:hidden fixed left-0 right-0 bottom-0 h-14 bg-black border-t-2 border-zinc-800 z-[9999]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className={`grid h-full`} style={{ gridTemplateColumns: `repeat(${navItems.length}, 1fr)` }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(item.href, pathname || '');

          return (
            <li key={item.href} className="contents">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "h-full w-full",
                  "flex flex-col items-center justify-center",
                  "gap-1 select-none touch-manipulation",
                  "text-[10px] font-medium leading-none",
                  "transition-colors relative",
                  active ? `${item.color} font-semibold` : "text-zinc-400",
                ].join(" ")}
              >
                {active && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent`} />
                )}
                <div className={active ? "drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" : ""}>
                  <Icon className="w-6 h-6 shrink-0" strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}