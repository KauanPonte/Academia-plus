import type { NextFunction, Request, Response } from 'express'
import { idParamsSchema } from '../schemas/social.schema.js'
import { followsService } from '../services/follows.service.js'

export const followsController = {
  follow(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params } = idParamsSchema.parse({ params: req.params })

      res.status(200).json(followsService.follow(res.locals.user.sub, params.id))
    } catch (error) {
      next(error)
    }
  },

  unfollow(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params } = idParamsSchema.parse({ params: req.params })

      res.status(200).json(followsService.unfollow(res.locals.user.sub, params.id))
    } catch (error) {
      next(error)
    }
  },
}

