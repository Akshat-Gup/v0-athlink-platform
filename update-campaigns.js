const { PrismaClient } = require('@prisma/client');

async function updateCampaigns() {
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.campaign.updateMany({
      where: { status: 'ACTIVE' },
      data: { status: 'OPEN' }
    });
    
    console.log(`Updated ${result.count} campaigns from ACTIVE to OPEN status`);
    
    // Verify the change
    const campaigns = await prisma.campaign.findMany({
      include: {
        athlete: { select: { name: true } }
      }
    });
    
    console.log('Current campaigns:');
    campaigns.forEach(c => {
      console.log(`- ID: ${c.id}, Title: ${c.title}, Status: ${c.status}, Athlete: ${c.athlete.name}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCampaigns();
