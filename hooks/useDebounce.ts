import { useState, useEffect } from 'react'

/**
 * Debounce a value to prevent excessive updates
 * Useful for search inputs to avoid API calls on every keystroke
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout on value change or unmount
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
