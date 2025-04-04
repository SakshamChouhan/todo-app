import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

// API base URL
const API_URL = '/api/todos';

/**
 * Fetch todos with pagination
 */
export async function fetchTodos(page: number = 1, limit: number = 10) {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  const totalCount = parseInt(response.headers['x-total-count'] || '0');
  
  return {
    todos: response.data as Todo[],
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / limit)
  };
}

/**
 * Create a new todo
 */
export async function createTodo(todoData: CreateTodoInput): Promise<Todo> {
  const response = await axios.post(API_URL, todoData);
  return response.data;
}

/**
 * Update an existing todo
 */
export async function updateTodo(todoData: UpdateTodoInput): Promise<Todo> {
  const response = await axios.put(`${API_URL}/${todoData.id}`, todoData);
  return response.data;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<string> {
  await axios.delete(`${API_URL}/${id}`);
  return id;
}
