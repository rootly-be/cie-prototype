import { z } from 'zod'

/**
 * Login request validation schema
 * H1 fix: Strengthened password validation (min 8 chars)
 */
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

/**
 * TypeScript type for login input
 */
export type LoginInput = z.infer<typeof loginSchema>
