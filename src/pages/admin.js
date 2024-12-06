'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState('');
  const [memes, setMemes] = useState([]);
  const [selectedMemes, setSelectedMemes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMemes();
    }
  }, [isAuthenticated]);

  const fetchMemes = async () => {
    try {
      const response = await fetch('/api/getMemes');
      const data = await response.json();
      setMemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Invalid password');
    }
  };

  const handleUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('memes', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowPopup('Great job intern! You yeeted a meme! 🎉');
        e.target.value = '';
        await fetchMemes(); // Refresh memes list immediately
        setTimeout(() => {
          setShowPopup('');
        }, 3000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicIds) => {
    try {
      const response = await fetch('/api/deleteMeme', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicIds: Array.isArray(publicIds) ? publicIds : [publicIds] }),
      });

      if (response.ok) {
        setShowPopup('Meme yeeted into the void! 🗑️');
        await fetchMemes(); // Refresh memes list immediately
        setSelectedMemes([]);
        setShowDeleteConfirm(false);
        setTimeout(() => {
          setShowPopup('');
        }, 3000);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      setMessage(`Error deleting meme: ${error.message}`);
    }
  };

  const toggleMemeSelection = (publicId) => {
    setSelectedMemes(prev => {
      if (prev.includes(publicId)) {
        return prev.filter(id => id !== publicId);
      } else {
        return [...prev, publicId];
      }
    });
  };

  const Footer = () => (
    <footer className="py-6 text-center">
      <p className="text-amber-800 mb-2">Made by yeetarded community member</p>
      <div className="flex justify-center space-x-4">
        <a 
          href="https://x.com/RaveniumNFT" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-900 hover:text-amber-600 transition-colors"
        >
          𝕏: @RaveniumNFT
        </a>
        <span className="text-amber-900">•</span>
        <span className="text-amber-900">Discord: ravenium22</span>
      </div>
    </footer>
  );

  const DeleteConfirmation = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-amber-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to yeet {selectedMemes.length} meme(s)? 
          This action cannot be undone!
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedMemes)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Yeet them
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200">
        <Header isAdmin={true} />
        <div className="flex items-center justify-center p-8">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-amber-900 text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition-colors transform hover:scale-105 duration-200"
              >
                Login
              </button>
              {message && (
                <p className="text-red-500 text-center">{message}</p>
              )}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-200">
      <Header isAdmin={true} />

      <main className="max-w-6xl mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Meme Upload Zone</h2>
          
          <div className="space-y-6">
            <div className="border-3 border-dashed border-amber-300 rounded-lg p-12 text-center bg-amber-50">
              <input
                type="file"
                onChange={handleUpload}
                multiple
                accept="image/*"
                className="hidden"
                id="meme-upload"
              />
              <label
                htmlFor="meme-upload"
                className="cursor-pointer bg-amber-500 text-white px-8 py-4 rounded-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 inline-block font-bold text-lg shadow-md"
              >
                {uploading ? 'Yeeting in progress...' : 'Select Memes to Yeet'}
              </label>
              <p className="text-amber-800 mt-4">Supported formats: JPG, PNG, GIF, WebP</p>
            </div>
          </div>
        </div>

        {/* Meme Management Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-amber-900">Manage Memes</h2>
            <div className="flex gap-4">
              {memes.length > 0 && (
                <button
                  onClick={() => {
                    setIsBulkDeleteMode(!isBulkDeleteMode);
                    setSelectedMemes([]);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isBulkDeleteMode 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {isBulkDeleteMode ? 'Cancel Selection' : 'Select Multiple'}
                </button>
              )}
              {selectedMemes.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Selected ({selectedMemes.length})
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme, index) => (
              <div 
                key={index} 
                className={`relative group cursor-pointer ${
                  selectedMemes.includes(meme.public_id) ? 'ring-4 ring-amber-500' : ''
                }`}
                onClick={() => isBulkDeleteMode && toggleMemeSelection(meme.public_id)}
              >
                <div className="relative">
                  <img
                    src={meme.url}
                    alt={meme.filename}
                    className={`w-full h-48 object-cover rounded-lg shadow-md transition-all duration-200 ${
                      selectedMemes.includes(meme.public_id) ? 'brightness-75' : 'group-hover:brightness-90'
                    }`}
                  />
                  {isBulkDeleteMode && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center bg-amber-500">
                      {selectedMemes.includes(meme.public_id) && (
                        <span className="text-white text-lg">✓</span>
                      )}
                    </div>
                  )}
                  {!isBulkDeleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete([meme.public_id]);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      title="Delete meme"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Popup Messages */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 transform animate-bounce">
            <div className="text-2xl font-bold text-amber-600 text-center">
              {showPopup}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <DeleteConfirmation />}
    </div>
  );
}