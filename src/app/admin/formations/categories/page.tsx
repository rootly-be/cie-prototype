'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import styles from '../../admin.module.css'

interface Category {
  id: string
  nom: string
  type: string
  _count?: {
    formations: number
  }
}

/**
 * Formation Categories Management Page
 * CRUD for formation categories
 */
export default function FormationCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New category form
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories?type=formation')
      const data = await res.json()
      if (data.data) {
        setCategories(data.data)
      }
    } catch {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newName.trim(), type: 'formation' }),
      })

      if (res.ok) {
        setNewName('')
        fetchCategories()
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
    if (!editName.trim()) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editName.trim() }),
      })

      if (res.ok) {
        setEditingId(null)
        setEditName('')
        fetchCategories()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la mise à jour')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer la catégorie "${nom}" ?`)) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCategories()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la suppression')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.nom)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
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
        <h1 className={styles.pageTitle}>Catégories de formations</h1>
        <Link href="/admin/formations">
          <Button variant="outline">Retour aux formations</Button>
        </Link>
      </div>

      {error && (
        <div className={styles.formError}>{error}</div>
      )}

      {/* Add new category form */}
      <div className={styles.formContainer} style={{ marginBottom: '24px' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className={styles.filterLabel}>Nouvelle catégorie</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la catégorie"
              className={styles.filterSelect}
              style={{ width: '100%' }}
            />
          </div>
          <Button type="submit" variant="primary" disabled={creating || !newName.trim()}>
            {creating ? 'Création...' : 'Ajouter'}
          </Button>
        </form>
      </div>

      {/* Categories list */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Formations</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                  Aucune catégorie
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={styles.filterSelect}
                        autoFocus
                      />
                    ) : (
                      <span className={styles.tableTitle}>{category.nom}</span>
                    )}
                  </td>
                  <td>{category._count?.formations || 0}</td>
                  <td className={styles.tableActions}>
                    {editingId === category.id ? (
                      <>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleUpdate(category.id)}
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
                          onClick={() => startEdit(category)}
                        >
                          Modifier
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() => handleDelete(category.id, category.nom)}
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
