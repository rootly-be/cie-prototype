'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { StatusToggle } from '@/components/admin'
import styles from '../admin.module.css'

interface Formation {
  id: string
  titre: string
  isFull: boolean
  published: boolean
  createdAt: string
  categorie: { id: string; nom: string }
  tags: { id: string; nom: string }[]
  dates: { id: string; dateDebut: string }[]
}

interface Category {
  id: string
  nom: string
}

interface ApiResponse {
  data: Formation[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * Formations List Page
 * Story 3.7: Build Admin Content Pages
 */
export default function FormationsListPage() {
  const router = useRouter()
  const [formations, setFormations] = useState<Formation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [categorieId, setCategorieId] = useState('')
  const [published, setPublished] = useState('')
  const [isFull, setIsFull] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories?type=formation')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCategories(data.data)
      })
      .catch(console.error)
  }, [])

  // Fetch formations
  const fetchFormations = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('pageSize', '20')
    if (categorieId) params.set('categorieId', categorieId)
    if (published) params.set('published', published)
    if (isFull) params.set('isFull', isFull)

    try {
      const res = await fetch(`/api/admin/formations?${params}`)
      const data: ApiResponse = await res.json()

      if (data.data) {
        setFormations(data.data)
        setTotalPages(data.meta.totalPages)
      } else {
        setError('Erreur lors du chargement')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [page, categorieId, published, isFull])

  useEffect(() => {
    fetchFormations()
  }, [fetchFormations])

  // Handle publish toggle
  const handleTogglePublish = async (id: string, newValue: boolean) => {
    const res = await fetch(`/api/admin/formations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newValue }),
    })

    if (!res.ok) throw new Error('Toggle failed')

    setFormations((prev) =>
      prev.map((f) => (f.id === id ? { ...f, published: newValue } : f))
    )
  }

  // Handle delete
  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return

    try {
      const res = await fetch(`/api/admin/formations/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setFormations((prev) => prev.filter((f) => f.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur de connexion')
    }
  }

  // Reset filters
  const handleResetFilters = () => {
    setCategorieId('')
    setPublished('')
    setIsFull('')
    setPage(1)
  }

  // Format next date
  const formatNextDate = (dates: { dateDebut: string }[]) => {
    if (!dates || dates.length === 0) return '-'
    const nextDate = dates
      .map((d) => new Date(d.dateDebut))
      .filter((d) => d >= new Date())
      .sort((a, b) => a.getTime() - b.getTime())[0]

    if (!nextDate) return 'Passée'
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(nextDate)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Formations</h1>
        <div className={styles.pageActions}>
          <Link href="/admin/formations/new">
            <Button variant="primary">+ Nouvelle formation</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Catégorie</label>
          <select
            className={styles.filterSelect}
            value={categorieId}
            onChange={(e) => {
              setCategorieId(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Statut</label>
          <select
            className={styles.filterSelect}
            value={published}
            onChange={(e) => {
              setPublished(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tous</option>
            <option value="true">Publiés</option>
            <option value="false">Brouillons</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Places</label>
          <select
            className={styles.filterSelect}
            value={isFull}
            onChange={(e) => {
              setIsFull(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tous</option>
            <option value="false">Places disponibles</option>
            <option value="true">Complet</option>
          </select>
        </div>

        {(categorieId || published || isFull) && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleResetFilters}
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚠️</div>
          <div className={styles.emptyTitle}>{error}</div>
          <Button variant="outline" onClick={fetchFormations}>
            Réessayer
          </Button>
        </div>
      ) : formations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <div className={styles.emptyTitle}>Aucune formation</div>
          <div className={styles.emptyDescription}>
            {categorieId || published || isFull
              ? 'Aucun résultat avec ces filtres.'
              : 'Commencez par créer votre première formation.'}
          </div>
          {!categorieId && !published && !isFull && (
            <Link href="/admin/formations/new">
              <Button variant="primary">Créer une formation</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Prochaine date</th>
                  <th>Places</th>
                  <th>Statut</th>
                  <th>Publié</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formations.map((formation) => (
                  <tr key={formation.id}>
                    <td>
                      <span className={styles.tableTitle}>{formation.titre}</span>
                    </td>
                    <td>{formation.categorie.nom}</td>
                    <td>{formatNextDate(formation.dates)}</td>
                    <td>
                      {formation.isFull ? (
                        <span className={styles.statusFull}>Complet</span>
                      ) : (
                        <span className={styles.statusAvailable}>Disponible</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          formation.published
                            ? styles.statusPublished
                            : styles.statusDraft
                        }`}
                      >
                        {formation.published ? '✓ Publié' : '○ Brouillon'}
                      </span>
                    </td>
                    <td>
                      <StatusToggle
                        id={formation.id}
                        initialValue={formation.published}
                        onToggle={handleTogglePublish}
                      />
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() =>
                            router.push(`/admin/formations/${formation.id}`)
                          }
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() =>
                            handleDelete(formation.id, formation.titre)
                          }
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Précédent
              </button>
              <span className={styles.paginationButton}>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
