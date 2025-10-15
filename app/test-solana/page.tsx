"use client"

import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'

export default function TestSolanaPage() {
  const { login, logout, ready, authenticated, user, createWallet } = usePrivy()

  const [creatingWallet, setCreatingWallet] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)

  // Check if user has Solana wallet from linkedAccounts
  const solanaWallet = user?.linkedAccounts?.find(
    (account: any) => account.type === 'wallet' && account.chainType === 'solana'
  )
  const solanaAddress = solanaWallet?.address
  const solanaConnected = !!solanaWallet

  // Function to manually create Solana wallet for existing users
  const createSolanaWallet = async () => {
    if (!ready) {
      setWalletError('System not ready, please wait...')
      return
    }

    if (solanaConnected) {
      setWalletError('You already have a Solana wallet!')
      return
    }

    if (!createWallet) {
      setWalletError('For existing users: Please logout and login with a fresh account to get Solana wallet automatically.')
      return
    }

    setCreatingWallet(true)
    setWalletError(null)

    try {
      // Try to create wallet - this may create both EVM and Solana wallets
      await createWallet()
      // Wait a moment for the wallet to be created
      setTimeout(() => {
        alert('Wallet creation attempted! Refreshing page...')
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error('Error creating wallet:', error)
      setWalletError(error?.message || 'Wallet creation failed. Try logging out and back in with a fresh account.')
      setCreatingWallet(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privy Authentication Test</h1>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div>
            <span className="text-gray-400">Privy Status: </span>
            <span className={ready ? "text-green-400" : "text-yellow-400"}>
              {ready ? "Ready" : "Loading..."}
            </span>
          </div>

          <div>
            <span className="text-gray-400">Authentication: </span>
            <span className={authenticated ? "text-green-400" : "text-red-400"}>
              {authenticated ? "Authenticated" : "Not Authenticated"}
            </span>
          </div>

          {authenticated && user && (
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">User ID: </span>
                <span className="text-violet-400 font-mono text-sm">
                  {user.id}
                </span>
              </div>
              {user.twitter && (
                <div>
                  <span className="text-gray-400">Twitter: </span>
                  <span className="text-violet-400">
                    @{user.twitter.username}
                  </span>
                </div>
              )}
              {user.wallet && (
                <div>
                  <span className="text-gray-400">Embedded Wallet (EVM): </span>
                  <span className="text-violet-400 font-mono text-sm break-all">
                    {user.wallet.address}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-700">
                <div className="text-lg font-semibold text-green-400 mb-2">
                  🎯 Solana Wallet Status
                </div>
                <div className="space-y-2 bg-gray-800 p-3 rounded">
                  <div>
                    <span className="text-gray-400">Solana Connected: </span>
                    <span className={solanaConnected ? "text-green-400" : "text-red-400"}>
                      {solanaConnected ? "✅ Yes" : "❌ No"}
                    </span>
                  </div>
                  {solanaAddress && (
                    <div>
                      <span className="text-gray-400">Solana Address: </span>
                      <div className="text-green-400 font-mono text-xs break-all mt-1 p-2 bg-gray-900 rounded">
                        {solanaAddress}
                      </div>
                    </div>
                  )}
                  {!solanaAddress && authenticated && (
                    <div className="space-y-2">
                      <div className="text-yellow-400 text-sm">
                        ⚠️ No Solana wallet found.
                      </div>
                      <div className="text-xs text-gray-400">
                        This can happen for existing users. Try:
                      </div>
                      <button
                        onClick={createSolanaWallet}
                        disabled={creatingWallet}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
                      >
                        {creatingWallet ? 'Creating Solana Wallet...' : '🔧 Create Solana Wallet'}
                      </button>
                      {walletError && (
                        <div className="text-red-400 text-xs">
                          Error: {walletError}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Or logout and login with a fresh account
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700">
                <div className="text-sm font-semibold text-gray-300 mb-2">
                  All Linked Accounts ({user?.linkedAccounts?.length || 0})
                </div>
                {user?.linkedAccounts && user.linkedAccounts.length > 0 ? (
                  <div className="space-y-2">
                    {user.linkedAccounts.map((account, idx) => (
                      <div key={idx} className="text-xs bg-gray-800 p-2 rounded">
                        <div className="mb-1">
                          <span className="text-gray-500">Type: </span>
                          <span className="text-cyan-400 font-semibold">{account.type}</span>
                        </div>
                        {account.type === 'wallet' && (
                          <>
                            {'walletClient' in account && (
                              <div>
                                <span className="text-gray-500">Wallet Client: </span>
                                <span className="text-cyan-400">{account.walletClient}</span>
                              </div>
                            )}
                            {'chainType' in account && (
                              <div>
                                <span className="text-gray-500">Chain Type: </span>
                                <span className="text-cyan-400">{account.chainType}</span>
                              </div>
                            )}
                            {'address' in account && (
                              <div>
                                <span className="text-gray-500">Address: </span>
                                <div className="text-violet-400 font-mono break-all text-[10px] mt-1">
                                  {account.address}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {account.type === 'twitter' && 'username' in account && (
                          <div>
                            <span className="text-gray-500">Username: </span>
                            <span className="text-violet-400">@{account.username}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No linked accounts</div>
                )}
              </div>
            </div>
          )}

          {!authenticated ? (
            <button
              onClick={login}
              className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Login with Privy
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}

          <div className="mt-6 pt-6 border-t border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <span className="text-gray-400">Network: </span>
                <span className="text-cyan-400">
                  {process.env.NEXT_PUBLIC_SOLANA_NETWORK || "Not Set"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Curve Program: </span>
                <span className="text-cyan-400 break-all">
                  {process.env.NEXT_PUBLIC_CURVE_PROGRAM_ID || "Not Set"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Privy App ID: </span>
                <span className="text-cyan-400">
                  {process.env.NEXT_PUBLIC_PRIVY_APP_ID ?
                    `${process.env.NEXT_PUBLIC_PRIVY_APP_ID.slice(0, 10)}...` :
                    "Not Set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
