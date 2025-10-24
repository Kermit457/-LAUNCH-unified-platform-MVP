'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropzoneProps {
  file: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in bytes
  label?: string
}

export function FileDropzone({
  file,
  onChange,
  accept = "image/png,image/jpeg",
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = "Upload Logo (PNG/JPG ≤ 5MB)"
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const validateFile = (file: File): string | null => {
    if (!accept.split(',').some(type => file.type.match(type.trim()))) {
      return 'Invalid file type. Please upload PNG or JPG.'
    }
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024))
      return `File too large. Maximum size is ${maxMB}MB.`
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onChange(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [onChange, maxSize, accept])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [handleFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  const removeFile = () => {
    onChange(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            isDragging
              ? "border-lime-500/50 bg-lime-500/10"
              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <Upload className="w-10 h-10 mx-auto mb-3 text-white/40" />
          <p className="text-sm text-white/70 mb-1">
            Drop your logo here or click to browse
          </p>
          <p className="text-xs text-white/50">
            PNG or JPG, max 5MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center gap-3">
            {preview ? (
              <img
                src={preview}
                alt="Logo preview"
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white/40" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-white/60">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
