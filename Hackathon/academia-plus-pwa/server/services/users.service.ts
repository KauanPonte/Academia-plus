import type { AuthUserDTO, UpdateProfileDTO } from '../dtos/auth.dto.js'
import type { User } from '../entities/user.entity.js'
import { AppError } from '../errors/app-error.js'
import { followsRepository } from '../repositories/follows.repository.js'
import { usersRepository } from '../repositories/users.repository.js'

export function toAuthUser(user: User): AuthUserDTO {
  const { password: _password, ...safeUser } = user

  return safeUser
}

export const usersService = {
  getMe(userId: string): AuthUserDTO {
    const user = usersRepository.findById(userId)

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    return toAuthUser(user)
  },

  getProfile(userId: string, viewerId?: string) {
    const user = usersRepository.findById(userId)

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    return {
      ...toAuthUser(user),
      followersCount: followsRepository.followersOf(userId).length,
      followingCount: followsRepository.followingOf(userId).length,
      followedByMe: viewerId ? !!followsRepository.find(viewerId, userId) : false,
    }
  },

  updateMe(userId: string, data: UpdateProfileDTO): AuthUserDTO {
    const updatedUser = usersRepository.update(userId, data)

    if (!updatedUser) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    return toAuthUser(updatedUser)
  },

  search(term: string, viewerId: string) {
    return usersRepository.search(term).map((user) => ({
      ...toAuthUser(user),
      followersCount: followsRepository.followersOf(user.id).length,
      followingCount: followsRepository.followingOf(user.id).length,
      followedByMe: !!followsRepository.find(viewerId, user.id),
    }))
  },
}
