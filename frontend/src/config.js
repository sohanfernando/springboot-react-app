import axios from 'axios';

const getBackendUrl = () => {
  const origin = window.location.origin;
  if (origin.includes('-frontend-')) {
    return origin.replace('-frontend-', '-backend-');
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getBackendUrl();

// Set default base URL for all axios requests
axios.defaults.baseURL = API_BASE_URL;
window.API_BASE_URL = API_BASE_URL;

// Customer and admin sessions are stored separately, so the token sent is the
// one for the area being used: the admin's on admin screens, the customer's
// everywhere else.
const onAdminScreen = () => window.location.pathname.startsWith('/admin');

const storedToken = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))?.token || null;
  } catch {
    return null;
  }
};

axios.interceptors.request.use((request) => {
  const token = storedToken(onAdminScreen() ? 'admin' : 'user');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

// A 401 on anything but the sign-in forms means the session is missing or has
// expired: drop it and send the person to sign in again.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthForm = url.includes('/users/login') || url.includes('/users/signup');
    if (error.response?.status === 401 && !isAuthForm) {
      const admin = onAdminScreen();
      localStorage.removeItem(admin ? 'admin' : 'user');
      const loginPath = admin ? '/admin-login' : '/login';
      if (window.location.pathname !== loginPath) window.location.assign(loginPath);
    }
    return Promise.reject(error);
  }
);
