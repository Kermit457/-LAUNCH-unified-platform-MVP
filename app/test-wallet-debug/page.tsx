'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';

export default function TestWalletDebugPage() {
  const { ready, authenticated, user } = usePrivy();
  const { connected, address, publicKey, wallet } = useSolanaWallet();

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading Privy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Wallet Debug Info</h1>

        {!authenticated ? (
          <div className="bg-gray-800 p-6 rounded-lg">
            <p>Please log in to see wallet info</p>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-2">
              <h2 className="text-xl font-semibold">User Info</h2>
              <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto">
                {JSON.stringify(
                  {
                    id: user?.id,
                    linkedAccountsCount: user?.linkedAccounts?.length,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Linked Accounts */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-2">
              <h2 className="text-xl font-semibold">Linked Accounts</h2>
              <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(user?.linkedAccounts, null, 2)}
              </pre>
            </div>

            {/* Solana Wallet from Hook */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-2">
              <h2 className="text-xl font-semibold">Solana Wallet (from useSolanaWallet)</h2>
              <div className="space-y-1 text-sm">
                <p>Connected: {connected ? '✅ Yes' : '❌ No'}</p>
                <p>Address: {address || 'N/A'}</p>
                <p>PublicKey: {publicKey?.toString() || 'N/A'}</p>
              </div>
              {wallet && (
                <>
                  <h3 className="font-semibold mt-4">Wallet Account Object:</h3>
                  <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(wallet.account, null, 2)}
                  </pre>

                  <h3 className="font-semibold mt-4">Available Methods:</h3>
                  <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto">
                    {JSON.stringify(
                      Object.getOwnPropertyNames(wallet.account).filter(
                        (prop) => typeof (wallet.account as any)[prop] === 'function'
                      ),
                      null,
                      2
                    )}
                  </pre>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
