import { z } from 'zod'

export const idParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
})

export const searchUsersSchema = z.object({
  query: z.object({
    q: z.string().trim().min(1).default(''),
  }),
})

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).optional(),
    course: z.string().trim().optional(),
    institution: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    avatar: z.url().optional(),
    theme: z.enum(['light', 'dark']).optional(),
  }),
})

export const postsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    size: z.coerce.number().int().positive().max(50).default(10),
  }),
})

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Publicacao precisa ter texto.'),
    image: z.url().optional(),
    type: z.enum(['post', 'sale', 'question', 'event', 'mentoring']).default('post'),
  }),
})

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    content: z.string().trim().min(1, 'Comentario precisa ter texto.'),
  }),
})

