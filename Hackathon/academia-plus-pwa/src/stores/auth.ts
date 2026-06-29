import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiLogin, apiRegister } from '@/services/api'

export interface AuthUser {
  id?: string
  name: string
  email: string
  role: 'admin' | 'customer'
  course?: string
  institution?: string
  communityScope?: 'institution' | 'general'
  verificationStatus?: 'unverified' | 'institutional_email' | 'document_pending'
  enrollmentDocumentName?: string
  enrollmentDocumentData?: string
  city?: string
  state?: string
  cep?: string
  acceptedTerms?: boolean
  acceptedPrivacy?: boolean
}

interface StoredAccount extends AuthUser {
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  course: string
  institution: string
  communityScope: 'institution' | 'general'
  verificationStatus: 'unverified' | 'institutional_email' | 'document_pending'
  enrollmentDocumentName?: string
  enrollmentDocumentData?: string
  city: string
  state: string
  cep: string
  acceptedTerms: boolean
  acceptedPrivacy: boolean
}

const STORAGE_USER_KEY = 'academiaPlusUser'
const STORAGE_TOKEN_KEY = 'academiaPlusToken'
const STORAGE_ACCOUNTS_KEY = 'academiaPlusAccounts'

const defaultAccounts: StoredAccount[] = [
  {
    name: 'Administrador',
    email: 'admin@teste.com',
    password: '123',
    role: 'admin',
  },
  {
    name: 'Larissa Lima',
    email: 'larissa@aluno.ifce.edu.br',
    password: '123456',
    role: 'customer',
    course: 'Sistemas de Informacao',
    institution: 'IFCE',
    communityScope: 'institution',
    verificationStatus: 'institutional_email',
    city: 'Fortaleza',
    state: 'CE',
    cep: '60000-000',
    acceptedTerms: true,
    acceptedPrivacy: true,
  },
  {
    name: 'Joao Medicina',
    email: 'joao@email.com',
    password: '123456',
    role: 'customer',
    course: 'Medicina',
    institution: 'USP',
    communityScope: 'general',
    verificationStatus: 'document_pending',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01000-000',
    acceptedTerms: true,
    acceptedPrivacy: true,
  },
]

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function toAuthUser(account: StoredAccount): AuthUser {
  const { password, ...user } = account
  return user
}

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function loadAccounts(): StoredAccount[] {
  const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(defaultAccounts))
    return defaultAccounts
  }

  try {
    const accounts = JSON.parse(raw) as StoredAccount[]
    if (!accounts.length) return defaultAccounts

    const mergedAccounts = [...accounts]
    defaultAccounts.forEach((defaultAccount) => {
      if (!mergedAccounts.some((account) => account.email === defaultAccount.email)) {
        mergedAccounts.push(defaultAccount)
      }
    })

    if (mergedAccounts.length !== accounts.length) {
      saveAccounts(mergedAccounts)
    }

    return mergedAccounts
  } catch {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(defaultAccounts))
    return defaultAccounts
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts))
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(loadStoredUser())
  const token = ref<string>(localStorage.getItem(STORAGE_TOKEN_KEY) ?? '')
  const isAuthenticated = ref<boolean>(!!token.value)
  const loading = ref(false)

  const persistSession = () => {
    if (user.value && token.value) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user.value))
      localStorage.setItem(STORAGE_TOKEN_KEY, token.value)
    }
  }

  const clearSession = () => {
    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 650))

    const normalizedEmail = normalizeEmail(email)

    try {
      const response = await apiLogin<AuthUser>(normalizedEmail, password)

      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true
      persistSession()
      loading.value = false

      return { success: true }
    } catch {
      // Mantem o prototipo funcionando mesmo quando a API local nao estiver ligada.
    }

    const account = loadAccounts().find((item) => item.email === normalizedEmail)

    if (!account) {
      loading.value = false
      return { success: false, code: 'ACCOUNT_NOT_FOUND', message: 'Conta não encontrada.' }
    }

    if (account.password !== password) {
      loading.value = false
      return {
        success: false,
        code: 'INVALID_PASSWORD',
        message: 'Senha incorreta. Você pode redefinir a senha.',
      }
    }

    user.value = toAuthUser(account)
    token.value = `demo-token-${Date.now()}`
    isAuthenticated.value = true
    persistSession()
    loading.value = false

    return { success: true }
  }

  const register = async (payload: RegisterPayload) => {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 750))

    const normalizedEmail = normalizeEmail(payload.email)
    const accounts = loadAccounts()
    const accountExists = accounts.some((item) => item.email === normalizedEmail)

    if (accountExists) {
      loading.value = false
      return {
        success: false,
        code: 'ACCOUNT_EXISTS',
        message: 'Ja existe uma conta cadastrada com este e-mail.',
      }
    }

    const newAccount: StoredAccount = {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password,
      role: 'customer',
      course: payload.course,
      institution: payload.institution,
      communityScope: payload.communityScope,
      verificationStatus: payload.verificationStatus,
      enrollmentDocumentName: payload.enrollmentDocumentName,
      enrollmentDocumentData: payload.enrollmentDocumentData,
      city: payload.city,
      state: payload.state,
      cep: payload.cep,
      acceptedTerms: payload.acceptedTerms,
      acceptedPrivacy: payload.acceptedPrivacy,
    }

    accounts.push(newAccount)
    saveAccounts(accounts)

    try {
      const response = await apiRegister<AuthUser>({
        name: newAccount.name,
        email: newAccount.email,
        password: newAccount.password,
        course: newAccount.course,
        institution: newAccount.institution,
        verificationStatus: payload.verificationStatus,
        enrollmentDocumentName: payload.enrollmentDocumentName,
        enrollmentDocumentData: payload.enrollmentDocumentData,
      })

      user.value = {
        ...response.user,
        communityScope: payload.communityScope,
        verificationStatus: payload.verificationStatus,
        enrollmentDocumentName: payload.enrollmentDocumentName,
        enrollmentDocumentData: payload.enrollmentDocumentData,
        city: payload.city,
        state: payload.state,
        cep: payload.cep,
        acceptedTerms: payload.acceptedTerms,
        acceptedPrivacy: payload.acceptedPrivacy,
      }
      token.value = response.token
      isAuthenticated.value = true
      persistSession()
      loading.value = false

      return { success: true }
    } catch {
      // Se a API nao estiver rodando, salva localmente para a banca ainda conseguir testar o fluxo.
    }

    user.value = toAuthUser(newAccount)
    token.value = `demo-token-${Date.now()}`
    isAuthenticated.value = true
    persistSession()
    loading.value = false

    return { success: true }
  }

  const requestPasswordReset = async (email: string) => {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))

    const normalizedEmail = normalizeEmail(email)
    const accountExists = loadAccounts().some((item) => item.email === normalizedEmail)
    loading.value = false

    if (!accountExists) {
      return { success: false, message: 'Nenhuma conta encontrada para este e-mail.' }
    }

    return {
      success: true,
      message: 'Enviamos as instrucoes de redefinicao de senha para este e-mail.',
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    isAuthenticated.value = false
    loading.value = false
    clearSession()
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    requestPasswordReset,
    logout,
  }
})
