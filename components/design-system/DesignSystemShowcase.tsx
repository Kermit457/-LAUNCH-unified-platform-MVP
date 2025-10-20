// LaunchOS Design System Showcase
// Premium native app-like components for web

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Gift, PlaySquare, Users, Wallet, LineChart,
  Zap, Cpu, Megaphone, BarChart3, Radio, Network,
  ChevronRight, ArrowUpRight, Sparkles, Home,
  Search, Plus, Bell, User, X, Check, Star
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// ============= DESIGN TOKENS =============
const tokens = {
  colors: {
    // Base
    black: '#000000',
    softBlack: '#0a0a0f',
    surface: {
      1: 'rgba(255, 255, 255, 0.02)',
      2: 'rgba(255, 255, 255, 0.04)',
      3: 'rgba(255, 255, 255, 0.06)',
      4: 'rgba(255, 255, 255, 0.08)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.06)',
      default: 'rgba(255, 255, 255, 0.08)',
      strong: 'rgba(255, 255, 255, 0.12)',
    },
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)',
      danger: 'linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)',
      info: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    }
  },
  radius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '28px',
    full: '9999px'
  },
  animation: {
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
    smooth: { type: 'spring' as const, stiffness: 100, damping: 15 },
    bounce: { type: 'spring' as const, stiffness: 400, damping: 10 }
  }
};

// ============= HAPTIC FEEDBACK HOOK =============
const useHaptic = () => {
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    // Visual feedback for web (would be actual haptic on mobile)
    const hapticEl = document.createElement('div');
    hapticEl.className = 'haptic-pulse';
    hapticEl.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
      animation: haptic-pulse 0.3s ease-out;
      z-index: 9999;
    `;

    const handleMouseMove = (e: MouseEvent) => {
      hapticEl.style.left = `${e.clientX - 20}px`;
      hapticEl.style.top = `${e.clientY - 20}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    handleMouseMove(new MouseEvent('mousemove'));

    document.body.appendChild(hapticEl);

    setTimeout(() => {
      hapticEl.remove();
      document.removeEventListener('mousemove', handleMouseMove);
    }, 300);

    // Add subtle screen shake for heavy feedback
    if (intensity === 'heavy') {
      document.body.style.transform = 'translateX(1px)';
      setTimeout(() => {
        document.body.style.transform = 'translateX(-1px)';
        setTimeout(() => {
          document.body.style.transform = 'translateX(0)';
        }, 50);
      }, 50);
    }
  };

  return { triggerHaptic };
};

// ============= GLASSMORPHIC CARD =============
export const GlassCard = ({
  children,
  className = '',
  interactive = false,
  blur = 'md',
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}) => {
  const { triggerHaptic } = useHaptic();
  const [isPressed, setIsPressed] = useState(false);

  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        ${blurValues[blur]}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, ${tokens.colors.surface[2]}, ${tokens.colors.surface[1]})`,
        border: `1px solid ${tokens.colors.border.default}`,
        borderRadius: tokens.radius.xl,
      }}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onMouseDown={() => interactive && setIsPressed(true)}
      onMouseUp={() => interactive && setIsPressed(false)}
      onMouseLeave={() => interactive && setIsPressed(false)}
      onClick={() => {
        if (interactive) {
          triggerHaptic('light');
          onClick?.();
        }
      }}
      transition={tokens.animation.spring}
    >
      {/* Gradient Border Effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, transparent, rgba(139, 92, 246, 0.1), transparent)`,
          borderRadius: tokens.radius.xl
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Press Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 pointer-events-none"
            style={{ borderRadius: tokens.radius.xl }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============= PREMIUM BUTTON =============
export const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'>) => {
  const { triggerHaptic } = useHaptic();
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      background: tokens.colors.gradients.primary,
      color: 'white',
      border: 'none'
    },
    secondary: {
      background: tokens.colors.surface[3],
      color: 'white',
      border: `1px solid ${tokens.colors.border.strong}`
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.8)',
      border: `1px solid ${tokens.colors.border.subtle}`
    },
    danger: {
      background: tokens.colors.gradients.danger,
      color: 'white',
      border: 'none'
    }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`
        relative overflow-hidden font-semibold
        flex items-center justify-center gap-2
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        ...variants[variant],
        borderRadius: tokens.radius.md,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onMouseLeave={() => !disabled && setIsPressed(false)}
      onClick={() => {
        if (!disabled) {
          triggerHaptic('medium');
          onClick?.();
        }
      }}
      transition={tokens.animation.spring}
      {...props}
    >
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)',
          transition: 'opacity 0.3s'
        }}
        animate={isPressed ? { x: '200%' } : { x: '-200%' }}
        transition={{ duration: 0.6 }}
      />

      {Icon && <Icon className="h-4 w-4 relative z-10" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// ============= INPUT =============
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        w-full px-3 py-2 rounded-lg
        bg-design-zinc-900/50 border border-design-zinc-800
        text-white placeholder:text-design-zinc-500
        focus:outline-none focus:ring-2 focus:ring-design-purple-500/50
        transition-all duration-200
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// ============= LABEL =============
export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className = '', ...props }, ref) => {
  return (
    <label
      className={`
        text-sm font-medium text-design-zinc-300
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});
Label.displayName = 'Label';

