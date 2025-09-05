<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { login } from '../services/authService';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const route = useRoute();

const canSubmit = computed(() =>
  !loading.value &&
  username.value.trim().length > 0 &&
  password.value.length > 0
);

onMounted(() => {
  // Tự điền username nếu đến từ đăng ký
  const qUser = route.query.u as string | undefined;
  if (qUser && !username.value) username.value = qUser;

  // Nếu đã có token thì về Home luôn
  if (localStorage.getItem('token')) {
    router.replace('/');
  }
});

async function onSubmit() {
  if (!canSubmit.value) return;
  loading.value = true;
  error.value = '';
  try {
    await login(username.value.trim(), password.value);
    await router.replace('/'); // chuyển về Home
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || 'Lỗi đăng nhập';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-[100dvh] bg-[#121212] text-white px-4">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-sm space-y-3 bg-[#1e1e1e]/90 p-6 rounded-xl shadow-lg backdrop-blur-md"
    >
      <h2 class="text-2xl font-bold text-center">Đăng nhập</h2>

      <div class="space-y-1">
        <label class="block text-xs uppercase tracking-wide text-gray-400">Username</label>
        <input
          v-model.trim="username"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring focus:ring-blue-500/40"
          autocomplete="username"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="block text-xs uppercase tracking-wide text-gray-400">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring focus:ring-blue-500/40"
          autocomplete="current-password"
          required
        />
      </div>

      <button
        :disabled="!canSubmit"
        class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>

      <p class="text-xs text-center text-gray-400">
        Chưa có tài khoản?
        <RouterLink to="/register" class="text-blue-400 hover:underline">Đăng ký</RouterLink>
      </p>

      <p v-if="error" class="text-red-400 text-xs text-center">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
/* Giữ tất cả vừa trong màn hình nhỏ */
@media (max-height: 560px) {
  form { padding: 14px; }
  h2 { font-size: 1.15rem; }
}
</style>