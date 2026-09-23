const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>

      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
