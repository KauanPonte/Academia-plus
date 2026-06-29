<template>
  <main class="min-h-screen bg-[#05051d] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
    <section class="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-[420px] items-stretch">
      <article
        class="relative flex min-h-[640px] flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#101a4a] px-7 py-8 text-white shadow-2xl"
        :class="screen === 'welcome' ? 'flex' : 'hidden'"
      >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_45%_8%,rgba(139,92,246,0.92),transparent_22rem)]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(120,62,231,0.28),rgba(5,10,39,0.8))]"></div>

        <div class="relative flex flex-1 flex-col items-center justify-center text-center">
          <div class="mb-8 grid h-32 w-32 place-items-center text-white">
            <svg
              class="h-28 w-28 drop-shadow-[0_18px_18px_rgba(0,0,0,0.28)]"
              viewBox="0 0 180 140"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M30 61.5 90 36l60 25.5-60 25.7L30 61.5Z"
                fill="#ffffff"
              />
              <path
                d="M49 73.5c10.2 10.7 24 16.2 41 16.2 17.2 0 31.1-5.5 41.4-16.4v23.4c0 9.9-18.5 17.9-41.3 17.9S49 106.6 49 96.7V73.5Z"
                fill="#f8fafc"
              />
              <path
                d="M90 36 30 61.5 90 87.2l60-25.7L90 36Z"
                stroke="#eef2ff"
                stroke-width="4"
                stroke-linejoin="round"
              />
              <path
                d="M132 69.5 86 90.3"
                stroke="#dbe3f0"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M47 70.5v35"
                stroke="#ffffff"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M47 104c-4.4 5-6.5 10-6.5 15h13c0-5-2.1-10-6.5-15Z"
                fill="#ffffff"
              />
              <path
                d="M58 66.5 104 47"
                stroke="#8792a2"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h1 class="text-4xl font-black">Academia+</h1>
          <p class="mt-6 max-w-[230px] text-lg font-medium leading-snug text-violet-100">
            Conecte-se com alunos, compre, venda e evolua junto.
          </p>
        </div>

        <div class="relative grid gap-3">
          <Button
            label="Criar conta"
            class="h-12 w-full border-none bg-violet-600 font-bold"
            @click="openRegister"
          />
          <Button
            label="Entrar"
            outlined
            class="h-12 w-full border-white/60 bg-transparent font-bold text-white"
            @click="openLogin"
          />
          <p class="mx-auto mt-5 max-w-[250px] text-center text-xs font-semibold leading-relaxed text-violet-100">
            Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </article>

      <article
        class="flex min-h-[640px] flex-col rounded-[28px] border border-slate-200 bg-white px-5 py-7 shadow-2xl sm:px-7"
        :class="screen === 'login' ? 'flex' : 'hidden'"
      >
        <header class="mb-6 grid grid-cols-[2rem_1fr_2rem] items-center">
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Voltar"
            @click="screen = 'welcome'"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2 class="text-center text-xl font-black">Entrar</h2>
        </header>

        <form class="flex flex-1 flex-col" @submit.prevent="handleLogin">
          <div class="mb-6 text-center">
            <div class="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-violet-100 text-4xl text-violet-600">
              <i class="pi pi-user"></i>
            </div>
            <h3 class="text-xl font-black">Bem-vindo de volta</h3>
            <p class="mx-auto mt-1 max-w-[250px] text-sm font-medium leading-snug text-slate-500">
              Entre com uma conta cadastrada.
            </p>
          </div>

          <div class="grid gap-4">
            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">E-mail</span>
              <InputText v-model="loginForm.email" class="w-full" placeholder="E-mail" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Senha</span>
              <Password
                v-model="loginForm.password"
                :feedback="false"
                toggleMask
                inputClass="w-full"
                class="w-full"
                placeholder="Senha"
              />
            </label>
          </div>

          <div class="mt-5 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-relaxed text-slate-500">
            Contas demo: admin@teste.com / 123 ou user@teste.com / 123456.
          </div>

          <p v-if="loginError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
            {{ loginError }}
          </p>

          <Button
            label="Entrar"
            type="submit"
            class="mt-auto h-12 w-full border-none bg-violet-600 font-bold"
            :loading="authStore.loading"
          />
        </form>
      </article>

      <article
        class="flex min-h-[640px] flex-col rounded-[28px] border border-slate-200 bg-white px-5 py-7 shadow-2xl sm:px-7"
        :class="screen === 'register' ? 'flex' : 'hidden'"
      >
        <header class="mb-5 grid grid-cols-[2rem_1fr_2rem] items-center">
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Voltar"
            @click="screen = 'welcome'"
          >
            <i class="pi pi-arrow-left"></i>
          </button>
          <h2 class="text-center text-xl font-black">Criar conta</h2>
        </header>

        <form class="flex flex-1 flex-col" @submit.prevent="goToCommunities">
          <div class="mb-6 text-center">
            <div class="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-violet-100 text-4xl text-violet-600">
              <i class="pi pi-graduation-cap"></i>
            </div>
            <h3 class="text-xl font-black">Vamos comecar!</h3>
            <p class="mx-auto mt-1 max-w-[230px] text-sm font-medium leading-snug text-slate-500">
              Informe seus dados para entrar na comunidade.
            </p>
          </div>

          <div class="grid gap-4">
            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Nome completo</span>
              <InputText v-model="registerForm.name" class="w-full" placeholder="Nome completo" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">E-mail</span>
              <InputText v-model="registerForm.email" class="w-full" placeholder="E-mail" />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Senha</span>
              <Password
                v-model="registerForm.password"
                :feedback="false"
                toggleMask
                inputClass="w-full"
                class="w-full"
                placeholder="Senha"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Curso</span>
              <Dropdown
                v-model="registerForm.course"
                :options="courses"
                placeholder="Selecione seu curso"
                class="w-full"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Instituicao</span>
              <Dropdown
                v-model="registerForm.institution"
                :options="institutions"
                placeholder="Selecione sua instituicao"
                class="w-full"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-xs font-bold text-slate-500">Declaracao de matricula</span>
              <span class="flex min-h-20 flex-col justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50 px-4 py-3 text-xs font-semibold leading-relaxed text-violet-900">
                <span class="flex items-center gap-2">
                  <i class="pi pi-upload text-violet-600"></i>
                  {{ registerForm.enrollmentDocumentName || 'Obrigatoria para e-mail nao institucional' }}
                </span>
                <small class="mt-1 text-violet-500">
                  Com e-mail institucional, a verificacao e automatica. Com outro e-mail, envie um PDF ou imagem.
                </small>
                <input
                  class="sr-only"
                  type="file"
                  accept="application/pdf,image/*"
                  @change="handleEnrollmentDocumentUpload"
                />
              </span>
            </label>
          </div>

          <p v-if="registerError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
            {{ registerError }}
          </p>

          <Button
            label="Continuar"
            type="submit"
            class="mt-auto h-12 w-full border-none bg-violet-600 font-bold"
          />
        </form>
      </article>

      <article
        class="flex min-h-[640px] flex-col rounded-[28px] border border-slate-200 bg-white px-5 py-7 shadow-2xl sm:px-7"
        :class="screen === 'communities' ? 'flex' : 'hidden'"
      >
        <header class="mb-5">
          <h2 class="text-2xl font-black leading-tight">Escolha sua comunidade</h2>
          <p class="mt-4 text-sm font-medium leading-relaxed text-slate-500">
            Participe das comunidades da sua instituicao ou explore outras.
          </p>
        </header>

        <div class="mb-5 inline-flex w-fit rounded-full bg-slate-100 p-1">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-xs font-black transition"
            :class="registerForm.communityScope === 'institution' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500'"
            @click="registerForm.communityScope = 'institution'"
          >
            Minha instituicao
          </button>
          <button
            type="button"
            class="rounded-full px-4 py-2 text-xs font-black transition"
            :class="registerForm.communityScope === 'general' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500'"
            @click="registerForm.communityScope = 'general'"
          >
            Geral
          </button>
        </div>

        <div class="divide-y divide-slate-100">
          <button
            v-for="community in visibleCommunities"
            :key="community.name"
            type="button"
            class="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left"
            @click="toggleCommunity(community.name)"
          >
            <span>
              <strong class="block text-sm font-black text-slate-800">{{ community.name }}</strong>
              <small v-if="community.description" class="mt-1 block text-xs font-semibold text-slate-400">
                {{ community.description }}
              </small>
            </span>
            <span
              class="grid h-6 w-6 shrink-0 place-items-center rounded-md border-2"
              :class="selectedCommunities.includes(community.name) ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 text-transparent'"
            >
              <i class="pi pi-check text-xs"></i>
            </span>
          </button>
        </div>

        <p v-if="registerError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
          {{ registerError }}
        </p>

        <Button
          label="Entrar"
          class="mt-auto h-12 w-full border-none bg-violet-600 font-bold"
          :loading="authStore.loading"
          @click="handleRegister"
        />
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'

