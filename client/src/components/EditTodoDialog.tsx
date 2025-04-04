import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo } from "../store/todoSlice";
import { RootState } from "../store";
import { useToast } from "@/hooks/use-toast";
import MaterialInput from "./ui/MaterialInput";
import { useEffect } from "react";

interface EditTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Form schema with validation
const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false)
});

type TodoFormValues = z.infer<typeof todoSchema>;

export default function EditTodoDialog({ isOpen, onClose }: EditTodoDialogProps) {
  const dispatch = useDispatch();
  const currentTodo = useSelector((state: RootState) => state.todo.currentTodo);
  const { toast } = useToast();
  
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: currentTodo?.title || "",
      completed: currentTodo?.completed || false
    }
  });
  
  // Update form values when currentTodo changes
  useEffect(() => {
    if (currentTodo) {
      form.reset({
        title: currentTodo.title,
        completed: currentTodo.completed
      });
    }
  }, [currentTodo, form]);
  
  // Handler for form submission
  const onSubmit = (values: TodoFormValues) => {
    if (!currentTodo) return;
    
    // Update todo via API
    dispatch(updateTodo({
      id: currentTodo._id,
      ...values
    }) as any)
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Todo updated successfully!",
        });
        onClose();
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update todo"
        });
      });
  };
  
  if (!isOpen || !currentTodo) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-background-paper rounded-lg shadow-mui-3 w-full max-w-md mx-4 z-20">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-text-primary">Edit Todo</h2>
          <button className="text-text-secondary hover:text-text-primary" onClick={onClose} aria-label="Close dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <input type="hidden" name="id" value={currentTodo._id} />
          
          <MaterialInput
            label="Title"
            id="edit-todo-title"
            error={form.formState.errors.title?.message}
            {...form.register("title")}
          />
          
          <div className="mb-6">
            <div className="flex items-center">
              <input 
                id="edit-todo-completed" 
                type="checkbox" 
                className="h-5 w-5 rounded border-gray-300 text-primary-main focus:ring-primary-light"
                {...form.register("completed")}
              />
              <label htmlFor="edit-todo-completed" className="ml-2 block text-sm text-text-primary">
                Completed
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              className="py-2 px-4 border border-gray-300 text-text-primary rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="py-2 px-4 bg-primary-main text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors"
              disabled={form.formState.isSubmitting}
            >
              Update Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
