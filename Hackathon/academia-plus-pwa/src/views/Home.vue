<template>
  <main class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
    <section class="min-w-0">
    <header class="rounded-2xl border border-slate-200 bg-white px-5 pt-5 pb-3 shadow-sm">
        <div class="flex items-center justify-between gap-4">
          <h1 class="text-3xl font-black tracking-normal text-slate-950">
            Academia<span class="text-violet-600">+</span>
          </h1>

        </div>

        <p
          v-if="notificationMessage"
          class="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700"
        >
          {{ notificationMessage }}
        </p>

        <div class="mt-4 flex gap-5 overflow-x-auto pb-4">
          <button
            v-for="story in feedStories"
            :key="story.label"
            type="button"
            class="grid w-20 shrink-0 justify-items-center gap-2 text-center"
            @click="selectStory(story)"
          >
            <span
              class="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-emerald-400 to-orange-400 p-[3px]"
            >
              <span class="grid h-full w-full place-items-center rounded-full bg-white p-[3px]">
                <img
                  v-if="story.avatar"
                  :src="story.avatar"
                  :alt="story.label"
                  class="h-full w-full rounded-full object-cover"
                />
                <span
                  v-else
                  :class="story.color"
                  class="grid h-full w-full place-items-center rounded-full text-xl font-black text-white"
                >
                  {{ story.initials }}
                </span>
              </span>
              <span
                v-if="story.isMine"
                class="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full bg-violet-600 text-xs font-black text-white ring-2 ring-white"
              >
                +
              </span>
            </span>
            <span class="line-clamp-2 min-h-9 text-xs font-bold leading-tight text-slate-600">
              {{ story.label }}
            </span>
          </button>
        </div>
      </header>

      <nav class="mt-3 border-t border-slate-100 pt-3">
        <div class="flex overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="relative min-h-14 flex-1 whitespace-nowrap px-4 text-sm font-black text-slate-500 md:flex-none md:px-6"
            :class="activeTab === tab.value ? 'text-violet-700' : ''"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.value"
              class="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-violet-600"
            ></span>
          </button>
        </div>
      </nav>

      <section class="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          class="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold"
          :class="
            activeFilter === filter.value
              ? 'border-violet-600 bg-violet-600 text-white'
              : 'border-slate-200 bg-white text-slate-600'
          "
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </section>

      <section class="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-violet-950">
        <strong class="block">{{ tabNotice.title }}</strong>
        <p class="mt-1 text-sm leading-relaxed">{{ tabNotice.description }}</p>
      </section>

      <div v-if="loadingPosts" class="mt-6 flex justify-center py-8">
        <span class="text-slate-400 font-bold">Carregando posts...</span>
      </div>

      <section v-else class="mt-4 space-y-4">
        <article
          v-for="post in visiblePosts"
          :key="post.id"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <header class="flex items-center gap-3 p-4">
            <img
              v-if="post.avatar"
              :src="post.avatar"
              :alt="post.author"
              class="h-11 w-11 rounded-full object-cover ring-2 ring-violet-100"
            />
            <span
              v-else
              class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600 text-base font-black text-white ring-2 ring-violet-100"
            >
              {{ post.author.charAt(0).toUpperCase() }}
            </span>
            <div class="min-w-0 flex-1">
              <strong class="block truncate">{{ post.author }}</strong>
              <small class="block truncate text-slate-500">{{ post.course }} • {{ post.institution }}</small>
            </div>
            <span class="hidden rounded-full px-3 py-1 text-xs font-black sm:inline-flex" :class="postMeta(post.type).class">
              {{ postMeta(post.type).label }}
            </span>
            <small class="font-bold text-slate-400">{{ post.publishedAt }}</small>
          </header>

          <template v-if="post.type === 'sale' && post.productId && productById(post.productId)">
            <div class="relative grid max-h-[340px] min-h-[220px] place-items-center overflow-hidden bg-white md:max-h-[360px]">
              <img
                :src="productById(post.productId)?.image"
                :alt="productById(post.productId)?.name"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                class="max-h-[340px] w-full object-contain p-4 md:max-h-[360px] md:p-6"
              />
              <span class="absolute bottom-4 left-4 rounded-full bg-violet-600 px-3 py-1.5 text-sm font-black text-white shadow-lg">
                A venda
              </span>
            </div>

            <div class="p-4">
              <div class="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                <span>Nota 5.0</span>
                <span>Verificado</span>
                <span>{{ post.publishedAt }}</span>
                <span>{{ post.distance }}</span>
              </div>
              <h2 class="mt-2 text-xl font-black md:text-2xl">{{ productById(post.productId)?.name }}</h2>
              <p class="mt-1 text-sm leading-relaxed text-slate-600 md:text-base">
                {{ productById(post.productId)?.description }}
              </p>
              <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <strong class="text-2xl">R$ {{ productById(post.productId)?.price }},00</strong>
                  <span class="ml-2 text-sm text-slate-400 line-through">
                    R$ {{ originalPrice(productById(post.productId)?.price) }},00
                  </span>
                </div>
                <RouterLink
                  :to="{ name: 'product-detail', params: { id: post.productId } }"
                  class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Ver detalhes
                </RouterLink>
              </div>
            </div>
          </template>

          <div v-else class="p-4">
            <span class="rounded-full px-3 py-1 text-xs font-black" :class="postMeta(post.type).class">
              {{ postMeta(post.type).label }}
            </span>
            <p class="mt-3 text-lg leading-relaxed">{{ post.text }}</p>
            <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
              <span>{{ post.publishedAt }}</span>
              <span v-if="post.distance">{{ post.distance }}</span>
              <span>{{ post.institution }}</span>
            </div>
          </div>

          <footer class="flex flex-wrap gap-3 border-t border-slate-100 p-4 text-sm font-bold text-slate-500">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
              :class="likedPosts.has(post.id) ? 'text-violet-700' : ''"
              @click="toggleLike(post)"
            >
              <i :class="likedPosts.has(post.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
              {{ post.likes }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-700"
              @click="openComment(post)"
            >
              <i class="pi pi-comment"></i>
              {{ post.comments }}
            </button>
            <button
              v-if="post.type === 'sale' && post.productId"
              type="button"
              class="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
              :class="isProductSaved(post.productId) ? 'text-violet-700' : ''"
              @click="toggleSavedProduct(post.productId)"
            >
              <i :class="isProductSaved(post.productId) ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"></i>
              {{ isProductSaved(post.productId) ? 'Salvo' : 'Salvar' }}
            </button>
          </footer>

          <!-- Caixa de comentário inline -->
          <div v-if="commentingPostId === post.id" class="border-t border-slate-100 p-4">
            <form class="flex gap-2" @submit.prevent="submitComment(post)">
              <input
                v-model="commentText"
                class="flex-1 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm text-violet-950 placeholder-violet-300 outline-none focus:border-violet-500"
                placeholder="Escreva um comentário..."
                autofocus
              />
              <button
                type="submit"
                class="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                :disabled="!commentText.trim()"
              >
                Enviar
              </button>
            </form>
          </div>
        </article>
      </section>
    </section>

    <aside class="hidden space-y-4 xl:block">
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Sua comunidade</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ authStore.user?.institution || 'IFCE' }} - {{ authStore.user?.course || 'Engenharia' }}
        </p>
        <div class="mt-4 grid grid-cols-2 gap-3 text-center">
          <div class="rounded-xl bg-slate-50 p-4">
            <strong class="block text-xl">7.213</strong>
            <span class="text-xs text-slate-500">alunos</span>
          </div>
          <div class="rounded-xl bg-slate-50 p-4">
            <strong class="block text-xl">34</strong>
            <span class="text-xs text-slate-500">novos hoje</span>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Eventos próximos</h2>
        <div class="mt-4 space-y-3 text-sm">
          <p><strong>Hoje</strong> - Plantao de Algoritmos as 20h</p>
          <p><strong>Amanhã</strong> - Feira de estágios da UFC</p>
          <p><strong>Segunda</strong> - Semana da Computacao</p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Comunidades em alta</h2>
        <div class="mt-4 space-y-3">
          <RouterLink
            v-for="community in store.communities.slice(0, 5)"
            :key="community.id"
            to="/communities"
            class="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
          >
            <span :class="community.color" class="grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white">
              {{ community.course.slice(0, 2).toUpperCase() }}
            </span>
            <span class="min-w-0">
              <strong class="block truncate">{{ community.title }}</strong>
              <small class="text-slate-500">{{ community.members }} membros</small>
            </span>
          </RouterLink>
        </div>
      </section>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { isProductSaved, store, toggleSavedProduct, type FeedPostType } from '@/store'
