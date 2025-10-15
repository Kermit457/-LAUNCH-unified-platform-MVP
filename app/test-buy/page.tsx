'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { BuyKeysButton } from '@/components/BuyKeysButton';
import { calculateBuyCost } from '@/lib/curve/bonding-math';

export default function TestBuyPage() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { connected, address, publicKey } = useSolanaWallet();
  const [twitterHandle, setTwitterHandle] = useState('elonmusk');
  const [keys, setKeys] = useState(1);
  const [curveSupply, setCurveSupply] = useState(100); // Mock current supply
  const [testResult, setTestResult] = useState<string | null>(null);

  const solCost = calculateBuyCost(curveSupply, keys);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading Privy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Solana Buy Keys Test</h1>

        {/* Authentication Status */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">1. Authentication</h2>
          <div className="space-y-2">
            <p>Status: {authenticated ? '✅ Logged in' : '❌ Not logged in'}</p>
            {user && (
              <p className="text-sm text-gray-400">
                User ID: {user.id}
              </p>
            )}
            {!authenticated ? (
              <button
                onClick={login}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Login with Privy
              </button>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Wallet Status */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">2. Solana Wallet</h2>
          <div className="space-y-2">
            <p>Connected: {connected ? '✅ Yes' : '❌ No'}</p>
            {address && (
              <>
                <p className="text-sm text-gray-400">
                  Address: {address}
                </p>
                <p className="text-sm text-gray-400">
                  PublicKey: {publicKey?.toString()}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Buy Test */}
        {connected && user && (
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">3. Buy Keys Test</h2>

            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  placeholder="elonmusk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Keys
                </label>
                <input
                  type="number"
                  value={keys}
                  onChange={(e) => setKeys(Number(e.target.value))}
                  min="1"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Supply (for calculation)
                </label>
                <input
                  type="number"
                  value={curveSupply}
                  onChange={(e) => setCurveSupply(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-sm">
                  Cost: <span className="font-bold">{solCost.toFixed(6)} SOL</span>
                </p>
              </div>
            </div>

            {/* Buy Button */}
            <BuyKeysButton
              curveId="68efaea20012de68592f"
              twitterHandle={twitterHandle}
              keys={keys}
              solCost={solCost}
              userId={user.id}
              onSuccess={(result) => {
                setTestResult(
                  `✅ Success!\nTx: ${result.txSignature}\n${result.explorerUrl || ''}`
                );
              }}
              onError={(error) => {
                setTestResult(`❌ Error: ${error}`);
              }}
            />

            {/* Test Result */}
            {testResult && (
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Login with Privy (step 1)</li>
            <li>Verify Solana wallet is connected (step 2)</li>
            <li>Ensure you have devnet SOL in your wallet</li>
            <li>Configure the buy parameters</li>
            <li>Click "Buy Keys" and approve the transaction</li>
            <li>Check the transaction on Solana Explorer</li>
          </ol>
        </div>

        {/* Devnet SOL Info */}
        <div className="bg-yellow-900 bg-opacity-50 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold">Need Devnet SOL?</h3>
          <p className="text-sm">
            Get free devnet SOL from the faucet:
          </p>
          <a
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            https://faucet.solana.com/
          </a>
          {address && (
            <p className="text-xs text-gray-400 mt-2">
              Your address: {address}
            </p>
          )}
        </div>

        {/* Curve Info */}
        <div className="bg-blue-900 bg-opacity-50 p-6 rounded-lg space-y-2">
          <h3 className="font-semibold">📊 Test Curve Info</h3>
          <p className="text-sm">
            Using curve: <code className="bg-gray-700 px-2 py-1 rounded">68efaea20012de68592f</code>
          </p>
          <div className="text-xs text-gray-300 mt-2 space-y-1">
            <p>• Owner: demo-user-123</p>
            <p>• Current Supply: 50 keys</p>
            <p>• Current Price: 0.015 SOL/key</p>
            <p>• Reserve: 5.5 SOL</p>
          </div>
          <p className="text-sm mt-2">
            This is a real seeded curve. Your purchase will update the actual database!
          </p>
        </div>
      </div>
    </div>
  );
}
