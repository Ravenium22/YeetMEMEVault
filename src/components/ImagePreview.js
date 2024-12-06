import React from 'react';

export function ImagePreview({ image, onClose, onDownload, downloadCount }) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold text-amber-900">
            {image.filename}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <img 
            src={image.url}
            alt={image.filename}
            className="max-h-[80vh] object-contain mx-auto rounded-lg"
          />
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Downloads: {downloadCount}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDownload(image);
            }}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}