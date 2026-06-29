<template>
  <article class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div class="aspect-[4/3] w-full overflow-hidden bg-white">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        class="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-[1.03]"
      />
    </div>

    <div class="p-4">
      <span class="text-xs font-black uppercase text-violet-700">
        {{ product.category?.name || 'Material estudantil' }}
      </span>
      <h3 class="mt-1 truncate text-lg font-black text-slate-950">{{ product.name }}</h3>
      <p class="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">{{ product.description }}</p>

      <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
        <span>Nota 5.0</span>
        <span>Verificado</span>
        <span>{{ product.location }}</span>
      </div>

      <div class="mt-4 flex items-center justify-between gap-3">
        <div>
          <small class="block text-xs text-slate-500">Preço usado</small>
          <p class="text-xl font-black text-slate-950">R$ {{ product.price }},00</p>
        </div>
        <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          Verificado
        </span>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Product } from '@/model/product.model'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
})
</script>
