<script setup lang="ts">
import { ref, watch } from "vue";

const text = ref("");
const search = ref("");
const showAdd = ref(false);
const deadline = ref("");
const error = ref("");
const emit = defineEmits<{ (e: "add", text: string, deadline: string): void; (e: "search", value: string): void }>();

function handleSubmit() {
  error.value = "";
  if (!text.value.trim()) {
    error.value = "Vui lòng nhập nội dung task!";
    return;
  }
  if (!deadline.value) {
    error.value = "Vui lòng chọn hạn task!";
    return;
  }
  const now = new Date();
  const selected = new Date(deadline.value);
  if (selected < now) {
    error.value = "Không được chọn thời gian đã trôi qua!";
    return;
  }
  emit("add", text.value.trim(), deadline.value);
  text.value = "";
  deadline.value = "";
  showAdd.value = false;
}

watch(search, (val) => emit("search", val));
</script>

<template>
  <div class="flex mb-4 w-full max-w-md items-center">
    <div class="relative flex-1">
      <input
        v-model="search"
        class="w-full border rounded-l px-3 py-2 focus:outline-none pl-9"
        placeholder="Tìm task..."
      />
      <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/>
        </svg>
      </span>
    </div>
    <button
      type="button"
      class="ml-3 border border-white text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-500 hover:text-white transition"
      @click="showAdd = true"
      aria-label="Thêm task mới"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>
  </div>

  <!-- Popup form -->
  <div v-if="showAdd" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <form @submit.prevent="handleSubmit" class="bg-[#222] rounded-lg shadow-lg p-6 w-full max-w-sm relative border border-gray-700">
      <button type="button" @click="showAdd = false" class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
      <h2 class="text-lg font-bold mb-4 text-white">Thêm Task Mới</h2>
      <input
        v-model="text"
        class="w-full border border-gray-600 bg-[#333] text-white rounded px-3 py-2 mb-3 focus:outline-none placeholder-gray-400"
        placeholder="Nhập task mới..."
        autofocus
      />
      <label class="block mb-2 text-gray-300">Hạn task</label>
      <input
        v-model="deadline"
        type="datetime-local"
        class="w-full border border-gray-600 bg-[#333] text-white rounded px-3 py-2 mb-3 focus:outline-none"
      />
      <div v-if="error" class="text-red-400 mb-2">{{ error }}</div>
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Thêm
      </button>
    </form>
  </div>
</template>