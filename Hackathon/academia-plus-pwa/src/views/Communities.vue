<template>
  <main class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black">Comunidades</h1>
        <p class="text-slate-500">Entre em grupos abertos ou solicite acesso nas comunidades fechadas.</p>
      </div>
      <Button
        label="Criar comunidade"
        icon="pi pi-plus"
        class="border-none bg-violet-600"
        :disabled="!canCreateCommunity"
      />
    </header>

    <section
      v-if="selectedCommunity"
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="bg-slate-950 p-5 text-white">
        <button class="mb-4 text-sm font-bold text-violet-200" type="button" @click="selectedId = null">
          <i class="pi pi-arrow-left mr-2"></i>
          Voltar para comunidades
        </button>
        <div class="flex flex-wrap items-center gap-4">
          <span
            :class="selectedCommunity.color"
            class="grid h-16 w-16 place-items-center rounded-full text-xl font-black text-white"
          >
            {{ selectedCommunity.course.slice(0, 2).toUpperCase() }}
          </span>
          <div>
            <h2 class="text-3xl font-black">{{ selectedCommunity.title }}</h2>
            <p class="text-slate-300">
              {{ selectedCommunity.visibility }} - {{ selectedCommunity.members }} membros
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-6 p-5 lg:grid-cols-[320px_1fr]">
        <aside>
          <h3 class="font-black">Membros em destaque</h3>
          <div class="mt-4 space-y-3">
            <article v-for="member in members" :key="member.username" class="flex items-center gap-3">
              <img :src="member.avatar" :alt="member.username" class="h-11 w-11 rounded-full object-cover" />
              <div class="min-w-0">
                <strong class="block truncate">{{ member.username }}</strong>
                <small class="text-slate-500">{{ member.role }}</small>
              </div>
            </article>
          </div>
        </aside>

        <section class="space-y-3">
          <h3 class="font-black">Comunicados e conversas</h3>
          <article
            v-for="post in communityPosts"
            :key="post"
            class="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            {{ post }}
          </article>
          <RouterLink to="/chat">
            <Button label="Abrir chat da comunidade" icon="pi pi-comments" class="border-none bg-violet-600" />
          </RouterLink>
        </section>
      </div>
    </section>

    <template v-else>
      <p v-if="!canCreateCommunity" class="rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800">
        Criação liberada para estudantes verificados ou usuários com selo de monitor, veterano ou embaixador.
      </p>

      <section class="grid gap-4 md:grid-cols-2">
        <article
          v-for="community in store.communities"
          :key="community.id"
          class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <span :class="community.color" class="grid h-14 w-14 place-items-center rounded-full font-black text-white">
              {{ community.course.slice(0, 2).toUpperCase() }}
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="truncate text-xl font-black">{{ community.title }}</h2>
              <p class="text-sm text-slate-500">
                {{ community.visibility }} - {{ community.members }} membros
              </p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {{ community.visibility === 'Publica' ? 'Aberta' : 'Fechada' }}
            </span>
          </div>

          <div class="mt-4 flex gap-3">
            <Button
              :label="community.visibility === 'Publica' ? 'Participar' : 'Solicitar acesso'"
              :icon="community.visibility === 'Publica' ? 'pi pi-users' : 'pi pi-lock'"
              class="flex-1 border-none bg-violet-600"
              @click="handleJoin(community)"
            />
            <Button icon="pi pi-info-circle" outlined />
          </div>

          <p v-if="requested.has(community.id)" class="mt-3 text-sm font-bold text-violet-700">
            Solicitação enviada. A resposta aparecerá nas suas notificações.
          </p>
        </article>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { persistChats, store } from '@/store'
import { useAuthStore } from '@/stores/auth'

type Community = (typeof store.communities)[number]

const authStore = useAuthStore()
const router = useRouter()
const requested = ref(new Set<number>())
const selectedId = ref<number | null>(null)

const members = [
  {
    username: 'larissa.dev',
    role: 'Fundadora da comunidade',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    username: 'joao.backend',
    role: 'Monitor',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
  {
    username: 'maria.front',
    role: 'Vendedora confiavel',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    username: 'pedro.db',
    role: 'Responde dúvidas',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    username: 'ana.estudos',
    role: 'Veterana',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
  },
]

const communityPosts = [
  'Aviso fixado: lista de materiais para o semestre foi atualizada.',
  'Joao compartilhou um resumo de Banco de Dados em PDF.',
  'Maria perguntou se alguem vai para a monitoria de algoritmos hoje.',
  'Pedro divulgou uma vaga de estagio para suporte em desenvolvimento web.',
]

const selectedCommunity = computed(() =>
  store.communities.find((community) => community.id === selectedId.value),
)

const canCreateCommunity = computed(
  () =>
    authStore.user?.verificationStatus === 'institutional_email' ||
    authStore.user?.verificationStatus === 'document_pending',
)

function handleJoin(community: Community) {
  if (community.visibility === 'Publica') {
    const existingChat = store.chats.find((chat) => chat.title === community.title)

    if (!existingChat) {
      store.chats.push({
        id: Date.now(),
        title: community.title,
        lastMessage: `Você entrou na comunidade ${community.title}.`,
        unread: 0,
        messages: [
          {
            text: `Bem-vindo ao chat da comunidade ${community.title}.`,
            senderName: 'Academia+',
            senderAvatar:
              'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=256&q=80',
          },
        ],
      })
    }

    persistChats()
    router.push({ name: 'chat', query: { community: community.title } })
    return
  }

  requested.value.add(community.id)
}
</script>
