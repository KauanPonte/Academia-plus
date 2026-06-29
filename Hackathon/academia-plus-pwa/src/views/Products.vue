<template>
  <main class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black">Marketplace estudantil</h1>
        <p class="text-slate-500">Itens usados, materiais de estudo e servicos entre alunos.</p>
      </div>
    </header>

    <section class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="cursor-pointer"
        @click="goToDetail(product)"
      >
        <ProductCard :product="product" />
      </div>
    </section>

    <div v-if="filteredProducts.length === 0" class="rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
      <i class="pi pi-search mb-3 block text-4xl text-slate-300"></i>
      <p class="text-slate-500">Nenhum item encontrado para sua busca.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store'
import type { Product } from '@/model/product.model'
import ProductCard from '@/components/card/ProductCard.vue'

const router = useRouter()
const searchQuery = inject<Ref<string>>('searchFilters', ref(''))

const filteredProducts = computed(() => {
  const term = searchQuery.value.toLowerCase().trim()
  if (!term) return store.products

  return store.products.filter((product) =>
    [product.name, product.description, product.category.name].join(' ').toLowerCase().includes(term),
  )
})

function goToDetail(product: Product) {
  router.push({ name: 'product-detail', params: { id: product.id.toString() } })
}
</script>
