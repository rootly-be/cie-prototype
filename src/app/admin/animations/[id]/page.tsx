'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentPreview } from '@/components/admin'
import { NIVEAUX_OPTIONS } from '@/lib/constants/niveaux'
import styles from '../../admin.module.css'

interface Category {
  id: string
  nom: string
}

interface Tag {
  id: string
  nom: string
}

interface Animation {
  id: string
  titre: string
  description: string
  niveau: string
  published: boolean
  categorieId: string
  categorie: Category
  tags: Tag[]
}

/**
 * Edit Animation Page
 * Story 3.7: Build Admin Content Pages
 *
 * Form for editing existing animations with live preview.
 */
export default function EditAnimationPage({
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
  const [niveau, setNiveau] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [published, setPublished] = useState(false)

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch animation and options
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/animations/${id}`).then((r) => r.json()),
      fetch('/api/admin/categories?type=animation').then((r) => r.json()),
      fetch('/api/admin/tags').then((r) => r.json()),
    ])
      .then(([animData, catData, tagData]) => {
        if (catData.data) setCategories(catData.data)
        if (tagData.data) setTags(tagData.data)

        if (animData.data) {
          const animation: Animation = animData.data
          setTitre(animation.titre)
          setDescription(animation.description)
          setNiveau(animation.niveau)
          setCategorieId(animation.categorieId)
          setSelectedTags(animation.tags.map((t) => t.id))
          setPublished(animation.published)
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load animation:', error)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  // Get selected category name for preview
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
    if (!niveau) {
      newErrors.niveau = 'Sélectionnez un niveau'
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
      const res = await fetch(`/api/admin/animations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          description,
          niveau,
          categorieId,
          tagIds: selectedTags,
          published,
        }),
      })

      const data = await res.json()

      if (res.ok && data.data) {
        router.push('/admin/animations')
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
        <div className={styles.emptyTitle}>Animation non trouvée</div>
        <div className={styles.emptyDescription}>
          L&apos;animation demandée n&apos;existe pas ou a été supprimée.
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/animations')}>
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Modifier l&apos;animation</h1>
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
                placeholder="Ex: Découverte de la mare"
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                required
                rows={5}
                placeholder="Décrivez l'animation en détail..."
              />

              <Select
                label="Niveau scolaire"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                options={[...NIVEAUX_OPTIONS]}
                placeholder="Sélectionnez un niveau"
                error={errors.niveau}
                required
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
              <h2 className={styles.formSectionTitle}>Publication</h2>
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
            type="animation"
            data={{
              titre,
              description,
              niveau,
              categorie: selectedCategory?.nom,
            }}
          />
        </div>
      </div>
    </div>
  )
}
