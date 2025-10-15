'use client';

import { useState } from 'react';
import { useSolanaBuyKeys } from '@/hooks/useSolanaBuyKeys';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { usePrivy } from '@privy-io/react-auth';

interface BuyKeysButtonProps {
  curveId: string;
  twitterHandle: string;
  keys: number;
  solCost: number;
  userId: string;
  referrerId?: string;
  onSuccess?: (result: { txSignature: string; explorerUrl: string | null }) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  hideExtras?: boolean; // Hide wallet info, success, and error messages
}

export function BuyKeysButton({
  curveId,
  twitterHandle,
  keys,
  solCost,
  userId,
  referrerId,
  onSuccess,
  onError,
  className,
  children,
  disabled = false,
  hideExtras = false,
}: BuyKeysButtonProps) {
  const { connected, address } = useSolanaWallet();
  const { login } = usePrivy();
  const { buyKeys, loading, error, txSignature, explorerUrl } = useSolanaBuyKeys();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBuy = async () => {
    try {
      setShowSuccess(false);

      // Step 1: Execute Solana transaction
      const signature = await buyKeys(twitterHandle, solCost, referrerId);
      console.log('✅ Solana tx confirmed:', signature);

      // Step 2: Update database with transaction proof
      const response = await fetch(`/api/curve/${curveId}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keys,
          userId,
          referrerId,
          txSignature: signature,
          solCost,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Database update failed');
      }

      const data = await response.json();
      console.log('✅ Database updated:', data);

      setShowSuccess(true);
      onSuccess?.({ txSignature: signature, explorerUrl });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      console.error('Purchase failed:', err);
      onError?.(err.message);
    }
  };

  // Not connected - show login button
  if (!connected) {
    return (
      <button
        onClick={login}
        className={className || "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"}
      >
        Connect Wallet to Buy
      </button>
    );
  }

  // If hideExtras is true, just return the button
  if (hideExtras) {
    return (
      <button
        onClick={handleBuy}
        disabled={loading || disabled}
        className={
          className ||
          `px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            loading
              ? 'bg-gray-400 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`
        }
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          children || `Buy ${keys} Key${keys !== 1 ? 's' : ''}`
        )}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Buy Button */}
      <button
        onClick={handleBuy}
        disabled={loading || disabled}
        className={
          className ||
          `px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            loading
              ? 'bg-gray-400 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`
        }
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          children || `Buy ${keys} Key${keys !== 1 ? 's' : ''}`
        )}
      </button>

      {/* Wallet Info */}
      <p className="text-xs text-gray-500">
        Connected: {address?.slice(0, 4)}...{address?.slice(-4)}
      </p>

      {/* Success Message */}
      {showSuccess && explorerUrl && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium mb-1">
            ✓ Keys purchased successfully!
          </p>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View on Solana Explorer →
          </a>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error: {error}
          </p>
        </div>
      )}

      {/* Referrer Info */}
      {referrerId && (
        <p className="text-xs text-gray-500">
          Referrer: {referrerId.slice(0, 4)}...{referrerId.slice(-4)}
        </p>
      )}
    </div>
  );
}
