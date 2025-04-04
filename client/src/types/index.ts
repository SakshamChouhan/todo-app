// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

// Todo Types
export interface Todo {
  _id: string; // MongoDB uses string IDs
  title: string;
  completed: boolean;
  userId: string;
  createdAt?: Date;
}

export interface TodoState {
  todos: Todo[];
  currentTodo: Todo | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    status: 'all' | 'completed' | 'incomplete';
    searchQuery: string;
  };
}

export interface CreateTodoInput {
  title: string;
  completed: boolean;
}

export interface UpdateTodoInput {
  id: string; // MongoDB uses string IDs
  title: string;
  completed: boolean;
}

// Form Types
export interface TodoFormData {
  title: string;
  completed: boolean;
}
