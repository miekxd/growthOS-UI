'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedSection, setSelectedSection] = useState('Knowledge');

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

        {/* Relationship Graph */}
        <div className="mb-6">
          <button className="text-blue-400 text-sm hover:underline">
            Relationship Graph
          </button>
        </div>

        {/* View Categories */}
        <div className="mb-6">
          <button className="text-blue-400 text-sm hover:underline">
            View Categories
          </button>
        </div>

        {/* Actions Section */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Actions:</h3>
          <div className="space-y-2">
            <SidebarItem icon="🔧" text="Curate Knowledge" hasDropdown={true} />
            <SidebarItem icon="🧪" text="Self Test" hasDropdown={true} />
            <SidebarItem icon="🤖" text="Deploy Agents" hasDropdown={true} />
          </div>
        </div>

        {/* Workspace Section */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Workspace:</h3>
          <div className="space-y-2">
            <SidebarItem icon="📝" text="Notes 1:" hasDropdown={true} />
            <SidebarItem icon="📝" text="Notes 2:" hasDropdown={true} />
            <SidebarItem icon="📝" text="Notes 3:" hasDropdown={true} />
          </div>
          <button className="flex items-center gap-2 text-gray-400 text-sm mt-3 hover:text-white">
            <span>+</span>
            <span>Add Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Upload Area */}
        <div className="bg-card-bg rounded-lg p-8 mb-6 text-center border-2 border-dashed border-gray-400">
          <div className="text-gray-300 mb-2">📄</div>
          <p className="text-gray-300">Add a file or document</p>
        </div>

        {/* Summary & Analysis Card */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="border-l-4 border-accent pl-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Summary & Analysis:</h2>
          </div>

          {/* Context Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              📊 CONTEXT:
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The input provided me talks about the foundation of effective learning and self-growth. 
              It starts with understanding that consistency matters more than intensity. Most people 
              overestimate what they can do in a short time and underestimate what they can achieve 
              over months or years of steady effort. Instead of trying to cram or master something 
              overnight, establish a regular rhythm of focused learning. This could mean dedicating 30 to 
              90 minutes a day to a skill or topic and sticking to it like a job. That consistency builds 
              neural connections, confidence, and momentum. Track your time and progress, not to judge 
              yourself, but to hold yourself accountable and make adjustments when necessary. Another 
              critical element is deliberate practice. Mindless repetition doesn't lead to growth; targeted, 
              uncomfortable practice does. Break down complex tasks into smaller parts, identify your 
              weak points, and work on them intentionally. Get feedback early and often, whether through 
              mentors, peers, or self-assessment. Growth happens when you push into the zone where 
              things feel hard, but not impossible.
            </p>
          </div>

          {/* Suggestions Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              💡 SUGGESTIONS:
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Reviewing your existing knowledge database, here are three ways that we can update it:
            </p>
            <ul className="text-gray-700 text-sm space-y-1 ml-4">
              <li>• Suggestion 1: ...</li>
              <li>• Suggestion 2: ...</li>
              <li>• Suggestion 3: ...</li>
            </ul>
          </div>

          {/* Recommendation Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              💡 RECOMMENDATION:
            </h3>
            <p className="text-gray-700 text-sm">
              Given that your goal is X, Y, and Z, I recommend that you go with Suggestion 1/2/3. This is 
              because...
            </p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Ask anything" 
              className="flex-1 bg-transparent text-white placeholder-gray-300 border-none outline-none"
            />
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>⚙️ ChatGPT 4o</span>
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