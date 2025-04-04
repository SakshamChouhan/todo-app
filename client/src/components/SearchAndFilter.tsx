import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setStatusFilter } from "../store/todoSlice";
import { RootState } from "../store";
import { useDebounce } from "../hooks/useDebounce";
import { useEffect, useState } from "react";

interface SearchAndFilterProps {
  onAddTodo: () => void;
}

export default function SearchAndFilter({ onAddTodo }: SearchAndFilterProps) {
  const dispatch = useDispatch();
  const { status, searchQuery } = useSelector((state: RootState) => state.todo.filters);
  
  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);
  // Debounce search query to avoid too many dispatches
  const debouncedSearchQuery = useDebounce(searchInput, 500);
  
  // Update Redux store when debounced search query changes
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [dispatch, debouncedSearchQuery]);
  
  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  
  // Handler for status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value as 'all' | 'completed' | 'incomplete'));
  };
  
  return (
    <div className="mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between bg-background-paper p-4 rounded-lg shadow-mui-1">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-grow">
        {/* Search Field */}
        <div className="flex-grow max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search todos..." 
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light bg-white"
            value={status}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>
      
      {/* Add Todo Button */}
      <button 
        className="py-2 px-4 bg-secondary-main text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2 transition-colors flex items-center justify-center"
        onClick={onAddTodo}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Todo</span>
      </button>
    </div>
  );
}
