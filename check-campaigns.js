const { PrismaClient } = require('@prisma/client');

async function checkCampaigns() {
  const prisma = new PrismaClient();
  
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        athlete: { select: { name: true } }
      }
    });
    
    console.log('Total campaigns:', campaigns.length);
    
    if (campaigns.length === 0) {
      console.log('No campaigns found! Creating a test campaign...');
      
      // Find a talent user to create a campaign for
      const athlete = await prisma.user.findFirst({
        where: { role: 'talent' }
      });
      
      if (athlete) {
        const campaign = await prisma.campaign.create({
          data: {
            athlete_id: athlete.id,
            title: 'Support My Athletic Journey',
            description: 'Help me reach my competitive goals with your sponsorship!',
            funding_goal: 25000,
            current_funding: 0,
            status: 'OPEN',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
          }
        });
        
        // Create some perk tiers
        await prisma.perkTier.createMany({
          data: [
            {
              campaign_id: campaign.id,
              tier_name: 'Bronze Supporter',
              amount: 500,
              description: 'Social media shoutout and thank you message',
              deliverables: JSON.stringify(['Social media mention', 'Thank you email']),
              max_sponsors: 50,
              current_sponsors: 0
            },
            {
              campaign_id: campaign.id,
              tier_name: 'Silver Sponsor',
              amount: 1500,
              description: 'Logo on training gear and social media',
              deliverables: JSON.stringify(['Logo placement', 'Social media posts', 'Training updates']),
              max_sponsors: 20,
              current_sponsors: 0
            },
            {
              campaign_id: campaign.id,
              tier_name: 'Gold Sponsor',
              amount: 5000,
              description: 'Premium sponsorship package with exclusive perks',
              deliverables: JSON.stringify(['Logo on competition gear', 'VIP updates', 'Meet and greet']),
              max_sponsors: 5,
              current_sponsors: 0
            }
          ]
        });
        
        console.log(`Created campaign: ${campaign.title} for ${athlete.name}`);
      }
    } else {
      console.log('Existing campaigns:');
      campaigns.forEach(c => {
        console.log(`- ID: ${c.id}, Title: ${c.title}, Status: ${c.status}, Athlete: ${c.athlete.name}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCampaigns();
