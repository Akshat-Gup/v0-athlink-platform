import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreSponsors() {
  console.log('🏢 Adding additional sponsor accounts...')

  // Get locations for the sponsors
  const locations = await prisma.location.findMany()
  const losAngeles = locations.find(loc => loc.city === 'Los Angeles')
  const chicago = locations.find(loc => loc.city === 'Chicago')
  const austin = locations.find(loc => loc.city === 'Austin')
  const denver = locations.find(loc => loc.city === 'Denver')

  if (!losAngeles || !chicago || !austin || !denver) {
    console.error('❌ Required locations not found')
    return
  }

  // Create additional sponsor users and companies
  const newSponsors = [
    {
      name: 'FitnessPro Gear',
      email: 'sponsors@fitnesspro.com',
      companyName: 'FitnessPro Gear',
      companyDescription: 'Premium fitness equipment and sportswear company supporting athletes worldwide with cutting-edge gear and training solutions.',
      industry: 'Fitness Equipment',
      website: 'https://fitnesspro.com',
      contactName: 'Jennifer Smith',
      contactPhone: '+1 (555) 234-5678',
      budgetRange: '$3K-$20K',
      preferredSports: ['Gymnastics', 'Track & Field', 'Swimming'],
      location: 'Los Angeles, CA',
      baseLocationId: losAngeles.id,
      teamEmoji: '💪',
    },
    {
      name: 'Velocity Sports Nutrition',
      email: 'partnerships@velocitysports.com',
      companyName: 'Velocity Sports Nutrition',
      companyDescription: 'Leading sports nutrition company providing supplements and dietary support for professional and amateur athletes.',
      industry: 'Sports Nutrition',
      website: 'https://velocitysports.com',
      contactName: 'Dr. Robert Chen',
      contactPhone: '+1 (555) 345-6789',
      budgetRange: '$1K-$10K',
      preferredSports: ['Basketball', 'Soccer', 'Tennis'],
      location: 'Chicago, IL',
      baseLocationId: chicago.id,
      teamEmoji: '🥤',
    },
    {
      name: 'Champion Financial Services',
      email: 'athlete.support@championfs.com',
      companyName: 'Champion Financial Services',
      companyDescription: 'Financial planning and investment services specifically designed for athletes and sports professionals.',
      industry: 'Financial Services',
      website: 'https://championfs.com',
      contactName: 'Amanda Rodriguez',
      contactPhone: '+1 (555) 456-7890',
      budgetRange: '$5K-$30K',
      preferredSports: ['Tennis', 'Swimming', 'Track & Field', 'Gymnastics'],
      location: 'Austin, TX',
      baseLocationId: austin.id,
      teamEmoji: '💰',
    },
    {
      name: 'SportsTech Innovation',
      email: 'sponsorships@sportstech.io',
      companyName: 'SportsTech Innovation',
      companyDescription: 'Technology company developing innovative sports analytics, training apps, and performance tracking solutions for athletes.',
      industry: 'Sports Technology',
      website: 'https://sportstech.io',
      contactName: 'David Park',
      contactPhone: '+1 (555) 567-8901',
      budgetRange: '$2K-$15K',
      preferredSports: ['Basketball', 'Soccer', 'Tennis', 'Track & Field'],
      location: 'Denver, CO',
      baseLocationId: denver.id,
      teamEmoji: '📱',
    }
  ]

  for (const sponsorData of newSponsors) {
    try {
      // Create sponsor user in User table
      const sponsorUser = await prisma.user.create({
        data: {
          name: sponsorData.name,
          email: sponsorData.email,
          primary_sport: 'Multi-Sport',
          base_location_id: sponsorData.baseLocationId,
          country_code: 'US',
          country_flag: '🇺🇸',
          team_emoji: sponsorData.teamEmoji,
          rating: 4.7 + Math.random() * 0.3, // Random rating between 4.7-5.0
          bio: sponsorData.companyDescription,
          category: 'SPONSOR',
          user_role: 'sponsor',
          verification_status: 'VERIFIED',
          years_experience: Math.floor(Math.random() * 8) + 3, // 3-10 years
        },
      })

      // Create sponsor entry in Sponsor table
      const sponsor = await prisma.sponsor.create({
        data: {
          name: sponsorData.name,
          email: sponsorData.email,
          company_name: sponsorData.companyName,
          company_description: sponsorData.companyDescription,
          industry: sponsorData.industry,
          website: sponsorData.website,
          contact_name: sponsorData.contactName,
          contact_phone: sponsorData.contactPhone,
          budget_range: sponsorData.budgetRange,
          preferred_sports: JSON.stringify(sponsorData.preferredSports),
          location: sponsorData.location,
          verification_status: 'VERIFIED',
          is_active: true,
        }
      })

      console.log(`✅ Created sponsor: ${sponsor.company_name} (User ID: ${sponsorUser.id})`)
    } catch (error) {
      console.error(`❌ Error creating sponsor ${sponsorData.name}:`, error)
    }
  }

  // Create some sample sponsorship relationships for the new sponsors
  const users = await prisma.user.findMany({
    where: { category: 'TALENT' },
    select: { id: true, name: true }
  })

  const newSponsorUsers = await prisma.user.findMany({
    where: { 
      category: 'SPONSOR',
      email: { in: newSponsors.map(s => s.email) }
    },
    select: { id: true, name: true }
  })

  // Create some sample relationships
  if (users.length > 0 && newSponsorUsers.length > 0) {
    const sampleRelationships = [
      {
        sponsor: newSponsorUsers.find(s => s.name === 'FitnessPro Gear'),
        talent: users.find(u => u.name === 'Sofia Martinez'), // Gymnastics
        amount: 1500,
        tier: 'Equipment Sponsor'
      },
      {
        sponsor: newSponsorUsers.find(s => s.name === 'Velocity Sports Nutrition'),
        talent: users.find(u => u.name === 'Marcus Johnson'), // Basketball
        amount: 1200,
        tier: 'Nutrition Partner'
      },
      {
        sponsor: newSponsorUsers.find(s => s.name === 'Champion Financial Services'),
        talent: users.find(u => u.name === 'Sarah Chen'), // Tennis
        amount: 3000,
        tier: 'Financial Advisor'
      }
    ]

    for (const relationship of sampleRelationships) {
      if (relationship.sponsor && relationship.talent) {
        try {
          await prisma.sponsorRelation.create({
            data: {
              sponsor_id: relationship.sponsor.id,
              sponsored_id: relationship.talent.id,
              amount: relationship.amount,
              tier: relationship.tier,
              status: 'ACTIVE',
            },
          })

          await prisma.sponsorContribution.create({
            data: {
              sponsor_id: relationship.sponsor.id,
              recipient_id: relationship.talent.id,
              amount: relationship.amount,
              currency: 'USD',
              message: `Welcome to our sponsorship program! We're excited to support your athletic journey.`,
              status: 'COMPLETED',
            },
          })

          console.log(`✅ Created relationship: ${relationship.sponsor.name} → ${relationship.talent.name}`)
        } catch (error) {
          console.error(`❌ Error creating relationship:`, error)
        }
      }
    }
  }

  console.log('✅ Additional sponsors added successfully!')
}

addMoreSponsors()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
