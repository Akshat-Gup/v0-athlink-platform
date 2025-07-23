// API service for connecting Next.js frontend to Django backend
// lib/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

class ApiService {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  // Talent endpoints
  async getTalents(params?: {
    sport?: string
    location?: string
    search?: string
    page?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString())
      })
    }
    
    return this.request(`/talents/?${searchParams.toString()}`)
  }

  async getTalentById(id: string) {
    return this.request(`/talents/${id}/`)
  }

  async createTalent(data: any) {
    return this.request('/talents/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTalent(id: string, data: any) {
    return this.request(`/talents/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Team endpoints
  async getTeams(params?: {
    sport?: string
    location?: string
    search?: string
    page?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString())
      })
    }
    
    return this.request(`/teams/?${searchParams.toString()}`)
  }

  async getTeamById(id: string) {
    return this.request(`/teams/${id}/`)
  }

  async getTeamPlayers(id: string) {
    return this.request(`/teams/${id}/players/`)
  }

  async getUpcomingGames(id: string) {
    return this.request(`/teams/${id}/upcoming_games/`)
  }

  async getRecentResults(id: string) {
    return this.request(`/teams/${id}/recent_results/`)
  }

  // Event endpoints
  async getEvents(params?: {
    location?: string
    status?: string
    search?: string
    page?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString())
      })
    }
    
    return this.request(`/events/?${searchParams.toString()}`)
  }

  async getEventById(id: string) {
    return this.request(`/events/${id}/`)
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming/')
  }

  async getLiveEvents() {
    return this.request('/events/live/')
  }

  // Global search
  async globalSearch(query: string, type?: string) {
    const searchParams = new URLSearchParams({ q: query })
    if (type) searchParams.append('type', type)
    
    return this.request(`/search/?${searchParams.toString()}`)
  }
}

export const apiService = new ApiService(API_BASE_URL)

// React hooks for API calls
import { useState, useEffect } from 'react'

export function useTeamData(id: string) {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTeam() {
      try {
        setLoading(true)
        const teamData = await apiService.getTeamById(id)
        setTeam(teamData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTeam()
    }
  }, [id])

  return { team, loading, error }
}

export function useTalentData(id: string) {
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTalent() {
      try {
        setLoading(true)
        const talentData = await apiService.getTalentById(id)
        setTalent(talentData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTalent()
    }
  }, [id])

  return { talent, loading, error }
}

export function useEventData(id: string) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        const eventData = await apiService.getEventById(id)
        setEvent(eventData)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  return { event, loading, error }
}
