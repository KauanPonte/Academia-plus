<template>
  <main class="space-y-6">
    <section class="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 via-violet-700 to-violet-500 text-white shadow-xl">
      <div class="flex flex-wrap items-start justify-between gap-4 p-6">
        <div class="flex items-center gap-4">
          <img
            src="https://picsum.photos/200"
            alt="Perfil"
            class="h-20 w-20 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h1 class="text-3xl font-black">{{ authStore.user?.name || 'Usuario' }}</h1>
            <p class="text-slate-300">
              @{{ username }} - {{ authStore.user?.course }} - {{ authStore.user?.institution }}
            </p>
          <span class="mt-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
              {{ verificationLabel }}
            </span>
          </div>
        </div>

        <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" @click="showMenu = !showMenu" />
      </div>

      <div class="grid grid-cols-3 border-t border-white/10 text-center">
        <div class="p-4">
          <strong class="block text-2xl">{{ myProducts.length }}</strong>
          <span class="text-sm text-violet-50">publicações</span>
        </div>
        <div class="p-4">
          <strong class="block text-2xl">{{ displayFollowers }}</strong>
          <span class="text-sm text-violet-50">seguidores</span>
        </div>
        <div class="p-4">
          <strong class="block text-2xl">{{ displayFollowing }}</strong>
          <span class="text-sm text-violet-50">seguindo</span>
        </div>
      </div>
    </section>

    <section v-if="showMenu" class="grid gap-3 md:grid-cols-4">
      <button
        class="rounded-xl border border-emerald-100 bg-white p-4 text-left font-bold shadow-sm"
        type="button"
        @click="openPanel('publish')"
      >
        <i class="pi pi-plus-circle mr-2 text-emerald-600"></i>
        Publicar item
      </button>
      <button
        class="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold shadow-sm"
        type="button"
        @click="openPanel('saved')"
      >
        <i class="pi pi-bookmark mr-2 text-violet-700"></i>
        Produtos salvos
      </button>
      <button
        class="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold shadow-sm"
        type="button"
        @click="openPanel('interested')"
      >
        <i class="pi pi-heart mr-2 text-violet-700"></i>
        Interessados nos meus produtos
      </button>
      <button
        class="rounded-xl border border-slate-200 bg-white p-4 text-left font-bold shadow-sm"
        type="button"
        @click="openPanel('settings')"
      >
        <i class="pi pi-cog mr-2 text-violet-700"></i>
        Configurações da conta
      </button>
    </section>

    <section
      v-if="activePanel"
      class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-black">{{ panelTitle }}</h2>
        <Button icon="pi pi-times" rounded text @click="activePanel = null" />
      </div>

      <form v-if="activePanel === 'publish'" class="grid gap-4 md:grid-cols-2" @submit.prevent="publishProduct">
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Nome do item</span>
          <InputText v-model="draft.name" class="profile-input w-full" placeholder="Calculadora, livro, jaleco..." />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Categoria</span>
          <InputText v-model="draft.category" class="profile-input w-full" placeholder="Material de estudo" />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Preço</span>
          <InputText v-model="draft.price" class="profile-input w-full" placeholder="120" />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Cidade, UF</span>
          <InputText v-model="draft.location" class="profile-input w-full" placeholder="Fortaleza, CE" />
        </label>
        <label class="md:col-span-2">
          <span class="mb-2 block text-sm font-bold text-slate-600">Foto do produto</span>
          <span class="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50 p-4 text-center text-sm font-semibold text-violet-900">
            <img
              v-if="draft.imageData"
              :src="draft.imageData"
              :alt="draft.imageName || 'Foto do produto'"
              class="mb-3 h-28 w-28 rounded-lg bg-white object-contain p-2 shadow-sm"
            />
            <i v-else class="pi pi-image mb-2 text-2xl text-violet-600"></i>
            <span>{{ draft.imageName || 'Escolha uma imagem para aparecer no marketplace' }}</span>
            <input class="sr-only" type="file" accept="image/*" @change="handleProductImageUpload" />
          </span>
        </label>
        <p class="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 md:col-span-2">
          O item aparece nas suas publicações e pode ser encontrado no marketplace estudantil.
        </p>
        <Button
          label="Publicar item"
          icon="pi pi-upload"
          class="h-12 w-full border-none bg-emerald-400 font-bold text-slate-950 md:col-span-2"
          type="submit"
        />
      </form>

      <div v-else-if="activePanel === 'saved'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="product in savedProducts"
          :key="product.id"
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="rounded-xl border border-slate-200 p-3"
        >
          <img :src="product.image" :alt="product.name" class="h-28 w-full rounded-lg bg-white object-contain p-2" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
          <strong class="mt-3 block truncate">{{ product.name }}</strong>
          <small class="text-slate-500">Salvo para negociar depois</small>
        </RouterLink>
      </div>

      <div v-else-if="activePanel === 'interested'" class="space-y-3">
        <article
          v-for="product in myProducts"
          :key="product.id"
          class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
        >
          <div>
            <strong class="block">{{ product.name }}</strong>
            <span class="text-sm text-slate-500">{{ product.interested }} alunos demonstraram interesse</span>
          </div>
          <RouterLink to="/chat" class="text-sm font-bold text-violet-700">
            Ver conversas
          </RouterLink>
        </article>
      </div>

      <div v-else-if="activePanel === 'settings'" class="grid gap-4 md:grid-cols-2">
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Nome</span>
          <InputText :model-value="authStore.user?.name" class="profile-input w-full" />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Curso</span>
          <InputText :model-value="authStore.user?.course" class="profile-input w-full" />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Cidade</span>
          <InputText :model-value="authStore.user?.city" class="profile-input w-full" />
        </label>
        <label>
          <span class="mb-2 block text-sm font-bold text-slate-600">Tema</span>
          <select class="h-11 w-full rounded-md border border-violet-200 bg-violet-50 px-3 text-violet-950">
            <option>Claro</option>
            <option>Escuro</option>
          </select>
        </label>
        <p class="md:col-span-2 rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
          O modo escuro deve ser uma preferência da conta. Quando ativo, todas as telas entram no
          tema escuro de forma consistente.
        </p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside class="space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <h2 class="text-xl font-black text-violet-950">Conquistas</h2>
          <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            <span class="rounded-full bg-violet-50 px-3 py-2 text-violet-700">Monitor</span>
            <span class="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">Vendedor confiável</span>
            <span class="rounded-full bg-amber-50 px-3 py-2 text-amber-700">Fundador</span>
          </div>
        </div>
      </aside>

      <section>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-black">Minhas publicações</h2>
          <span class="text-sm text-slate-500">{{ myProducts.length }} produtos</span>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <RouterLink
            v-for="product in myProducts"
            :key="product.id"
            :to="{ name: 'product-detail', params: { id: product.id } }"
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <img :src="product.image" :alt="product.name" class="h-44 w-full bg-white object-contain p-3" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
            <div class="p-4">
              <strong class="block truncate">{{ product.name }}</strong>
              <span class="text-sm text-slate-500">{{ product.interested }} interessados</span>
              <p class="mt-2 font-black">R$ {{ product.price }},00</p>
            </div>
          </RouterLink>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Product } from '@/model/product.model'
