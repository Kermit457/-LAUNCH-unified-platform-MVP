'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWalletsContext } from '@/components/SolanaWalletManager';

export default function TestWalletStatusPage() {
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets, ready: walletsReady, createWallet } = useSolanaWalletsContext();

  if (!ready) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Wallet Status Debug</h1>

        {/* Auth Status */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <p>Authenticated: {authenticated ? '✅ Yes' : '❌ No'}</p>
          {!authenticated && (
            <button
              onClick={login}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Login
            </button>
          )}
        </div>

        {/* Wallets Status */}
        {authenticated && (
          <>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Wallets Status</h2>
              <div className="space-y-2 text-sm">
                <p>Wallets Ready: {walletsReady ? '✅' : '❌'}</p>
                <p>Number of wallets: {wallets.length}</p>
              </div>
            </div>

            {/* Wallet Details */}
            {wallets.length > 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Wallet Found!</h2>
                {wallets.map((wallet, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-sm">Address: {wallet.address || wallet.publicKey?.toString()}</p>
                    <p className="text-sm">Chain: {wallet.chainType || wallet.chain}</p>
                    <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto">
                      {JSON.stringify(wallet, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">No Wallets Found</h2>
                <p className="mb-4">The wallet should have been created automatically on login.</p>
                <button
                  onClick={async () => {
                    try {
                      await createWallet();
                      alert('Wallet creation initiated!');
                    } catch (err: any) {
                      alert('Error: ' + err.message);
                    }
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Manually Create Wallet
                </button>
              </div>
            )}

            {/* User Info */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">User Linked Accounts</h2>
              <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(user?.linkedAccounts, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
