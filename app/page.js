'use client';

import { useState, useEffect } from 'react';
import { processText, applyRecommendation, getCategories, getDatabaseStats } from '../lib/api';

export default function Home() {
  const [selectedSection, setSelectedSection] = useState('Knowledge');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [similarCategory, setSimilarCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load categories and stats on component mount
  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getDatabaseStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const result = await processText(inputText);
      setRecommendations(result.recommendations);
      setSimilarCategory(result.similar_category);
    } catch (error) {
      setError(`Processing failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyRecommendation = async (optionNumber) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await applyRecommendation(inputText, optionNumber);
      
      if (result.success) {
        setSuccessMessage(`✅ ${result.message}`);
        // Refresh categories and stats
        await loadCategories();
        await loadStats();
        // Clear recommendations after successful application
        setRecommendations(null);
        setInputText('');
      } else {
        setError(`Failed to apply recommendation: ${result.message}`);
      }
    } catch (error) {
      setError(`Application failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleProcessText();
    }
  };

  return (
    <div className="flex h-screen bg-main-bg">
      {/* Left Sidebar */}
      <div className="w-64 bg-sidebar-bg text-white p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-white font-semibold ml-2">GOS</span>
        </div>

        {/* Favorites Section */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Favorites:</h3>
          <div className="space-y-2">
            <SidebarItem icon="😊" text="User" />
            <SidebarItem 
              icon="❤️" 
              text="Knowledge" 
              isActive={selectedSection === 'Knowledge'}
              onClick={() => setSelectedSection('Knowledge')}
              hasDropdown={true}
            />
          </div>
        </div>

        {/* Database Stats */}
        {stats && (
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-3">Database:</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>📚 {stats.total_knowledge_items} categories</div>
              <div>🏷️ {stats.unique_tags} unique tags</div>
            </div>
          </div>
        )}

        {/* Actions Section */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Actions:</h3>
          <div className="space-y-2">
            <SidebarItem icon="🔧" text="Curate Knowledge" hasDropdown={true} />
            <SidebarItem icon="🧪" text="Self Test" hasDropdown={true} />
            <SidebarItem icon="🤖" text="Deploy Agents" hasDropdown={true} />
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Recent Categories:</h3>
          <div className="space-y-1">
            {categories.slice(0, 3).map((category, index) => (
              <div key={index} className="text-xs text-gray-300 truncate">
                📝 {category.category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Input Area */}
        <div className="bg-card-bg rounded-lg p-6 mb-6">
          <h2 className="text-white text-lg font-semibold mb-4">💡 Add Knowledge</h2>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your knowledge, insights, or information here..."
            className="w-full h-32 p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-400 focus:outline-none resize-none"
            disabled={isProcessing}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-400">
              Press Enter to process, Shift+Enter for new line
            </div>
            <button
              onClick={handleProcessText}
              disabled={isProcessing || !inputText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isProcessing ? '🔄 Processing...' : '🚀 Process'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">🤖 AI Recommendations:</h2>
            </div>

            {/* Similar Category Info */}
            {similarCategory && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  📊 Similar Content Found:
                </h3>
                <p className="text-blue-700 text-sm">
                  Found similar content in category: <strong>{similarCategory}</strong>
                </p>
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.option_number} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Option {rec.option_number}: {rec.category}
                    </h3>
                    <button
                      onClick={() => handleApplyRecommendation(rec.option_number)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isProcessing ? '⏳' : '✅ Apply'}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{rec.change}</p>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Preview:</strong> {rec.preview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Ask anything about your knowledge base..." 
              className="flex-1 bg-transparent text-white placeholder-gray-300 border-none outline-none"
            />
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>🧠 Second Brain AI</span>
              <button className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white hover:bg-gray-400">
                ↗️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Sidebar Item Component
function SidebarItem({ icon, text, isActive, onClick, hasDropdown }) {
  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700 ${
        isActive ? 'bg-gray-700' : ''
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="text-sm flex-1">{text}</span>
      {hasDropdown && <span className="text-gray-400">▶</span>}
    </div>
  );
}