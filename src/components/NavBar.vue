<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 mb-6">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">PS</span>
          </div>
          <span class="font-semibold text-gray-800 hidden sm:inline">Prompt Store</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            :class="{ 'text-primary-600': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isMenuOpen" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-gray-100">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
            :class="{ 'text-primary-600': $route.path === item.path }"
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
