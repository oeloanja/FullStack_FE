import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://billit.kro.kr/';

console.log('환경변수 체크:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://billit.kro.kr/'
});

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const fetchWithAuth = async (endpoint: string, options: any = {}) => {
  try {
    const response = await api.request({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

export default api;