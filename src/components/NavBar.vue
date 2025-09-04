<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import ShinyText from './ShinyText.vue';
import { logout as doLogout } from '../services/authService';

const route = useRoute();
const router = useRouter();
const isAuthed = ref(!!localStorage.getItem('token'));

function refreshAuth() {
  isAuthed.value = !!localStorage.getItem('token');
}

async function logout() {
  doLogout();            // xóa token + phát 'auth-changed'
  refreshAuth();
  await router.replace('/');
}

function handleStorage(e: StorageEvent) {
  if (e.key === 'token') refreshAuth();
}
function handleAuthChanged() {
  refreshAuth();
}

onMounted(() => {
  window.addEventListener('storage', handleStorage);
  window.addEventListener('auth-changed', handleAuthChanged as EventListener);
});
onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage);
  window.removeEventListener('auth-changed', handleAuthChanged as EventListener);
});
</script>

<template>
  <nav class="py-5 bg-transparent">
    <div class="container mx-auto relative flex items-center">
      <!-- Logo giữa -->
      <div class="absolute left-1/2 -translate-x-1/2 select-none">
        <RouterLink to="/" class="logo-link">
          <ShinyText class="text-3xl font-bold nav" text="📝 My Todo App" />
        </RouterLink>
      </div>

      <!-- Auth pill bên phải -->
      <div class="ml-auto flex items-center">
        <div v-if="!isAuthed" class="auth-pill overflow-hidden">
          <RouterLink
            to="/login"
            class="segment"
            :class="{ active: route.path === '/login' }"
          >Đăng nhập</RouterLink>
          <RouterLink
            to="/register"
            class="segment"
            :class="{ active: route.path === '/register' }"
          >Đăng ký</RouterLink>
        </div>

        <button
          v-else
          class="auth-pill single px-5 py-2 text-sm font-medium"
          @click="logout"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  will-change: filter;
  transition: filter 300ms;
}
.nav:hover { filter: drop-shadow(0 0 1em #ffffff66); }

.logo-link { text-decoration: none; }

.auth-pill {
  display: inline-flex;
  border: 1px solid #3a3a3a;
  border-radius: 999px;
  background: linear-gradient(145deg,#1d1d1d,#242424);
  box-shadow: 0 2px 4px #0008;
  font-size: 0.8rem;
}

.segment {
  padding: 0.55rem 1.1rem;
  font-weight: 500;
  color: #d5d5d5;
  text-decoration: none;
  transition: background .25s,color .25s;
}
.segment:first-child { border-right: 1px solid #2e2e2e; }
.segment:hover { background:#2d2d2d; color:#fff; }
.segment.active { background:#3b82f6; color:#fff; }

.auth-pill.single {
  background: linear-gradient(145deg,#2a2a2a,#343434);
  border:1px solid #454545;
  color:#eee;
  cursor:pointer;
  transition: background .25s,color .25s;
}
.auth-pill.single:hover { background:#3d3d3d; color:#fff; }
</style>