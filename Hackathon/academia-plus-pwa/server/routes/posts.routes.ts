import { Router } from 'express'
import { postsController } from '../controllers/posts.controller.js'
import { authMiddleware } from '../middlewares/authenticate.js'

export const postsRouter = Router()

postsRouter.use(authMiddleware)
postsRouter.get('/', postsController.list)
postsRouter.post('/', postsController.create)
postsRouter.post('/:id/like', postsController.like)
postsRouter.delete('/:id/like', postsController.unlike)
postsRouter.post('/:id/comments', postsController.comment)

