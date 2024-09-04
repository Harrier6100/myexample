import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '@/env/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 3000,
});

const user = {
    namespaced: true,
    state: {
        user: null,
        token: null,
        isAuthenticated: false,
    },
    getters: {
        getUser: (state) => {
            return state.user;
        },
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user;
            state.token = payload.token;
            state.isAuthenticated = true;
        },
        clearUser(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    actions: {
        signin: async ({ commit }, credentials) => {
            try {
                const response = await api.post(`/api/signin`, credentials);
                const { token, refreshToken } = response.data;

                const user = jwtDecode(token);
                commit('setUser', { user, token });

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
            } catch (err) {
                throw new Error(err);
            }
        },
        autoSignin: async ({ commit }) => {
            const storedToken = localStorage.getItem('token');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (storedToken && storedRefreshToken) {
                try {
                    const response = await api.post(`/api/refresh`, { refreshToken: storedRefreshToken });
                    const { token, refreshToken } = response.data;

                    const user = jwtDecode(token);
                    commit('setUser', { user, token });

                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);
                } catch (err) {
                    commit('clearUser');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                }
            }
        },
        signout({ commit }) {
            commit('clearUser');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
};

export default user;