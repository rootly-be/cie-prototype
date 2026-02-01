import { z } from 'zod'

/**
 * Validation schemas for AgendaEvent API
 * Story 6.1: Build Agenda Event CRUD API
 *
 * Covers:
 * - FR4: Admin can CRUD manual Agenda events
 * - FR16: Admin can create standalone Agenda events
 * - FR8: Events can have tags with colors
 */

// Source types for agenda events
const SOURCE_TYPES = ['manual', 'formation', 'stage'] as const

/**
 * Schema for creating an agenda event
 */
export const agendaEventCreateSchema = z.object({
  titre: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  date: z.coerce.date({ message: 'La date est requise' }),
  dateFin: z.coerce.date().optional(),
  lieu: z.string().max(200, 'Le lieu ne peut pas dépasser 200 caractères').optional(),
  sourceType: z.enum(SOURCE_TYPES).default('manual'),
  sourceId: z.string().cuid().optional(),
  published: z.boolean().default(false),
  // Relations
  tagIds: z.array(z.string().cuid()).optional().default([])
})
  .refine(data => {
    if (data.dateFin && data.date) {
      return data.dateFin >= data.date
    }
    return true
  }, {
    message: 'dateFin doit être postérieure ou égale à date',
    path: ['dateFin']
  })
  .refine(data => {
    // If sourceType is not manual, sourceId is required
    if (data.sourceType !== 'manual' && !data.sourceId) {
      return false
    }
    return true
  }, {
    message: 'sourceId est requis pour les événements liés',
    path: ['sourceId']
  })

export type AgendaEventCreateInput = z.infer<typeof agendaEventCreateSchema>

/**
 * Schema for updating an agenda event
 */
export const agendaEventUpdateSchema = z.object({
  titre: z.string().min(3).max(200).optional(),
  date: z.coerce.date().optional(),
  dateFin: z.coerce.date().optional(),
  lieu: z.string().max(200).optional(),
  published: z.boolean().optional(),
  tagIds: z.array(z.string().cuid()).optional()
})
  .refine(data => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour'
  })
  .refine(data => {
    // Validate dateFin >= date when both are provided in update
    if (data.dateFin && data.date) {
      return data.dateFin >= data.date
    }
    return true
  }, {
    message: 'dateFin doit être postérieure ou égale à date',
    path: ['dateFin']
  })

export type AgendaEventUpdateInput = z.infer<typeof agendaEventUpdateSchema>

/**
 * Schema for querying agenda events
 */
export const agendaEventQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),

  // Filters
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2020).max(2100).optional(),
  tagIds: z.string().optional(), // Comma-separated
  sourceType: z.enum(SOURCE_TYPES).optional(),
  published: z.coerce.boolean().optional(),

  // Date range
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),

  // Sorting
  sortBy: z.enum(['date', 'createdAt', 'titre']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export type AgendaEventQueryInput = z.infer<typeof agendaEventQuerySchema>

export { SOURCE_TYPES }
