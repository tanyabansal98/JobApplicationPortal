import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
