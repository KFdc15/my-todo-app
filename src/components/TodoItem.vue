<script setup lang="ts">
import { ref } from "vue";

type Todo = { id: number; text: string; done: boolean };

const props = defineProps<{ todo: Todo }>();
const emit = defineEmits<{
  (e: "toggle", id: number): void;
  (e: "remove", id: number): void;
  (e: "update", id: number, text: string): void;
}>();

const editing = ref(false);
const editText = ref(props.todo.text);

function saveEdit() {
  if (editText.value.trim()) {
    emit("update", props.todo.id, editText.value.trim());
    editing.value = false;
  }
}
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
          @change="emit('toggle', props.todo.id)"
        />
        <span
          v-if="!editing"
          @dblclick="editing=true"
          :class="{ 'line-through text-gray-400': props.todo.done }"
        >
          {{ props.todo.text }}
        </span>
        <input
          v-else
          v-model="editText"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
          class="border px-1 rounded"
        />
      </div>
      <button
        class="text-red-500 hover:text-red-700"
        @click="emit('remove', props.todo.id)"
      >
        ✕
      </button>
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
