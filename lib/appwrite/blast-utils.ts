/**
 * BLAST Utility Functions
 * Helper functions for BLAST services
 */

/**
 * Sanitize user ID for Appwrite document ID
 * Converts Privy DIDs like "did:privy:abc123" to "did_privy_abc123"
 * Appwrite document IDs cannot contain colons
 */
export function sanitizeUserId(userId: string): string {
  return userId.replace(/:/g, '_')
}

/**
 * Desanitize document ID back to original user ID
 */
export function desanitizeUserId(documentId: string): string {
  // For now, keep as-is since we store original userId in the document
  return documentId
}
