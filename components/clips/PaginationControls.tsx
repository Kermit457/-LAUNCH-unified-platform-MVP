'use client'

interface PaginationControlsProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
  isLoading: boolean
}

export function PaginationControls({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading
}: PaginationControlsProps) {
  if (isLoading || totalItems === 0) {
    return null
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNextPage = totalItems >= itemsPerPage

  return (
    <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 md:px-4 py-2 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm font-semibold hover:border-[#D1FD0A]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#D1FD0A]/20"
      >
        Previous
      </button>

      <div className="flex items-center gap-1.5 md:gap-2">
        {Array.from({ length: Math.min(5, totalPages || currentPage) }, (_, i) => {
          const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
          if (page > totalPages && totalPages > 0) return null
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-led-dot text-sm md:text-base font-bold transition-all ${
                currentPage === page
                  ? 'bg-[#D1FD0A] text-black'
                  : 'glass-premium border border-[#D1FD0A]/20 text-white hover:border-[#D1FD0A]/40'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-3 md:px-4 py-2 rounded-lg glass-premium border border-[#D1FD0A]/20 text-white text-sm font-semibold hover:border-[#D1FD0A]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#D1FD0A]/20"
      >
        Next
      </button>
    </div>
  )
}
