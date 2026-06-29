<template>
  <Teleport to="body">
    <Transition name="story-fade">
      <div
        v-if="modelValue !== null"
        class="sv-backdrop"
        @click.self="close"
        @keydown.esc="close"
        @keydown.left="prev"
        @keydown.right="next"
        tabindex="0"
        ref="overlayRef"
      >
        <!-- Close button -->
        <button class="sv-global-close" type="button" @click="close" aria-label="Fechar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Story strip -->
        <div class="sv-strip">
          <!-- Prev arrow -->
          <button
            v-if="prevStory"
            class="sv-arrow sv-arrow-left"
            type="button"
            @click="prev"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <!-- Prev story (peek) -->
          <div
            v-if="prevStory"
            class="sv-card sv-card-side sv-card-left"
            @click="prev"
          >
            <img
              v-if="prevStory.avatar"
              :src="prevStory.avatar"
              :alt="prevStory.label"
              class="sv-card-img"
              :class="prevStory.kind === 'product' ? 'object-contain' : 'object-cover'"
              referrerpolicy="no-referrer"
            />
            <div v-else :class="prevStory.color" class="sv-card-solid"></div>
            <div class="sv-card-dim"></div>
            <div class="sv-side-author">
              <span class="sv-side-avatar">
                <img v-if="prevStory.avatar" :src="prevStory.avatar" :alt="prevStory.label" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />
                <span v-else :class="prevStory.color" class="w-full h-full rounded-full grid place-items-center text-white font-black text-xs">{{ prevStory.initials }}</span>
              </span>
              <div>
                <strong class="sv-side-name">{{ prevStory.label }}</strong>
              </div>
            </div>
          </div>

          <!-- Current story (main card) -->
          <div class="sv-card sv-card-main">
            <template v-if="currentStory">
              <!-- Progress bars -->
              <div class="sv-progress-bars">
                <div v-for="(_s, i) in stories" :key="i" class="sv-progress-track">
                  <div class="sv-progress-fill" :style="progressStyle(i)"></div>
                </div>
              </div>

              <!-- Header -->
              <div class="sv-header">
                <div class="sv-author">
                  <span class="sv-avatar-ring">
                    <img
                      v-if="currentStory.authorAvatar"
                      :src="currentStory.authorAvatar"
                      :alt="currentStory.label"
                      class="sv-avatar-img object-cover"
                      referrerpolicy="no-referrer"
                    />
                    <span v-else :class="currentStory.color" class="sv-avatar-fallback">{{ currentStory.initials }}</span>
                  </span>
                  <div>
                    <strong class="sv-name">{{ currentStory.label }}</strong>
                    <small class="sv-inst">{{ currentStory.institution }}</small>
                  </div>
                </div>
              </div>

              <!-- Background image -->
              <div class="sv-bg">
                <img
                  v-if="currentStory.avatar"
                  :src="currentStory.avatar"
                  :alt="currentStory.label"
                  class="sv-bg-img"
                  :class="currentStory.kind === 'product' ? 'object-contain' : 'object-cover'"
                  referrerpolicy="no-referrer"
                />
                <div v-else :class="currentStory.color" class="sv-bg-solid"></div>
              </div>

              <!-- Gradient bottom -->
              <div class="sv-gradient"></div>

              <!-- Message -->
              <div class="sv-message-area">
                <span class="sv-badge" :class="kindClass(currentStory.kind)">{{ kindLabel(currentStory.kind) }}</span>
                <p class="sv-message-text">{{ currentStory.message }}</p>
              </div>

              <!-- Reply bar -->
              <div class="sv-reply-bar">
                <span class="sv-user-avatar">
                  <img
                    v-if="userAvatar"
                    :src="userAvatar"
                    alt="Você"
                    class="w-full h-full object-cover rounded-full"
                    referrerpolicy="no-referrer"
                  />
                  <span v-else class="sv-user-avatar-fallback">{{ userInitials }}</span>
                </span>
                <button
                  class="sv-reply-input"
                  type="button"
                  @click.stop="goToChat"
                >
                  Responder a {{ currentStory.label }}...
                </button>
                <button class="sv-reply-action" type="button" aria-label="Compartilhar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>

              <!-- Tap zones -->
              <button class="sv-tap-prev" type="button" @click.stop="prev" aria-label="Anterior"></button>
              <button class="sv-tap-next" type="button" @click.stop="next" aria-label="Próximo"></button>
            </template>
          </div>

          <!-- Next story (peek) -->
          <div
            v-if="nextStory"
            class="sv-card sv-card-side sv-card-right"
            @click="next"
          >
            <img
              v-if="nextStory.avatar"
              :src="nextStory.avatar"
              :alt="nextStory.label"
              class="sv-card-img"
              :class="nextStory.kind === 'product' ? 'object-contain' : 'object-cover'"
              referrerpolicy="no-referrer"
            />
            <div v-else :class="nextStory.color" class="sv-card-solid"></div>
            <div class="sv-card-dim"></div>
            <div class="sv-side-author">
              <span class="sv-side-avatar">
                <img v-if="nextStory.avatar" :src="nextStory.avatar" :alt="nextStory.label" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />
                <span v-else :class="nextStory.color" class="w-full h-full rounded-full grid place-items-center text-white font-black text-xs">{{ nextStory.initials }}</span>
              </span>
              <div>
                <strong class="sv-side-name">{{ nextStory.label }}</strong>
              </div>
            </div>
          </div>

          <!-- Next arrow -->
          <button
            v-if="nextStory"
            class="sv-arrow sv-arrow-right"
            type="button"
            @click="next"
            aria-label="Próximo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface Story {
  label: string
  initials: string
  color: string
  avatar: string
  authorAvatar: string
  isMine: boolean
  institution: string
  kind: 'mine' | 'product' | 'announcement' | 'community'
  message: string
}

