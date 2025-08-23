<script setup lang="ts">
import { ref, computed, watch } from "vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";

type Todo = {
  id: number;
  text: string;
  done: boolean;
  deadline?: string;
};

const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos") || "[]"));
const filter = ref<"all" | "active" | "completed">("all");
const search = ref("");

watch(todos, () => {
  localStorage.setItem("todos", JSON.stringify(todos.value));
}, { deep: true });

function addTodo(text: string, deadline?: string) {
  todos.value.push({ id: Date.now(), text, done: false, deadline });
}

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
}

function updateTodo(id: number, newText: string) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) todo.text = newText;
}

function removeTodo(id: number) {
  todos.value = todos.value.filter(t => t.id !== id);
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.done);
}

function setFilter(val: "all" | "active" | "completed") {
  filter.value = val;
}

function setSearch(val: string) {
  search.value = val;
}

// computed list theo filter
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
</script>

<template>
  <NavBar/>
  <SideBar :filter="filter" @set-filter="setFilter"/>
  <div class="container mx-auto p-4 justify-center items-center flex flex-col">
    <TodoInput @add="addTodo" @search="setSearch" />
    <TodoList
      :todos="filteredTodos"
      @toggle="toggleTodo"
      @remove="removeTodo"
      @update="updateTodo"
    />
    <div class="flex justify-between items-center w-full max-w-md mt-4">
      <span>{{ remaining }} tasks left</span>
      <button class="text-sm font-bold text-red-500 btn" @click="clearCompleted">
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