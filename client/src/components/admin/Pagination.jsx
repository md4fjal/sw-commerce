// Pagination.jsx
const Pagination = ({ page, pages, onPrev, onNext, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-3">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                page === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {pages > 5 && <span className="text-gray-500 px-2">...</span>}
      </div>

      <button
        onClick={onNext}
        disabled={page >= pages}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
