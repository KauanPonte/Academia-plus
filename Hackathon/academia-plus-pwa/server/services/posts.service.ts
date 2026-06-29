import type { CreateCommentDTO, CreatePostDTO } from '../dtos/post.dto.js'
import { AppError } from '../errors/app-error.js'
import { postsRepository } from '../repositories/posts.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { toAuthUser } from './users.service.js'

export const postsService = {
  list(viewerId: string, page = 1, size = 10) {
    const start = (page - 1) * size
    const posts = postsRepository.findAll()
    const data = posts.slice(start, start + size).map((post) => this.toResponse(post.id, viewerId))

    return {
      page,
      size,
      total: postsRepository.count(),
      hasNextPage: start + size < posts.length,
      data,
    }
  },

  create(authorId: string, data: CreatePostDTO) {
    const post = postsRepository.create({
      id: crypto.randomUUID(),
      authorId,
      content: data.content.trim(),
      image: data.image,
      type: data.type ?? 'post',
      createdAt: new Date().toISOString(),
    })

    return this.toResponse(post.id, authorId)
  },

  like(postId: string, userId: string) {
    this.ensurePost(postId)

    if (!postsRepository.findLike(postId, userId)) {
      postsRepository.like({
        id: crypto.randomUUID(),
        postId,
        userId,
        createdAt: new Date().toISOString(),
      })
    }

    return this.toResponse(postId, userId)
  },

  unlike(postId: string, userId: string) {
    this.ensurePost(postId)
    postsRepository.unlike(postId, userId)

    return this.toResponse(postId, userId)
  },

  comment(postId: string, authorId: string, data: CreateCommentDTO) {
    this.ensurePost(postId)

    postsRepository.comment({
      id: crypto.randomUUID(),
      postId,
      authorId,
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
    })

    return this.toResponse(postId, authorId)
  },

  ensurePost(postId: string) {
    const post = postsRepository.findById(postId)

    if (!post) {
      throw new AppError('Publicacao nao encontrada.', 404)
    }

    return post
  },

  toResponse(postId: string, viewerId: string) {
    const post = this.ensurePost(postId)
    const author = usersRepository.findById(post.authorId)

    if (!author) {
      throw new AppError('Autor da publicacao nao encontrado.', 404)
    }

    const comments = postsRepository.findComments(post.id).map((comment) => {
      const commentAuthor = usersRepository.findById(comment.authorId)

      return {
        ...comment,
        author: commentAuthor ? toAuthUser(commentAuthor) : toAuthUser(author),
      }
    })

    return {
      ...post,
      author: toAuthUser(author),
      likesCount: postsRepository.findLikes(post.id).length,
      commentsCount: comments.length,
      likedByMe: !!postsRepository.findLike(post.id, viewerId),
      comments,
    }
  },
}
