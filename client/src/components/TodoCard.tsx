import { useDispatch } from "react-redux";
import { updateTodo } from "../store/todoSlice";
import { Todo } from "../types";

interface TodoCardProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  const dispatch = useDispatch();
  
  // Handler for toggling completion status
  const handleToggleComplete = () => {
    dispatch(updateTodo({
      id: todo._id,
      title: todo.title,
      completed: !todo.completed
    }) as any);
  };
  
  return (
    <div className="bg-background-paper rounded-lg shadow-mui-1 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            {/* Checkbox */}
            <div className="mr-2 pt-0.5">
              <input 
                type="checkbox" 
                className="h-5 w-5 rounded border-gray-300 text-primary-main focus:ring-primary-light"
                checked={todo.completed}
                onChange={handleToggleComplete}
                id={`todo-checkbox-${todo._id}`}
                aria-label="Mark as complete"
              />
            </div>
            {/* Title */}
            <h3 
              className={`text-lg font-medium line-clamp-2 flex-1 text-text-primary ${todo.completed ? 'line-through' : ''}`}
            >
              {todo.title}
            </h3>
          </div>
          
          {/* Action Buttons */}
          <div className="flex ml-2">
            <button 
              className="p-1 text-text-secondary hover:text-primary-main transition-colors"
              onClick={onEdit}
              aria-label="Edit todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button 
              className="p-1 text-text-secondary hover:text-error-main transition-colors"
              onClick={onDelete}
              aria-label="Delete todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
        {/* Todo ID */}
        <div className="mt-2 text-sm text-text-secondary">
          <span>Todo ID: #{todo._id}</span>
        </div>
      </div>
    </div>
  );
}
