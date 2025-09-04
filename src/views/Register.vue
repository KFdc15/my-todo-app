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
  <div class="min-h-screen flex items-center justify-center bg-[#121212] text-white">
    <form @submit.prevent="onSubmit" class="w-full max-w-sm space-y-4 bg-[#1e1e1e] p-6 rounded">
      <h2 class="text-xl font-bold text-center">Đăng ký</h2>

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

      <div>
        <label class="block mb-1 text-sm">Nhập lại mật khẩu</label>
        <input
          v-model="confirm"
          type="password"
          :class="[
            'w-full px-3 py-2 rounded bg-[#2a2a2a] outline-none',
            confirm && !passwordsMatch ? 'ring-2 ring-red-500' : ''
          ]"
          required
        />
        <p
          v-if="confirm && !passwordsMatch"
          class="text-red-400 text-xs mt-1"
        >
          Mật khẩu không khớp
        </p>
      </div>

      <button
        :disabled="!canSubmit"
        class="w-full bg-green-600 hover:bg-green-500 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
      </button>

      <p class="text-sm text-center">
        Đã có tài khoản?
        <RouterLink to="/login" class="text-blue-400 hover:underline">Đăng nhập</RouterLink>
      </p>

      <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
    </form>
  </div>
</template>