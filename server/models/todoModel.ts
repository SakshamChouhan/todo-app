import mongoose from 'mongoose';

export interface ITodo extends mongoose.Document {
  title: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the todo'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;