// lib/api.js
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
export async function processText(text, similarityThreshold = 0.5) {
  return apiRequest('/api/process-text', {
    method: 'POST',
    body: JSON.stringify({
      text,
      similarity_threshold: similarityThreshold,
    }),
  });
}

// Apply a selected recommendation
export async function applyRecommendation(text, selectedOption, similarityThreshold = 0.8) {
  return apiRequest('/api/apply-recommendation', {
    method: 'POST',
    body: JSON.stringify({
      text,
      selected_option: selectedOption,
      similarity_threshold: similarityThreshold,
    }),
  });
}

// Get all knowledge categories
export async function getCategories() {
  return apiRequest('/api/categories');
}

// Get database statistics
export async function getDatabaseStats() {
  return apiRequest('/api/stats');
}

// Health check
export async function healthCheck() {
  return apiRequest('/health');
}

// Supabase integration for direct database access
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API functions for knowledge items (for the knowledge view page)
export const knowledgeAPI = {
  // Get all knowledge items
  async getAll() {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('id, category, content, tags, created_at, last_updated')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching knowledge items:', error)
      throw error
    }
    
    // Parse the tags field which is stored as a JSON string
    const processedData = data?.map(item => ({
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || [])
    })) || []
    
    return processedData
  },

  // Get knowledge item by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('id, category, content, tags, created_at, last_updated')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching knowledge item:', error)
      throw error
    }
    
    // Parse the tags field
    return {
      ...data,
      tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : (data.tags || [])
    }
  },

  // Create new knowledge item
  async create(knowledgeItem) {
    const itemToInsert = {
      ...knowledgeItem,
      tags: JSON.stringify(knowledgeItem.tags || [])
    }
    
    const { data, error } = await supabase
      .from('knowledge_items')
      .insert([itemToInsert])
      .select('id, category, content, tags, created_at, last_updated')
    
    if (error) {
      console.error('Error creating knowledge item:', error)
      throw error
    }
    
    return {
      ...data[0],
      tags: typeof data[0].tags === 'string' ? JSON.parse(data[0].tags) : (data[0].tags || [])
    }
  },

  // Update knowledge item
  async update(id, updates) {
    const updatesToApply = {
      ...updates,
      tags: updates.tags ? JSON.stringify(updates.tags) : undefined
    }
    
    const { data, error } = await supabase
      .from('knowledge_items')
      .update(updatesToApply)
      .eq('id', id)
      .select('id, category, content, tags, created_at, last_updated')
    
    if (error) {
      console.error('Error updating knowledge item:', error)
      throw error
    }
    
    return {
      ...data[0],
      tags: typeof data[0].tags === 'string' ? JSON.parse(data[0].tags) : (data[0].tags || [])
    }
  },

  // Delete knowledge item
  async delete(id) {
    const { error } = await supabase
      .from('knowledge_items')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting knowledge item:', error)
      throw error
    }
    
    return true
  }
}