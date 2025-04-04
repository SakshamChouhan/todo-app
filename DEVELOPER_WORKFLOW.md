# Todo App - Developer Workflow Guide

This document outlines the development workflow for the React Redux TypeScript Todo Application, providing step-by-step instructions for common development tasks.

## Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/react-redux-typescript-todo-app.git
   cd react-redux-typescript-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This starts both the Express backend and the Vite frontend in development mode.

## Development Workflow

### Backend Development

#### Creating a new API endpoint

1. **Define the route**
   Add the new route to `server/routes/yourRoutes.ts`:
   ```typescript
   router.get('/your-endpoint', yourController.yourMethod);
   ```

2. **Implement the controller method**
   Add the method to `server/controllers/yourController.ts`:
   ```typescript
   export const yourMethod = async (req: Request, res: Response, next: NextFunction) => {
     try {
       // Your implementation
       res.status(200).json({ data: 'your response' });
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Create or update the model (if needed)**
   If your endpoint requires a new data model, define it in `server/models/yourModel.ts`:
   ```typescript
   const yourSchema = new mongoose.Schema({
     field1: {
       type: String,
       required: true
     },
     // other fields
   });
   
   export interface IYourModel extends mongoose.Document {
     field1: string;
     // other fields
   }
   
   export default mongoose.model<IYourModel>('YourModel', yourSchema);
   ```

4. **Test the endpoint**
   Use a tool like Postman or curl to test your endpoint:
   ```bash
   curl http://localhost:5000/api/your-endpoint
   ```

### Frontend Development

#### Adding a new component

1. **Create the component file**
   Create a new file in `client/src/components/YourComponent.tsx`:
   ```typescript
   import React from 'react';
   
   interface YourComponentProps {
     // Define props
   }
   
   export default function YourComponent({ /* destructure props */ }: YourComponentProps) {
     return (
       <div className="your-component">
         {/* component JSX */}
       </div>
     );
   }
   ```

2. **Add Redux integration (if needed)**
   If your component needs to interact with Redux:
   ```typescript
   import { useDispatch, useSelector } from 'react-redux';
   import { RootState } from '../store';
   import { yourAction } from '../store/yourSlice';
   
   // Inside your component
   const dispatch = useDispatch();
   const yourData = useSelector((state: RootState) => state.yourSlice.yourData);
   
   // To dispatch an action
   const handleEvent = () => {
     dispatch(yourAction(payload));
   };
   ```

3. **Add API integration (if needed)**
   If your component needs to fetch data:
   ```typescript
   import { useTodosApi } from '../hooks/useTodosApi';
   
   // Inside your component
   const { yourApiMethod } = useTodosApi();
   
   // To call the API
   const handleEvent = async () => {
     try {
       const result = await yourApiMethod(params);
       // Handle result
     } catch (error) {
       // Handle error
     }
   };
   ```

#### Creating a new Redux slice

1. **Create the slice file**
   Create a new file in `client/src/store/yourSlice.ts`:
   ```typescript
   import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
   import { yourApiMethod } from '../lib/api';
   
   // Define the state type
   export interface YourState {
     data: any[];
     loading: boolean;
     error: string | null;
   }
   
   // Initial state
   const initialState: YourState = {
     data: [],
     loading: false,
     error: null
   };
   
   // Async thunk
   export const fetchYourData = createAsyncThunk(
     'your/fetchData',
     async (params, { rejectWithValue }) => {
       try {
         const response = await yourApiMethod(params);
         return response.data;
       } catch (error: any) {
         return rejectWithValue(error.message);
       }
     }
   );
   
   // Create the slice
   const yourSlice = createSlice({
     name: 'your',
     initialState,
     reducers: {
       // Synchronous actions
       setData(state, action: PayloadAction<any[]>) {
         state.data = action.payload;
       }
     },
     extraReducers: (builder) => {
       // Async action handlers
       builder
         .addCase(fetchYourData.pending, (state) => {
           state.loading = true;
           state.error = null;
         })
         .addCase(fetchYourData.fulfilled, (state, action) => {
           state.loading = false;
           state.data = action.payload;
         })
         .addCase(fetchYourData.rejected, (state, action) => {
           state.loading = false;
           state.error = action.payload as string;
         });
     }
   });
   
   // Export actions and reducer
   export const { setData } = yourSlice.actions;
   export default yourSlice.reducer;
   ```

2. **Add the slice to the store**
   Update `client/src/store/index.ts`:
   ```typescript
   import yourReducer from './yourSlice';
   
   export const store = configureStore({
     reducer: {
       // ... other reducers
       your: yourReducer
     }
   });
   ```

#### Adding a new page

1. **Create the page component**
   Create a new file in `client/src/pages/YourPage.tsx`

2. **Add the route to the router**
   Update `client/src/App.tsx`:
   ```typescript
   import YourPage from './pages/YourPage';
   
   // Inside the Router component
   <Route path="/your-path" component={YourPage} />
   ```

## Testing Workflow

### Manual Testing Checklist

- [ ] Test authentication (signup, login, logout)
- [ ] Test todo CRUD operations (create, read, update, delete)
- [ ] Test filtering and searching
- [ ] Test pagination
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test error states and handling

### Automated Testing

*Not implemented yet - future enhancement*

## Deployment Workflow

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting provider**
   This depends on your specific hosting provider (Heroku, Vercel, AWS, etc.)

## Common Issues and Solutions

### MongoDB Connection Issues

If you encounter MongoDB connection issues:
- Ensure your MongoDB instance is running
- Check your connection string in the `.env` file
- Verify network connectivity to the MongoDB server

### Authentication Issues

If authentication is not working:
- Check JWT_SECRET in the `.env` file
- Verify token expiration settings
- Ensure the token is being sent with API requests

### Redux State Management Issues

If Redux state is not updating as expected:
- Check Redux DevTools to see the current state
- Verify actions are being dispatched correctly
- Ensure reducers are updating the state correctly

## Best Practices

### Code Style and Formatting

- Use consistent indentation (2 spaces)
- Follow TypeScript best practices
- Use descriptive variable and function names
- Add comments for complex logic

### Git Workflow

- Use feature branches for new features
- Create pull requests for code review
- Write descriptive commit messages
- Keep commits focused and small

### Performance Optimization

- Use memoization for expensive calculations
- Implement pagination for large data sets
- Optimize database queries
- Use React.memo and useMemo where appropriate