import { savedProductIds, store } from '@/store'
import { useAuthStore } from '@/stores/auth'
import { apiGetUser } from '@/services/api'

const authStore = useAuthStore()
const showMenu = ref(false)
type ProfilePanel = 'publish' | 'saved' | 'interested' | 'settings'
const activePanel = ref<null | ProfilePanel>(null)

const followerCount = ref<number | null>(null)
const followingCount = ref<number | null>(null)

const draft = reactive({
  name: '',
  category: '',
  price: '',
  location: '',
  imageData: '',
  imageName: '',
})

interface UserProfile {
  id: string
  name: string
  email: string
  course?: string
  institution?: string
  followerCount: number
  followingCount: number
}

onMounted(async () => {
  const userId = authStore.user?.id
  if (!userId || !authStore.token || authStore.token.startsWith('demo-token')) return

  try {
    const profile = await apiGetUser<UserProfile>(authStore.token, userId)
    followerCount.value = profile.followerCount
    followingCount.value = profile.followingCount
  } catch {
    // Mantém os valores padrão se a API falhar
  }
})

const username = computed(() => authStore.user?.email.split('@')[0] || 'aluno')
const displayFollowers = computed(() => followerCount.value ?? 0)
const displayFollowing = computed(() => followingCount.value ?? 0)
const myProducts = computed(() => {
  const emailUser = authStore.user?.email.split('@')[0] || ''
  return store.products.filter(
    (product) => product.seller === 'larissa.dev' || product.seller === emailUser,
  )
})
const savedProducts = computed(() => store.products.filter((product) => savedProductIds.has(product.id)))
const panelTitle = computed(() => {
  if (activePanel.value === 'publish') return 'Publicar item'
  if (activePanel.value === 'saved') return 'Produtos salvos'
  if (activePanel.value === 'interested') return 'Interessados nos meus produtos'
  return 'Configurações da conta'
})
const verificationLabel = computed(() =>
  authStore.user?.verificationStatus === 'institutional_email'
    ? 'Estudante Verificado'
    : 'Aluno em verificação',
)

function publishProduct() {
  if (!draft.name || !draft.price) return

  store.products.unshift(
    new Product(
      Date.now(),
      draft.name,
      'Produto publicado pelo perfil. Complete a descrição nas configurações do item.',
      Number(draft.price),
      { id: Date.now(), name: draft.category || 'Material de estudo' },
      draft.imageData || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      authStore.user?.email.split('@')[0] || 'aluno',
      authStore.user?.course || 'Curso',
      authStore.user?.institution || 'Instituicao',
      draft.location || `${authStore.user?.city}, ${authStore.user?.state}`,
      authStore.user?.state || 'SP',
      'Usado',
      0,
    ),
  )

  draft.name = ''
  draft.category = ''
  draft.price = ''
  draft.location = ''
  draft.imageData = ''
  draft.imageName = ''
  activePanel.value = null
  showMenu.value = false
}

function openPanel(panel: ProfilePanel) {
  activePanel.value = panel
  showMenu.value = false
}

function handleProductImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  draft.imageName = file.name
  const reader = new FileReader()
  reader.onload = () => {
    draft.imageData = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
:deep(.profile-input),
:deep(.p-inputtext) {
  border: 1px solid #ddd6fe;
  background: #f5f3ff;
  color: #2e1065;
  box-shadow: none;
}

:deep(.profile-input::placeholder),
:deep(.p-inputtext::placeholder) {
  color: #7c6faf;
}

:deep(.profile-input:enabled:focus),
:deep(.p-inputtext:enabled:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18);
}
</style>
