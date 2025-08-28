<script setup lang="ts">
import { ref } from "vue";
import { toggleTodo, removeTodo, updateTodo } from "../services/todoService";
import type { Todo } from "../services/todoService";

const props = defineProps<{ todo: Todo }>();
const emit = defineEmits<{
  (e: "toggled", todo: Todo): void;
  (e: "removed", id: number): void;
  (e: "updated", todo: Todo): void;
}>();

const editing = ref(false);

const loading = ref(false);

const handleToggle = async () => {
  loading.value = true;
  try {
    const updated = await toggleTodo(props.todo.id, !props.todo.done);
    emit("toggled", updated);
  } finally {
    loading.value = false;
  }
};

const handleRemove = async () => {
  loading.value = true;
  try {
    await removeTodo(props.todo.id);
    emit("removed", props.todo.id);
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async () => {
  const newText = prompt("New text", props.todo.text);
  if (!newText || newText.trim() === props.todo.text) return;

  loading.value = true;
  try {
    const updated = await updateTodo(props.todo.id, newText.trim());
    emit("updated", updated);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <transition name="fade">
    <li
      class="flex justify-between items-center bg-white p-3 mb-2 rounded shadow dark:bg-gray-800"
    >
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          :checked="props.todo.done"
          @change="handleToggle"
          :disabled="loading"
        />
        <span
          v-if="!editing"
          @dblclick="editing=true"
          :class="{ 'line-through text-gray-400': props.todo.done }"
        >
          {{ props.todo.text }}
        </span>
        <span v-if="props.todo.deadline" class="deadline">
          (⏰ {{ props.todo.deadline }})
        </span>
        <button @click="handleUpdate" :disabled="loading">✏️</button>
        <button class="text-red-500 hover:text-red-700" @click="handleRemove" :disabled="loading">🗑</button>
      </div>
    </li>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
