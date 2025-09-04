import React, { useCallback } from 'react';
import './ImageInput.css';

const ImageInput = ({ onImage }) => {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImage(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImage(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        onImage(file);
      }
    }
  }, [onImage]);

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div
      className="flex items-center gap-3 p-4 border-2 border-pink-500/50 rounded-2xl bg-gray-800/80 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <label className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
        📷 Upload Image
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      <span className="text-pink-300 text-sm font-light">Drag & drop, paste, or select image</span>
    </div>
  );
};

export default ImageInput;
