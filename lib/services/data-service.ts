// Data service functions to fetch from API instead of mock data

// Fetch team data from API
export async function getTeamData(id: string) {
  try {
    const response = await fetch(`/api/teams/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch team data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching team data:', error)
    // Fallback to mock data if API fails
    const { getTeamMockData } = await import('../mock-profile-data')
    return getTeamMockData(id)
  }
}

// Fetch talent data from API
export async function getTalentData(id: string) {
  try {
    const response = await fetch(`/api/talents/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch talent data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching talent data:', error)
    // Fallback to mock data if API fails
    const { getTalentMockData } = await import('../mock-profile-data')
    return getTalentMockData(id)
  }
}

// Server-side versions for SSR/SSG
export async function getTeamDataServer(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/teams/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch team data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching team data:', error)
    // Fallback to mock data if API fails
    const { getTeamMockData } = await import('../mock-profile-data')
    return getTeamMockData(id)
  }
}

export async function getTalentDataServer(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/talents/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch talent data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching talent data:', error)
    // Fallback to mock data if API fails
    const { getTalentMockData } = await import('../mock-profile-data')
    return getTalentMockData(id)
  }
}
