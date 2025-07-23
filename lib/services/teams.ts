// Database service functions for teams
import { prisma } from '@/lib/prisma'

export interface CreateTeamData {
  name: string
  sport: string
  location: string
  country: string
  league?: string
  goalFunding: number
  image?: string
  coverImage?: string
  achievements?: string
  bio?: string
  userId: string
}

export interface UpdateTeamData {
  name?: string
  sport?: string
  location?: string
  country?: string
  league?: string
  currentFunding?: number
  goalFunding?: number
  image?: string
  coverImage?: string
  achievements?: string
  bio?: string
  rating?: number
}

export async function createTeam(data: CreateTeamData) {
  return prisma.team.create({
    data,
    include: {
      players: true,
      sponsors: true,
      games: true,
    }
  })
}

export async function getTeamById(id: string) {
  return prisma.team.findUnique({
    where: { id },
    include: {
      players: true,
      sponsors: true,
      games: {
        orderBy: {
          date: 'asc'
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          avatar: true,
        }
      }
    }
  })
}

export async function updateTeam(id: string, data: UpdateTeamData) {
  return prisma.team.update({
    where: { id },
    data,
    include: {
      players: true,
      sponsors: true,
      games: true,
    }
  })
}

export async function deleteTeam(id: string) {
  return prisma.team.delete({
    where: { id }
  })
}

export async function addPlayerToTeam(teamId: string, playerData: {
  name: string
  position: string
  number: number
  image?: string
  ppg?: number
  apg?: number
  rpg?: number
}) {
  return prisma.player.create({
    data: {
      ...playerData,
      teamId
    }
  })
}

export async function addGameToTeam(teamId: string, gameData: {
  opponent: string
  date: Date
  location: string
  time: string
  result?: string
  image?: string
}) {
  return prisma.game.create({
    data: {
      ...gameData,
      teamId
    }
  })
}

export async function getUpcomingGames(teamId: string) {
  return prisma.game.findMany({
    where: {
      teamId,
      result: null, // Upcoming games have no result
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
}

export async function getRecentResults(teamId: string, limit: number = 10) {
  return prisma.game.findMany({
    where: {
      teamId,
      result: {
        not: null
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: limit
  })
}
