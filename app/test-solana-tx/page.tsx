'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallet } from '@/hooks/useSolanaWallet';
import { useSolanaTransaction } from '@/hooks/useSolanaTransaction';
import { connection } from '@/lib/solana/config';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function TestSolanaTxPage() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { connected, address, publicKey } = useSolanaWallet();
  const { sendTestTransaction, loading, error, txSignature, explorerUrl } = useSolanaTransaction();
  const [testAmount, setTestAmount] = useState(0.001);
  const [balance, setBalance] = useState<number | null>(null);

  // Fetch balance
  useEffect(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, txSignature]);

  const handleTest = async () => {
    try {
      await sendTestTransaction(testAmount);
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

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
        <h1 className="text-3xl font-bold">🧪 Solana Transaction Test</h1>
        <p className="text-gray-400">
          Simple test to verify Privy wallet signing works with Solana devnet
        </p>

        {/* Important Notice */}
        {authenticated && (
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 p-4 rounded-lg">
            <p className="font-semibold text-yellow-200">⚠️ Important: Wallet Network Setup</p>
            <p className="text-sm text-yellow-100 mt-2">
              If you're getting "Failed to connect to wallet" or 403 errors, your wallet may have been created on mainnet.
              To fix this: <strong>Log out and log back in</strong> to create a fresh devnet wallet with the updated configuration.
            </p>
          </div>
        )}

        {/* Step 1: Login */}
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Step 1: Login</h2>
          <div className="space-y-2">
            <p>Status: {authenticated ? '✅ Logged in' : '❌ Not logged in'}</p>
            {user && (
              <p className="text-sm text-gray-400">User ID: {user.id}</p>
            )}
            {!authenticated ? (
              <button
                onClick={login}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Login with Privy
              </button>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Step 2: Wallet */}
        {authenticated && (
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Step 2: Solana Wallet</h2>
            <div className="space-y-2">
              <p>Connected: {connected ? '✅ Yes' : '❌ No'}</p>
              {address && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 break-all">
                    Address: {address}
                  </p>
                  {balance !== null && (
                    <p className="text-sm">
                      Balance: <span className="font-bold">{balance.toFixed(4)} SOL</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {balance !== null && balance < 0.01 && (
              <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg">
                <p className="text-sm">
                  ⚠️ Low balance! Get devnet SOL from:{' '}
                  <a
                    href="https://faucet.solana.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    https://faucet.solana.com/
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Test Transaction */}
        {connected && (
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Step 3: Send Test Transaction</h2>
            <p className="text-sm text-gray-400">
              This will send a small amount of SOL to verify signing works.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  step="0.001"
                  min="0.001"
                  max="0.1"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                />
              </div>

              <button
                onClick={handleTest}
                disabled={loading || !balance || balance < testAmount}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {loading ? '⏳ Sending...' : '🚀 Send Test Transaction'}
              </button>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-900 bg-opacity-50 rounded-lg">
                  <p className="text-sm font-semibold text-red-200">Error:</p>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                </div>
              )}

              {/* Success */}
              {txSignature && (
                <div className="p-4 bg-green-900 bg-opacity-50 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-green-200">
                    ✅ Transaction Successful!
                  </p>
                  <p className="text-xs text-gray-300 break-all">
                    Signature: {txSignature}
                  </p>
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-blue-400 hover:underline"
                    >
                      View on Solana Explorer →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg space-y-3">
          <h3 className="font-semibold">📋 What This Test Does:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Verifies Privy login works</li>
            <li>Checks Solana wallet is connected</li>
            <li>Builds a simple SOL transfer transaction</li>
            <li>Signs it with your Privy embedded wallet</li>
            <li>Sends it to Solana devnet</li>
            <li>Waits for confirmation</li>
            <li>Shows the transaction on Explorer</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
