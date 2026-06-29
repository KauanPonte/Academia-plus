import { AppError } from '../errors/app-error.js'
import { followsRepository } from '../repositories/follows.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { toAuthUser } from './users.service.js'

export const followsService = {
  follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new AppError('Voce nao pode seguir a si mesmo.')
    }

    const user = usersRepository.findById(followingId)

    if (!user) {
      throw new AppError('Usuario nao encontrado.', 404)
    }

    if (!followsRepository.find(followerId, followingId)) {
      followsRepository.create({
        id: crypto.randomUUID(),
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      })
    }

    return { following: toAuthUser(user), status: 'following' }
  },

  unfollow(followerId: string, followingId: string) {
    followsRepository.delete(followerId, followingId)

    return { followingId, status: 'not_following' }
  },
}

