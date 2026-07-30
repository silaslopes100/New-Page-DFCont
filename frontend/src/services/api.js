import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 'Erro de conexão. Tente novamente.';
    return Promise.reject(new Error(message));
  }
);

export const calculatorAPI = {
  calculate: (data) => api.post('/calculator/calculate', data),
};

export const plansAPI = {
  getAll: (category) => api.get('/plans/', { params: { category } }),
};

export const leadAPI = {
  create: (data) => api.post('/leads/create', data),
};

export const contactAPI = {
  send: (data) => api.post('/contact/send', data),
};

export default api;
