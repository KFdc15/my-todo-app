<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);

const props = defineProps<{ filter: "all" | "active" | "completed" }>();
const emit = defineEmits<{
  (e: "set-filter", val: "all" | "active" | "completed"): void;
}>();
</script>

<template>
  <button
    @click="open = !open"
    class="fixed top-6 left-6 z-50 flex flex-col justify-center items-center w-10 h-10 bg-gray-800 rounded hover:bg-gray-700"
    aria-label="Open sidebar"
  >
    <span class="block w-6 h-0.5 bg-white mb-1"></span>
    <span class="block w-6 h-0.5 bg-white mb-1"></span>
    <span class="block w-6 h-0.5 bg-white"></span>
  </button>

  <transition name="slide">
    <aside
      v-if="open"
      class="fixed top-0 left-0 h-full w-64 bg-[#181818] shadow-lg z-40 flex flex-col pt-16"
    >
    <br></br>
      <nav class="flex flex-col space-y-6 px-8">
        <a href="#" class="text-white sidebar" @click="emit('set-filter', 'all'); open=false" :class="{ 'font-bold sidebar': props.filter==='all' }">All Tasks</a>
        <a href="#" class="text-white sidebar" @click="emit('set-filter', 'active'); open=false" :class="{ 'font-bold sidebar': props.filter==='active' }">Active Tasks</a>
        <a href="#" class="text-white sidebar" @click="emit('set-filter', 'completed'); open=false" :class="{ 'font-bold sidebar': props.filter==='completed' }">Completed Tasks</a>
      </nav>
    </aside>
  </transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.sidebar {
  will-change: filter;
  transition: filter 300ms;
}
.sidebar:hover {
  filter: drop-shadow(0 0 1.5em #fff2f2aa);
}
</style>