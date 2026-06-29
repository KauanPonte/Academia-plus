<template>
  <main class="min-h-[70vh] bg-white p-4 md:p-6">
    <section class="cart-summary mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h1 class="mb-8 flex items-center gap-3 text-2xl font-black text-violet-950">
        <i class="pi pi-shopping-cart text-violet-600"></i>
        Meu Carrinho
      </h1>

      <div v-if="store.cart.list.length === 0" class="flex flex-col items-center py-20 text-center">
        <i class="pi pi-box mb-4 text-6xl text-emerald-200"></i>
        <p class="text-lg font-semibold text-slate-500">O seu carrinho ainda está vazio.</p>
        <RouterLink to="/products" class="mt-6">
          <Button label="Voltar ao marketplace" icon="pi pi-arrow-left" outlined class="text-violet-700" />
        </RouterLink>
      </div>

      <div
        v-for="(item, index) in store.cart.list"
        :key="index"
        class="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 last:mb-0"
      >
        <div class="flex flex-col gap-5 md:flex-row md:items-center">
          <div class="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="h-full w-full object-contain p-2"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            />
          </div>

          <div class="min-w-0 flex-1">
            <h2 class="text-xl font-black text-slate-950">{{ item.product.name }}</h2>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-slate-600">
              <span class="rounded-lg bg-white px-3 py-1 text-sm font-bold text-emerald-800">
                Qtd: {{ item.quantity }}
              </span>
              <span class="text-sm">Preço unitário: R$ {{ item.product.price }},00</span>
            </div>

            <div class="mt-3 flex gap-2">
              <Button
                v-if="item.quantity > 1"
                icon="pi pi-minus"
                class="border-none bg-white text-emerald-800"
                @click="store.cart.decItem(item.product.id)"
              />
              <Button
                icon="pi pi-plus"
                class="border-none bg-white text-emerald-800"
                @click="store.cart.addItem(item.product)"
              />
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              label="Remover"
              class="p-0 text-xs font-semibold"
              @click="confirmExclude(item.product.id)"
            />
            <p class="text-2xl font-black text-violet-700">
              R$ {{ item.product.price * item.quantity }},00
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="store.cart.list.length > 0"
        class="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 md:flex-row"
      >
        <div class="text-center md:text-left">
          <p class="mb-1 text-sm font-bold uppercase tracking-widest text-slate-500">
            Total de itens: {{ store.cart.total }}
          </p>
          <h3 class="text-2xl font-black text-slate-950">Valor total da compra</h3>
        </div>
        <div class="text-center md:text-right">
          <p class="text-5xl font-black text-violet-700">
            R$ {{ store.cart.price }},00
          </p>
          <Button
            label="Finalizar pedido"
            icon="pi pi-check"
            class="mt-4 w-full border-none bg-emerald-400 text-slate-950"
          />
        </div>
      </div>
    </section>

    <ConfirmDialog />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { store } from '@/store'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'

export default defineComponent({
  name: 'CartView',
  components: {
    Button,
    ConfirmDialog,
  },
  data() {
    return {
      store,
    }
  },
  methods: {
    confirmExclude(productId: number) {
      this.$confirm.require({
        message: 'Tem certeza que deseja remover este produto do carrinho?',
        header: 'Confirmar exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, remover',
        rejectLabel: 'Cancelar',
        acceptClass: 'p-button-danger',
        accept: () => {
          store.cart.excludeItem(productId)
        },
      })
    },
  },
})
</script>
