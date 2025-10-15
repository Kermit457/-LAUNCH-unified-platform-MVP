import { PublicKey, Transaction, VersionedTransaction, Connection } from '@solana/web3.js';

/**
 * Privy Wallet Adapter for Solana
 * Provides a wallet interface compatible with Anchor that uses Privy's embedded wallet
 *
 * Usage with Privy v3.3.0:
 * - Use the signAndSendTransaction method from Privy's embedded wallet
 * - This handles signing and broadcasting the transaction
 */
export class PrivyWalletAdapter {
  constructor(
    public publicKey: PublicKey,
    private signAndSendFn?: (tx: Transaction, connection: Connection) => Promise<string>
  ) {}

  /**
   * Sign and send a transaction using Privy's embedded wallet
   */
  async signAndSendTransaction(transaction: Transaction, connection: Connection): Promise<string> {
    if (!this.signAndSendFn) {
      throw new Error('Privy wallet sign and send function not configured');
    }
    return await this.signAndSendFn(transaction, connection);
  }

  /**
   * Sign a transaction (for use with manual broadcasting)
   */
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Direct transaction signing not yet implemented. Use signAndSendTransaction instead.');
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    throw new Error('Batch transaction signing not yet implemented.');
  }
}

/**
 * Create a wallet adapter from Privy's Solana wallet
 * This allows using Privy embedded wallets with Anchor programs
 */
export function createPrivyWalletAdapter(
  publicKey: PublicKey,
  signAndSendFn?: (tx: Transaction, connection: Connection) => Promise<string>
): PrivyWalletAdapter {
  return new PrivyWalletAdapter(publicKey, signAndSendFn);
}
