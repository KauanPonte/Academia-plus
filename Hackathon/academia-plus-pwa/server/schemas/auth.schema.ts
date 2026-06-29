import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.email('E-mail invalido.'),
    password: z.string().min(1, 'Senha e obrigatoria.'),
  }),
})

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres.'),
    email: z.email('E-mail invalido.'),
    password: z.string().min(3, 'Senha deve ter pelo menos 3 caracteres.'),
    course: z.string().trim().optional(),
    institution: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    verificationStatus: z.enum(['unverified', 'institutional_email', 'document_pending']).optional(),
    enrollmentDocumentName: z.string().trim().optional(),
    enrollmentDocumentData: z.string().trim().optional(),
  }),
})
