import type { Request, Response } from 'express'
import type { LoginDTO, RegisterDTO } from '../dtos/auth.dto.js'
import { authService } from '../services/auth.service.js'

export function login(req: Request<unknown, unknown, LoginDTO>, res: Response): void {
  const result = authService.login(req.body)

  if (!result.ok) {
    res.status(result.status).json({ message: result.message })
    return
  }

  res.status(200).json(result.data)
}

export function register(req: Request<unknown, unknown, RegisterDTO>, res: Response): void {
  const result = authService.register(req.body)

  if (!result.ok) {
    res.status(result.status).json({ message: result.message })
    return
  }

  res.status(201).json(result.data)
}
