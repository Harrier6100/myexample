<template>
    <NavBar />
    <router-view />
</template>

<script>
import { useStore } from 'vuex';
import NavBar from '@/components/NavBar';

export default {
    name: 'App',
    components: {
        NavBar,
    },
    created() {
        const store = useStore();
        store.dispatch('user/autoSignin');
    },
}
</script>