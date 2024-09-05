<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-primary">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">Navbar</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link" href="#" id="navbarDropdownMenu#1" role="button" data-bs-toggle="dropdown" aria-expanded="false">マスタ</a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenu#1">
                            <router-link class="dropdown-item" to="/users">Users</router-link>
                        </ul>
                    </li>
                </ul>
                <template v-if="user">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle ms-1"></i>
                                {{ user.userName }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                                <li><a class="dropdown-item" href="#" @click="openPassword">パスワード変更</a></li>
                                <li><a class="dropdown-item" href="#" @click="onSignout">サインアウト</a></li>
                            </ul>
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click="openSignin">サインイン</a>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </nav>
    <Signin :open="isOpenSignin" @close="closeSignin" />
    <PasswordChange :open="isOpenPassword" @close="closePassword" />
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Signin from '@/components/Signin';
import PasswordChange from '@/components/PasswordChange';
import useToggle from '@/hooks/useToggle';

export default {
    components: {
        Signin,
        PasswordChange,
    },
    setup() {
        const store = useStore();
        const { isShow: isOpenSignin, show: openSignin, hide: closeSignin } = useToggle();
        const { isShow: isOpenPassword, show: openPassword, hide: closePassword } = useToggle();

        const onSignout = () => {
            if (confirm('サインアウトしますか？')) {
                store.dispatch('user/signout');
            }
        };

        const user = computed(() => {
            return store.getters['user/getUser'];
        });

        return {
            isOpenSignin,
            openSignin,
            closeSignin,
            isOpenPassword,
            openPassword,
            closePassword,
            onSignout,
            user,
        };
    },
};
</script>