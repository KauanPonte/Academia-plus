<template>
  <div class="min-h-screen bg-slate-50 pb-20 text-slate-950 lg:grid lg:grid-cols-[320px_1fr] lg:pb-0">
    <aside class="sticky top-0 hidden h-screen overflow-hidden bg-[#08071d] p-6 text-white lg:block">
      <RouterLink to="/" class="flex items-center gap-4">
        <span class="grid h-20 w-20 place-items-center rounded-3xl bg-violet-600 shadow-xl">
          <i class="pi pi-graduation-cap text-5xl"></i>
        </span>
        <span>
          <strong class="block text-4xl font-black leading-none">Academia<span class="text-violet-500">+</span></strong>
          <small class="mt-2 block text-lg font-bold text-violet-400">Conecte. Compartilhe. Evolua.</small>
        </span>
      </RouterLink>

      <p class="mt-8 text-2xl font-semibold leading-tight text-slate-100">
        A rede social e marketplace feita por e para alunos.
      </p>

      <div class="mt-8 grid gap-5">
        <RouterLink
          v-for="feature in sidebarFeatures"
          :key="feature.title"
          :to="feature.to"
          class="group grid grid-cols-[52px_1fr] gap-5 rounded-xl p-2 transition hover:bg-white/5"
        >
          <i :class="feature.icon" class="text-4xl text-violet-500 transition group-hover:text-emerald-300"></i>
          <span>
            <strong class="block text-lg">{{ feature.title }}</strong>
            <small class="mt-1 block text-sm leading-snug text-slate-300">{{ feature.description }}</small>
          </span>
        </RouterLink>
      </div>

      <strong class="mt-12 block text-xl text-violet-400">Para alunos. Por alunos. Com você.</strong>
    </aside>

    <div class="min-w-0">
      <nav class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center gap-3">
          <RouterLink to="/" class="flex items-center gap-2 lg:hidden">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 font-black text-white">
              <i class="pi pi-graduation-cap text-2xl"></i>
            </span>
            <span class="hidden text-xl font-black sm:inline">Academia+</span>
          </RouterLink>

          <div class="min-w-0 flex-1">
            <div class="relative">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Buscar produtos, comunidades ou alunos..."
                class="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500"
              />
              <div
                v-if="showGlobalSearchEmpty"
                class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-black text-violet-700 shadow-xl"
              >
                Não tem!
              </div>
            </div>
          </div>

          <div class="ml-auto hidden items-center gap-1 xl:flex">
            <RouterLink v-for="item in desktopNavItems" :key="item.to" :to="item.to">
              <Button :label="item.label" :icon="item.icon" text />
            </RouterLink>
            <Button icon="pi pi-bell" rounded text severity="secondary" aria-label="Notificações" @click="showNoNotifications" />
            <Button icon="pi pi-sign-out" rounded severity="danger" text @click="handleLogout" />
          </div>

          <RouterLink to="/profile" class="xl:hidden">
            <Button icon="pi pi-user" rounded severity="secondary" />
          </RouterLink>
        </div>
      </nav>

      <main class="mx-auto max-w-7xl p-4 md:p-6">
        <RouterView />
      </main>
    </div>

    <nav class="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] lg:hidden">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="grid min-h-12 place-items-center gap-1 rounded-lg text-xs font-bold text-slate-500"
        active-class="text-violet-700"
      >
        <i :class="item.icon"></i>
        <span>{{ item.short }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { store } from '@/store'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const searchQuery = ref('')

const normalizeSearch = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const globalSearchItems = computed(() => [
  ...store.products.flatMap((product) => [
    product.name,
    product.description,
    product.category?.name,
  ]),
  ...store.communities.flatMap((community) => [
    community.title,
    community.institution,
    community.course,
  ]),
  ...store.feedPosts.flatMap((post) => [
    post.author,
    post.course,
    post.institution,
    post.text,
  ]),
])

const showGlobalSearchEmpty = computed(() => {
  const term = normalizeSearch(searchQuery.value.trim())

  if (!term) {
    return false
  }

  return !globalSearchItems.value.some((item) => normalizeSearch(item).includes(term))
})

const sidebarFeatures = [
  {
    title: 'Marketplace estudantil',
    description: 'Compre e venda itens usados com preços mais acessíveis.',
    icon: 'pi pi-shopping-bag',
    to: '/products',
  },
  {
    title: 'Comunidades por curso',
    description: 'Converse com alunos da sua instituição ou de todo o Brasil.',
    icon: 'pi pi-users',
    to: '/communities',
  },
  {
    title: 'Chat e grupos',
    description: 'Tire dúvidas, troque ideias e crie uma rede de apoio real.',
    icon: 'pi pi-comments',
    to: '/chat',
  },
  {
    title: 'Conexão que transforma',
    description: 'Porque juntos, vamos mais longe.',
    icon: 'pi pi-heart',
    to: '/',
  },
]

const navItems = [
  { to: '/', label: 'Início', short: 'Início', icon: 'pi pi-home' },
  { to: '/search', label: 'Busca', short: 'Buscar', icon: 'pi pi-search' },
  { to: '/communities', label: 'Comunidades', short: 'Grupos', icon: 'pi pi-users' },
  { to: '/chat', label: 'Chat', short: 'Chat', icon: 'pi pi-comments' },
  { to: '/profile', label: 'Perfil', short: 'Perfil', icon: 'pi pi-user' },
]

const desktopNavItems = [
  { to: '/', label: 'Início', icon: 'pi pi-home' },
  { to: '/products', label: 'Marketplace', icon: 'pi pi-shopping-bag' },
  { to: '/communities', label: 'Comunidades', icon: 'pi pi-users' },
  { to: '/chat', label: 'Chat', icon: 'pi pi-comments' },
  { to: '/profile', label: 'Perfil', icon: 'pi pi-user' },
]

provide('searchFilters', searchQuery)

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const showNoNotifications = () => {
  toast.add({
    severity: 'info',
    summary: 'Sem notificações',
    detail: 'Você não tem notificações novas no momento.',
    life: 3000,
  })
}
</script>
