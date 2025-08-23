<script setup lang="ts">
type Todo = { id: number; text: string; done: boolean; deadline?: string };

const props = defineProps<{ todos: Todo[] }>();
const emit = defineEmits<{
  (e: "toggle", id: number): void;
  (e: "remove", id: number): void;
  (e: "update", id: number, text: string): void;
}>();
</script>

<template>
  <ul class="w-full max-w-md">
    <li
      v-for="todo in props.todos"
      :key="todo.id"
      class="mb-4 p-4 rounded bg-[#222] text-white shadow"
    >
      <div class="flex items-center">
        <input type="checkbox" :checked="todo.done" @change="emit('toggle', todo.id)" class="mr-2" />
        <span :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
        <button @click="emit('remove', todo.id)" class="ml-auto font-bold text-red-400 hover:text-red-600 h-1">x</button>
      </div>
      <div v-if="todo.deadline" class="mt-2 text-xs text-gray-300">
        Hạn: {{ new Date(todo.deadline).toLocaleString('vi-VN') }}
      </div>
    </li>
  </ul>
</template>