"use client";

import React, { useState, useEffect } from 'react';
import { knowledgeAPI } from '../../lib/supabase';
import SidebarNavigation from '../../components/SidebarNavigation';
import Link from 'next/link';

// Knowledge Item Card Component
const KnowledgeCard = ({ category, content, tags, created_at, last_updated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncateLength = 200;
  const shouldTruncate = content.length > truncateLength;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Category Header */}
      <div className="border-b border-gray-200 pb-2 mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">{category}</h3>
      </div>
      
      {/* Content Section */}
      <div className="mb-4">
        <div className="text-gray-600 text-sm leading-relaxed">
          {shouldTruncate && !isExpanded 
            ? `${content.substring(0, truncateLength)}...`
            : content
          }
        </div>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      
      {/* Tags Section */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {tags && tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Timestamp Footer */}
      <div className="text-xs text-gray-400 border-t border-gray-100 pt-2">
        Created: {new Date(created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
        {last_updated !== created_at && (
          <div className="mt-1">
            Updated: {new Date(last_updated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default function KnowledgeViewPage() {
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Navigation handler - Added from second page
  const handleNavigation = (section) => {
    setSelectedSection(section);
    
    // Handle navigation to different pages/sections
    switch(section) {
      case 'Curate Knowledge':
        // You can replace this with actual routing later
        window.location.href = '/curate'; // or use Next.js router
        break;
      case 'Self Test':
        window.location.href = '/test';
        break;
      case 'Deploy Agents':
        window.location.href = '/agents';
        break;
      case 'Relationship Graph':
        window.location.href = '/graph';
        break;
      case 'View Categories':
        // Stay on current page - this is the knowledge view
        break;
      default:
        break;
    }
  };

  // Fetch knowledge items from Supabase
  useEffect(() => {
    async function fetchKnowledgeItems() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await knowledgeAPI.getAll();
        setKnowledgeItems(data || []);
        
        // Generate stats from the fetched data
        if (data && data.length > 0) {
          const allTags = data.flatMap(item => item.tags || []);
          const uniqueTags = [...new Set(allTags)];
          
          setStats({
            total_knowledge_items: data.length,
            unique_tags: uniqueTags.length
          });
        }
      } catch (err) {
        console.error('Error fetching knowledge items:', err);
        setError('Failed to load knowledge items. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchKnowledgeItems();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation Component */}
      <SidebarNavigation currentPage="knowledge" stats={stats} />

      {/* Main Content - Knowledge Items Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Knowledge Database</h1>
            <p className="text-gray-600">
              {loading ? 'Loading knowledge items...' : `${knowledgeItems.length} knowledge items`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading knowledge items...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Knowledge Items Grid */}
          {!loading && !error && knowledgeItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledgeItems.map((item) => (
                <KnowledgeCard
                  key={item.id}
                  category={item.category}
                  content={item.content}
                  tags={item.tags}
                  created_at={item.created_at}
                  last_updated={item.last_updated}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && knowledgeItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No knowledge items found</h3>
              <p className="text-gray-500 mb-4">Your knowledge database is empty. Start adding knowledge to see it here.</p>
              <Link 
                href="/curate"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
              >
                Add Knowledge Item
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}