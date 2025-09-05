<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { register } from '../services/authService';

const username = ref('');
const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const passwordsMatch = computed(() => !confirm.value || password.value === confirm.value);

const canSubmit = computed(() =>
  !loading.value &&
  username.value.trim().length > 0 &&
  password.value.length > 0 &&
  confirm.value.length > 0 &&
  passwordsMatch.value
);

async function onSubmit() {
  loading.value = true;
  error.value = '';
  try {
    if (!passwordsMatch.value) {
      error.value = 'Mật khẩu không khớp';
      return;
    }
    await register({ username: username.value.trim(), password: password.value });
    router.push({ path: '/login', query: { u: username.value } });
  } catch (e: any) {
    if (e?.response?.status === 409) error.value = 'Username đã tồn tại';
    else error.value = e?.response?.data?.message || e.message || 'Lỗi đăng ký';
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
      <h2 class="text-2xl font-bold text-center">Đăng ký</h2>

      <div class="space-y-1">
        <label class="block text-xs uppercase tracking-wide text-gray-400">Username</label>
        <input
          v-model.trim="username"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring focus:ring-green-500/40"
          autocomplete="username"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="block text-xs uppercase tracking-wide text-gray-400">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring focus:ring-green-500/40"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="block text-xs uppercase tracking-wide text-gray-400">Nhập lại mật khẩu</label>
        <input
          v-model="confirm"
          type="password"
          :class="[
            'w-full px-3 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring',
            confirm && !passwordsMatch ? 'ring-red-500 focus:ring-red-500/60' : 'focus:ring-green-500/40'
          ]"
          autocomplete="new-password"
          required
        />
        <p v-if="confirm && !passwordsMatch" class="text-red-400 text-xs mt-1">
          Mật khẩu không khớp
        </p>
      </div>

      <button
        :disabled="!canSubmit"
        class="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
      </button>

      <p class="text-xs text-center text-gray-400">
        Đã có tài khoản?
        <RouterLink to="/login" class="text-green-400 hover:underline">Đăng nhập</RouterLink>
      </p>

      <p v-if="error" class="text-red-400 text-xs text-center">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
@media (max-height: 560px) {
  form { padding: 14px; }
  h2 { font-size: 1.15rem; }
}
</style>