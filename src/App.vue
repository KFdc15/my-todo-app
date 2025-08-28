<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import {
  getTodos,
  addTodo,
  updateTodo,
  toggleTodo,
  removeTodo,
  clearCompleted
} from "./services/todoService";
import type { Todo } from "./services/todoService";

const todos = ref<Todo[]>([]);
const filter = ref<"all" | "active" | "completed">("all");
const search = ref("");

async function fetchTodos() {
  todos.value = await getTodos();
}

async function addTodoHandler(text: string, deadline: string) {
  await addTodo(text, deadline);
  await fetchTodos();
}

async function toggleTodoHandler(id: number) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    await toggleTodo(id, !todo.done);
    await fetchTodos();
  }
}

async function updateTodoHandler(id: number, newText: string) {
  await updateTodo(id, newText);
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

function setFilter(val: "all" | "active" | "completed") {
  filter.value = val;
}

function setSearch(val: string) {
  search.value = val;
}

const filteredTodos = computed(() => {
  let list = todos.value;
  if (filter.value === "active") list = list.filter(t => !t.done);
  if (filter.value === "completed") list = list.filter(t => t.done);
  if (search.value.trim()) {
    const keyword = search.value.trim().toLowerCase();
    list = list.filter(t => t.text.toLowerCase().includes(keyword));
  }
  return list;
});

const remaining = computed(() => todos.value.filter(t => !t.done).length);

onMounted(fetchTodos);
</script>

<template>
  <NavBar/>
  <SideBar :filter="filter" @set-filter="setFilter"/>
  <div class="container mx-auto p-4 justify-center items-center flex flex-col">
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
.btn {
  will-change: filter;
  transition: filter 300ms;
}
.btn:hover {
  filter: drop-shadow(0 0 2em #ff0000aa);
}
</style>