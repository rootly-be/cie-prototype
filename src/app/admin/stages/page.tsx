'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { StatusToggle } from '@/components/admin'
import styles from '../admin.module.css'

interface Stage {
  id: string
  titre: string
  periode: string
  ageMin: number
  ageMax: number
  dateDebut: string
  dateFin: string
  prix: string
  isFull: boolean
  published: boolean
  createdAt: string
  categorie: { id: string; nom: string } | null
}

interface ApiResponse {
  data: Stage[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

const PERIODES = ['Pâques', 'Été', 'Toussaint', 'Carnaval']

/**
 * Stages List Page
 * Story 3.7: Build Admin Content Pages
 */
export default function StagesListPage() {
  const router = useRouter()
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [periode, setPeriode] = useState('')
  const [published, setPublished] = useState('')
  const [isFull, setIsFull] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch stages
  const fetchStages = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('pageSize', '20')
    if (periode) params.set('periode', periode)
    if (published) params.set('published', published)
    if (isFull) params.set('isFull', isFull)

    try {
      const res = await fetch(`/api/admin/stages?${params}`)
      const data: ApiResponse = await res.json()

      if (data.data) {
        setStages(data.data)
        setTotalPages(data.meta.totalPages)
      } else {
        setError('Erreur lors du chargement')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [page, periode, published, isFull])

  useEffect(() => {
    fetchStages()
  }, [fetchStages])

  // Handle publish toggle
  const handleTogglePublish = async (id: string, newValue: boolean) => {
    const res = await fetch(`/api/admin/stages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newValue }),
    })

    if (!res.ok) throw new Error('Toggle failed')

    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: newValue } : s))
    )
  }

  // Handle delete
  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return

    try {
      const res = await fetch(`/api/admin/stages/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setStages((prev) => prev.filter((s) => s.id !== id))
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur de connexion')
    }
  }

  // Reset filters
  const handleResetFilters = () => {
    setPeriode('')
    setPublished('')
    setIsFull('')
    setPage(1)
  }

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
      })
      return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`
    } catch {
      return '-'
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Stages</h1>
        <div className={styles.pageActions}>
          <Link href="/admin/stages/categories">
            <Button variant="outline">Catégories</Button>
          </Link>
          <Link href="/admin/stages/new">
            <Button variant="primary">+ Nouveau stage</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Période</label>
          <select
            className={styles.filterSelect}
            value={periode}
            onChange={(e) => {
              setPeriode(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Toutes les périodes</option>
            {PERIODES.map((p) => (
              <option key={p} value={p}>
                {p}
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

        {(periode || published || isFull) && (
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
          <Button variant="outline" onClick={fetchStages}>
            Réessayer
          </Button>
        </div>
      ) : stages.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏕️</div>
          <div className={styles.emptyTitle}>Aucun stage</div>
          <div className={styles.emptyDescription}>
            {periode || published || isFull
              ? 'Aucun résultat avec ces filtres.'
              : 'Commencez par créer votre premier stage.'}
          </div>
          {!periode && !published && !isFull && (
            <Link href="/admin/stages/new">
              <Button variant="primary">Créer un stage</Button>
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
                  <th>Période</th>
                  <th>Âges</th>
                  <th>Dates</th>
                  <th>Prix</th>
                  <th>Places</th>
                  <th>Statut</th>
                  <th>Publié</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={stage.id}>
                    <td>
                      <span className={styles.tableTitle}>{stage.titre}</span>
                    </td>
                    <td>{stage.periode}</td>
                    <td>
                      {stage.ageMin}-{stage.ageMax} ans
                    </td>
                    <td>{formatDateRange(stage.dateDebut, stage.dateFin)}</td>
                    <td>{stage.prix}</td>
                    <td>
                      {stage.isFull ? (
                        <span className={styles.statusFull}>Complet</span>
                      ) : (
                        <span className={styles.statusAvailable}>Disponible</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          stage.published
                            ? styles.statusPublished
                            : styles.statusDraft
                        }`}
                      >
                        {stage.published ? '✓ Publié' : '○ Brouillon'}
                      </span>
                    </td>
                    <td>
                      <StatusToggle
                        id={stage.id}
                        initialValue={stage.published}
                        onToggle={handleTogglePublish}
                      />
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => router.push(`/admin/stages/${stage.id}`)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() => handleDelete(stage.id, stage.titre)}
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
