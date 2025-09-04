import { http } from './httpClient';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
  deadline?: string;
};

const RESOURCE = '/todos';

export async function getTodos(): Promise<Todo[]> {
  const { data } = await http.get<Todo[]>(RESOURCE);
  return data;
}

export async function addTodo(text: string, deadline?: string): Promise<Todo> {
  const payload = { text, done: false, deadline };
  const { data } = await http.post<Todo>(RESOURCE, payload);
  return data;
}

export async function updateTodo(id: number, newText: string, deadline?: string): Promise<Todo> {
  const body: Partial<Todo> = { text: newText };
  if (deadline !== undefined) body.deadline = deadline;
  const { data } = await http.patch<Todo>(`${RESOURCE}/${id}`, body);
  return data;
}

export async function toggleTodo(id: number, done: boolean): Promise<Todo> {
  const { data } = await http.patch<Todo>(`${RESOURCE}/${id}`, { done });
  return data;
}

export async function removeTodo(id: number): Promise<void> {
  await http.delete(`${RESOURCE}/${id}`);
}

export async function clearCompleted(): Promise<void> {
  const todos = await getTodos();
  const completed = todos.filter(t => t.done);
  if (!completed.length) return;
  await Promise.all(completed.map(t => removeTodo(t.id)));
}