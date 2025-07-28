const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n')
    
    // Check users by category and role
    const talents = await prisma.user.findMany({
      where: { category: 'TALENT' },
      select: { id: true, name: true, user_role: true, category: true, primary_sport: true }
    })
    
    const sponsors = await prisma.user.findMany({
      where: { category: 'SPONSOR' },
      select: { id: true, name: true, user_role: true, category: true }
    })
    
    console.log('👥 TALENT USERS:')
    talents.forEach(user => {
      console.log(`  - ${user.name} (ID: ${user.id}, Role: ${user.user_role}, Sport: ${user.primary_sport})`)
    })
    
    console.log('\n🏢 SPONSOR USERS:')
    sponsors.forEach(user => {
      console.log(`  - ${user.name} (ID: ${user.id}, Role: ${user.user_role})`)
    })
    
    // Check sponsor relations
    const sponsorRelations = await prisma.sponsorRelation.findMany({
      include: {
        sponsor: { select: { name: true } },
        sponsored: { select: { name: true } }
      }
    })
    
    console.log('\n🤝 SPONSOR RELATIONSHIPS:')
    sponsorRelations.forEach(relation => {
      console.log(`  - ${relation.sponsor.name} → ${relation.sponsored.name} ($${relation.amount}, ${relation.tier})`)
    })
    
    // Check sponsor contributions
    const contributions = await prisma.sponsorContribution.findMany({
      include: {
        sponsor: { select: { name: true } },
        recipient: { select: { name: true } }
      }
    })
    
    console.log('\n💰 SPONSOR CONTRIBUTIONS:')
    contributions.forEach(contribution => {
      console.log(`  - ${contribution.sponsor.name} → ${contribution.recipient.name}: $${contribution.amount} (${contribution.status})`)
    })
    
    // Check sponsor table
    const sponsorCompanies = await prisma.sponsor.findMany({
      select: { id: true, name: true, company_name: true, industry: true, budget_range: true }
    })
    
    console.log('\n🏢 SPONSOR COMPANIES:')
    sponsorCompanies.forEach(sponsor => {
      console.log(`  - ${sponsor.company_name} (${sponsor.industry}, Budget: ${sponsor.budget_range})`)
    })
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
