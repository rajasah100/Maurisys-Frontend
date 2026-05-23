import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 (expired token) -> sign out and route to the right login page
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't auto-logout on login/register attempts (401 there = bad creds, handled by UI)
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        const wasLoggedIn = !!localStorage.getItem('token');
        if (wasLoggedIn) {
          // Figure out where to send them based on their previous role
          let savedUser = null;
          try {
            savedUser = JSON.parse(localStorage.getItem('user') || 'null');
          } catch {
            savedUser = null;
          }
          const wasAdmin = savedUser?.role === 'admin';

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          const path = window.location.pathname;
          // Don't redirect if already on a login page
          const onAuthPage =
            path.startsWith('/signin') ||
            path.startsWith('/signup') ||
            path.startsWith('/admin/login');
          if (!onAuthPage) {
            window.location.href = wasAdmin ? '/admin/login' : '/signin';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// Services
export const fetchServices = () => API.get('/services');
export const fetchServiceBySlug = (slug) => API.get(`/services/${slug}`);

// Portfolio
export const fetchPortfolio = (params = {}) => API.get('/portfolio', { params });
export const fetchPortfolioBySlug = (slug) => API.get(`/portfolio/${slug}`);

// Blogs
export const fetchBlogs = (params = {}) => API.get('/blogs', { params });
export const fetchBlogBySlug = (slug) => API.get(`/blogs/${slug}`);

// Plans
export const fetchPlans = (params = {}) => API.get('/plans', { params });
export const fetchPlanById = (id) => API.get(`/plans/${id}`);

// Reviews
export const fetchReviews = (params = {}) => API.get('/reviews', { params });
export const submitReview = (data) => API.post('/reviews', data);

// Contact
export const submitContactForm = (data) => API.post('/contact', data);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.put('/auth/password', data);

export default API;
