'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import styles from '../../admin.module.css'

interface Niveau {
  id: string
  code: string
  label: string
  ordre: number
}

/**
 * Animation Niveaux Management Page
 * CRUD for school levels
 */
export default function AnimationNiveauxPage() {
  const [niveaux, setNiveaux] = useState<Niveau[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New niveau form
  const [newCode, setNewCode] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [creating, setCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCode, setEditCode] = useState('')
  const [editLabel, setEditLabel] = useState('')

  const fetchNiveaux = async () => {
    try {
      const res = await fetch('/api/admin/niveaux')
      const data = await res.json()
      if (data.data) {
        setNiveaux(data.data)
      }
    } catch {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNiveaux()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim() || !newLabel.trim()) return

    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/niveaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.trim(),
          label: newLabel.trim(),
          ordre: niveaux.length,
        }),
      })

      if (res.ok) {
        setNewCode('')
        setNewLabel('')
        fetchNiveaux()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la création')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editCode.trim() || !editLabel.trim()) return

    setError(null)
    try {
      const res = await fetch(`/api/admin/niveaux/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editCode.trim(),
          label: editLabel.trim(),
        }),
      })

      if (res.ok) {
        setEditingId(null)
        setEditCode('')
        setEditLabel('')
        fetchNiveaux()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la mise à jour')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Supprimer le niveau "${code}" ?`)) return

    setError(null)
    try {
      const res = await fetch(`/api/admin/niveaux/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchNiveaux()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la suppression')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const startEdit = (niveau: Niveau) => {
    setEditingId(niveau.id)
    setEditCode(niveau.code)
    setEditLabel(niveau.label)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditCode('')
    setEditLabel('')
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Niveaux scolaires</h1>
        <Link href="/admin/animations">
          <Button variant="outline">Retour aux animations</Button>
        </Link>
      </div>

      {error && (
        <div className={styles.formError}>{error}</div>
      )}

      {/* Add new niveau form */}
      <div className={styles.formContainer} style={{ marginBottom: '24px' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '120px' }}>
            <label className={styles.filterLabel}>Code</label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Ex: M1"
              className={styles.filterSelect}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className={styles.filterLabel}>Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex: Maternelle 1"
              className={styles.filterSelect}
              style={{ width: '100%' }}
            />
          </div>
          <Button type="submit" variant="primary" disabled={creating || !newCode.trim() || !newLabel.trim()}>
            {creating ? 'Création...' : 'Ajouter'}
          </Button>
        </form>
      </div>

      {/* Niveaux list */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Label</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {niveaux.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                  Aucun niveau. Ajoutez-en un ci-dessus.
                </td>
              </tr>
            ) : (
              niveaux.map((niveau) => (
                <tr key={niveau.id}>
                  <td>
                    {editingId === niveau.id ? (
                      <input
                        type="text"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        className={styles.filterSelect}
                        style={{ width: '100px' }}
                      />
                    ) : (
                      <span className={styles.tableTitle}>{niveau.code}</span>
                    )}
                  </td>
                  <td>
                    {editingId === niveau.id ? (
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className={styles.filterSelect}
                        autoFocus
                      />
                    ) : (
                      niveau.label
                    )}
                  </td>
                  <td className={styles.tableActions}>
                    {editingId === niveau.id ? (
                      <>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleUpdate(niveau.id)}
                        >
                          Sauver
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={cancelEdit}
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.actionButton}
                          onClick={() => startEdit(niveau)}
                        >
                          Modifier
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() => handleDelete(niveau.id, niveau.code)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
