<template>
    <div class="mb-3">
        <Navbar />
    </div>
    <router-view />
</template>

<script>
import { useStore } from 'vuex';
import Navbar from '@/components/Navbar';

export default {
    name: 'App',
    components: {
        Navbar,
    },
    created() {
        const store = useStore();
        store.dispatch('user/autoSignin');
    },
}
</script>