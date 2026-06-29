import type { Follow } from '../entities/follow.entity.js'
import { readDatabase, writeDatabase } from '../database/json-database.js'

export const followsRepository = {
  find(followerId: string, followingId: string): Follow | null {
    return (
      readDatabase().follows.find(
        (follow) => follow.followerId === followerId && follow.followingId === followingId,
      ) ?? null
    )
  },

  create(follow: Follow): Follow {
    const database = readDatabase()
    database.follows.push(follow)
    writeDatabase(database)

    return follow
  },

  delete(followerId: string, followingId: string): void {
    const database = readDatabase()
    database.follows = database.follows.filter(
      (follow) => follow.followerId !== followerId || follow.followingId !== followingId,
    )
    writeDatabase(database)
  },

  followersOf(userId: string): Follow[] {
    return readDatabase().follows.filter((follow) => follow.followingId === userId)
  },

  followingOf(userId: string): Follow[] {
    return readDatabase().follows.filter((follow) => follow.followerId === userId)
  },
}

