/**
 * Hook to fetch curves from V6 Anchor program on-chain
 * Replaces useCurvesByOwners which read from Appwrite
 */

import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
// import {
//   fetchCurveByTwitter,
//   fetchKeyHoldings,
//   CurveData,
//   KeyHolderData,
// } from '@/lib/solana/v6-curve-service';

// Stub implementations
const fetchCurveByTwitter = async (twitterHandle: string): Promise<any> => null;
const fetchKeyHoldings = async (twitterHandleOrPDA: string | PublicKey, userWallet: PublicKey): Promise<any> => null;
type CurveData = any;
type KeyHolderData = any;

export interface V6Curve {
  id: string; // launchId/projectId
  twitterHandle: string;
  address: string;
  owner: string;
  supply: number;
  price: number;
  reserve: number;
  status: 'active' | 'frozen' | 'launched';
  holders: number;
  volume24h: number;
  volumeTotal: number;
  marketCap: number;
  exists: boolean;
  userKeys?: number; // User's key balance if wallet connected
  userSharePercent?: number; // User's ownership percentage
}

/**
 * Fetch curves for multiple projects from V6 Anchor program
 * Each project has a twitter handle used to derive the curve PDA
 */
export function useV6Curves(
  launches: Array<{ id: string; twitterUrl?: string; socials?: { twitter?: string } }>,
  userWallet?: PublicKey | null
) {
  const [curves, setCurves] = useState<Map<string, V6Curve>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllCurves() {
      if (launches.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const curvesMap = new Map<string, V6Curve>();

        // Fetch all curves in parallel
        await Promise.all(
          launches.map(async (launch) => {
            try {
              // Extract twitter handle from launch
              const twitterUrl = launch.twitterUrl || launch.socials?.twitter;

              // If no Twitter URL, create a placeholder curve using launch ID as handle
              if (!twitterUrl) {
                console.log(`⚠️ No Twitter URL for launch ${launch.id} - creating placeholder curve`);
                curvesMap.set(launch.id, {
                  id: launch.id,
                  twitterHandle: launch.id, // Use launch ID as fallback
                  address: '',
                  owner: '',
                  supply: 0,
                  price: 0.05, // V6 starting price
                  reserve: 0,
                  status: 'active',
                  holders: 0,
                  volume24h: 0,
                  volumeTotal: 0,
                  marketCap: 0,
                  exists: false,
                });
                return;
              }

              // Extract handle from URL (e.g., https://twitter.com/username -> username)
              const twitterHandle = twitterUrl.split('/').pop() || twitterUrl;

              console.log(`📖 Fetching V6 curve for ${twitterHandle}`);

              // Fetch on-chain curve data
              const curveData = await fetchCurveByTwitter(twitterHandle);

              if (!curveData) {
                // Curve doesn't exist on-chain yet
                console.log(`ℹ️ Curve not initialized: ${twitterHandle}`);
                curvesMap.set(launch.id, {
                  id: launch.id,
                  twitterHandle,
                  address: '',
                  owner: '',
                  supply: 0,
                  price: 0.05, // V6 starting price
                  reserve: 0,
                  status: 'active',
                  holders: 0,
                  volume24h: 0,
                  volumeTotal: 0,
                  marketCap: 0,
                  exists: false,
                });
                return;
              }

              // If user wallet is connected, fetch their key balance
              let userKeys = 0;
              let userSharePercent = 0;

              if (userWallet) {
                const holdings = await fetchKeyHoldings(twitterHandle, userWallet);
                if (holdings) {
                  userKeys = holdings.amount;
                  userSharePercent = holdings.sharePercent;
                }
              }

              curvesMap.set(launch.id, {
                id: launch.id,
                twitterHandle,
                address: curveData.address,
                owner: curveData.owner,
                supply: curveData.supply,
                price: curveData.price,
                reserve: curveData.reserve,
                status: curveData.status,
                holders: curveData.holders,
                volume24h: curveData.volume24h,
                volumeTotal: curveData.volumeTotal,
                marketCap: curveData.marketCap,
                exists: true,
                userKeys,
                userSharePercent,
              });

              console.log(`✅ Fetched V6 curve: ${twitterHandle}`, curvesMap.get(launch.id));

            } catch (err) {
              console.error(`Error fetching curve for ${launch.id}:`, err);
              // Don't fail the whole operation, just skip this curve
            }
          })
        );

        setCurves(curvesMap);
        setLoading(false);

      } catch (err: any) {
        console.error('Error fetching V6 curves:', err);
        setError(err.message || 'Failed to fetch curves');
        setLoading(false);
      }
    }

    fetchAllCurves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Use stable identifiers to avoid infinite loops
    launches.map((l) => l.id).join(','),
    userWallet?.toBase58(),
  ]);

  return { curves, loading, error };
}