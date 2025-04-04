# Todo App - Technical Architecture Document

## Project Overview

This document provides a technical overview of the React Redux TypeScript Todo Application, describing the system architecture, data flow, and implementation details for developers working on the project.

## System Architecture

### Client-Server Architecture

The application follows a modern client-server architecture:

```
┌───────────────┐         ┌──────────────┐        ┌─────────────┐
│   React UI    │ ←─────→ │  Express API  │ ←────→ │   MongoDB   │
│  (Frontend)   │   HTTP  │  (Backend)    │  ODM   │ (Database)  │
└───────────────┘         └──────────────┘        └─────────────┘
```

### Layered Architecture

Both frontend and backend follow a layered architecture with clear separation of concerns:

#### Frontend Layers

1. **Presentation Layer**: React components (pages, UI components)
2. **State Management Layer**: Redux store, slices, and actions
3. **API Layer**: API client (axios) for communication with backend
4. **Utility Layer**: Helper functions, hooks, and type definitions

#### Backend Layers

1. **API Layer**: Express routes for handling HTTP requests
2. **Service Layer**: Controllers for business logic
3. **Data Access Layer**: Mongoose models for database operations
4. **Security Layer**: Authentication middleware and JWT handling

## Data Flow

### Authentication Flow

```
┌───────────────┐                                          ┌─────────────┐
│  Login Form   │                                          │  Redux      │
│  Component    │                                          │  Auth State │
└───────┬───────┘                                          └──────┬──────┘
        │                                                         │
        │ 1. User enters                                          │ 5. Store
        │    credentials                                          │    token & user
        ▼                                                         │
┌───────────────┐       ┌──────────────┐       ┌─────────────┐   │
│  Auth Slice   │ ─────→│ Auth API     │ ─────→│ Auth        │   │
│  Login Thunk  │ HTTP  │ Endpoint     │ Query │ Controller  │   │
└───────┬───────┘ POST  └──────┬───────┘       └──────┬──────┘   │
        │                      │                      │          │
        │                      │                      │          │
        │                      │       ┌─────────────┐          │
        │                      │       │ User Model  │          │
        │                      └──────→│ (MongoDB)   │          │
        │                      validate└──────┬──────┘          │
        │                                     │                 │
        │ 4. Return token                     │                 │
        └─────────────────────────────────────┘                 │
              and user data                                     │
                                                                │
┌───────────────┐                                               │
│  Protected    │◄─────────────────────────────────────────────┘
│  Components   │          6. Allow access based on auth state
└───────────────┘
```

### Todo CRUD Operations Flow

```
┌───────────────┐       ┌──────────────┐      ┌─────────────┐
│  Todo         │       │ Todo API     │      │ Todo        │
│  Components   │ HTTP  │ Endpoints    │ Call │ Controller  │
└───────┬───────┘       └──────┬───────┘      └──────┬──────┘
        │                      │                     │
        │                      │                     │
┌───────▼───────┐              │                     │
│  Todo Slice   │              │                     │
│  Actions &    │              │       ┌─────────────▼─┐
│  Thunks       │              │       │ Todo Model    │
└───────┬───────┘              │       │ (MongoDB)     │
        │                      │       └───────┬───────┘
        │ ◄──────────────────────────────────┘
        │    API Response
        │
┌───────▼───────┐
│  Redux Store  │
│  Todo State   │
└───────┬───────┘
        │
        │ Update UI
┌───────▼───────┐
│  Todo List    │
│  Component    │
└───────────────┘
```

## Component Architecture

### Frontend Component Hierarchy

```
App
│
├── Router
│   │
│   ├── Login Page
│   │
│   ├── Signup Page
│   │
│   ├── Dashboard Page
│   │   │
│   │   ├── Search & Filter
│   │   │   └── Add Todo Button
│   │   │
│   │   ├── Todo Card List
│   │   │   └── Todo Card
│   │   │       ├── Edit Button (triggers Edit Dialog)
│   │   │       └── Delete Button (triggers Delete Dialog)
│   │   │
│   │   ├── Pagination
│   │   │
│   │   ├── Add Todo Dialog
│   │   │
│   │   ├── Edit Todo Dialog
│   │   │
│   │   └── Delete Confirm Dialog
│   │
│   └── NotFound Page
│
└── Toast Provider
```

## State Management

### Redux Store Structure

```
store
│
├── auth
│   ├── isAuthenticated: boolean
│   ├── user: string | null
│   ├── token: string | null
│   ├── error: string | null
│   └── loading: boolean
│
└── todo
    ├── todos: Todo[]
    ├── currentTodo: Todo | null
    ├── loading: boolean
    ├── error: string | null
    ├── pagination: {
    │   ├── currentPage: number
    │   ├── totalPages: number
    │   ├── totalItems: number
    │   └── itemsPerPage: number
    │   }
    └── filters: {
        ├── status: 'all' | 'completed' | 'incomplete'
        └── searchQuery: string
        }
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed)
}
```

### Todo Collection

```javascript
{
  _id: ObjectId,
  title: String,
  completed: Boolean,
  userId: String (reference to User._id),
  createdAt: Date
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `GET /api/auth/me` - Get the current authenticated user

### Todo Endpoints

- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Security Implementation

### Authentication

- JWT tokens are generated upon successful login
- Tokens are stored in Redux state (client-side)
- Tokens are sent with every API request that requires authentication
- Backend validates tokens for protected routes

### Password Security

- Passwords are hashed using bcrypt before storage
- Password comparison also uses bcrypt to validate login attempts

## Error Handling

- Client-side form validation using Zod schemas
- Server-side validation for all API requests
- Centralized error handling middleware in Express
- Toast notifications for user feedback

## Performance Considerations

- Pagination for todo lists to limit data transfer
- Debounced search to prevent excessive API calls
- Optimistic UI updates for faster perceived performance
- MongoDB indexes on frequently queried fields

## Future Enhancements

- Implement refresh tokens for more secure authentication
- Add due dates and priority levels for todos
- Create categories/tags for todos
- Add collaborative todo lists (shared between users)
- Implement offline support with local storage
- Add real-time updates with WebSocket/Socket.io