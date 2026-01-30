import { z } from 'zod'

/**
 * Validation schemas for Formation API
 * Story 3.3: Build Formation CRUD API
 *
 * Covers:
 * - FR2: CRUD operations on formations
 * - FR13: isFull flag for manual capacity management
 * - FR14: dates for agenda auto-generation
 * - FR22: Filter by category
 * - FR27: Filter by tags
 */

/**
 * Schema for creating a formation
 * All required fields except relations
 */
export const formationCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  categorieId: z.string().cuid('ID de catégorie invalide'),
  isFull: z.boolean().default(false),
  published: z.boolean().default(false),
  // Relations (optional arrays of IDs)
  tagIds: z.array(z.string().cuid()).optional().default([]),
  imageIds: z.array(z.string().cuid()).optional().default([]),
  dateIds: z.array(z.string().cuid()).optional().default([])
})

export type FormationCreateInput = z.infer<typeof formationCreateSchema>

/**
 * Schema for updating a formation
 * All fields optional for partial updates
 */
export const formationUpdateSchema = z.object({
  titre: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(5000).optional(),
  categorieId: z.string().cuid().optional(),
  isFull: z.boolean().optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  imageIds: z.array(z.string().cuid()).optional(),
  dateIds: z.array(z.string().cuid()).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour'
})

export type FormationUpdateInput = z.infer<typeof formationUpdateSchema>

/**
 * Schema for querying formations (filters, pagination, sorting)
 * Supports FR22, FR27 filtering requirements
 */
export const formationQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),

  // Filters
  categorieId: z.string().cuid().optional(),
  tagIds: z.string().optional(), // Comma-separated tag IDs
  published: z.coerce.boolean().optional(),
  isFull: z.coerce.boolean().optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'updatedAt', 'titre']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type FormationQueryInput = z.infer<typeof formationQuerySchema>
