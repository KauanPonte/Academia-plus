import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { validateData } from '../middlewares/validateData.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'

export const authRouter = Router()

authRouter.post('/login', validateData(loginSchema), login)
authRouter.post('/register', validateData(registerSchema), register)
