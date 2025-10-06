import { storage, BUCKETS } from './client'
import { ID } from 'appwrite'

/**
 * Upload a file to Appwrite storage
 */
export async function uploadFile(
  file: File,
  bucketId: string,
  fileId: string = ID.unique()
): Promise<{ fileId: string; url: string }> {
  try {
    const response = await storage.createFile(bucketId, fileId, file)

    // Get file URL
    const url = storage.getFileView(bucketId, response.$id)

    return {
      fileId: response.$id,
      url: url.toString(),
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(file: File): Promise<{ fileId: string; url: string }> {
  return uploadFile(file, BUCKETS.AVATARS)
}

/**
 * Upload campaign media (image or video)
 */
export async function uploadCampaignMedia(
  file: File
): Promise<{ fileId: string; url: string }> {
  return uploadFile(file, BUCKETS.CAMPAIGN_MEDIA)
}

/**
 * Upload submission file
 */
export async function uploadSubmission(file: File): Promise<{ fileId: string; url: string }> {
  return uploadFile(file, BUCKETS.SUBMISSIONS)
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucketId: string, fileId: string): Promise<void> {
  try {
    await storage.deleteFile(bucketId, fileId)
  } catch (error) {
    console.error('File deletion error:', error)
    throw error
  }
}

/**
 * Get file preview URL (for images with resize/crop)
 */
export function getFilePreview(
  bucketId: string,
  fileId: string,
  width?: number,
  height?: number
): string {
  const url = storage.getFilePreview(bucketId, fileId, width, height)
  return url.toString()
}

/**
 * Get direct file URL
 */
export function getFileView(bucketId: string, fileId: string): string {
  const url = storage.getFileView(bucketId, fileId)
  return url.toString()
}
