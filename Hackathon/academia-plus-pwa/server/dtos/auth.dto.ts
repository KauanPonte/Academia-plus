import type { User } from '../entities/user.entity.js'

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  name: string
  email: string
  password: string
  course?: string
  institution?: string
  bio?: string
  verificationStatus?: 'unverified' | 'institutional_email' | 'document_pending'
  enrollmentDocumentName?: string
  enrollmentDocumentData?: string
}

export interface AuthUserDTO extends Omit<User, 'password'> {}

export interface UpdateProfileDTO {
  name?: string
  course?: string
  institution?: string
  bio?: string
  avatar?: string
  theme?: 'light' | 'dark'
}

export interface LoginResponseDTO {
  token: string
  user: AuthUserDTO
}
