<template>
  <main class="chat-view grid min-h-[calc(100vh-150px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[390px_1fr]">
    <aside class="flex min-h-[76vh] flex-col border-b border-slate-200 bg-white xl:border-b-0 xl:border-r">
      <header class="p-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-black">Chat</h1>
            <p class="text-sm text-slate-500">Conversas individuais, grupos e mentores.</p>
          </div>
          <Button icon="pi pi-info-circle" rounded text severity="secondary" aria-label="Informacoes do chat" />
        </div>

        <label class="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 text-slate-500">
          <i class="pi pi-search"></i>
          <input
            v-model="search"
            class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Buscar conversas"
            type="search"
          />
        </label>
      </header>

      <nav class="grid grid-cols-3 border-b border-slate-200 px-5">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="relative min-h-12 text-sm font-black text-slate-500"
          :class="activeTab === tab.value ? 'text-violet-700' : ''"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.value"
            class="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-violet-600"
          ></span>
        </button>
      </nav>

      <div class="conversation-scroll flex-1 overflow-y-auto p-4">
        <button
          v-for="chat in visibleChats"
          :key="chat.id"
          type="button"
          class="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition"
          :class="activeChatId === chat.id ? 'bg-violet-50 text-violet-950' : 'hover:bg-slate-50'"
          @click="activeChatId = chat.id"
        >
          <span
            class="grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-black text-white ring-4 ring-white"
            :class="chatAvatar(chat.id).class"
          >
            {{ chatAvatar(chat.id).label }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center justify-between gap-3">
              <strong class="block truncate">{{ chat.title }}</strong>
              <small class="shrink-0 text-xs font-bold text-slate-400">{{ chatTime(chat.id) }}</small>
            </span>
            <small class="mt-1 block truncate font-semibold text-slate-500">{{ chat.lastMessage }}</small>
          </span>
          <span v-if="chat.unread" class="grid h-6 min-w-6 place-items-center rounded-full bg-violet-600 px-2 text-xs font-black text-white">
            {{ chat.unread }}
          </span>
        </button>
      </div>
    </aside>

    <section class="flex min-h-[82vh] flex-col bg-white">
      <header class="flex items-center gap-4 border-b border-slate-200 p-5">
        <span
          class="grid h-12 w-12 place-items-center rounded-full text-sm font-black text-white"
          :class="chatAvatar(activeChat?.id).class"
        >
          {{ chatAvatar(activeChat?.id).label }}
        </span>
        <div class="min-w-0 flex-1">
          <h2 class="truncate text-xl font-black">{{ activeChat?.title }}</h2>
          <p class="truncate text-sm text-slate-500">
            Combine compras, tire dúvidas e converse sem expor dados sensíveis.
          </p>
        </div>
        <Button icon="pi pi-ellipsis-v" rounded text severity="secondary" aria-label="Mais opcoes" />
      </header>

      <div class="message-scroll flex-1 space-y-4 overflow-y-auto bg-emerald-50/60 p-5 md:p-7">
        <div
          v-for="(message, index) in activeChat?.messages"
          :key="`${message.text}-${index}`"
          class="max-w-[82%] md:max-w-[74%]"
          :class="isMine(message) ? 'ml-auto' : ''"
        >
          <div class="flex items-end gap-3" :class="isMine(message) ? 'justify-end' : ''">
            <img
              v-if="showSenderIdentity(message)"
              :src="message.senderAvatar"
              :alt="message.senderName"
              class="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
            />
            <div class="min-w-0">
              <strong
                v-if="showSenderIdentity(message)"
                class="mb-1 block pl-1 text-xs font-black text-emerald-800"
              >
                {{ message.senderName }}
              </strong>
              <div
                class="rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm md:text-base"
                :class="
                  isMine(message)
                    ? 'rounded-br-lg bg-emerald-200 text-emerald-950'
                    : 'rounded-bl-lg bg-white text-slate-700 ring-1 ring-emerald-100'
                "
              >
                {{ message.text }}
              </div>
            </div>
          </div>
          <small
            v-if="isMine(message)"
            class="mt-1 block pr-2 text-right text-[0.7rem] font-black text-emerald-700"
          >
            Visto
          </small>
        </div>
      </div>

      <form class="flex gap-3 border-t border-slate-200 bg-white p-4 md:p-5" @submit.prevent="sendMessage">
        <InputText v-model="draft" class="flex-1" placeholder="Digite sua mensagem..." />
        <Button icon="pi pi-send" label="Enviar" class="border-none bg-emerald-500 px-5 text-white" type="submit" />
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { persistChats, store, type ChatMessage } from '@/store'

type ChatTab = 'all' | 'unread' | 'groups'

const activeChatId = ref(store.chats[0]?.id)
const route = useRoute()
const draft = ref('')
const search = ref('')
const activeTab = ref<ChatTab>('all')

const tabs = [
  { label: 'Todas', value: 'all' },
  { label: 'Não lidas', value: 'unread' },
  { label: 'Grupos', value: 'groups' },
] as const

const activeChat = computed(() => store.chats.find((chat) => chat.id === activeChatId.value))

watch(
  () => route.query.community,
  (community) => {
    const communityName = community?.toString().toLowerCase() || ''
    if (!communityName) return

    const chat = store.chats.find((item) => item.title.toLowerCase() === communityName)
    if (chat) activeChatId.value = chat.id
  },
  { immediate: true },
)

const visibleChats = computed(() => {
  const query = search.value.trim().toLowerCase()
  return store.chats.filter((chat) => {
    const matchesSearch = [chat.title, chat.lastMessage].join(' ').toLowerCase().includes(query)
    if (!matchesSearch) return false
    if (activeTab.value === 'unread') return chat.unread > 0
    if (activeTab.value === 'groups') return chat.id !== 1
    return true
  })
})

function chatAvatar(id?: number) {
  const avatarMap = {
    1: { label: 'JO', class: 'bg-violet-600' },
    2: { label: 'EN', class: 'bg-emerald-700' },
    3: { label: 'ME', class: 'bg-violet-700' },
  } as Record<number, { label: string; class: string }>

  return avatarMap[id || 1] || { label: 'CH', class: 'bg-sky-700' }
}

function chatTime(id?: number) {
  const timeMap = {
    1: '09:41',
    2: 'Ontem',
    3: '10:24',
  } as Record<number, string>

  return timeMap[id || 1] || '2d'
}

function isMine(message?: ChatMessage) {
  return !!message?.mine
}

function showSenderIdentity(message?: ChatMessage) {
  return activeChat.value?.id !== 1 && !isMine(message) && !!message?.senderName && !!message?.senderAvatar
}

function sendMessage() {
  if (!draft.value.trim() || !activeChat.value) return
  activeChat.value.messages.push({ text: draft.value.trim(), mine: true })
  activeChat.value.lastMessage = `Você: ${draft.value.trim()}`
  persistChats()
  draft.value = ''
}
</script>

<style scoped>
:deep(.p-inputtext) {
  min-height: 48px;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  background: #ecfdf5;
  color: #064e3b;
  box-shadow: none;
}

:deep(.p-inputtext::placeholder) {
  color: #4b927b;
}

:deep(.p-inputtext:enabled:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.conversation-scroll,
.message-scroll {
  scrollbar-color: #a7f3d0 #ecfdf5;
  scrollbar-width: thin;
}

.conversation-scroll::-webkit-scrollbar,
.message-scroll::-webkit-scrollbar {
  width: 10px;
}

.conversation-scroll::-webkit-scrollbar-track,
.message-scroll::-webkit-scrollbar-track {
  background: #ecfdf5;
}

.conversation-scroll::-webkit-scrollbar-thumb,
.message-scroll::-webkit-scrollbar-thumb {
  border: 2px solid #ecfdf5;
  border-radius: 999px;
  background: #a7f3d0;
}
</style>
