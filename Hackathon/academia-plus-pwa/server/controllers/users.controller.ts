import type { NextFunction, Request, Response } from 'express'
import { idParamsSchema, searchUsersSchema, updateProfileSchema } from '../schemas/social.schema.js'
import { usersService } from '../services/users.service.js'

export const usersController = {
  me(req: Request, res: Response, next: NextFunction): void {
    try {
      res.status(200).json(usersService.getMe(res.locals.user.sub))
    } catch (error) {
      next(error)
    }
  },

  updateMe(req: Request, res: Response, next: NextFunction): void {
    try {
      const { body } = updateProfileSchema.parse({ body: req.body })

      res.status(200).json(usersService.updateMe(res.locals.user.sub, body))
    } catch (error) {
      next(error)
    }
  },

  search(req: Request, res: Response, next: NextFunction): void {
    try {
      const { query } = searchUsersSchema.parse({ query: req.query })

      res.status(200).json(usersService.search(query.q, res.locals.user.sub))
    } catch (error) {
      next(error)
    }
  },

  profile(req: Request, res: Response, next: NextFunction): void {
    try {
      const { params } = idParamsSchema.parse({ params: req.params })

      res.status(200).json(usersService.getProfile(params.id, res.locals.user?.sub))
    } catch (error) {
      next(error)
    }
  },
}
