import { z } from 'zod'

/**
 * Validation schemas for Stage API
 * Story 3.4: Build Stage CRUD API
 *
 * Covers:
 * - FR3: CRUD operations on stages
 * - FR13: isFull flag for manual capacity management
 * - FR24: Age group filtering
 * - FR25: Period/season filtering
 * - FR22: Filter by category
 * - FR27: Filter by tags
 */

// Periode enum - holiday seasons
const PERIODES = ['Pâques', 'Été', 'Toussaint', 'Carnaval'] as const

/**
 * Schema for creating a stage
 * All required fields except optional relations and Billetweb fields
 */
export const stageCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  ageMin: z.number().int().min(0, 'ageMin doit être >= 0').max(18, 'ageMin doit être <= 18'),
  ageMax: z.number().int().min(0, 'ageMax doit être >= 0').max(18, 'ageMax doit être <= 18'),
  periode: z.enum(PERIODES, 'Période invalide'),
  dateDebut: z.coerce.date('Date de début invalide'),
  dateFin: z.coerce.date('Date de fin invalide'),
  prix: z.string().min(1, 'Le prix est requis'),
  billetwebUrl: z.string().url('URL Billetweb invalide').optional(),
  billetwebId: z.string().optional(),
  placesTotal: z.number().int().positive('placesTotal doit être > 0').optional(),
  placesLeft: z.number().int().min(0, 'placesLeft doit être >= 0').optional(),
  isFull: z.boolean().default(false),
  published: z.boolean().default(false),
  categorieId: z.string().cuid('ID de catégorie invalide').optional(),
  // Relations (optional arrays of IDs)
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([])
})
  .refine(data => data.ageMax >= data.ageMin, {
    message: 'ageMax doit être supérieur ou égal à ageMin',
    path: ['ageMax']
  })
  .refine(data => data.dateFin >= data.dateDebut, {
    message: 'dateFin doit être postérieure à dateDebut',
    path: ['dateFin']
  })
  .refine(data => {
    if (data.placesLeft !== undefined && data.placesTotal !== undefined) {
      return data.placesLeft <= data.placesTotal
    }
    return true
  }, {
    message: 'placesLeft ne peut pas dépasser placesTotal',
    path: ['placesLeft']
  })

export type StageCreateInput = z.infer<typeof stageCreateSchema>

/**
 * Schema for updating a stage
 * All fields optional for partial updates
 */
export const stageUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  ageMin: z.number().int().min(0).max(18).optional(),
  ageMax: z.number().int().min(0).max(18).optional(),
  periode: z.enum(PERIODES).optional(),
  dateDebut: z.coerce.date().optional(),
  dateFin: z.coerce.date().optional(),
  prix: z.string().min(1).optional(),
  billetwebUrl: z.string().url().optional(),
  billetwebId: z.string().optional(),
  placesTotal: z.number().int().positive().optional(),
  placesLeft: z.number().int().min(0).optional(),
  isFull: z.boolean().optional(),
  published: z.boolean().optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional()
})
  .refine(data => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour'
  })
  .refine(data => {
    if (data.ageMin !== undefined && data.ageMax !== undefined) {
      return data.ageMax >= data.ageMin
    }
    return true
  }, {
    message: 'ageMax doit être supérieur ou égal à ageMin',
    path: ['ageMax']
  })
  .refine(data => {
    if (data.dateDebut !== undefined && data.dateFin !== undefined) {
      return data.dateFin >= data.dateDebut
    }
    return true
  }, {
    message: 'dateFin doit être postérieure à dateDebut',
    path: ['dateFin']
  })
  .refine(data => {
    if (data.placesLeft !== undefined && data.placesTotal !== undefined) {
      return data.placesLeft <= data.placesTotal
    }
    return true
  }, {
    message: 'placesLeft ne peut pas dépasser placesTotal',
    path: ['placesLeft']
  })

export type StageUpdateInput = z.infer<typeof stageUpdateSchema>

/**
 * Schema for querying stages (filters, pagination, sorting)
 * Supports FR24 (age), FR25 (periode), FR22 (category), FR27 (tags) filtering
 */
export const stageQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),

  // Filters
  periode: z.enum(PERIODES).optional(),
  ageMin: z.coerce.number().int().min(0).max(18).optional(),
  ageMax: z.coerce.number().int().min(0).max(18).optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(), // Comma-separated tag IDs
  published: z.coerce.boolean().optional(),
  isFull: z.coerce.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre', 'dateDebut']).default('dateDebut'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export type StageQueryInput = z.infer<typeof stageQuerySchema>

/**
 * Export periode enum for reuse
 */
export { PERIODES }
