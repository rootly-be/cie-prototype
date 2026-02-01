'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { ContentPreview } from '@/components/admin'
import styles from '../../admin.module.css'

interface Category {
  id: string
  nom: string
}

interface Tag {
  id: string
  nom: string
}

interface Stage {
  id: string
  titre: string
  description: string
  periode: string
  ageMin: number
  ageMax: number
  dateDebut: string
  dateFin: string
  prix: string
  billetwebUrl: string | null
  categorieId: string | null
  isFull: boolean
  published: boolean
  categorie: Category | null
  tags: Tag[]
}

const PERIODES = [
  { value: 'Pâques', label: 'Pâques' },
  { value: 'Été', label: 'Été' },
  { value: 'Toussaint', label: 'Toussaint' },
  { value: 'Carnaval', label: 'Carnaval' },
]

/**
 * Edit Stage Page
 * Story 3.7: Build Admin Content Pages
 */
export default function EditStagePage({
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

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch stage and options
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/stages/${id}`).then((r) => r.json()),
      fetch('/api/admin/categories?type=stage').then((r) => r.json()),
      fetch('/api/admin/tags').then((r) => r.json()),
    ])
      .then(([stageData, catData, tagData]) => {
        if (catData.data) setCategories(catData.data)
        if (tagData.data) setTags(tagData.data)

        if (stageData.data) {
          const stage: Stage = stageData.data
          setTitre(stage.titre)
          setDescription(stage.description)
          setPeriode(stage.periode)
          setAgeMin(stage.ageMin.toString())
          setAgeMax(stage.ageMax.toString())
          setDateDebut(stage.dateDebut.split('T')[0]) // Format for date input
          setDateFin(stage.dateFin.split('T')[0])
          setPrix(stage.prix)
          setBilletwebUrl(stage.billetwebUrl || '')
          setCategorieId(stage.categorieId || '')
          setSelectedTags(stage.tags.map((t) => t.id))
          setIsFull(stage.isFull)
          setPublished(stage.published)
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load stage:', error)
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

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

    setSaving(true)
    setErrors({})

    try {
      const res = await fetch(`/api/admin/stages/${id}`, {
        method: 'PUT',
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
          isFull,
          published,
        }),
      })

      const data = await res.json()

      if (res.ok && data.data) {
        router.push('/admin/stages')
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
        <div className={styles.emptyTitle}>Stage non trouvé</div>
        <div className={styles.emptyDescription}>
          Le stage demandé n&apos;existe pas ou a été supprimé.
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/stages')}>
          Retour à la liste
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Modifier le stage</h1>
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
