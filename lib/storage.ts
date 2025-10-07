/**
 * Storage Helper for Project Logo Uploads
 *
 * Integrates with Appwrite Storage for persistent file uploads
 */

import { storage, BUCKETS } from './appwrite/client'
import { ID } from 'appwrite'

/**
 * Upload a project logo file to Appwrite Storage
 *
 * @param file - The logo file to upload (PNG/JPG, ≤5MB, ideally 1:1 aspect ratio)
 * @returns Promise<string> - Public URL of the uploaded logo
 */
export async function uploadLogo(file: File): Promise<string> {
  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload PNG or JPG only.')
  }

  // Validate file size (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB. Please upload a smaller image.')
  }

  try {
    // Generate unique file ID (max 36 chars for Appwrite)
    // Use Appwrite's ID.unique() which generates a valid short ID
    const fileId = ID.unique()

    // Upload to Appwrite Storage
    const response = await storage.createFile(
      BUCKETS.LAUNCH_LOGOS,
      fileId,
      file
    )

    // Get the file view URL (public preview URL)
    const fileUrl = storage.getFileView(BUCKETS.LAUNCH_LOGOS, response.$id)
    const urlString = fileUrl.toString()

    console.log('📸 File uploaded to Appwrite Storage:', {
      fileId: response.$id,
      bucketId: BUCKETS.LAUNCH_LOGOS,
      url: urlString
    })

    return urlString
  } catch (error) {
    console.error('Failed to upload logo to Appwrite:', error)
    throw new Error('Failed to upload logo. Please try again.')
  }
}

/**
 * Delete a project logo
 *
 * @param logoUrl - The URL of the logo to delete
 * @returns Promise<void>
 *
 * Mock implementation: No-op
 * Production: Delete from storage bucket
 */
export async function deleteLogo(logoUrl: string): Promise<void> {
  // Mock: Simulate deletion
  await new Promise(resolve => setTimeout(resolve, 200))

  // In production:
  // const path = extractPathFromUrl(logoUrl)
  // await supabase.storage.from('project-logos').remove([path])

  console.log('Logo deleted (mock):', logoUrl)
}

/**
 * Validate image aspect ratio
 *
 * @param file - The image file to check
 * @returns Promise<boolean> - True if aspect ratio is 1:1 (square)
 */
export async function validateAspectRatio(file: File): Promise<{ isSquare: boolean; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const isSquare = img.width === img.height
      URL.revokeObjectURL(url)
      resolve({
        isSquare,
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Get recommended dimensions text
 */
export function getRecommendedDimensions(): string {
  return '512×512 or 1024×1024 pixels'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
