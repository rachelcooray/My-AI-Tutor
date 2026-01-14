import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
