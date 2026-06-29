import { Router } from 'express'
import { followsController } from '../controllers/follows.controller.js'
import { authMiddleware } from '../middlewares/authenticate.js'

export const followsRouter = Router()

followsRouter.use(authMiddleware)
followsRouter.post('/:id', followsController.follow)
followsRouter.delete('/:id', followsController.unfollow)

