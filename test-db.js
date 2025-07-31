const { PrismaClient } = require('@prisma/client')

async function testDatabase() {
  const prisma = new PrismaClient()
  
  try {
    const count = await prisma.user.count()
    console.log('User count:', count)
    
    const users = await prisma.user.findMany({
      take: 2,
      select: {
        id: true,
        name: true,
        verification_status: true,
        is_active: true,
      }
    })
    console.log('Sample users:', users)
    
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
