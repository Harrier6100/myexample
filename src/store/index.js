import { createStore } from 'vuex';

const store = createStore({
    modules: {
    },
    state() {
        return {
            loading: false,
        };
    },
    getters: {
    },
    mutations: {
        startLoading(state) {
            state.loading = true;
        },
        stopLoading(state) {
            state.loading = false;
        },
    },
});

export default store;