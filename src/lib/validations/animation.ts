import { z } from 'zod'

/**
 * Validation schemas for Animation API
 * Story 3.2: Build Animation CRUD API
 *
 * Covers:
 * - FR1: CRUD operations on animations
 * - FR21: Filter by school level (niveau)
 * - FR22: Filter by category
 * - FR27: Filter by tags
 */

// School level enum - maternelle to secondaire
const NIVEAUX = ['M1', 'M2/M3', 'P1-P2', 'P3-P4', 'P5-P6', 'S1-S3', 'S4-S6'] as const

/**
 * Schema for creating an animation
 * All required fields except relations
 */
export const animationCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  niveau: z.enum(NIVEAUX, 'Niveau scolaire invalide'),
  categorieId: z.string().cuid('ID de catégorie invalide'),
  published: z.boolean().default(false),
  // Relations (optional arrays of IDs)
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([])
})

export type AnimationCreateInput = z.infer<typeof animationCreateSchema>

/**
 * Schema for updating an animation
 * All fields optional for partial updates
 */
export const animationUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  niveau: z.enum(NIVEAUX).optional(),
  categorieId: z.string().cuid().optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour'
})

export type AnimationUpdateInput = z.infer<typeof animationUpdateSchema>

/**
 * Schema for querying animations (filters, pagination, sorting)
 * Supports FR21, FR22, FR27 filtering requirements
 */
export const animationQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),

  // Filters
  niveau: z.enum(NIVEAUX).optional(),
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(), // Comma-separated tag IDs
  published: z.coerce.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type AnimationQueryInput = z.infer<typeof animationQuerySchema>

/**
 * Export niveau enum for reuse
 */
export { NIVEAUX }
