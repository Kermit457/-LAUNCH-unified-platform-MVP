"use client"

import { useState, useRef } from 'react'
import { uploadCampaignMedia } from '@/lib/appwrite/storage'
import { Upload, Image as ImageIcon, Video, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaUploadProps {
  currentMedia?: string
  onUploadComplete: (url: string, fileId: string) => void
  onError?: (error: string) => void
  accept?: 'image' | 'video' | 'both'
  maxSizeMB?: number
}

export function MediaUpload({
  currentMedia,
  onUploadComplete,
  onError,
  accept = 'both',
  maxSizeMB = 50,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentMedia || null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptString = () => {
    if (accept === 'image') return 'image/*'
    if (accept === 'video') return 'video/*'
    return 'image/*,video/*'
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Determine file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    // Validate file type
    if (accept === 'image' && !isImage) {
      onError?.('Please select an image file')
      return
    }
    if (accept === 'video' && !isVideo) {
      onError?.('Please select a video file')
      return
    }
    if (!isImage && !isVideo) {
      onError?.('Please select an image or video file')
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      onError?.(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setFileType(isImage ? 'image' : 'video')

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Appwrite
    setUploading(true)
    setUploadSuccess(false)
    setUploadProgress(0)

    try {
      // Simulate progress (Appwrite SDK doesn't provide upload progress yet)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const { fileId, url } = await uploadCampaignMedia(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      onUploadComplete(url, fileId)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)
    } catch (error: any) {
      console.error('Upload error:', error)
      onError?.(error.message || 'Failed to upload media')
      setPreview(currentMedia || null)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveClick = () => {
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Media Preview */}
      <div className="relative rounded-xl overflow-hidden bg-white/5 border-2 border-white/10 aspect-video flex items-center justify-center">
        {preview ? (
          fileType === 'image' ? (
            <img src={preview} alt="Media preview" className="w-full h-full object-cover" />
          ) : (
            <video src={preview} className="w-full h-full object-cover" controls />
          )
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            {accept === 'video' ? (
              <Video className="w-16 h-16" />
            ) : (
              <ImageIcon className="w-16 h-16" />
            )}
            <p className="text-sm">No media uploaded</p>
          </div>
        )}

        {/* Upload Status Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-12 h-12 text-fuchsia-400 animate-spin" />
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-fuchsia-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-zinc-300">{uploadProgress}%</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <Check className="w-16 h-16 text-green-400" />
          </div>
        )}
      </div>

      {/* Upload Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          size="sm"
          disabled={uploading}
          className="gap-2 flex-1"
        >
          <Upload className="w-4 h-4" />
          {preview ? 'Change Media' : 'Upload Media'}
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
        accept={getAcceptString()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Info */}
      <p className="text-xs text-zinc-500">
        {accept === 'image' && `JPG, PNG or WEBP. Max size ${maxSizeMB}MB.`}
        {accept === 'video' && `MP4, WEBM or MOV. Max size ${maxSizeMB}MB.`}
        {accept === 'both' && `Images or videos. Max size ${maxSizeMB}MB.`}
      </p>
    </div>
  )
}
