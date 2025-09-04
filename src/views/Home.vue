<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import SideBar from '../components/SideBar.vue';
import TodoInput from '../components/TodoInput.vue';
import TodoList from '../components/TodoList.vue';
import { getTodos, addTodo, updateTodo, toggleTodo, removeTodo, clearCompleted } from '../services/todoService';
import type { Todo } from '../services/todoService';

type Filter = 'all' | 'active' | 'completed';

const authed = ref<boolean>(!!localStorage.getItem('token'));
const todos = ref<Todo[]>([]);
const filter = ref<Filter>('all');
const search = ref('');

function refreshAuth() {
  authed.value = !!localStorage.getItem('token');
}
function handleAuthChanged() {
  refreshAuth();
  fetchTodos();
}

async function fetchTodos() {
  if (!authed.value) return;
  try {
    todos.value = await getTodos();
  } catch (e) {
    // Có thể log hoặc hiển thị lỗi
    console.error('Load todos failed', e);
    todos.value = [];
  }
}

async function addTodoHandler(text: string, deadline?: string) {
  await addTodo(text, deadline);
  await fetchTodos();
}

async function toggleTodoHandler(id: number) {
  const t = todos.value.find(x => x.id === id);
  if (!t) return;
  await toggleTodo(id, !t.done);
  await fetchTodos();
}

async function updateTodoHandler(id: number, newText: string, deadline?: string) {
  await updateTodo(id, newText, deadline);
  await fetchTodos();
}

async function removeTodoHandler(id: number) {
  await removeTodo(id);
  await fetchTodos();
}

async function clearCompletedHandler() {
  await clearCompleted();
  await fetchTodos();
}

function setFilter(f: Filter) {
  filter.value = f;
}
function setSearch(v: string) {
  search.value = v;
}

const filteredTodos = computed<Todo[]>(() => {
  let list = [...todos.value];
  if (filter.value === 'active') list = list.filter(t => !t.done);
  if (filter.value === 'completed') list = list.filter(t => t.done);
  if (search.value.trim()) {
    const k = search.value.toLowerCase();
    list = list.filter(t => t.text.toLowerCase().includes(k));
  }
  return list;
});

const remaining = computed(() => todos.value.filter(t => !t.done).length);

onMounted(() => {
  refreshAuth();
  fetchTodos();
  window.addEventListener('auth-changed', handleAuthChanged as EventListener);
});
onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', handleAuthChanged as EventListener);
});
</script>

<template>
  <SideBar :filter="filter" @set-filter="setFilter" />

  <div v-if="!authed" class="min-h-[50vh] flex items-center justify-center text-lg text-gray-300">
    Please login to explore for more
  </div>

  <div v-else class="container mx-auto p-4 justify-center items-center flex flex-col">
    <TodoInput @add="addTodoHandler" @search="setSearch" />
    <TodoList
      :todos="filteredTodos"
      @toggle="toggleTodoHandler"
      @remove="removeTodoHandler"
      @update="updateTodoHandler"
    />
    <div class="flex justify-between items-center w-full max-w-md mt-4">
      <span>{{ remaining }} tasks left</span>
      <button class="text-sm font-bold text-red-500 btn" @click="clearCompletedHandler">
        Clear Completed
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn { transition: filter .3s; }
.btn:hover { filter: drop-shadow(0 0 2em #ff0000aa); }
</style>