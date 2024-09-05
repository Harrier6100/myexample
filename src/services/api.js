import axios from 'axios';
import { API_BASE_URL } from '@/env/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) config.headers['Authorization'] = token;
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    response => {
        return response.data;
    },
    async error => {
        const { config, response } = error;

        if (response) {
            if (response.status === 401 && !config._retry) {
                config._retry = true;
                try {
                    const storedRefreshToken = localStorage.getItem('refreshToken');
                    const response = await axios.post(`${API_BASE_URL}/api/refresh`, { refreshToken: storedRefreshToken });
                    const { token, refreshToken } = response.data;

                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);

                    config.headers['Authorization'] = token;
                    return axios(config);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;