import type { NextFunction, Request, Response } from 'express'
import {
  createCommentSchema,
  createPostSchema,
  idParamsSchema,
  postsQuerySchema,
} from '../schemas/social.schema.js'
import { postsService } from '../services/posts.service.js'

export const postsController = {
  list(req: Request, res: Response, next: NextFunction): void {
    try {
      const { query } = postsQuerySchema.parse({ query: req.query })

      res.status(200).json(postsService.list(res.locals.user.sub, query.page, query.size))
    } catch (error) {
      next(error)
    }
  },

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const { body } = createPostSchema.parse({ body: req.body })

      res.status(201).json(postsService.create(res.locals.user.sub, body))
    } catch (error) {
      next(error)
    }
  },

  like(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params } = idParamsSchema.parse({ params: req.params })

      res.status(200).json(postsService.like(params.id, res.locals.user.sub))
    } catch (error) {
      next(error)
    }
  },

  unlike(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params } = idParamsSchema.parse({ params: req.params })

      res.status(200).json(postsService.unlike(params.id, res.locals.user.sub))
    } catch (error) {
      next(error)
    }
  },

  comment(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params, body } = createCommentSchema.parse({ params: req.params, body: req.body })

      res.status(201).json(postsService.comment(params.id, res.locals.user.sub, body))
    } catch (error) {
      next(error)
    }
  },
}
