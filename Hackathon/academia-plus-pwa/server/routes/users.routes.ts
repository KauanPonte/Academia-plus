import { Router } from 'express'
import { usersController } from '../controllers/users.controller.js'
import { authMiddleware } from '../middlewares/authenticate.js'

export const usersRouter = Router()

usersRouter.get('/me', authMiddleware, usersController.me)
usersRouter.put('/me', authMiddleware, usersController.updateMe)
usersRouter.get('/search', authMiddleware, usersController.search)
usersRouter.get('/:id', authMiddleware, usersController.profile)