// ============= APP ICON =============
export const AppIcon = ({
  icon: Icon,
  label,
  gradient,
  size = 'md',
  onClick,
  badge
}: {
  icon: any;
  label: string;
  gradient: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  badge?: number;
}) => {
  const { triggerHaptic } = useHaptic();
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: { container: 'w-16 h-16', icon: 'h-5 w-5', text: 'text-[10px]' },
    md: { container: 'w-20 h-20', icon: 'h-6 w-6', text: 'text-xs' },
    lg: { container: 'w-24 h-24', icon: 'h-8 w-8', text: 'text-sm' }
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={() => {
        triggerHaptic('medium');
        onClick?.();
      }}
      transition={tokens.animation.bounce}
    >
      {/* Icon Container */}
      <div
        className={`${sizes[size].container} relative mx-auto mb-1`}
        style={{
          background: gradient,
          borderRadius: '22px',
          padding: '2px'
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: isPressed ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
            borderRadius: '20px',
            transition: 'background 0.2s'
          }}
        >
          <Icon className={`${sizes[size].icon} text-white`} />
        </div>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1"
          >
            {badge > 99 ? '99+' : badge}
          </motion.div>
        )}
      </div>

      {/* Label */}
      <div className={`text-center ${sizes[size].text} text-zinc-300 font-medium`}>
        {label}
      </div>
    </motion.div>
  );
};

// ============= FLOATING TAB BAR =============
export const FloatingTabBar = ({
  items,
  activeIndex,
  onChange
}: {
  items: { icon: any; label: string; badge?: number }[];
  activeIndex: number;
  onChange: (index: number) => void;
}) => {
  const { triggerHaptic } = useHaptic();

  return (
    <GlassCard
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      blur="xl"
    >
      <div className="flex items-center gap-1 p-2">
        {items.map((item, index) => (
          <motion.button
            key={index}
            className={`
              relative px-4 py-3 rounded-2xl flex items-center gap-2
              ${activeIndex === index ? 'bg-white/10' : ''}
            `}
            onClick={() => {
              triggerHaptic('light');
              onChange(index);
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Active Indicator */}
            {activeIndex === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-2xl"
                transition={tokens.animation.spring}
              />
            )}

            <item.icon
              className={`h-5 w-5 relative z-10 ${
                activeIndex === index ? 'text-white' : 'text-zinc-400'
              }`}
            />

            {activeIndex === index && (
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="text-sm font-medium text-white relative z-10"
              >
                {item.label}
              </motion.span>
            )}

            {item.badge !== undefined && item.badge > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full" />
            )}
          </motion.button>
        ))}
      </div>
    </GlassCard>
  );
};

