import type { Comment } from '../entities/comment.entity.js'
import type { Like } from '../entities/like.entity.js'
import type { Post } from '../entities/post.entity.js'
import { readDatabase, writeDatabase } from '../database/json-database.js'

export const postsRepository = {
  findAll(): Post[] {
    return readDatabase().posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  count(): number {
    return readDatabase().posts.length
  },

  findById(id: string): Post | null {
    return readDatabase().posts.find((post) => post.id === id) ?? null
  },

  create(post: Post): Post {
    const database = readDatabase()
    database.posts.unshift(post)
    writeDatabase(database)

    return post
  },

  findLikes(postId: string): Like[] {
    return readDatabase().likes.filter((like) => like.postId === postId)
  },

  findComments(postId: string): Comment[] {
    return readDatabase().comments.filter((comment) => comment.postId === postId)
  },

  findLike(postId: string, userId: string): Like | null {
    return readDatabase().likes.find((like) => like.postId === postId && like.userId === userId) ?? null
  },

  like(like: Like): Like {
    const database = readDatabase()
    database.likes.push(like)
    writeDatabase(database)

    return like
  },

  unlike(postId: string, userId: string): void {
    const database = readDatabase()
    database.likes = database.likes.filter((like) => like.postId !== postId || like.userId !== userId)
    writeDatabase(database)
  },

  comment(comment: Comment): Comment {
    const database = readDatabase()
    database.comments.push(comment)
    writeDatabase(database)

    return comment
  },
}
