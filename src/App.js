
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatBubble from './components/ChatBubble';
import ImageInput from './components/ImageInput';
// import { v4 as uuidv4 } from 'uuid'; // Not used in frontend, handled by server
import './App.css';

const USERNAME = 'zlisto';
const MEMBER = 'Lisa';
const VECTOR_STORE_ID = 'your_vector_store_id'; // Replace with your actual vector store id

function App() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Create a new session on load
    const apiUrl = process.env.REACT_APP_API_URL || '';
    axios.post(`${apiUrl}/session`, { username: USERNAME, member: MEMBER })
      .then(res => setSessionId(res.data.sessionId));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Global drag and drop event listeners
  useEffect(() => {
    const handleDragEnter = (e) => handleGlobalDragEnter(e);
    const handleDragLeave = (e) => handleGlobalDragLeave(e);
    const handleDragOver = (e) => handleGlobalDragOver(e);
    const handleDrop = (e) => handleGlobalDrop(e);

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [dragCounter]);

  const sendMessage = async () => {
    if (!input.trim() && !imagePreview) return;
    
    // Create user message with text and/or image
    let userContent = input;
    if (imagePreview) {
      userContent = input ? `${input}\n\n![image](data:${imagePreview.mimeType};base64,${imagePreview.base64})` 
                          : `![image](data:${imagePreview.mimeType};base64,${imagePreview.base64})`;
    }
    
    const userMsg = { role: 'user', content: userContent, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput('');
    setImagePreview(null);
    
    try {
      // Use production API URL if available
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await axios.post(`${apiUrl}/chat`, {
        sessionId,
        username: USERNAME,
        member: MEMBER,
        message: input,
        imageData: imagePreview ? imagePreview.base64 : null,
      });
      const assistantMsg = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
    }
    setLoading(false);
  };



  const handleImage = async (file) => {
    console.log('Handling image:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      console.log('Uploading to /upload...');
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', res.data);
      
      // Set image preview instead of immediately sending
      setImagePreview({
        base64: res.data.base64,
        mimeType: res.data.mimeType,
        filename: res.data.filename
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Show error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error uploading image: ${error.response?.data?.error || error.message}. Please try again.`,
        timestamp: new Date()
      }]);
    }
  };

  const handleGlobalDragEnter = (e) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    if (dragCounter === 0) {
      setIsDragOver(true);
    }
  };

  const handleGlobalDragLeave = (e) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleGlobalDrop = (e) => {
    e.preventDefault();
    setDragCounter(0);
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => handleImage(file));
    }
  };

  const handleGlobalDragOver = (e) => {
    e.preventDefault();
  };

  const handleChatPaste = (e) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length > 0) {
      imageItems.forEach(item => {
        const file = item.getAsFile();
        if (file) {
          handleImage(file);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-pink-500 relative">
      {/* Global Drag Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-pink-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center text-pink-300 bg-black/80 rounded-2xl p-8 border-2 border-pink-500">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-2xl font-medium mb-2">Drop image anywhere</p>
            <p className="text-lg text-pink-400">Release to upload and chat with AI Lisa</p>
          </div>
        </div>
      )}

      {/* Floating Background Elements */}
      <div className="floating-bg">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      {/* Header with Lisa image */}
      <header className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src="/lisa_02.jpg"
            alt="Lisa"
            className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-pink-500 mb-4 hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-lg"></div>
        </div>
        <h1 className="text-7xl font-title mb-3">AI LISA</h1>
        <h2 className="text-2xl text-pink-300 mb-2 font-light">Your Personal Teaching Assistant</h2>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-5xl mx-auto mb-6">
        <div 
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 h-[720px] overflow-y-auto border-2 border-pink-500/50 shadow-2xl custom-scrollbar relative"
          onPaste={handleChatPaste}
          tabIndex={0}
        >

          {messages.length === 0 ? (
            <div className="text-center text-pink-300 mt-24">
              <p className="text-3xl font-light mb-3">Welcome to AI Lisa!</p>
              <p className="text-xl text-pink-400">Ask me anything about probability modeling and I'll help you learn.</p>
              <p className="text-sm text-pink-500 mt-4">💡 Tip: You can drag & drop images or paste them directly into the chat!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble key={idx} message={msg} />
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4 relative">
            <div className="bg-gray-800/80 backdrop-blur-sm border-2 border-pink-500/50 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <img
                  src={`data:${imagePreview.mimeType};base64,${imagePreview.base64}`}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-pink-500/30"
                />
                <div className="flex-1">
                  <p className="text-pink-300 text-sm font-medium">{imagePreview.filename}</p>
                  <p className="text-pink-400 text-xs">Image ready to send</p>
                </div>
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
            onPaste={handleChatPaste}
            placeholder={imagePreview ? "Add a message about the image..." : "Ask Lisa about probability modeling..."}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gray-800/80 backdrop-blur-sm border-2 border-pink-500/50 rounded-2xl text-pink-100 placeholder-pink-400 focus:outline-none focus:border-pink-400 focus:bg-gray-800 text-lg font-light transition-all duration-300"
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || (!input.trim() && !imagePreview)}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