type OnboardingScreen = 'welcome' | 'login' | 'register' | 'communities'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const screen = ref<OnboardingScreen>('welcome')
const loginError = ref('')
const registerError = ref('')
const selectedCommunities = ref(['UNIFESP', 'Fisioterapia'])

const courses = ['Fisioterapia', 'Medicina', 'Enfermagem', 'Terapia Ocupacional', 'Psicologia']
const institutions = ['UNIFESP', 'USP', 'UFRJ', 'IFCE', 'PUC-SP', 'FGV']
const institutionalDomains = ['.edu.br', '@usp.br', '@ufrj.br', '@aluno.unifesp.br', '@aluno.ifce.edu.br']

const communities = [
  { name: 'UNIFESP', description: 'Universidade Federal de Sao Paulo', scope: 'institution' },
  { name: 'Fisioterapia', description: '', scope: 'institution' },
  { name: 'Medicina', description: '', scope: 'institution' },
  { name: 'Enfermagem', description: '', scope: 'institution' },
  { name: 'Terapia Ocupacional', description: '', scope: 'institution' },
  { name: 'Geral Brasil', description: 'Comunidade aberta de estudantes', scope: 'general' },
  { name: 'Marketplace Geral', description: 'Compra e venda entre alunos', scope: 'general' },
]

