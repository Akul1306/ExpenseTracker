export default function ExpensePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
      <button
        disabled={currentPage === 1}
        onClick={onPrevious}
        className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Previous
      </button>

      <span className="text-sm text-slate-600">
        Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
        <strong className="text-slate-900">{totalPages}</strong>
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}
