import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useState } from 'react'

interface PaginationControlsProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  onJumpToPage?: (page: number) => void
  className?: string
}

export function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  onJumpToPage,
  className,
}: PaginationControlsProps) {
  const [jumpValue, setJumpValue] = useState('')

  const handleJump = () => {
    const targetPage = parseInt(jumpValue)
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && onJumpToPage) {
      onJumpToPage(targetPage)
      setJumpValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump()
    }
  }

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      {/* Prev Button */}
      <button
        onClick={onPrev}
        disabled={page === 1}
        className={cn(
          'px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
          page === 1
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* Page Indicator */}
      <div className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-sm">
        Page {page} / {totalPages}
      </div>

      {/* Optional Jump Input */}
      {onJumpToPage && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Go to..."
            className="w-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleJump}
            disabled={!jumpValue}
            className={cn(
              'px-3 py-2 rounded-xl text-sm font-medium transition-all',
              jumpValue
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            )}
          >
            Go
          </button>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className={cn(
          'px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2',
          page === totalPages
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg'
        )}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