const loginForm = reactive({
  email: 'larissa@aluno.ifce.edu.br',
  password: '123456',
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  course: '',
  institution: '',
  communityScope: 'institution' as 'institution' | 'general',
  enrollmentDocumentName: '',
  enrollmentDocumentData: '',
})

const redirectTo = computed(() => route.query.redirect?.toString())

const visibleCommunities = computed(() =>
  communities.filter((community) => community.scope === registerForm.communityScope),
)

const verificationStatus = computed(() => {
  const email = registerForm.email.toLowerCase()
  if (institutionalDomains.some((domain) => email.endsWith(domain))) return 'institutional_email'
  return email ? 'document_pending' : 'unverified'
})

watch(
  () => registerForm.communityScope,
  (scope) => {
    selectedCommunities.value = scope === 'institution' ? ['UNIFESP', registerForm.course || 'Fisioterapia'] : ['Geral Brasil']
  },
)

function openRegister() {
  registerError.value = ''
  screen.value = 'register'
}

function openLogin() {
  loginError.value = ''
  screen.value = 'login'
}

function goToAuthenticatedArea() {
  if (redirectTo.value) {
    router.push(redirectTo.value)
    return
  }

  router.push(authStore.user?.role === 'admin' ? { name: 'admin-dashboard' } : { name: 'home' })
}

function validateRegisterForm() {
  registerError.value = ''

  if (!registerForm.name || !registerForm.email || !registerForm.password) {
    registerError.value = 'Preencha nome, e-mail e senha para continuar.'
    return false
  }

  if (!registerForm.email.includes('@')) {
    registerError.value = 'Informe um e-mail valido.'
    return false
  }

  if (registerForm.password.length < 6) {
    registerError.value = 'A senha precisa ter pelo menos 6 caracteres.'
    return false
  }

  if (!registerForm.course || !registerForm.institution) {
    registerError.value = 'Escolha seu curso e instituicao.'
    return false
  }

  if (verificationStatus.value === 'document_pending' && !registerForm.enrollmentDocumentData) {
    registerError.value = 'Use e-mail institucional ou envie uma declaracao de matricula.'
    return false
  }

  return true
}

function goToCommunities() {
  if (!validateRegisterForm()) return

  selectedCommunities.value = [registerForm.institution, registerForm.course]
  screen.value = 'communities'
}

function toggleCommunity(name: string) {
  if (selectedCommunities.value.includes(name)) {
    selectedCommunities.value = selectedCommunities.value.filter((community) => community !== name)
    return
  }

  selectedCommunities.value = [...selectedCommunities.value, name]
}

async function handleLogin() {
  loginError.value = ''
  const result = await authStore.login(loginForm.email, loginForm.password)

  if (!result.success) {
    loginError.value = result.message ?? 'Nao foi possivel entrar com esses dados.'
    return
  }

  goToAuthenticatedArea()
}

async function handleRegister() {
  if (!validateRegisterForm()) return

  if (!selectedCommunities.value.length) {
    registerError.value = 'Escolha pelo menos uma comunidade.'
    return
  }

  const result = await authStore.register({
    name: registerForm.name,
    email: registerForm.email,
    password: registerForm.password,
    course: registerForm.course,
    institution: registerForm.institution,
    communityScope: registerForm.communityScope,
    verificationStatus: verificationStatus.value,
    enrollmentDocumentName: registerForm.enrollmentDocumentName,
    enrollmentDocumentData: registerForm.enrollmentDocumentData,
    city: 'Sao Paulo',
    state: 'SP',
    cep: '',
    acceptedTerms: true,
    acceptedPrivacy: true,
  })

  if (!result.success) {
    toast.add({ severity: 'warn', summary: 'Conta ja existe', detail: result.message, life: 4500 })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Conta criada',
    detail: 'Bem-vinda ao Academia+.',
    life: 3000,
  })
  goToAuthenticatedArea()
}

function handleEnrollmentDocumentUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  registerForm.enrollmentDocumentName = file.name
  const reader = new FileReader()
  reader.onload = () => {
    registerForm.enrollmentDocumentData = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}
</script>
