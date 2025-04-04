import { useState, useCallback } from 'react';
import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

/**
 * Custom hook for working with the todos API
 */
export function useTodosApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = 'https://jsonplaceholder.typicode.com/todos';
  
  /**
   * Fetch todos with pagination
   */
  const fetchTodos = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}?_page=${page}&_limit=${limit}`);
      const totalCount = parseInt(response.headers['x-total-count'] || '200');
      
      return {
        todos: response.data as Todo[],
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Create a new todo
   */
  const createTodo = useCallback(async (todoData: CreateTodoInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(API_URL, todoData);
      return response.data as Todo;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Update an existing todo
   */
  const updateTodo = useCallback(async (todoData: UpdateTodoInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${API_URL}/${todoData.id}`, todoData);
      return response.data as Todo;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Delete a todo
   */
  const deleteTodo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo
  };
}
