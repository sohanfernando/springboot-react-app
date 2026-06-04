import axios from 'axios';

const getBackendUrl = () => {
  const origin = window.location.origin;
  if (origin.includes('-frontend-')) {
    return origin.replace('-frontend-', '-backend-');
  }
  return 'http://localhost:8081';
};

export const API_BASE_URL = getBackendUrl();

// Set default base URL for all axios requests
axios.defaults.baseURL = API_BASE_URL;
window.API_BASE_URL = API_BASE_URL;
