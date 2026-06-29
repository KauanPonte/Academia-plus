<template>
  <main class="space-y-6">
    <header>
      <h1 class="text-3xl font-black">Busca</h1>
      <p class="text-slate-500">Encontre produtos, comunidades da sua instituição e grupos gerais.</p>
    </header>

    <label class="relative block">
      <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
      <InputText
        v-model="query"
        class="w-full pl-11"
        placeholder="Buscar por calculadora, Medicina - USP, mentorias..."
      />
    </label>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <h2 class="text-xl font-black">Comunidades</h2>
        <div class="mt-4 space-y-3">
          <p v-if="filteredCommunities.length === 0" class="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
            Não existe.
          </p>
          <article
            v-for="community in filteredCommunities"
            :key="community.id"
            class="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
          >
            <span :class="community.color" class="grid h-11 w-11 place-items-center rounded-full font-black text-white">
              {{ community.course.slice(0, 2).toUpperCase() }}
            </span>
            <div class="min-w-0 flex-1">
              <strong class="block truncate">{{ community.title }}</strong>
              <small class="text-slate-500">{{ community.visibility }} - {{ community.members }} membros</small>
            </div>
            <RouterLink to="/communities" class="text-sm font-bold text-violet-700">
              Ver
            </RouterLink>
          </article>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <h2 class="text-xl font-black">Produtos</h2>
        <div class="mt-4 space-y-3">
          <p v-if="filteredProducts.length === 0" class="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
            Não existe.
          </p>
          <RouterLink
            v-for="product in filteredProducts"
            :key="product.id"
            :to="{ name: 'product-detail', params: { id: product.id } }"
            class="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="h-14 w-14 rounded-lg bg-white object-contain p-1"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            />
            <div class="min-w-0 flex-1">
              <strong class="block truncate">{{ product.name }}</strong>
              <small class="text-slate-500">{{ product.location }} - R$ {{ product.price }},00</small>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { store } from '@/store'

const query = ref('')

const filteredCommunities = computed(() => {
  const term = query.value.toLowerCase()
  return store.communities.filter((community) =>
    [community.title, community.course, community.institution].join(' ').toLowerCase().includes(term),
  )
})

const filteredProducts = computed(() => {
  const term = query.value.toLowerCase()
  return store.products.filter((product) =>
    [product.name, product.description, product.category.name, product.location]
      .join(' ')
      .toLowerCase()
      .includes(term),
  )
})
</script>
