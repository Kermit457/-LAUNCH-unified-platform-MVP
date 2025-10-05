/**
 * Mock Storage Helper for Project Logo Uploads
 *
 * In production, this would integrate with Supabase Storage or S3
 * For now, returns a data URL for immediate preview
 */

/**
 * Upload a project logo file
 *
 * @param file - The logo file to upload (PNG/JPG, ≤5MB, ideally 1:1 aspect ratio)
 * @param launchId - Optional launch ID for path generation
 * @returns Promise<string> - Public URL of the uploaded logo
 *
 * Mock implementation: Returns a data URL
 * Production path: projects/{launchId}/logo.png
 */
export async function uploadLogo(file: File, launchId?: string): Promise<string> {
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

  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock: Convert to data URL for immediate use
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // In production, this would be:
        // const path = `projects/${launchId || 'temp'}/logo.png`
        // const { data, error } = await supabase.storage.from('project-logos').upload(path, file)
        // return data.publicUrl

        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
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