// ============= ACTIVITY CARD =============
export const ActivityCard = ({
  title,
  subtitle,
  amount,
  tag,
  icon: Icon,
  gradient,
  onClick
}: {
  title: string;
  subtitle: string;
  amount: string;
  tag: string;
  icon: any;
  gradient: string;
  onClick?: () => void;
}) => {
  const { triggerHaptic } = useHaptic();

  return (
    <GlassCard
      interactive
      className="p-6 group"
      onClick={() => {
        triggerHaptic('light');
        onClick?.();
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-2xl"
          style={{ background: gradient }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-zinc-400">
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 mb-3">{subtitle}</p>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 text-transparent bg-clip-text">
          {amount}
        </span>
        <motion.div
          whileHover={{ x: 5 }}
          transition={tokens.animation.spring}
        >
          <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </motion.div>
      </div>
    </GlassCard>
  );
};

// ============= MAIN SHOWCASE =============
export default function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Add haptic styles to document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes haptic-pulse {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const apps = [
    { icon: Rocket, label: 'Launch', gradient: tokens.colors.gradients.primary, badge: 3 },
    { icon: Gift, label: 'Bounty', gradient: tokens.colors.gradients.danger },
    { icon: Wallet, label: 'Wallet', gradient: tokens.colors.gradients.success, badge: 1 },
    { icon: Users, label: 'Network', gradient: tokens.colors.gradients.info },
    { icon: LineChart, label: 'Analytics', gradient: tokens.colors.gradients.warning },
    { icon: PlaySquare, label: 'Clips', gradient: tokens.colors.gradients.info },
  ];

  const tabItems = [
    { icon: Home, label: 'Home' },
    { icon: Search, label: 'Discover' },
    { icon: Plus, label: 'Create' },
    { icon: Bell, label: 'Activity', badge: 5 },
    { icon: User, label: 'Profile' },
  ];

  const activities = [
    {
      title: "Meme Royale Launch",
      subtitle: "Campaign starting in 2 hours",
      amount: "$12.5K",
      tag: "LIVE",
      icon: Rocket,
      gradient: tokens.colors.gradients.primary
    },
    {
      title: "Stream Bounty",
      subtitle: "Complete streaming tasks",
      amount: "$850",
      tag: "NEW",
      icon: Gift,
      gradient: tokens.colors.gradients.danger
    },
    {
      title: "SOL Prediction",
      subtitle: "98% participation rate",
      amount: "$45K Pool",
      tag: "HOT",
      icon: BarChart3,
      gradient: tokens.colors.gradients.warning
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
                LaunchOS Design System
              </h1>
              <p className="text-zinc-500 mt-1">Premium native app experience for web</p>
            </div>
            <PremiumButton
              variant="primary"
              icon={Sparkles}
              onClick={() => setShowNotification(true)}
            >
              Test Haptics
            </PremiumButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* App Grid */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-zinc-300">App Launcher</h2>
            <GlassCard className="p-8">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                {apps.map((app) => (
                  <AppIcon
                    key={app.label}
                    {...app}
                    size="md"
                    onClick={() => console.log(`Launching ${app.label}`)}
                  />
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Activity Cards */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-zinc-300">Live Activity</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {activities.map((activity, i) => (
                <ActivityCard key={i} {...activity} />
              ))}
            </div>
          </section>

          {/* Buttons Showcase */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-zinc-300">Premium Buttons</h2>
            <GlassCard className="p-8">
              <div className="flex flex-wrap gap-4">
                <PremiumButton variant="primary">Primary Action</PremiumButton>
                <PremiumButton variant="secondary">Secondary</PremiumButton>
                <PremiumButton variant="ghost">Ghost Button</PremiumButton>
                <PremiumButton variant="danger">Danger Zone</PremiumButton>
              </div>
            </GlassCard>
          </section>

        </div>
      </main>

      {/* Floating Tab Bar */}
      <FloatingTabBar
        items={tabItems}
        activeIndex={activeTab}
        onChange={setActiveTab}
      />

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 right-6 z-50"
          >
            <GlassCard className="p-4 pr-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Haptic Feedback Active</p>
                  <p className="text-xs text-zinc-400">Experience the magic ✨</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}