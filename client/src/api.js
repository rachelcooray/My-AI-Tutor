import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL;

    // Fallback: If no env var, and we are NOT on localhost, assume production backend
    if (!url && window.location.hostname !== 'localhost') {
        url = 'https://cima-tutor-api.onrender.com';
    }

    url = url || 'http://localhost:3000';

    // If URL doesn't start with http/https, assume it's a hostname (from Render) and prepend https://
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    // Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

export default api;