import { useAuthStore } from '@/stores/auth'
import { apiFetchPosts, apiLikePost, apiUnlikePost, apiCommentPost } from '@/services/api'

const authStore = useAuthStore()
const activeTab = ref('for-you')
const activeFilter = ref('all')
const likedPosts = ref(new Set<string | number>())
const notificationMessage = ref('')
const loadingPosts = ref(false)
const commentingPostId = ref<string | number | null>(null)
const commentText = ref('')

// Tipo unificado para posts da API e posts locais
interface DisplayPost {
  id: string | number
  author: string
  course: string
  institution: string
  avatar: string
  type: FeedPostType
  text?: string
  likes: number
  comments: number
  distance?: string
  publishedAt: string
  likedByMe: boolean
  productId?: number
}

interface ApiPostAuthor {
  id: string
  name: string
  course?: string
  institution?: string
}

interface ApiPost {
  id: string
  authorId: string
  content: string
  type: string
  createdAt: string
  author: ApiPostAuthor
  likesCount: number
  commentsCount: number
  likedByMe: boolean
}

interface ApiPostsResponse {
  data: ApiPost[]
  page: number
  size: number
  total: number
}

const apiPosts = ref<DisplayPost[]>([])

const tabs = [
  { label: 'Para você', value: 'for-you' },
  { label: 'Seguindo', value: 'following' },
  { label: 'Sua instituição', value: 'institution' },
]

