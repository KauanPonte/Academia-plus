export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
  course?: string
  institution?: string
  bio?: string
  avatar?: string
  theme?: 'light' | 'dark'
  createdAt?: string
}
