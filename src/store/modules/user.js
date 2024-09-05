import axios from 'axios';
import { API_BASE_URL } from '@/env/config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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
                const { user, token, refreshToken } = response.data;
                commit('setUser', { user, token });
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
            } catch (err) {
                if (err.response) throw new Error(err.response.data);
                else throw new Error(err);
            }
        },
        autoSignin: async ({ commit }) => {
            const storedToken = localStorage.getItem('token');
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (storedToken && storedRefreshToken) {
                try {
                    const response = await api.post(`/api/refresh`, { refreshToken: storedRefreshToken });
                    const { user, token, refreshToken } = response.data;
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