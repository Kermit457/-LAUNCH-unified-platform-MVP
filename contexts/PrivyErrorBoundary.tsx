'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class PrivyErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's the Privy RPC error we want to ignore
    if (error.message?.includes('No RPC configuration found')) {
      console.warn('Suppressing Privy RPC configuration error (known v3.3.0 bug)')
      return { hasError: false } // Don't show error
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-RPC errors
    if (!error.message?.includes('No RPC configuration found')) {
      console.error('Privy error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with authentication.</div>
    }

    return this.props.children
  }
}