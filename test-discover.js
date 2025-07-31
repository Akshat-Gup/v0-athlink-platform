const fetch = require('node-fetch')

async function testDiscoverPage() {
  try {
    console.log('🔍 Testing discover page to verify sponsors are excluded...\n')
    
    const response = await fetch('http://localhost:3001/api/discover?activeTab=talents&searchMode=filter&searchQuery=&aiQuery=&selectedTalentType=&selectedFit=&selectedSport=&selectedLeague=&selectedExperience=&selectedRating=&selectedLocation=')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('📊 Discover Page Results:')
    console.log(`   • Top Talent: ${data.topTalentItems?.length || 0} items`)
    console.log(`   • Up & Coming: ${data.upAndComingItems?.length || 0} items`)
    console.log(`   • Brand Ambassadors: ${data.brandAmbassadorItems?.length || 0} items`)
    console.log(`   • Teams: ${data.teamItems?.length || 0} items`)
    console.log(`   • Events: ${data.eventItems?.length || 0} items`)
    
    // Check all items to verify no sponsors
    const allItems = [
      ...(data.topTalentItems || []),
      ...(data.upAndComingItems || []),
      ...(data.brandAmbassadorItems || []),
      ...(data.teamItems || []),
      ...(data.eventItems || [])
    ]
    
    console.log(`\n👥 Total Items in Discover: ${allItems.length}`)
    
    if (allItems.length > 0) {
      console.log('\n📋 Items found:')
      allItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.sport}) - Category: ${item.category}`)
      })
      
      // Check if any sponsors made it through
      const sponsorItems = allItems.filter(item => 
        item.name.toLowerCase().includes('corp') || 
        item.name.toLowerCase().includes('gear') || 
        item.name.toLowerCase().includes('boost') ||
        item.name.toLowerCase().includes('fitness') ||
        item.name.toLowerCase().includes('velocity') ||
        item.name.toLowerCase().includes('champion') ||
        item.name.toLowerCase().includes('tech')
      )
      
      if (sponsorItems.length === 0) {
        console.log('\n✅ SUCCESS: No sponsor companies found in discover page!')
        console.log('✅ Only talent users (athletes, teams, events) are visible.')
      } else {
        console.log('\n❌ ISSUE: Found potential sponsor items:')
        sponsorItems.forEach(item => {
          console.log(`   - ${item.name}`)
        })
      }
    } else {
      console.log('\n⚠️  No items found in discover page. This might indicate an issue.')
    }
    
  } catch (error) {
    console.error('❌ Error testing discover page:', error)
  }
}

testDiscoverPage()
