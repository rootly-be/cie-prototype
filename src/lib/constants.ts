/**
 * Application constants
 * M1 fix: Centralize magic strings
 */

export const AUDIT_ACTIONS = {
  ADMIN_LOGIN: 'admin.login',
  ADMIN_LOGOUT: 'admin.logout',
  ANIMATION_CREATED: 'animation.created',
  ANIMATION_UPDATED: 'animation.updated',
  ANIMATION_DELETED: 'animation.deleted',
  FORMATION_CREATED: 'formation.created',
  FORMATION_UPDATED: 'formation.updated',
  FORMATION_DELETED: 'formation.deleted',
  STAGE_CREATED: 'stage.created',
  STAGE_UPDATED: 'stage.updated',
  STAGE_DELETED: 'stage.deleted',
  AGENDA_EVENT_CREATED: 'agenda_event.created',
  AGENDA_EVENT_UPDATED: 'agenda_event.updated',
  AGENDA_EVENT_DELETED: 'agenda_event.deleted',
  BILLETWEB_SYNC_STARTED: 'billetweb.sync_started',
  BILLETWEB_SYNC_COMPLETED: 'billetweb.sync_completed',
  BILLETWEB_SYNC_FAILED: 'billetweb.sync_failed',
} as const

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const

export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth-token',
} as const
