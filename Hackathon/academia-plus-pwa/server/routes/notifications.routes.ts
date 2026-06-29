import { Router } from 'express'
import { notificationsController } from '../controllers/notifications.controller.js'
import { authMiddleware } from '../middlewares/authenticate.js'

export const notificationsRouter = Router()

notificationsRouter.get('/', authMiddleware, notificationsController.list)

