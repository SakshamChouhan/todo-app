import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/authSlice";
import { 
  fetchTodos, 
  setCurrentPage,
  setStatusFilter,
  setSearchQuery,
  setCurrentTodo
} from "../store/todoSlice";
import TodoCard from "../components/TodoCard";
import AddTodoDialog from "../components/AddTodoDialog";
import EditTodoDialog from "../components/EditTodoDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import TodoPagination from "../components/TodoPagination";
import SearchAndFilter from "../components/SearchAndFilter";
import { Todo } from "../types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { 
    todos, 
    loading, 
    error, 
    pagination,
    filters
  } = useSelector((state: RootState) => state.todo);
  const { toast } = useToast();
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Load todos on mount and when page changes
  useEffect(() => {
    dispatch(fetchTodos(pagination.currentPage) as any);
  }, [dispatch, pagination.currentPage]);
  
  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      });
    }
  }, [error, toast]);
  
  // Handler for opening the add todo dialog
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  
  // Handler for opening the edit todo dialog
  const handleOpenEditDialog = (todo: Todo) => {
    dispatch(setCurrentTodo(todo));
    setIsEditDialogOpen(true);
  };
  
  // Handler for opening the delete confirmation dialog
  const handleOpenDeleteDialog = (todo: Todo) => {
    dispatch(setCurrentTodo(todo));
    setIsDeleteDialogOpen(true);
  };
  
  // Handler for logout button
  const handleLogout = () => {
    dispatch(logout());
  };
  
  // Filter todos based on status and search query
  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    if (filters.status === 'completed' && !todo.completed) return false;
    if (filters.status === 'incomplete' && todo.completed) return false;
    
    // Filter by search query
    if (filters.searchQuery && !todo.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="h-screen flex flex-col bg-background-default">
      {/* App Bar */}
      <header className="bg-primary-main text-white shadow-mui-1">
        <div className="px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h1 className="text-xl font-medium">TodoMaster</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">{user}</span>
            <button 
              className="ml-2 p-2 rounded-full hover:bg-primary-dark transition-colors"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search, Filter and Add Controls */}
          <SearchAndFilter onAddTodo={handleOpenAddDialog} />
          
          {/* Loading State */}
          {loading && (
            <div className="mb-6">
              <div className="p-4 bg-background-paper rounded-lg shadow-mui-1 text-center text-text-secondary">
                Loading todos...
              </div>
            </div>
          )}
          
          {/* No Results State */}
          {!loading && filteredTodos.length === 0 && (
            <div className="mb-6">
              <div className="p-4 bg-background-paper rounded-lg shadow-mui-1 text-center text-text-secondary">
                No todos found for the current filter settings.
              </div>
            </div>
          )}
          
          {/* Todo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTodos.map((todo) => (
              <TodoCard 
                key={todo._id} 
                todo={todo} 
                onEdit={() => handleOpenEditDialog(todo)}
                onDelete={() => handleOpenDeleteDialog(todo)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {!loading && filteredTodos.length > 0 && (
            <TodoPagination />
          )}
        </div>
      </main>
      
      {/* Dialogs */}
      <AddTodoDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
      
      <EditTodoDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
      />
      
      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
      />
    </div>
  );
}
