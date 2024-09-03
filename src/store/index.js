import { createStore } from 'vuex';
import user from './modules/user';

const store = createStore({
    modules: {
        user,
    },
    state() {
        return {
            loading: false,
            routeQuery: null,
        };
    },
    getters: {
        getQuery: (state) => {
            return state.routeQuery;
        },
    },
    mutations: {
        startLoading(state) {
            state.loading = true;
        },
        stopLoading(state) {
            state.loading = false;
        },
        setQuery(state, payload) {
            state.routeQuery = payload;
        },
    },
});

export default store;