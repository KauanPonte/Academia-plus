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
  verificationStatus?: 'unverified' | 'institutional_email' | 'document_pending'
  enrollmentDocumentName?: string
  enrollmentDocumentData?: string
  createdAt?: string
}
