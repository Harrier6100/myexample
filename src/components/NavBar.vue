<template>
    <template v-if="user">
        <a href="javascript:" @click="onSignout">
            <i class="bi bi-person-circle ms-1"></i>
            {{ user.userName }}
        </a>
    </template>
    <template v-else>
        <a href="javascript:" @click="openSignin">
            <i class="bi bi-person-circle"></i>
        </a>
    </template>
    <Signin :open="isOpenSignin" @close="closeSignin" />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Signin from '@/components/Signin';
import useToggle from '@/hooks/useToggle';

export default {
    components: {
        Signin,
    },
    setup() {
        const store = useStore();
        const { isShow: isOpenSignin, show: openSignin, hide: closeSignin } = useToggle();

        const user = computed(() => {
            return store.getters['user/getUser'];
        });

        const onSignout = () => {
            if (confirm('サインアウトしますか？')) {
                store.dispatch('user/signout');
            }
        };

        return {
            isOpenSignin,
            openSignin,
            closeSignin,
            user,
            onSignout,
        };
    },
};
</script>