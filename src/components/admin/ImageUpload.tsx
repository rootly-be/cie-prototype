'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import styles from './admin-components.module.css'

interface UploadedImage {
  id: string
  url: string
  alt: string | null
}

interface ImageUploadProps {
  entityType: 'animation' | 'formation' | 'stage'
  entityId?: string
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
}

/**
 * ImageUpload Component
 * Story 3.6: Image upload to S3
 *
 * Handles image upload with drag & drop support.
 */
export function ImageUpload({
  entityType,
  entityId,
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images autorisées`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    setUploading(true)
    setError(null)

    const newImages: UploadedImage[] = []

    for (const file of filesToUpload) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('entityType', entityType)
        if (entityId) {
          formData.append('entityId', entityId)
        }

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (res.ok && data.data) {
          newImages.push(data.data)
        } else {
          setError(data.error?.message || 'Erreur lors de l\'upload')
        }
      } catch {
        setError('Erreur de connexion')
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages])
    }

    setUploading(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemove = async (imageId: string) => {
    try {
      const res = await fetch(`/api/admin/upload/${imageId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onImagesChange(images.filter((img) => img.id !== imageId))
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la suppression')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const canUpload = images.length < maxImages

  return (
    <div>
      {/* Upload zone */}
      {canUpload && (
        <div
          className={`${styles.imageUpload} ${dragActive ? styles.imageUploadActive : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
          />
          <div className={styles.imageUploadIcon}>
            {uploading ? '⏳' : '📷'}
          </div>
          <div className={styles.imageUploadText}>
            {uploading
              ? 'Upload en cours...'
              : 'Cliquez ou glissez des images ici'}
          </div>
          <div className={styles.imageUploadHint}>
            JPG, PNG ou WebP • Max 5 Mo • {images.length}/{maxImages} images
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className={styles.uploadError}>{error}</div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className={styles.imagePreviewGrid}>
          {images.map((image) => (
            <div key={image.id} className={styles.imagePreviewItem}>
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                sizes="120px"
                style={{ objectFit: 'cover' }}
              />
              <button
                type="button"
                className={styles.imagePreviewRemove}
                onClick={() => handleRemove(image.id)}
                aria-label="Supprimer l'image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
