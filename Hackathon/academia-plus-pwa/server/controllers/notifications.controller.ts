import type { NextFunction, Request, Response } from 'express'
import { notificationsService } from '../services/notifications.service.js'

export const notificationsController = {
  list(_req: Request, res: Response, next: NextFunction): void {
    try {
      res.status(200).json(notificationsService.list(res.locals.user.sub))
    } catch (error) {
      next(error)
    }
  },
}

