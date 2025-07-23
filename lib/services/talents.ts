// Database service functions for talents
import { prisma } from '@/lib/prisma'

export interface CreateTalentData {
  name: string
  sport: string
  location: string
  country: string
  team?: string
  goalFunding: number
  image?: string
  coverImage?: string
  achievements?: string
  bio?: string
  userId: string
}

export interface UpdateTalentData {
  name?: string
  sport?: string
  location?: string
  country?: string
  team?: string
  currentFunding?: number
  goalFunding?: number
  image?: string
  coverImage?: string
  achievements?: string
  bio?: string
  rating?: number
}

export async function createTalent(data: CreateTalentData) {
  return prisma.talent.create({
    data,
    include: {
      sponsors: true,
      stats: true,
      competitions: true,
    }
  })
}

export async function getTalentById(id: string) {
  return prisma.talent.findUnique({
    where: { id },
    include: {
      sponsors: true,
      stats: true,
      competitions: true,
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

export async function updateTalent(id: string, data: UpdateTalentData) {
  return prisma.talent.update({
    where: { id },
    data,
    include: {
      sponsors: true,
      stats: true,
      competitions: true,
    }
  })
}

export async function deleteTalent(id: string) {
  return prisma.talent.delete({
    where: { id }
  })
}

export async function getTalentsByUser(userId: string) {
  return prisma.talent.findMany({
    where: { userId },
    include: {
      sponsors: true,
      stats: true,
    }
  })
}

export async function searchTalents(query: {
  sport?: string
  location?: string
  minRating?: number
  maxFunding?: number
}) {
  const where: any = {}
  
  if (query.sport) {
    where.sport = {
      contains: query.sport,
      mode: 'insensitive'
    }
  }
  
  if (query.location) {
    where.location = {
      contains: query.location,
      mode: 'insensitive'
    }
  }
  
  if (query.minRating) {
    where.rating = {
      gte: query.minRating
    }
  }
  
  if (query.maxFunding) {
    where.goalFunding = {
      lte: query.maxFunding
    }
  }

  return prisma.talent.findMany({
    where,
    include: {
      sponsors: true,
      stats: true,
    },
    orderBy: {
      rating: 'desc'
    }
  })
}
