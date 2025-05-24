interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3; // Show max 3 page numbers
    
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <div className="bg-[#F8F9FA] p-3 border-t border-[#E9ECEF] flex justify-between items-center">
      <button 
        className="text-[#6C757D] px-3 py-1 rounded hover:bg-[#E9ECEF] transition-colors focus:outline-none disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left mr-1"></i> Precedente
      </button>
      
      <div className="text-sm text-[#6C757D]">
        Pagina <span className="font-medium">{currentPage}</span> di <span className="font-medium">{totalPages}</span>
      </div>
      
      <button 
        className="text-[#19647E] px-3 py-1 rounded hover:bg-[#E9ECEF] transition-colors focus:outline-none disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Successivo <i className="fas fa-chevron-right ml-1"></i>
      </button>
    </div>
  );
}
