import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all todo routes with authentication middleware
router.use(protect);

// Todo routes
router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;