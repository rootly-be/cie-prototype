'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { StatusToggle } from '@/components/admin'
import { NIVEAUX } from '@/lib/constants/niveaux'
import styles from '../admin.module.css'

interface Animation {
  id: string
  titre: string
  niveau: string
  published: boolean
  categorie: { id: string; nom: string }
}

interface Category {
  id: string
  nom: string
}

interface ApiResponse {
  data: Animation[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * Animations List Page
 * Story 3.7: Build Admin Content Pages
 *
 * Displays all animations with filters and quick actions.
 */
export default function AnimationsListPage() {
  const router = useRouter()
  const [animations, setAnimations] = useState<Animation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [niveau, setNiveau] = useState('')
  const [categorieId, setCategorieId] = useState('')
  const [published, setPublished] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch categories for filter dropdown
  useEffect(() => {
    fetch('/api/admin/categories?type=animation')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCategories(data.data)
      })
      .catch(console.error)
  }, [])

  // Fetch animations
  const fetchAnimations = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('pageSize', '20')
    if (niveau) params.set('niveau', niveau)
    if (categorieId) params.set('categorieId', categorieId)
    if (published) params.set('published', published)

    try {
      const res = await fetch(`/api/admin/animations?${params}`)
      const data: ApiResponse = await res.json()

      if (data.data) {
        setAnimations(data.data)
        setTotalPages(data.meta.totalPages)
      } else {
        setError('Erreur lors du chargement')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [page, niveau, categorieId, published])

  useEffect(() => {
    fetchAnimations()
  }, [fetchAnimations])

  // Handle publish toggle
  const handleTogglePublish = async (id: string, newValue: boolean) => {
    const res = await fetch(`/api/admin/animations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newValue }),
    })

    if (!res.ok) {
      throw new Error('Toggle failed')
    }

    // Update local state
    setAnimations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: newValue } : a))
    )
  }

  // Handle delete
  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return

    try {
      const res = await fetch(`/api/admin/animations/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setAnimations((prev) => prev.filter((a) => a.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur de connexion')
    }
  }

  // Reset filters
  const handleResetFilters = () => {
    setNiveau('')
    setCategorieId('')
    setPublished('')
    setPage(1)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Animations</h1>
        <div className={styles.pageActions}>
          <Link href="/admin/animations/new">
            <Button variant="primary">+ Nouvelle animation</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Niveau</label>
          <select
            className={styles.filterSelect}
            value={niveau}
            onChange={(e) => {
              setNiveau(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tous les niveaux</option>
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

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

        {(niveau || categorieId || published) && (
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
          <Button variant="outline" onClick={fetchAnimations}>
            Réessayer
          </Button>
        </div>
      ) : animations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎓</div>
          <div className={styles.emptyTitle}>Aucune animation</div>
          <div className={styles.emptyDescription}>
            {niveau || categorieId || published
              ? 'Aucun résultat avec ces filtres.'
              : "Commencez par créer votre première animation."}
          </div>
          {!niveau && !categorieId && !published && (
            <Link href="/admin/animations/new">
              <Button variant="primary">Créer une animation</Button>
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
                  <th>Niveau</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Publié</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {animations.map((animation) => (
                  <tr key={animation.id}>
                    <td>
                      <span className={styles.tableTitle}>{animation.titre}</span>
                    </td>
                    <td>{animation.niveau}</td>
                    <td>{animation.categorie.nom}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          animation.published
                            ? styles.statusPublished
                            : styles.statusDraft
                        }`}
                      >
                        {animation.published ? '✓ Publié' : '○ Brouillon'}
                      </span>
                    </td>
                    <td>
                      <StatusToggle
                        id={animation.id}
                        initialValue={animation.published}
                        onToggle={handleTogglePublish}
                      />
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() =>
                            router.push(`/admin/animations/${animation.id}`)
                          }
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() =>
                            handleDelete(animation.id, animation.titre)
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
