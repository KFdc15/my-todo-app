<script setup lang="ts">
import { ref } from "vue";
import { toggleTodo, removeTodo, updateTodo } from "../services/todoService";
import type { Todo } from "../services/todoService";

const props = defineProps<{ todos: Todo[] }>();
const emit = defineEmits<{
  (e: "toggle", id: number): void;
  (e: "remove", id: number): void;
  (e: "update", id: number, text: string): void;
}>();

const handleToggle = async (id: number) => {
  await toggleTodo(id);
  emit("toggle", id);
};

const handleRemove = async (id: number) => {
  await removeTodo(id);
  emit("remove", id);
};

const editingTodo = ref<{ id: number; text: string; deadline?: string } | null>(null);

const handleUpdate = (todo: Todo) => {
  editingTodo.value = { ...todo }; // mở popup và copy data cũ
};

const saveUpdate = async () => {
  if (!editingTodo.value) return;

  await updateTodo(editingTodo.value.id, editingTodo.value.text);
  // nếu muốn cập nhật deadline backend thì sửa service updateTodo để nhận thêm deadline
  emit("update", editingTodo.value.id, editingTodo.value.text);
  editingTodo.value = null;
};
</script>

<template>
  <ul class="w-full max-w-md">
    <li
      v-for="todo in props.todos"
      :key="todo.id"
      class="mb-4 p-4 rounded bg-[#222] text-white shadow"
    >
      <div class="flex items-center">
        <input
          type="checkbox"
          :checked="todo.done"
          @change="handleToggle(todo.id)"
          class="mr-2"
        />
        <span :class="{ 'line-through text-gray-400': todo.done }">
          {{ todo.text }}
        </span>
        <button
          @click="handleUpdate(todo)"
          class="ml-2 text-blue-400 hover:text-blue-600"
        >
          ✏️
        </button>
        <div v-if="editingTodo" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form @submit.prevent="saveUpdate" class="bg-[#222] rounded-lg shadow-lg p-6 w-full max-w-sm relative border border-gray-700">
            <button type="button" @click="editingTodo = null" class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
            <h2 class="text-lg font-bold mb-4 text-white">Cập nhật Task</h2>

            <input
              v-model="editingTodo.text"
              class="w-full border border-gray-600 bg-[#333] text-white rounded px-3 py-2 mb-3 focus:outline-none placeholder-gray-400"
              placeholder="Sửa nội dung..."
              autofocus
            />
            <label class="block mb-2 text-gray-300">Hạn task</label>
            <input
              v-model="editingTodo.deadline"
              type="datetime-local"
              class="w-full border border-gray-600 bg-[#333] text-white rounded px-3 py-2 mb-3 focus:outline-none"
            />

            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>

        <button
          @click="handleRemove(todo.id)"
          class="ml-auto font-bold text-red-400 hover:text-red-600 h-1"
        >
          🗑
        </button>
      </div>
      <div v-if="todo.deadline" class="mt-2 text-xs text-gray-300">
        ⏰: {{ new Date(todo.deadline).toLocaleString("vi-VN") }}
      </div>
    </li>
  </ul>
</template>