<template>
  <nav class="bg-white/90 backdrop-blur-sm ring-1 ring-gray-900/5 sticky top-0 z-30">
    <div class="container">
      <div class="flex items-center justify-between h-14">
        <router-link to="/" class="flex items-baseline gap-2 group">
          <span class="font-semibold text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors">
            Prompt Store
          </span>
        </router-link>

        <div class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <button
          type="button"
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden text-sm font-medium text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          :aria-expanded="isMenuOpen"
        >
          {{ isMenuOpen ? 'Fechar' : 'Menu' }}
        </button>
      </div>

      <transition
        enter-active-class="transition ease-out duration-200 motion-reduce:transition-none"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150 motion-reduce:transition-none"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="isMenuOpen" class="md:hidden py-3 border-t border-gray-100">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="block py-2 text-sm nav-link border-b-0"
            :class="{ 'nav-link-active': $route.path === item.path }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const navItems = [
  { name: 'Início', path: '/' },
  { name: 'Blocos', path: '/blocos' },
  { name: 'Tags', path: '/tags' },
  { name: 'Configurações', path: '/configuracoes' }
]
</script>