const filters = [
  { label: 'Tudo', value: 'all' },
  { label: 'Produtos', value: 'sale' },
  { label: 'Perguntas', value: 'question' },
  { label: 'Eventos', value: 'event' },
  { label: 'Estagios', value: 'internship' },
  { label: 'Monitorias', value: 'mentoring' },
  { label: 'Perto de mim', value: 'nearby' },
]

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`
  if (diffH < 24) return `há ${diffH}h`
  if (diffD === 1) return 'ontem'
  return `há ${diffD} dias`
}

function mapApiPost(post: ApiPost): DisplayPost {
  return {
    id: post.id,
    author: post.author?.name ?? 'Usuário',
    course: post.author?.course ?? 'Estudante',
    institution: post.author?.institution ?? 'Academia+',
    avatar: '',
    type: (post.type as FeedPostType) ?? 'question',
    text: post.content,
    likes: post.likesCount,
    comments: post.commentsCount,
    distance: undefined,
    publishedAt: formatRelativeTime(post.createdAt),
    likedByMe: post.likedByMe,
  }
}

async function fetchPosts() {
  if (!authStore.token || authStore.token.startsWith('demo-token')) return

  loadingPosts.value = true
  try {
    const response = await apiFetchPosts<ApiPostsResponse>(authStore.token)
    apiPosts.value = response.data.map(mapApiPost)

    // Marcar posts já curtidos pelo usuário logado
    const initialLiked = new Set<string | number>(
      response.data.filter((p) => p.likedByMe).map((p) => p.id),
    )
    likedPosts.value = initialLiked
  } catch {
    // API offline — feed local já cobre visualmente
  } finally {
    loadingPosts.value = false
  }
}

onMounted(() => {
  fetchPosts()
})

// Posts locais convertidos para o mesmo formato
const localDisplayPosts = computed<DisplayPost[]>(() =>
  store.feedPosts.map((p) => ({
    id: p.id,
    author: p.author,
    course: p.course,
    institution: p.institution,
    avatar: p.avatar,
    type: p.type,
    text: p.text,
    likes: p.likes,
    comments: p.comments,
    distance: p.distance,
    publishedAt: p.publishedAt,
    likedByMe: false,
    productId: p.productId,
  })),
)

// Todos os posts: API primeiro, depois locais que não se sobrepõem
const allPosts = computed<DisplayPost[]>(() => {
  if (apiPosts.value.length > 0) {
    return [...apiPosts.value, ...localDisplayPosts.value]
  }
  return localDisplayPosts.value
})

const feedStories = computed(() => [
  {
    label: 'Seu story',
    initials: 'EU',
    color: 'bg-violet-600',
    avatar:
      'https://picsum.photos/200',
    isMine: true,
    institution: authStore.user?.institution || 'IFCE',
  },
  ...store.communities.slice(0, 5).map((community) => ({
    label: community.title,
    initials: community.course.slice(0, 2).toUpperCase(),
    color: community.color,
    avatar: '',
    isMine: false,
    institution: community.institution,
  })),
])

const visiblePosts = computed(() => {
  let posts = allPosts.value
  const currentInstitution = authStore.user?.institution || 'IFCE'

  if (activeTab.value === 'following') {
    posts = posts.filter(
      (post) =>
        ['joao.backend', 'maria.front', 'prof.mentor'].includes(post.author) ||
        typeof post.id === 'string',
    )
  } else if (activeTab.value === 'institution') {
    posts = posts.filter((post) => post.institution === currentInstitution)
  } else {
    posts = posts.filter(
      (post) =>
        typeof post.id === 'string' ||
        ['event', 'internship', 'mentoring'].includes(post.type) ||
        (post.type === 'sale' && post.institution !== currentInstitution),
    )
  }

  if (activeFilter.value === 'nearby') {
    return posts.filter((post) => post.distance?.includes('km') || post.distance === 'campus')
  }

  if (activeFilter.value === 'all') return posts

  return posts.filter((post) => post.type === activeFilter.value)
})

const tabNotice = computed(() => {
  if (activeTab.value === 'institution') {
    return {
      title: 'Comunicados da sua instituição',
      description:
        'Veja avisos, mentorias, oficinas e produtos publicados por alunos da sua instituição.',
    }
  }

  if (activeTab.value === 'following') {
    return {
      title: 'Novidades de quem você segue',
      description:
        'Acompanhe publicações de alunos, vendedores e comunidades que você já demonstrou interesse.',
    }
  }

  return {
    title: 'Selecionado para você',
    description:
      'Mentorias, avisos de workshop, oficinas, lives e produtos com base no seu curso e nas suas preferências.',
  }
})

function productById(id?: number) {
  return store.products.find((product) => product.id === id)
}

async function toggleLike(post: DisplayPost) {
  const liked = likedPosts.value.has(post.id)

  // Atualização otimista: muda a UI imediatamente
  if (liked) {
    likedPosts.value.delete(post.id)
    post.likes -= 1
  } else {
    likedPosts.value.add(post.id)
    post.likes += 1
  }
  likedPosts.value = new Set(likedPosts.value)

  // Se for post da API (id é string UUID), persiste no backend
  if (typeof post.id === 'string' && authStore.token && !authStore.token.startsWith('demo-token')) {
    try {
      if (liked) {
        await apiUnlikePost(authStore.token, post.id)
      } else {
        await apiLikePost(authStore.token, post.id)
      }
    } catch {
      // Reverte se der erro
      if (liked) {
        likedPosts.value.add(post.id)
        post.likes += 1
      } else {
        likedPosts.value.delete(post.id)
        post.likes -= 1
      }
      likedPosts.value = new Set(likedPosts.value)
    }
  }
}

function openComment(post: DisplayPost) {
  if (commentingPostId.value === post.id) {
    commentingPostId.value = null
    return
  }
  commentingPostId.value = post.id
  commentText.value = ''
}

async function submitComment(post: DisplayPost) {
  const text = commentText.value.trim()
  if (!text) return

  post.comments += 1
  commentText.value = ''
  commentingPostId.value = null

  if (typeof post.id === 'string' && authStore.token && !authStore.token.startsWith('demo-token')) {
    try {
      await apiCommentPost(authStore.token, post.id, text)
    } catch {
      post.comments -= 1
    }
  }
}

function selectStory(story: (typeof feedStories.value)[number]) {
  if (story.isMine) {
    activeTab.value = 'for-you'
    activeFilter.value = 'all'
    return
  }

  activeTab.value = story.institution === (authStore.user?.institution || 'IFCE') ? 'institution' : 'for-you'
  activeFilter.value = 'all'
}

function originalPrice(price?: number) {
  return Math.round((price || 0) * 1.5)
}

function postMeta(type: FeedPostType) {
  const meta = {
    sale: { label: 'Produto', class: 'bg-violet-50 text-violet-700' },
    question: { label: 'Pergunta', class: 'bg-sky-50 text-sky-700' },
    event: { label: 'Evento', class: 'bg-emerald-50 text-emerald-700' },
    internship: { label: 'Estagio', class: 'bg-orange-50 text-orange-700' },
    mentoring: { label: 'Monitoria', class: 'bg-rose-50 text-rose-700' },
    post: { label: 'Post', class: 'bg-slate-50 text-slate-700' },
  }

  return meta[type] ?? meta.post
}
</script>
