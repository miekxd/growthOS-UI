// lib/api.js - Updated for Railway backend integration
import { API_ENDPOINTS, apiCall } from './api-config';

export async function processText(text, similarityThreshold = 0.8) {
  try {
    console.log('🚀 Processing text with backend...');
    
    const response = await apiCall(API_ENDPOINTS.PROCESS_TEXT, {
      method: 'POST',
      body: JSON.stringify({
        text: text,
        threshold: similarityThreshold
      }),
    });

    console.log('📊 Backend response:', response);

    return {
      recommendations: response.recommendations || [],
      similar_category: response.similar_category,
      similarity_score: response.similarity_score,
      status: response.status || 'success'
    };
  } catch (error) {
    console.error('❌ Error processing text:', error);
    throw new Error(`Processing failed: ${error.message}`);
  }
}

export async function getCategories() {
  try {
    console.log('📂 Getting categories from backend...');
    
    const response = await apiCall(API_ENDPOINTS.CATEGORIES);
    
    return response.categories || [];
  } catch (error) {
    console.error('❌ Error getting categories:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function getDatabaseStats() {
  try {
    console.log('📈 Getting database stats from backend...');
    
    const response = await apiCall(API_ENDPOINTS.STATS);
    
    return {
      total_knowledge_items: response.total_knowledge_items || 0,
      unique_tags: response.unique_tags || 0,
      status: response.status || 'success'
    };
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    // Return default stats as fallback
    return {
      total_knowledge_items: 0,
      unique_tags: 0,
      status: 'error'
    };
  }
}

export async function healthCheck() {
  try {
    console.log('❤️ Checking backend health...');
    
    const response = await apiCall(API_ENDPOINTS.HEALTH);
    
    return response;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw error;
  }
}

// Helper function to test backend connection
export async function testBackendConnection() {
  try {
    const health = await healthCheck();
    console.log('✅ Backend connection successful:', health);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
}