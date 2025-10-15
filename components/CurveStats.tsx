'use client';

import { useCurveData } from '@/hooks/useCurveData';
import { getExplorerUrl } from '@/lib/solana/config';

interface CurveStatsProps {
  twitterHandle: string;
  className?: string;
}

export function CurveStats({ twitterHandle, className }: CurveStatsProps) {
  const { data, loading, error } = useCurveData(twitterHandle);

  if (loading && !data) {
    return (
      <div className={className || "bg-white rounded-lg p-6 shadow-sm"}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className || "bg-white rounded-lg p-6 shadow-sm"}>
        <p className="text-red-600">Error loading curve data: {error}</p>
      </div>
    );
  }

  if (!data || !data.exists) {
    return (
      <div className={className || "bg-white rounded-lg p-6 shadow-sm"}>
        <p className="text-gray-500">Curve not found. Create one to get started!</p>
      </div>
    );
  }

  const formatSOL = (lamports: string) => {
    const sol = parseFloat(lamports) / 1e9;
    return sol.toFixed(4) + ' SOL';
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Active: 'bg-green-100 text-green-800',
    Frozen: 'bg-blue-100 text-blue-800',
    Launched: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className={className || "bg-white rounded-lg p-6 shadow-sm"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          @{twitterHandle}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[data.status]}`}>
          {data.status}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatItem
          label="Total Supply"
          value={data.supply}
          suffix="keys"
        />
        <StatItem
          label="Reserve Balance"
          value={formatSOL(data.reserveBalance)}
        />
        <StatItem
          label="Unique Holders"
          value={data.uniqueHolders.toString()}
        />
        <StatItem
          label="Total Buys"
          value={data.totalBuys.toString()}
        />
        <StatItem
          label="Total Sells"
          value={data.totalSells.toString()}
        />
        <StatItem
          label="Target Reserve"
          value={formatSOL(data.targetReserve.toString())}
        />
      </div>

      {/* Progress to Launch */}
      {data.status === 'Active' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to Launch</span>
            <span>
              {((parseFloat(data.reserveBalance) / data.targetReserve) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (parseFloat(data.reserveBalance) / data.targetReserve) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Wallet Addresses */}
      <div className="space-y-2 pt-4 border-t">
        <p className="text-xs font-medium text-gray-500 mb-2">Addresses</p>
        {data.creator && (
          <AddressLink
            label="Creator"
            address={data.creator}
          />
        )}
        {data.reserveVault && (
          <AddressLink
            label="Reserve"
            address={data.reserveVault}
          />
        )}
      </div>

      {/* Refresh indicator */}
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value} {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </p>
    </div>
  );
}

function AddressLink({ label, address }: { label: string; address: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}:</span>
      <a
        href={getExplorerUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline font-mono"
      >
        {address.slice(0, 4)}...{address.slice(-4)}
      </a>
    </div>
  );
}
