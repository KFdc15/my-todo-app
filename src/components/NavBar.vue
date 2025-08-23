<script setup lang="ts">
import ShinyText from "./ShinyText.vue";
</script>

<template>
  <nav class="py-5 bg-transparent">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex-1 flex justify-center">
          <ShinyText class="text-3xl font-bold nav" text="📝 My Todo App"/>
        </div>
      </div>
      <div class="w-32"></div>
  </nav>
</template>

<style scoped>
.nav {
  will-change: filter;
  transition: filter 300ms;
}
.nav:hover {
  filter: drop-shadow(0 0 1em #fbfbfbaa);
}
</style>