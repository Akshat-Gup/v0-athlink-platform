const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listSponsors() {
  try {
    console.log('🏢 Available Sponsor Accounts:\n')
    
    const sponsors = await prisma.user.findMany({
      where: { category: 'SPONSOR' },
      include: {
        base_location: { select: { city: true, state: true } }
      },
      orderBy: { name: 'asc' }
    })

    const sponsorCompanies = await prisma.sponsor.findMany({
      orderBy: { company_name: 'asc' }
    })

    sponsors.forEach((sponsor, index) => {
      const company = sponsorCompanies.find(c => c.email === sponsor.email)
      
      console.log(`${index + 1}. 🏢 ${sponsor.name}`)
      console.log(`   📧 Email: ${sponsor.email}`)
      console.log(`   🔒 Password: 12345678`)
      console.log(`   🏭 Industry: ${company?.industry || 'N/A'}`)
      console.log(`   💰 Budget: ${company?.budget_range || 'N/A'}`)
      console.log(`   📍 Location: ${sponsor.base_location?.city}, ${sponsor.base_location?.state}`)
      console.log(`   ⭐ Rating: ${sponsor.rating.toFixed(1)}`)
      console.log(`   🎯 Preferred Sports: ${company?.preferred_sports ? JSON.parse(company.preferred_sports).join(', ') : 'N/A'}`)
      console.log()
    })

    // Show sponsor relationships
    console.log('🤝 Active Sponsorship Relationships:\n')
    
    const relationships = await prisma.sponsorRelation.findMany({
      include: {
        sponsor: { select: { name: true } },
        sponsored: { select: { name: true, primary_sport: true } }
      },
      orderBy: { amount: 'desc' }
    })

    relationships.forEach((rel, index) => {
      console.log(`${index + 1}. ${rel.sponsor.name} → ${rel.sponsored.name}`)
      console.log(`   💰 Amount: $${rel.amount.toLocaleString()}`)
      console.log(`   🏆 Tier: ${rel.tier}`)
      console.log(`   🏃 Sport: ${rel.sponsored.primary_sport}`)
      console.log()
    })

    console.log(`📊 Summary:`)
    console.log(`   • Total Sponsors: ${sponsors.length}`)
    console.log(`   • Active Relationships: ${relationships.length}`)
    console.log(`   • Total Sponsorship Value: $${relationships.reduce((sum, rel) => sum + rel.amount, 0).toLocaleString()}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listSponsors()
