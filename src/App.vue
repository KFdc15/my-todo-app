<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';

const route = useRoute();
const hideSideBar = computed(() => ['/login','/register'].includes(route.path));
</script>

<template>
  <NavBar />
  <SideBar v-if="!hideSideBar" filter="all" @set-filter="() => {}" />
  <router-view />
</template>