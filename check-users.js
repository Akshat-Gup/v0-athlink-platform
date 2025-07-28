const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        user_role: true
      },
      orderBy: { id: 'asc' }
    });
    
    console.log('All users:');
    users.forEach(u => {
      console.log(`ID ${u.id}: ${u.name} (${u.category}, role: ${u.user_role})`);
    });
    
    const talents = users.filter(u => u.category === 'TALENT');
    const sponsors = users.filter(u => u.category === 'SPONSOR');
    
    console.log(`\nSummary: ${talents.length} talents, ${sponsors.length} sponsors`);
    console.log('Talent IDs:', talents.map(t => t.id).join(', '));
    console.log('Sponsor IDs:', sponsors.map(s => s.id).join(', '));
    
    // Check which users appear in discover API response
    console.log('\nDiscover API should show talent IDs: 10, 11, 15, 16, 17');
    console.log('Actual talent IDs from DB:', talents.map(t => t.id).join(', '));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
