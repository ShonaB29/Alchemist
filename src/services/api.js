import axios from 'axios';

export const API_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1`;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const learningAPI = {
  getCourses: (params = {}) => api.get('/learning/courses', { params }),
  getProgress: () => api.get('/learning/progress'),
  getActiveRoadmap: () => api.get('/learning/active-roadmap'),
  completeCourse: (courseId) => api.post(`/learning/courses/${courseId}/complete`),
  completeResource: (resourceId) => api.post(`/learning/resources/${resourceId}/complete`),
  getUserProgress: () => api.get('/learning/user-progress'),
  getAchievements: () => api.get('/learning/achievements'),
  getStats: () => api.get('/learning/stats'),
  getRecommendations: () => api.post('/learning/recommendations'),
  getPeerMatches: () => api.get('/learning/peer-matches'),
};

// Helper for streaming chat responses using fetch + ReadableStream
export const chatAPI = {
  // Get user context for AI personalization
  getContext: () => api.get('/chat/context'),
  
  // Get available mentor personalities
  getPersonalities: () => api.get('/chat/personalities'),
  
  // Get all conversations
  getConversations: (skip = 0, limit = 20) => api.get(`/chat/conversations?skip=${skip}&limit=${limit}`),
  
  // Get specific conversation
  getConversation: (id) => api.get(`/chat/conversations/${id}`),
  
  // Create new conversation
  createConversation: (personalityId = null) => api.post('/chat/conversations', null, { params: { personality_id: personalityId } }),
  
  // Send message (non-streaming)
  sendMessage: (data) => api.post('/chat/chat', data),
  
  // Send message with streaming using fetch + ReadableStream
  async *sendMessageStream(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6);
            if (jsonStr.trim()) {
              yield JSON.parse(jsonStr);
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  },
  
  // Submit feedback on a message
  submitFeedback: (messageId, feedbackType) => api.post('/chat/feedback', { message_id: messageId, feedback_type: feedbackType }),
  
  // Get conversation summary
  summarizeConversation: (id) => api.post(`/chat/conversations/${id}/summarize`),
  
  // Search conversations
  searchConversations: (query) => api.get('/chat/search', { params: { query } }),
  
  // Archive conversation
  archiveConversation: (id) => api.delete(`/chat/conversations/${id}`),
};

export default api;
