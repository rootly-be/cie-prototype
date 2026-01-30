/**
 * Database connectivity test script
 * Run with: npx tsx scripts/test-db.ts
 */
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function testConnection() {
  console.log('🔌 Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)

  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test Admin table exists (without creating data)
    const adminCount = await prisma.admin.count()
    console.log('✅ Admin table accessible, count:', adminCount)

    // Test AuditLog table exists (without creating data)
    const auditCount = await prisma.auditLog.count()
    console.log('✅ AuditLog table accessible, count:', auditCount)

    await prisma.$disconnect()
    console.log('🎉 All database tests passed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database test failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testConnection()