const props = defineProps<{
  modelValue: number | null
  stories: Story[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'story-action': [story: Story]
}>()

const router = useRouter()
const authStore = useAuthStore()

const userAvatar = computed(() => '')
const userInitials = computed(() => {
  const name = authStore.user?.name ?? authStore.user?.email ?? 'U'
  return name.charAt(0).toUpperCase()
})

function goToChat() {
  close()
  router.push({ name: 'chat' })
}

const STORY_DURATION = 5000
const overlayRef = ref<HTMLElement | null>(null)
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
let startTime = 0

const currentIndex = computed(() => props.modelValue ?? 0)
const currentStory = computed(() => props.stories[currentIndex.value] ?? null)
const prevStory = computed(() => currentIndex.value > 0 ? (props.stories[currentIndex.value - 1] ?? null) : null)
const nextStory = computed(() => currentIndex.value < props.stories.length - 1 ? (props.stories[currentIndex.value + 1] ?? null) : null)

function progressStyle(i: number) {
  if (i < currentIndex.value) return { width: '100%' }
  if (i > currentIndex.value) return { width: '0%' }
  return { width: `${Math.min((elapsed.value / STORY_DURATION) * 100, 100)}%`, transition: 'none' }
}

function startTimer() {
  stopTimer()
  startTime = Date.now()
  elapsed.value = 0
  timer = setInterval(() => {
    elapsed.value = Date.now() - startTime
    if (elapsed.value >= STORY_DURATION) next()
  }, 50)
}

function stopTimer() {
  if (timer !== null) { clearInterval(timer); timer = null }
}

function next() {
  const nextIdx = currentIndex.value + 1
  if (nextIdx >= props.stories.length) { close(); return }
  emit('update:modelValue', nextIdx)
}

function prev() {
  const prevIdx = currentIndex.value - 1
  if (prevIdx < 0) return
  emit('update:modelValue', prevIdx)
}

function close() {
  stopTimer()
  emit('update:modelValue', null)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val !== null) {
      const story = props.stories[val]
      if (story) emit('story-action', story)
      startTimer()
      nextTick(() => overlayRef.value?.focus())
    } else {
      stopTimer()
    }
  },
  { immediate: true },
)

onUnmounted(() => stopTimer())

function kindLabel(kind: string) {
  const map: Record<string, string> = { mine: 'Seu Story', product: 'Produto', announcement: 'Comunicado', community: 'Comunidade' }
  return map[kind] ?? kind
}

