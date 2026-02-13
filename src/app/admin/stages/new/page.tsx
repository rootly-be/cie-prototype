'use client'

import { useState, useEffect } from 'react'
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

const PERIODES = [
  { value: 'Pâques', label: 'Pâques' },
  { value: 'Été', label: 'Été' },
  { value: 'Toussaint', label: 'Toussaint' },
  { value: 'Carnaval', label: 'Carnaval' },
]

/**
 * Create Stage Page
 * Story 3.7: Build Admin Content Pages
 */
export default function NewStagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // Form state
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [periode, setPeriode] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [prix, setPrix] = useState('')
  const [billetwebUrl, setBilletwebUrl] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFull, setIsFull] = useState(false)
  const [published, setPublished] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch categories and tags
  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories?type=stage').then((r) => r.json()),
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

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!titre || titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères'
    }
    if (!description || description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères'
    }
    if (!periode) {
      newErrors.periode = 'Sélectionnez une période'
    }
    if (!ageMin || isNaN(parseInt(ageMin))) {
      newErrors.ageMin = 'Âge minimum requis'
    }
    if (!ageMax || isNaN(parseInt(ageMax))) {
      newErrors.ageMax = 'Âge maximum requis'
    }
    if (parseInt(ageMax) < parseInt(ageMin)) {
      newErrors.ageMax = 'Doit être >= âge minimum'
    }
    if (!dateDebut) {
      newErrors.dateDebut = 'Date de début requise'
    }
    if (!dateFin) {
      newErrors.dateFin = 'Date de fin requise'
    }
    if (dateDebut && dateFin && new Date(dateFin) < new Date(dateDebut)) {
      newErrors.dateFin = 'Doit être après la date de début'
    }
    if (!prix) {
      newErrors.prix = 'Prix requis'
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
      const res = await fetch('/api/admin/stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          description,
          periode,
          ageMin: parseInt(ageMin),
          ageMax: parseInt(ageMax),
          dateDebut,
          dateFin,
          prix,
          billetwebUrl: billetwebUrl || null,
          categorieId: categorieId || undefined,
          tagIds: selectedTags,
          imageIds: images.map((img) => img.id),
          isFull,
          published,
        }),
      })

      const data = await res.json()

      if (res.ok && data.data) {
        router.push('/admin/stages')
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
        <h1 className={styles.pageTitle}>Nouveau stage</h1>
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
                placeholder="Ex: Explorateurs de la forêt"
              />

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                required
                rows={5}
                placeholder="Décrivez le stage en détail..."
              />

              <Select
                label="Période"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                options={PERIODES}
                placeholder="Sélectionnez une période"
                error={errors.periode}
                required
              />

              {categories.length > 0 && (
                <Select
                  label="Catégorie (optionnel)"
                  value={categorieId}
                  onChange={(e) => setCategorieId(e.target.value)}
                  options={categories.map((c) => ({ value: c.id, label: c.nom }))}
                  placeholder="Sélectionnez une catégorie"
                />
              )}
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formSectionTitle}>Âges et dates</h2>

              <div className={styles.formRow}>
                <Input
                  label="Âge minimum"
                  type="number"
                  min="0"
                  max="18"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  error={errors.ageMin}
                  required
                  placeholder="6"
                />

                <Input
                  label="Âge maximum"
                  type="number"
                  min="0"
                  max="18"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  error={errors.ageMax}
                  required
                  placeholder="12"
                />
              </div>

              <div className={styles.formRow}>
                <Input
                  label="Date de début"
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  error={errors.dateDebut}
                  required
                />

                <Input
                  label="Date de fin"
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  error={errors.dateFin}
                  required
                />
              </div>

              <Input
                label="Prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                error={errors.prix}
                required
                placeholder="Ex: 50€ ou 45€/jour"
              />

              <Input
                label="Lien d'inscription (Billetweb)"
                value={billetwebUrl}
                onChange={(e) => setBilletwebUrl(e.target.value)}
                placeholder="https://www.billetweb.fr/..."
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
                entityType="stage"
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
                {loading ? 'Création...' : 'Créer le stage'}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ContentPreview
            type="stage"
            data={{
              titre,
              description,
              periode,
              ageMin: ageMin ? parseInt(ageMin) : undefined,
              ageMax: ageMax ? parseInt(ageMax) : undefined,
              prix,
              dateDebut,
              dateFin,
            }}
          />
        </div>
      </div>
    </div>
  )
}
