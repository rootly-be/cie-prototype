'use client'

import { useState, useEffect } from 'react'
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

/**
 * Create Animation Page
 * Story 3.7: Build Admin Content Pages
 *
 * Form for creating new animations with live preview.
 */
export default function NewAnimationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // Form state
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [niveau, setNiveau] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [published, setPublished] = useState(false)

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch categories and tags
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories?type=animation').then((r) => r.json()),
      fetch('/api/admin/tags').then((r) => r.json()),
    ])
      .then(([catData, tagData]) => {
        if (catData.data) setCategories(catData.data)
        if (tagData.data) setTags(tagData.data)
      })
      .catch((error) => {
        console.error('Failed to load categories/tags:', error)
        setErrors({ form: 'Erreur de chargement des données' })
      })
  }, [])

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

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/admin/animations', {
        method: 'POST',
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
        setErrors({ form: data.error?.message || 'Erreur lors de la création' })
      }
    } catch {
      setErrors({ form: 'Erreur de connexion' })
    } finally {
      setLoading(false)
    }
  }

  // Toggle tag selection
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Nouvelle animation</h1>
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
                <span>Publier immédiatement</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer l\'animation'}
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
