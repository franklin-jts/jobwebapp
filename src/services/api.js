import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data?.detail || err.message || 'Something went wrong');
  }
);

export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/api/auth/me').then((r) => r.data),
  register: (body) => api.post('/api/auth/register', body).then((r) => r.data),
};

export const postsAPI = {
  feed: (skip = 0, limit = 50) => api.get(`/api/posts/?skip=${skip}&limit=${limit}`).then((r) => r.data),
  getOne: (id) => api.get(`/api/posts/${id}`).then((r) => r.data),
  create: (body) => api.post('/api/posts/', body).then((r) => r.data),
  update: (id, body) => api.put(`/api/posts/${id}`, body).then((r) => r.data),
  delete: (id) => api.delete(`/api/posts/${id}`).then((r) => r.data),
};

export const storiesAPI = {
  list: () => api.get('/api/stories/').then((r) => r.data),
  create: (body) => api.post('/api/stories/', body).then((r) => r.data),
  delete: (id) => api.delete(`/api/stories/${id}`).then((r) => r.data),
};
