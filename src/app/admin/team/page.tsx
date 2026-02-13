'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import styles from '../admin.module.css'

interface TeamMember {
  id: string
  nom: string
  fonction: string
  photo: string | null
  type: 'equipe' | 'ca'
  ordre: number
}

/**
 * Team Members Management Page
 * CRUD for "Qui sommes nous" section
 */
export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    fonction: '',
    photo: '',
    type: 'equipe' as 'equipe' | 'ca',
    ordre: 0,
  })
  const [saving, setSaving] = useState(false)

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      if (data.data) {
        setMembers(data.data)
      }
    } catch {
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const resetForm = () => {
    setFormData({ nom: '', fonction: '', photo: '', type: 'equipe', ordre: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photo: formData.photo || null,
        }),
      })

      if (res.ok) {
        resetForm()
        fetchMembers()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la sauvegarde')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      nom: member.nom,
      fonction: member.fonction,
      photo: member.photo || '',
      type: member.type,
      ordre: member.ordre,
    })
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer "${nom}" de l'équipe ?`)) return

    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchMembers()
      } else {
        const data = await res.json()
        setError(data.error?.message || 'Erreur lors de la suppression')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  const equipeMembers = members.filter((m) => m.type === 'equipe')
  const caMembers = members.filter((m) => m.type === 'ca')

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
        <h1 className={styles.pageTitle}>Équipe & CA</h1>
        <div className={styles.pageActions}>
          <Link href="/admin">
            <Button variant="outline">Retour</Button>
          </Link>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Ajouter un membre
          </Button>
        </div>
      </div>

      {error && <div className={styles.formError}>{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className={styles.formContainer} style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            {editingId ? 'Modifier le membre' : 'Nouveau membre'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className={styles.filterLabel}>Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div>
                <label className={styles.filterLabel}>Fonction</label>
                <input
                  type="text"
                  value={formData.fonction}
                  onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                  required
                />
              </div>
              <div>
                <label className={styles.filterLabel}>URL Photo</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={styles.filterLabel}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'equipe' | 'ca' })}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                >
                  <option value="equipe">Équipe</option>
                  <option value="ca">Conseil d&apos;Administration</option>
                </select>
              </div>
              <div>
                <label className={styles.filterLabel}>Ordre d&apos;affichage</label>
                <input
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                  className={styles.filterSelect}
                  style={{ width: '100%' }}
                  min="0"
                />
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Ajouter'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Équipe Section */}
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Équipe ({equipeMembers.length})</h2>
      <div className={styles.tableContainer} style={{ marginBottom: '32px' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Photo</th>
              <th>Nom</th>
              <th>Fonction</th>
              <th>Ordre</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipeMembers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                  Aucun membre dans l&apos;équipe
                </td>
              </tr>
            ) : (
              equipeMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.nom}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--border-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)'
                      }}>
                        ?
                      </div>
                    )}
                  </td>
                  <td><span className={styles.tableTitle}>{member.nom}</span></td>
                  <td>{member.fonction}</td>
                  <td>{member.ordre}</td>
                  <td className={styles.tableActions}>
                    <button className={styles.actionButton} onClick={() => handleEdit(member)}>
                      Modifier
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      onClick={() => handleDelete(member.id, member.nom)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CA Section */}
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Conseil d&apos;Administration ({caMembers.length})</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Photo</th>
              <th>Nom</th>
              <th>Fonction</th>
              <th>Ordre</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {caMembers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                  Aucun membre dans le CA
                </td>
              </tr>
            ) : (
              caMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.nom}
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--border-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)'
                      }}>
                        ?
                      </div>
                    )}
                  </td>
                  <td><span className={styles.tableTitle}>{member.nom}</span></td>
                  <td>{member.fonction}</td>
                  <td>{member.ordre}</td>
                  <td className={styles.tableActions}>
                    <button className={styles.actionButton} onClick={() => handleEdit(member)}>
                      Modifier
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      onClick={() => handleDelete(member.id, member.nom)}
                    >
                      Supprimer
                    </button>
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
