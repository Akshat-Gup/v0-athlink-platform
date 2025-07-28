const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...')
    
    // Delete in order to respect foreign key constraints
    await prisma.sponsorContribution.deleteMany({})
    await prisma.sponsorRelation.deleteMany({})
    await prisma.sponsorshipRequest.deleteMany({})
    await prisma.sponsor.deleteMany({})
    await prisma.favorite.deleteMany({})
    await prisma.userTag.deleteMany({})
    await prisma.tag.deleteMany({})
    await prisma.campaign.deleteMany({})
    await prisma.mediaItem.deleteMany({})
    await prisma.socialLink.deleteMany({})
    await prisma.eventProfile.deleteMany({})
    await prisma.teamProfile.deleteMany({})
    await prisma.talentProfile.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.talentType.deleteMany({})
    await prisma.location.deleteMany({})
    
    console.log('✅ Database cleared successfully!')
  } catch (error) {
    console.error('❌ Error clearing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()
