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
  <div class="min-h-screen flex items-center justify-center bg-[#121212] text-white">
    <form @submit.prevent="onSubmit" class="w-full max-w-sm space-y-4 bg-[#1e1e1e] p-6 rounded">
      <h2 class="text-xl font-bold text-center">Đăng nhập</h2>

      <div>
        <label class="block mb-1 text-sm">Username</label>
        <input
          v-model.trim="username"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a]"
          required
        />
      </div>

      <div>
        <label class="block mb-1 text-sm">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a]"
          required
        />
      </div>

      <button
        :disabled="!canSubmit"
        class="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>

      <p class="text-sm text-center">
        Chưa có tài khoản?
        <RouterLink to="/register" class="text-blue-400 hover:underline">Đăng ký</RouterLink>
      </p>

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>