// ConfirmDeleteModal.jsx
const ConfirmDeleteModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 text-sm mb-4">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
