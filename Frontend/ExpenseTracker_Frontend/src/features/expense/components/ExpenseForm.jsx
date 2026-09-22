export default function ExpenseForm({
  formData,
  editingExpenseId,
  error,
  success,
  maxDate,
  fileInputRef,

  handleChange,
  handleFileChange,
  handleSubmit,
  cancelEdit,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        {editingExpenseId ? "Edit Expense" : "Submit New Expense Claim"}
      </h2>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* TITLE */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Client Dinner"
          />
        </div>

        {/* AMOUNT */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Amount (₹)
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="FOOD">Food</option>

            <option value="TRAVEL">Travel</option>

            <option value="ACCOMMODATION">Accommodation</option>

            <option value="OFFICE_SUPPLIES">Office Supplies</option>

            <option value="MEDICAL">Medical</option>

            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onKeyDown={(e) => e.preventDefault()}
            max={maxDate}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* RECEIPT */}
        <div className="md:col-span-2">
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Proof / Receipt Attachment (Optional)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <label className="block text-slate-700 text-sm font-semibold mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional notes or details..."
          />
        </div>

        {/* BUTTONS */}
        <div className="md:col-span-2 flex justify-end gap-3">
          {editingExpenseId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow"
          >
            {editingExpenseId ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
