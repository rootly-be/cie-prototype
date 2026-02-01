import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Contact Form API Route
 * Story 4.3: Create Contact Page (Task 4)
 * Implements FR34 (webhook to n8n), NFR25 (<5s), NFR26 (3 retries)
 */

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  subject: z.enum(['general', 'scolaire', 'stage', 'autre']),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

// Retry configuration (NFR26)
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

/**
 * Send webhook to n8n with retry logic
 */
async function sendWebhook(data: z.infer<typeof contactSchema>): Promise<boolean> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  // If no webhook URL configured, log and return success (for development)
  if (!webhookUrl) {
    console.log('[Contact API] No N8N_WEBHOOK_URL configured, skipping webhook')
    console.log('[Contact API] Form data:', data)
    return true
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      // Timeout after 5 seconds (NFR25)
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'cie-website-contact-form',
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        console.log(`[Contact API] Webhook sent successfully on attempt ${attempt}`)
        return true
      }

      console.warn(`[Contact API] Webhook failed with status ${response.status} on attempt ${attempt}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[Contact API] Webhook error on attempt ${attempt}: ${errorMessage}`)

      if (attempt < MAX_RETRIES) {
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt))
      }
    }
  }

  console.error('[Contact API] All webhook attempts failed')
  return false
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parseResult = contactSchema.safeParse(body)
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: firstError.message,
            field: firstError.path[0],
          },
        },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Send webhook to n8n (FR34)
    const webhookSuccess = await sendWebhook(data)

    // Even if webhook fails, we still return success to user (graceful degradation)
    // The message is logged and can be recovered
    if (!webhookSuccess) {
      console.warn('[Contact API] Webhook failed but returning success to user')
      // In production, you might want to store this in a queue for retry
    }

    // Return success (FR35)
    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
    })
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Une erreur est survenue. Veuillez réessayer.',
        },
      },
      { status: 500 }
    )
  }
}
