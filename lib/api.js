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