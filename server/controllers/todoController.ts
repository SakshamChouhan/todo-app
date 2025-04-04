import { Request, Response, NextFunction } from 'express';
import Todo from '../models/todoModel';

// Get all todos for a user with pagination
export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get user ID from authenticated user
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find todos for the current user
    const todos = await Todo.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Todo.countDocuments({ userId });
    
    res.setHeader('x-total-count', totalCount.toString());
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

// Create a new todo
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, completed } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const todo = await Todo.create({
      title,
      completed,
      userId
    });
    
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// Update an existing todo
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find and update todo, ensuring it belongs to the current user
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { title, completed },
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }
    
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find and delete todo, ensuring it belongs to the current user
    const todo = await Todo.findOneAndDelete({ _id: id, userId });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }
    
    res.status(200).json({ id: todo._id });
  } catch (error) {
    next(error);
  }
};