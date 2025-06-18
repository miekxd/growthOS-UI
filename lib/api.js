// lib/api.js - Complete file with debug logging
import { API_ENDPOINTS, apiCall } from './api-config';

export async function processText(text, similarityThreshold = 0.8) {
  console.log('🚀 Starting processText...');
  console.log('📝 Text length:', text.length);
  console.log('📝 Text preview:', text.substring(0, 100) + '...');
  console.log('🎯 Similarity threshold:', similarityThreshold);
  console.log('🔗 API endpoint:', API_ENDPOINTS.PROCESS_TEXT);

  try {
    const requestBody = {
      text: text,
      threshold: similarityThreshold,
    };

    console.log('📦 Request body:', requestBody);

    const response = await apiCall(API_ENDPOINTS.PROCESS_TEXT, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    console.log('📊 Processing response received:', response);

    // Validate response structure
    if (!response.recommendations) {
      console.warn('⚠️ No recommendations in response');
    }

    return {
      recommendations: response.recommendations || [],
      similar_category: response.similar_category,
      similarity_score: response.similarity_score,
      status: response.status || 'success',
    };
  } catch (error) {
    console.error('❌ processText error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });

    // Provide a user-friendly error message
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error: Unable to connect to the backend service. Please check your internet connection.'
      );
    } else if (error.message.includes('CORS')) {
      throw new Error('CORS error: Backend is not allowing requests from this domain.');
    } else {
      throw new Error(`Backend processing failed: ${error.message}`);
    }
  }
}

export async function getCategories() {
  console.log('📂 Getting categories...');

  try {
    const response = await apiCall(API_ENDPOINTS.CATEGORIES);
    console.log('📂 Categories response:', response);

    return response.categories || [];
  } catch (error) {
    console.error('❌ Error getting categories:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function getDatabaseStats() {
  console.log('📈 Getting database stats...');

  try {
    const response = await apiCall(API_ENDPOINTS.STATS);
    console.log('📈 Stats response:', response);

    return {
      total_knowledge_items: response.total_knowledge_items || 0,
      unique_tags: response.unique_tags || 0,
      status: response.status || 'success',
    };
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    // Return default stats as fallback
    return {
      total_knowledge_items: 0,
      unique_tags: 0,
      status: 'error',
    };
  }
}

export async function healthCheck() {
  console.log('❤️ Checking backend health...');

  try {
    const response = await apiCall(API_ENDPOINTS.HEALTH);
    console.log('❤️ Health check response:', response);

    return response;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw error;
  }
}

// Test function to check backend connectivity
export async function testBackendConnection() {
  try {
    console.log('🧪 Testing backend connection...');
    console.log('🔗 Testing URL:', API_ENDPOINTS.HEALTH);

    const health = await healthCheck();
    console.log('✅ Backend connection successful:', health);
    return true;
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    return false;
  }
}
