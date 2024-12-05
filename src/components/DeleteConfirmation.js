export function DeleteConfirmation({ isOpen, onClose, onConfirm, selectedCount }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-amber-900 mb-4">
            Confirm Delete
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to yeet {selectedCount} meme{selectedCount !== 1 ? 's' : ''}? 
            This action cannot be undone!
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Yeet {selectedCount !== 1 ? 'them' : 'it'}
            </button>
          </div>
        </div>
      </div>
    );
  }