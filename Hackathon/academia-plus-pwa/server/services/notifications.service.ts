import { readDatabase } from '../database/json-database.js'
import { usersRepository } from '../repositories/users.repository.js'

export const notificationsService = {
  list(userId: string) {
    const database = readDatabase()
    const myPostIds = database.posts.filter((post) => post.authorId === userId).map((post) => post.id)

    const likeNotifications = database.likes
      .filter((like) => myPostIds.includes(like.postId) && like.userId !== userId)
      .map((like) => {
        const actor = usersRepository.findById(like.userId)
        const post = database.posts.find((item) => item.id === like.postId)

        return {
          id: `like-${like.id}`,
          type: 'like',
          title: 'Nova curtida',
          message: `${actor?.name ?? 'Um aluno'} curtiu sua publicacao.`,
          postId: post?.id,
          read: false,
          createdAt: like.createdAt,
        }
      })

    const commentNotifications = database.comments
      .filter((comment) => myPostIds.includes(comment.postId) && comment.authorId !== userId)
      .map((comment) => {
        const actor = usersRepository.findById(comment.authorId)

        return {
          id: `comment-${comment.id}`,
          type: 'comment',
          title: 'Novo comentario',
          message: `${actor?.name ?? 'Um aluno'} comentou sua publicacao.`,
          postId: comment.postId,
          read: false,
          createdAt: comment.createdAt,
        }
      })

    const followNotifications = database.follows
      .filter((follow) => follow.followingId === userId)
      .map((follow) => {
        const actor = usersRepository.findById(follow.followerId)

        return {
          id: `follow-${follow.id}`,
          type: 'follow',
          title: 'Novo seguidor',
          message: `${actor?.name ?? 'Um aluno'} comecou a seguir voce.`,
          read: false,
          createdAt: follow.createdAt,
        }
      })

    return [...likeNotifications, ...commentNotifications, ...followNotifications].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
  },
}

