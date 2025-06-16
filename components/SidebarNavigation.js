import Link from 'next/link';
import { Search, Plus, BarChart3, TestTube, Bot, Settings, Brain } from 'lucide-react';

export default function SidebarNavigation({ currentPage = 'knowledge', stats = null }) {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <Brain size={20} className="text-blue-400 ml-2" />
        <span className="text-white font-semibold">GrowthOS</span>
      </div>

      {/* Navigation */}
      <div className="p-4">
        {/* Favorites */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Favorites:</h3>
          <div className="space-y-1">
            <div className="flex items-center px-3 py-2 rounded text-gray-300">
              <span className="mr-3">😊</span>
              <span>User</span>
            </div>
            
            <Link 
              href="/knowledge" 
              className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                currentPage === 'knowledge' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">❤️</span>
                <span>Knowledge</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>
          </div>
        </div>

        {/* Database Stats */}
        {stats && (
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-3">Database:</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div>📚 {stats.total_knowledge_items} items</div>
              <div>🏷️ {stats.unique_tags} unique tags</div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-6">
          <div className="space-y-1">
            <Link 
              href="/graph" 
              className="block text-blue-400 text-sm hover:underline px-3 py-1"
            >
              Relationship Graph
            </Link>
            <Link 
              href="/knowledge" 
              className="block text-blue-400 text-sm hover:underline px-3 py-1"
            >
              View Categories
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Actions:</h3>
          <div className="space-y-1">
            <Link 
              href="/curate" 
              className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                currentPage === 'curate' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">🔧</span>
                <span>Curate Knowledge</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>

            <Link 
              href="/test" 
              className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                currentPage === 'test' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">🧪</span>
                <span>Self Test</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>

            <Link 
              href="/agents" 
              className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                currentPage === 'agents' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">🤖</span>
                <span>Deploy Agents</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>
          </div>
        </div>

        {/* Workspace */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Workspace:</h3>
          <div className="space-y-1">
            <Link 
              href="/workspace/1" 
              className="flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <span className="mr-3">📝</span>
                <span>Workspace 1</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>
            <Link 
              href="/workspace/2" 
              className="flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <span className="mr-3">📝</span>
                <span>Workspace 2</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>
            <Link 
              href="/workspace/3" 
              className="flex items-center justify-between px-3 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <span className="mr-3">📝</span>
                <span>Workspace 3</span>
              </div>
              <span className="text-xs">▼</span>
            </Link>
            <Link 
              href="/workspace/new" 
              className="flex items-center px-3 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <span className="mr-3">➕</span>
              <span>Add Workspace</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}