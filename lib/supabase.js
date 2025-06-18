// lib/supabase.js - Fixed version with proper array handling
// API helper functions to communicate with FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(
        errorData.detail || errorData.error || `HTTP ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    console.error('API request failed:', error);
    throw new ApiError('Failed to connect to the knowledge processing service');
  }
}

// Process text and get AI recommendations
export async function processText(text, similarityThreshold = 0.8) {
  const response = await apiRequest('/api/process-text', {
    method: 'POST',
    body: JSON.stringify({
      text,
      threshold: similarityThreshold,
    }),
  });

  // Transform the response to match what your frontend expects
  return {
    recommendations: response.recommendations.map(rec => ({
      option_number: rec.option_number,
      change: rec.change,
      updated_text: rec.updated_text,
      category: rec.category,
      tags: rec.tags || [], // Include tags
      preview: rec.preview,
    })),
    similar_category: response.similar_category,
  };
}

// Get all knowledge categories - use your backend endpoint
export async function getCategories() {
  const response = await apiRequest('/api/categories');
  return {
    categories: response.categories || [],
  };
}

// Get database statistics - use your backend endpoint
export async function getDatabaseStats() {
  const response = await apiRequest('/api/stats');
  return response.stats || response;
}

// Health check
export async function healthCheck() {
  return apiRequest('/health');
}

// Supabase integration for direct database access
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate embedding using Next.js API route (fast + secure)
async function generateEmbedding(text) {
  try {
    const response = await fetch('/api/generate-embedding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

// API functions for knowledge items (FIXED VERSION WITH EMBEDDINGS)
export const knowledgeAPI = {
  // Get all knowledge items
  async getAll() {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('id, category, content, tags, created_at, last_updated')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching knowledge items:', error);
      throw error;
    }

    // Handle tags properly - they might be stored as JSON strings or arrays
    const processedData =
      data?.map(item => ({
        ...item,
        tags: Array.isArray(item.tags)
          ? item.tags
          : typeof item.tags === 'string'
            ? JSON.parse(item.tags)
            : item.tags || [],
      })) || [];

    return processedData;
  },

  // Create new knowledge item - WITH EMBEDDING GENERATION AND UPDATE LOGIC
  async create(knowledgeItem) {
    console.log('Creating knowledge item with tags:', knowledgeItem.tags);

    // Ensure tags is a proper array (not a JSON string)
    let tags = knowledgeItem.tags || [];

    // If tags is somehow a string, parse it
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        // If parsing fails, treat as single tag
        tags = [tags];
      }
    }

    // Ensure it's an array
    if (!Array.isArray(tags)) {
      tags = [];
    }

    // Generate embedding for the content
    console.log('🔄 Generating embedding for content...');
    let embedding = [];

    try {
      embedding = await generateEmbedding(knowledgeItem.content);
      console.log('✅ Embedding generated successfully, dimension:', embedding.length);
      console.log('📊 Sample embedding values:', embedding.slice(0, 5));
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      console.log('⚠️ Proceeding without embedding...');
      // Continue without embedding rather than failing completely
    }

    // 🔍 Check if category already exists
    console.log('🔍 Checking if category exists:', knowledgeItem.category);
    const { data: existingItems, error: checkError } = await supabase
      .from('knowledge_items')
      .select('id, category, content, tags')
      .eq('category', knowledgeItem.category)
      .limit(1);

    if (checkError) {
      console.error('Error checking existing category:', checkError);
      throw checkError;
    }

    const itemToInsert = {
      category: knowledgeItem.category,
      content: knowledgeItem.content,
      tags: tags,
      embedding: embedding,
    };

    if (existingItems && existingItems.length > 0) {
      // 🔄 UPDATE existing category
      const existingItem = existingItems[0];
      console.log('📝 Updating existing category:', existingItem.id);

      const { data, error } = await supabase
        .from('knowledge_items')
        .update(itemToInsert)
        .eq('id', existingItem.id)
        .select('id, category, content, tags, created_at, last_updated');

      if (error) {
        console.error('Error updating knowledge item:', error);
        throw error;
      }

      console.log('✅ Successfully updated existing category');
      const updatedItem = data[0];
      return {
        ...updatedItem,
        tags: Array.isArray(updatedItem.tags)
          ? updatedItem.tags
          : typeof updatedItem.tags === 'string'
            ? JSON.parse(updatedItem.tags)
            : updatedItem.tags || [],
      };
    } else {
      // ➕ CREATE new category
      console.log('➕ Creating new category');

      const { data, error } = await supabase
        .from('knowledge_items')
        .insert([itemToInsert])
        .select('id, category, content, tags, created_at, last_updated');

      if (error) {
        console.error('Error creating knowledge item:', error);
        throw error;
      }

      console.log('✅ Successfully created new category');
      const createdItem = data[0];
      return {
        ...createdItem,
        tags: Array.isArray(createdItem.tags)
          ? createdItem.tags
          : typeof createdItem.tags === 'string'
            ? JSON.parse(createdItem.tags)
            : createdItem.tags || [],
      };
    }
  },

  // Update knowledge item - FIXED VERSION
  async update(id, updates) {
    // Handle tags properly
    let tags = updates.tags || [];
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [tags];
      }
    }
    if (!Array.isArray(tags)) {
      tags = [];
    }

    const updatesToApply = {
      ...updates,
      tags: tags, // ✅ Send as array directly
    };

    const { data, error } = await supabase
      .from('knowledge_items')
      .update(updatesToApply)
      .eq('id', id)
      .select('id, category, content, tags, created_at, last_updated');

    if (error) {
      console.error('Error updating knowledge item:', error);
      throw error;
    }

    const updatedItem = data[0];
    return {
      ...updatedItem,
      tags: Array.isArray(updatedItem.tags)
        ? updatedItem.tags
        : typeof updatedItem.tags === 'string'
          ? JSON.parse(updatedItem.tags)
          : updatedItem.tags || [],
    };
  },

  // Delete knowledge item
  async delete(id) {
    const { error } = await supabase.from('knowledge_items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting knowledge item:', error);
      throw error;
    }

    return true;
  },
};
