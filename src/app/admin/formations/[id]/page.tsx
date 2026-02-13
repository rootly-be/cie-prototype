'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentPreview, ImageUpload } from '@/components/admin'
import styles from '../../admin.module.css'

interface Category {
  id: string
  nom: string
}

interface Tag {
  id: string
  nom: string
}

interface UploadedImage {
  id: string
  url: string
  alt: string | null
}

interface Formation {
  id: string
  titre: string
  description: string
  categorieId: string
  billetwebUrl: string | null
  isFull: boolean
  published: boolean
  categorie: Category
  tags: Tag[]
  images: UploadedImage[]
}

/**
 * Edit Formation Page
 * Story 3.7: Build Admin Content Pages
 */
export default function EditFormationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [notFound, setNotFound] = useState(false)

  // Form state
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [billetwebUrl, setBilletwebUrl] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFull, setIsFull] = useState(false)
  const [published, setPublished] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch formation and options
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/formations/${id}`).then((r) => r.json()),
      fetch('/api/admin/categories?type=formation').then((r) => r.json()),
      fetch('/api/admin/tags').then((r) => r.json()),
    ])
      .then(([formData, catData, tagData]) => {
        if (catData.data) setCategories(catData.data)
        if (tagData.data) setTags(tagData.data)

        if (formData.data) {
          const formation: Formation = formData.data
          setTitre(formation.titre)
          setDescription(formation.description)
          setCategorieId(formation.categorieId)
          setBilletwebUrl(formation.billetwebUrl || '')
          setSelectedTags(formation.tags.map((t) => t.id))
          setIsFull(formation.isFull)
          setPublished(formation.published)
          setImages(formation.images || [])
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load formation:', error)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  const selectedCategory = categories.find((c) => c.id === categorieId)

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!titre || titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères'
    }
    if (!description || description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères'
    }
    if (!categorieId) {
      newErrors.categorieId = 'Sélectionnez une catégorie'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSaving(true)
    setErrors({})

    try {
      const res = await fetch(`/api/admin/formations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          description,
          categorieId,
          billetwebUrl: billetwebUrl || null,
          tagIds: selectedTags,
          imageIds: images.map((img) => img.id),
          isFull,
          published,
        }),
      })

      const data = await res.json()

      if (res.ok && data.data) {
        router.push('/admin/formations')
      } else {
        setErrors({ form: data.error?.message || 'Erreur lors de la mise à jour' })
      }
    } catch {
      setErrors({ form: 'Erreur de connexion' })
    } finally {
      setSaving(false)
    }
  }

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <div className={styles.emptyTitle}>Formation non trouvée</div>
        <div className={styles.emptyDescription}>
          La formation demandée n&apos;existe pas ou a été supprimée.
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/formations')}>
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Modifier la formation</h1>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {errors.form && (
              <div className={styles.formError}>{errors.form}</div>
            )}

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Informations générales</h2>

              <Input
                label="Titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                error={errors.titre}
                required
                placeholder="Ex: Formation compostage"
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                required
                rows={5}
                placeholder="Décrivez la formation en détail..."
              />

              <Select
                label="Catégorie"
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                options={categories.map((c) => ({ value: c.id, label: c.nom }))}
                placeholder="Sélectionnez une catégorie"
                error={errors.categorieId}
                required
              />

              <Input
                label="Lien d'inscription (Billetweb)"
                value={billetwebUrl}
                onChange={(e) => setBilletwebUrl(e.target.value)}
                placeholder="https://www.billetweb.fr/..."
                error={errors.billetwebUrl}
              />
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Tags</h2>
              <div className={styles.tagSelectContainer}>
                {tags.length === 0 ? (
                  <p className={styles.tagEmpty}>Aucun tag disponible</p>
                ) : (
                  <div className={styles.tagGrid}>
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className={`${styles.tagOption} ${
                          selectedTags.includes(tag.id) ? styles.tagOptionSelected : ''
                        }`}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.nom}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Images</h2>
              <ImageUpload
                entityType="formation"
                entityId={id}
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Options</h2>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isFull}
                  onChange={(e) => setIsFull(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Marquer comme complet (plus de places)</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Publié</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ContentPreview
            type="formation"
            data={{
              titre,
              description,
              categorie: selectedCategory?.nom,
            }}
          />
        </div>
      </div>
    </div>
  )
}
