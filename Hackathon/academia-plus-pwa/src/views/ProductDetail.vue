<template>
  <main>
    <div v-if="!product" class="py-20 text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-violet-600"></i>
    </div>

    <section v-else class="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
      <div class="grid min-h-[420px] place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[620px]">
        <img
          :src="product.image"
          :alt="product.name"
          referrerpolicy="no-referrer"
          class="max-h-[620px] w-full object-contain p-6"
        />
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <nav class="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <RouterLink to="/" class="font-bold text-violet-700">Início</RouterLink>
          <i class="pi pi-chevron-right text-xs"></i>
          <span>{{ product.name }}</span>
        </nav>

        <h1 class="text-4xl font-black">{{ product.name }}</h1>
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
            {{ product.category.name }}
          </span>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
            {{ product.condition }}
          </span>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
            {{ product.location }}
          </span>
        </div>

        <p class="mt-5 text-lg leading-relaxed text-slate-600">{{ product.description }}</p>

        <div class="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-900">
          <span class="text-sm font-bold">Preço do produto</span>
          <strong class="mt-1 block text-4xl">R$ {{ product.price.toFixed(2).replace('.', ',') }}</strong>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <strong class="block">Entrega e localizacao</strong>
              <span class="text-sm text-slate-500">
                Origem: {{ product.location }} - Destino: {{ authStore.user?.city }},
                {{ authStore.user?.state }}
              </span>
            </div>
            <span class="rounded-full bg-violet-50 px-3 py-1 text-sm font-black text-violet-700">
              {{ freightLabel }}
            </span>
          </div>
          <p class="mt-3 text-xs text-slate-500">
            Seu CEP não aparece publicamente. Ele deve ser usado apenas para calcular entrega
            durante a compra.
          </p>
        </div>

        <div class="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <img
            :src="sellerAvatar"
            alt="Vendedor"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div class="min-w-0 flex-1">
            <strong class="block">{{ product.seller }}</strong>
            <span class="text-sm text-slate-500">
              {{ product.sellerCourse }} - {{ product.sellerInstitution }}
            </span>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
              Verificado
            </span>
            <Button
              :label="isFollowingSeller ? 'Seguindo' : 'Seguir'"
              :icon="isFollowingSeller ? 'pi pi-check' : 'pi pi-user-plus'"
              size="small"
              class="border-none"
              :class="isFollowingSeller ? 'bg-emerald-500' : 'bg-violet-600'"
              @click="toggleSellerFollow"
            />
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button label="Conversar" icon="pi pi-comments" outlined class="flex-1" @click="talkToSeller" />
          <Button
            :label="isSaved ? 'Salvo' : 'Salvar'"
            :icon="isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
            outlined
            class="flex-1"
            @click="toggleSave"
          />
          <Button
            label="Comprar"
            icon="pi pi-shopping-cart"
            class="flex-1 border-none bg-violet-600"
            @click="addToCart"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import {
  isProductSaved,
  isSellerFollowed,
  startProductChat,
  store,
  toggleFollowSeller,
  toggleSavedProduct,
} from '@/store'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const product = computed(() => store.products.find((item) => item.id === Number(route.params.id)))
const isSaved = computed(() => (product.value ? isProductSaved(product.value.id) : false))
const isFollowingSeller = computed(() => (product.value ? isSellerFollowed(product.value.seller) : false))
const sellerAvatar = computed(() => {
  const avatars: Record<string, string> = {
    'joao.backend':
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    'maria.front':
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'larissa.dev':
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    'pedro.db':
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    'ana.estudos':
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
  }

  return avatars[product.value?.seller || ''] || avatars['larissa.dev']
})
const freightLabel = computed(() => {
  if (!product.value) return 'Frete a calcular'
  return product.value.state === authStore.user?.state ? 'Frete local' : 'Frete interestadual'
})

function toggleSave() {
  if (!product.value) return
  toggleSavedProduct(product.value.id)
}

function toggleSellerFollow() {
  if (!product.value) return
  toggleFollowSeller(product.value.seller)
}

function talkToSeller() {
  if (!product.value) return
  startProductChat(product.value)
  router.push({ name: 'chat', query: { community: product.value.seller } })
}

function addToCart() {
  if (!product.value) return
  store.cart.addItem(product.value)
  router.push('/checkout')
}
</script>
