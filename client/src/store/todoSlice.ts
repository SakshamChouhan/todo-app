import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoState, CreateTodoInput, UpdateTodoInput } from '../types';
import { RootState } from './index';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;
const API_URL = '/api/todos';

// Define async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (page: number = 1, { getState }) => {
    // Get the current user ID from auth state
    const state = getState() as RootState;
    const userId = state.auth.user;
    
    // Only fetch todos for the current user
    if (!userId) {
      return { todos: [], totalItems: 0 };
    }
    
    // Get auth token from state
    const token = state.auth.token;
    
    if (!token) {
      return { todos: [], totalItems: 0 };
    }
    
    // Set auth header for the request
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Call our API endpoint with pagination
    const response = await axios.get(`${API_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`, config);
    const totalCount = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : 0;
    
    return {
      todos: response.data,
      totalItems: totalCount
    };
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData: CreateTodoInput, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.post(API_URL, todoData, config);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todoData: UpdateTodoInput, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.put(`${API_URL}/${todoData.id}`, todoData, config);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  }
);

const initialState: TodoState = {
  todos: [],
  currentTodo: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE
  },
  filters: {
    status: 'all',
    searchQuery: ''
  }
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setCurrentTodo(state, action: PayloadAction<Todo | null>) {
      state.currentTodo = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<'all' | 'completed' | 'incomplete'>) {
      state.filters.status = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filters.searchQuery = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    // fetchTodos
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload.todos;
      state.loading = false;
      state.pagination.totalItems = action.payload.totalItems;
      state.pagination.totalPages = Math.ceil(action.payload.totalItems / ITEMS_PER_PAGE);
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch todos';
    });
    
    // createTodo
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.unshift(action.payload);
    });
    
    // updateTodo
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const index = state.todos.findIndex(todo => todo._id === action.payload._id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    });
    
    // deleteTodo
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter(todo => todo._id !== action.payload);
    });
  }
});

export const { setCurrentTodo, setStatusFilter, setSearchQuery, setCurrentPage } = todoSlice.actions;

export default todoSlice.reducer;
