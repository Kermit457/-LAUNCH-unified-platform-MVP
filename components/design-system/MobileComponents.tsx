// LaunchOS Mobile-First Components
// Swipeable cards, gestures, and native-like interactions

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronLeft, ChevronRight, MoreVertical,
  Heart, MessageCircle, Share2, Bookmark,
  TrendingUp, Clock, Users, Eye,
  Settings, Camera, Image, Mic, Send
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';

// ============= SWIPEABLE CARD STACK =============
export const SwipeableCardStack = ({
  cards,
  onSwipe
}: {
  cards: Array<{
    id: string;
    title: string;
    subtitle: string;
    image?: string;
    gradient: string;
  }>;
  onSwipe?: (id: string, direction: 'left' | 'right') => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitDirection(direction);
      if (cards[currentIndex]) {
        onSwipe?.(cards[currentIndex].id, direction);
      }
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
      }, 200);
    }
  };

  return (
    <div className="relative h-[600px] w-full max-w-md mx-auto">
      <AnimatePresence>
        {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            initial={{ scale: 0.95 - index * 0.05, y: index * 10 }}
            animate={{
              scale: 1 - index * 0.05,
              y: index * 10,
              opacity: index < 2 ? 1 : 0
            }}
            exit={{
              x: exitDirection === 'left' ? -300 : exitDirection === 'right' ? 300 : 0,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 }
            }}
            style={{
              zIndex: cards.length - currentIndex - index,
              borderRadius: '32px',
              background: card.gradient,
              cursor: index === 0 ? 'grab' : 'default'
            }}
            drag={index === 0 ? 'x' : false}
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => index === 0 && handleDragEnd(info)}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div className="h-full p-6 flex flex-col justify-between">
              {/* Card Header */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-black/20 backdrop-blur-md rounded-full px-3 py-1">
                    <span className="text-white/80 text-sm font-medium">
                      {currentIndex + 1} / {cards.length}
                    </span>
                  </div>
                  <button className="bg-black/20 backdrop-blur-md rounded-full p-2">
                    <MoreVertical className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex items-center justify-center">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">{card.title}</h2>
                    <p className="text-white/70">{card.subtitle}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {index === 0 && (
                <div className="flex justify-center gap-4 mt-6">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/10 backdrop-blur-md rounded-full p-3"
                    onClick={() => {
                      setExitDirection('left');
                      onSwipe?.(card.id, 'left');
                      setTimeout(() => {
                        setCurrentIndex((prev) => prev + 1);
                        setExitDirection(null);
                      }, 200);
                    }}
                  >
                    <X className="h-6 w-6 text-red-400" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/10 backdrop-blur-md rounded-full p-3"
                    onClick={() => {
                      setExitDirection('right');
                      onSwipe?.(card.id, 'right');
                      setTimeout(() => {
                        setCurrentIndex((prev) => prev + 1);
                        setExitDirection(null);
                      }, 200);
                    }}
                  >
                    <Heart className="h-6 w-6 text-green-400" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {currentIndex >= cards.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">No more cards</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-4 py-2 bg-violet-500 text-white rounded-xl"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============= SHEET MODAL (iOS Style) =============
export const SheetModal = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const scale = useTransform(y, [0, 300], [1, 0.9]);

  const handleDragEnd = (info: PanInfo) => {
    if (info.offset.y > 150) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => handleDragEnd(info)}
            style={{ y, opacity, scale }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-[32px] max-h-[90vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-zinc-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-white text-center">{title}</h2>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-auto max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============= STORIES VIEWER =============
export const StoriesViewer = ({
  stories,
  isOpen,
  onClose
}: {
  stories: Array<{
    id: string;
    user: string;
    avatar: string;
    content: string;
    timestamp: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStory < stories.length - 1) {
              setCurrentStory((c) => c + 1);
              return 0;
            } else {
              onClose();
              return 100;
            }
          }
          return prev + 2;
        });
      }, 60);

      return () => clearInterval(timer);
    }
  }, [isOpen, currentStory, stories.length, onClose]);

  if (!isOpen || !stories.length) return null;

  const story = stories[currentStory];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Progress bars */}
      <div className="flex gap-1 p-2">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-zinc-800 rounded overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{
                width: index === currentStory ? `${progress}%` : index < currentStory ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-0.5">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {story.user.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold">{story.user}</p>
            <p className="text-zinc-400 text-xs">{story.timestamp}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <p className="text-white text-2xl text-center">{story.content}</p>
      </div>

      {/* Navigation */}
      <div className="absolute inset-0 flex">
        <button
          className="flex-1"
          onClick={() => setCurrentStory(Math.max(0, currentStory - 1))}
        />
        <button
          className="flex-1"
          onClick={() => setCurrentStory(Math.min(stories.length - 1, currentStory + 1))}
        />
      </div>
    </motion.div>
  );
};

// ============= FLOATING ACTION BUTTON =============
export const FloatingActionButton = ({
  icon: Icon,
  onClick,
  expanded = false,
  actions = []
}: {
  icon: any;
  onClick?: () => void;
  expanded?: boolean;
  actions?: Array<{ icon: any; label: string; onClick: () => void }>;
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 justify-end"
              >
                <span className="bg-zinc-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                >
                  <action.icon className="h-5 w-5 text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (actions.length) {
            setIsExpanded(!isExpanded);
          } else {
            onClick?.();
          }
        }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg"
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
};

// ============= INTERACTIVE LIST ITEM =============
export const InteractiveListItem = ({
  title,
  subtitle,
  avatar,
  badge,
  trailing,
  onClick,
  onSwipeLeft,
  onSwipeRight
}: {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  badge?: number;
  trailing?: React.ReactNode;
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) => {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['rgb(239, 68, 68)', 'rgba(255, 255, 255, 0.02)', 'rgb(34, 197, 94)']
  );

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{ background }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) onSwipeLeft?.();
          if (info.offset.x > 50) onSwipeRight?.();
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative bg-zinc-900 p-4 flex items-center gap-4 cursor-pointer"
      >
        {avatar && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 p-0.5">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
              {avatar}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{title}</h3>
            {badge !== undefined && badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        {trailing && <div className="text-zinc-400">{trailing}</div>}
      </motion.div>
    </motion.div>
  );
};

// ============= SEGMENTED CONTROL =============
export const SegmentedControl = ({
  options,
  value,
  onChange
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="bg-zinc-900 p-1 rounded-2xl flex">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="flex-1 relative px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          {value === option && (
            <motion.div
              layoutId="segmented-active"
              className="absolute inset-0 bg-white/10 rounded-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${value === option ? 'text-white' : 'text-zinc-400'}`}>
            {option}
          </span>
        </button>
      ))}
    </div>
  );
};

// ============= CHAT INPUT =============
export const ChatInput = ({
  onSend,
  placeholder = "Type a message..."
}: {
  onSend: (message: string) => void;
  placeholder?: string;
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-2 flex items-center gap-2">
      <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
        <Camera className="h-5 w-5 text-zinc-400" />
      </button>
      <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
        <Image className="h-5 w-5 text-zinc-400" />
      </button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none px-2"
      />

      {message ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="p-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
        >
          <Send className="h-5 w-5 text-white" />
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onMouseDown={() => setIsRecording(true)}
          onMouseUp={() => setIsRecording(false)}
          className={`p-2 rounded-full transition-colors ${
            isRecording ? 'bg-red-500' : 'hover:bg-zinc-800'
          }`}
        >
          <Mic className={`h-5 w-5 ${isRecording ? 'text-white' : 'text-zinc-400'}`} />
        </motion.button>
      )}
    </div>
  );
};