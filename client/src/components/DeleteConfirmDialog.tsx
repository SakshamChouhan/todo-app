import { useDispatch, useSelector } from "react-redux";
import { deleteTodo } from "../store/todoSlice";
import { RootState } from "../store";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteConfirmDialog({ isOpen, onClose }: DeleteConfirmDialogProps) {
  const dispatch = useDispatch();
  const currentTodo = useSelector((state: RootState) => state.todo.currentTodo);
  const { toast } = useToast();
  
  // Handler for confirming delete
  const handleConfirmDelete = () => {
    if (!currentTodo) return;
    
    dispatch(deleteTodo(currentTodo._id) as any)
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Todo deleted successfully!",
        });
        onClose();
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to delete todo"
        });
      });
  };
  
  if (!isOpen || !currentTodo) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-background-paper rounded-lg shadow-mui-3 w-full max-w-md mx-4 z-20">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-text-primary">Confirm Delete</h2>
          <button className="text-text-secondary hover:text-text-primary" onClick={onClose} aria-label="Close dialog">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <p className="mb-6 text-text-primary">Are you sure you want to delete this todo?</p>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              className="py-2 px-4 border border-gray-300 text-text-primary rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            
            <button 
              type="button" 
              className="py-2 px-4 bg-error-main text-white rounded-md hover:bg-error-dark focus:outline-none focus:ring-2 focus:ring-error-light focus:ring-offset-2 transition-colors"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
