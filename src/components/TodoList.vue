<script setup lang="ts">
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

const handleUpdate = async (id: number, oldText: string) => {
  const newText = prompt("Sửa task", oldText);
  if (!newText || newText.trim() === oldText) return;

  await updateTodo(id, newText.trim());
  emit("update", id, newText.trim());
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
          @click="handleUpdate(todo.id, todo.text)"
          class="ml-2 text-blue-400 hover:text-blue-600"
        >
          ✏️
        </button>
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