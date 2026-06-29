import type { Comment } from '../entities/comment.entity.js'
import type { Post } from '../entities/post.entity.js'
import type { AuthUserDTO } from './auth.dto.js'

export interface CreatePostDTO {
  content: string
  image?: string
  type?: Post['type']
}

export interface CreateCommentDTO {
  content: string
}

export interface PostResponseDTO extends Post {
  author: AuthUserDTO
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  comments: Array<Comment & { author: AuthUserDTO }>
}

