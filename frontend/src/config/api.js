// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://learn-gpt.onrender.com';

export const API_ENDPOINTS = {
  QUIZ: `${API_BASE_URL}/generate/quiz`,
  CHAT: `${API_BASE_URL}/chat`,
  SUMMARIZE: `${API_BASE_URL}/generate/summarise`,
  LOAD_PDF: `${API_BASE_URL}/load_pdf`,
  UPLOAD: `${API_BASE_URL}/upload`,
  ROOT: `${API_BASE_URL}/`
};

export default API_BASE_URL; 