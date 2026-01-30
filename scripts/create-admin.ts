/**
 * Helper script to create a test admin for development
 * Usage: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcrypt'

// Create Prisma client with LibSQL adapter
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function createTestAdmin() {
  const email = 'admin@cie.test'
  const password = 'testpassword123'
  const SALT_ROUNDS = 10

  try {
    // Check if admin already exists
    const existing = await prisma.admin.findUnique({
      where: { email }
    })

    if (existing) {
      console.log('⚠️  Admin already exists:', email)
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash
      }
    })

    console.log('✅ Test admin created successfully!')
    console.log('   Email:', admin.email)
    console.log('   Password:', password)
    console.log('   ID:', admin.id)

  } catch (error) {
    console.error('❌ Error creating admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()
