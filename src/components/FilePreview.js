import React from 'react';

export function FilePreview({ files, onRemove }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
        Selected Files ({files.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                ✕
              </button>
              <div className="absolute bottom-1 left-1 right-1 text-xs text-gray-600 dark:text-gray-300 truncate px-2 py-1 bg-white/70 dark:bg-black/70 rounded">
                {file.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}