function kindClass(kind: string) {
  const map: Record<string, string> = { mine: 'bg-violet-600', product: 'bg-emerald-600', announcement: 'bg-orange-500', community: 'bg-sky-600' }
  return map[kind] ?? 'bg-slate-600'
}
</script>

<style scoped>
/* Backdrop */
.sv-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.sv-global-close {
  position: absolute;
  top: 20px;
  right: 24px;
  color: #fff;
  background: rgba(255,255,255,0.12);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 20;
  transition: background 0.15s;
}
.sv-global-close:hover { background: rgba(255,255,255,0.25); }

/* Strip: side cards + main card + arrows */
.sv-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 0 60px;
}

/* Arrows */
.sv-arrow {
  color: #fff;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.15s;
}
.sv-arrow:hover { background: rgba(255,255,255,0.3); }

/* Cards */
.sv-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  background: #111;
}

/* Main card */
.sv-card-main {
  width: min(390px, 90vw);
  height: min(692px, 85vh);
  display: flex;
  flex-direction: column;
  z-index: 2;
}

/* Side cards */
.sv-card-side {
  width: min(220px, 22vw);
  height: min(480px, 60vh);
  cursor: pointer;
  transition: transform 0.2s;
  display: none;
}
@media (min-width: 768px) { .sv-card-side { display: block; } }
.sv-card-side:hover { transform: scale(1.02); }

.sv-card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.sv-card-solid {
  position: absolute;
  inset: 0;
}
.sv-card-dim {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
}
.sv-side-author {
  position: absolute;
  bottom: 16px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sv-side-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.8);
  flex-shrink: 0;
  display: block;
}
.sv-side-name {
  display: block;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main card internals */
.sv-progress-bars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  gap: 4px;
  padding: 10px 10px 0;
}
.sv-progress-track {
  flex: 1;
  height: 3px;
  background: rgba(255,255,255,0.35);
  border-radius: 2px;
  overflow: hidden;
}
.sv-progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 2px;
}

.sv-header {
  position: absolute;
  top: 22px;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 8px 12px;
}
.sv-author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sv-avatar-ring {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.85);
  display: block;
  flex-shrink: 0;
  background: #333;
}
.sv-avatar-img {
  width: 100%;
  height: 100%;
  display: block;
}
.sv-avatar-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 0.8rem;
  color: #fff;
  border-radius: 50%;
}
.sv-name {
  display: block;
  color: #fff;
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}
.sv-inst {
  display: block;
  color: rgba(255,255,255,0.72);
  font-size: 0.73rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.sv-bg {
  position: absolute;
  inset: 0;
}
.sv-bg-img {
  width: 100%;
  height: 100%;
}
.sv-bg-solid {
  width: 100%;
  height: 100%;
}

.sv-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%);
  z-index: 2;
}

.sv-message-area {
  position: absolute;
  bottom: 76px;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 0 16px 12px;
}
.sv-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}
.sv-message-text {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.45;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
}

/* Reply bar */
.sv-reply-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 20px;
  background: transparent;
}
.sv-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.8);
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #7c3aed;
}
.sv-user-avatar-fallback {
  color: #fff;
  font-weight: 900;
  font-size: 0.9rem;
}
.sv-reply-input {
  flex: 1;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 999px;
  padding: 10px 18px;
  color: rgba(255,255,255,0.75);
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sv-reply-input:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.6);
  color: #fff;
}
.sv-reply-action {
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 4px;
  opacity: 0.85;
  transition: opacity 0.15s;
}
.sv-reply-action:hover { opacity: 1; }

/* Tap zones */
.sv-tap-prev,
.sv-tap-next {
  position: absolute;
  top: 0;
  bottom: 80px;
  width: 38%;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 5;
}
.sv-tap-prev { left: 0; }
.sv-tap-next { right: 0; }

/* Transition */
.story-fade-enter-active,
.story-fade-leave-active { transition: opacity 0.2s ease; }
.story-fade-enter-from,
.story-fade-leave-to { opacity: 0; }
</style>
