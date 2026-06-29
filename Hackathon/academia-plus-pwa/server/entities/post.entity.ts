export interface Post {
  id: string
  authorId: string
  content: string
  image?: string
  type: 'post' | 'sale' | 'question' | 'event' | 'mentoring'
  createdAt: string
}

