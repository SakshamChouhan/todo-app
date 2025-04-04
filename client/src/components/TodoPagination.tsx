import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../store/todoSlice";
import { RootState } from "../store";

export default function TodoPagination() {
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state: RootState) => state.todo.pagination);
  
  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Handler for changing page
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  
  // Handler for previous page button
  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };
  
  // Handler for next page button
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="mt-6 flex justify-center">
      <div className="flex items-center bg-background-paper shadow-mui-1 rounded-lg overflow-hidden">
        <button 
          className="p-2 text-text-secondary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div className="flex items-center">
          {/* Show a limited number of page buttons to avoid overflow */}
          {pageNumbers.slice(0, 5).map((page) => (
            <button 
              key={page}
              className={`min-w-[40px] h-10 flex items-center justify-center px-2 ${
                currentPage === page 
                  ? 'bg-primary-main text-white hover:bg-primary-dark' 
                  : 'text-text-primary hover:bg-gray-100'
              } transition-colors`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          {totalPages > 5 && (
            <span className="px-2 text-text-secondary">...</span>
          )}
        </div>
        
        <button 
          className="p-2 text-text-secondary hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
