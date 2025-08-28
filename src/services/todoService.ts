const API_URL = 'http://localhost:3000/todos';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
  deadline?: string;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addTodo(text: string, deadline?: string): Promise<Todo> {
  const todo = { text, done: false, deadline };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return res.json();
}

export async function updateTodo(id: number, newText: string, deadline?: string): Promise<Todo> {
  const body: any = { text: newText };
  if (deadline !== undefined) body.deadline = deadline;
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function toggleTodo(id: number, done: boolean): Promise<Todo> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  return res.json();
}

export async function removeTodo(id: number): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}

export async function clearCompleted(): Promise<void> {
  const todos = await getTodos();
  const completed = todos.filter(t => t.done);
  await Promise.all(completed.map(t => removeTodo(t.id)));
}