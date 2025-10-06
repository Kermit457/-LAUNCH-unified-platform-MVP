"use client"

import { useState, useRef } from 'react'
import { uploadAvatar } from '@/lib/appwrite/storage'
import { Upload, User, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AvatarUploadProps {
  currentAvatar?: string
  onUploadComplete: (url: string, fileId: string) => void
  onError?: (error: string) => void
}

export function AvatarUpload({ currentAvatar, onUploadComplete, onError }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError?.('File size must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Appwrite
    setUploading(true)
    setUploadSuccess(false)

    try {
      const { fileId, url } = await uploadAvatar(file)
      onUploadComplete(url, fileId)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
    } catch (error: any) {
      console.error('Upload error:', error)
      onError?.(error.message || 'Failed to upload avatar')
      setPreview(currentAvatar || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveClick = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-zinc-500" />
          )}
        </div>

        {/* Upload Status Overlay */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
          </div>
        )}

        {uploadSuccess && (
          <div className="absolute inset-0 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-12 h-12 text-green-400" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          size="sm"
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {preview ? 'Change Avatar' : 'Upload Avatar'}
        </Button>

        {preview && !uploading && (
          <Button onClick={handleRemoveClick} variant="ghost" size="sm" className="gap-2">
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Info */}
      <p className="text-xs text-zinc-500 text-center">
        JPG, PNG or WEBP. Max size 5MB.
      </p>
    </div>
  )
}
