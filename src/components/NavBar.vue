<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-primary mb-3">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">Vue</router-link>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a href="javascript:" class="nav-link dropdown-toggle active" @click="dropdownToggle(0)">マスタ</a>
                        <ul class="dropdown-menu" v-show="isDropdownShow[0]">
                            <router-link to="/users" class="dropdown-item">Users</router-link>
                        </ul>
                    </li>
                </ul>
            </div>
            <template v-if="user">
                <a href="javascript:" class="text-white" @click="onSignout">
                    <i class="bi bi-person-circle ms-1"></i>
                    {{ user.userName }}
                </a>
            </template>
            <template v-else>
                <a href="javascript:" class="text-white" @click="openSignin">サインイン</a>
            </template>
        </div>
    </nav>
    <Signin :open="isOpenSignin" @close="closeSignin" />
</template>

<script>
import { reactive, computed, onMounted, onUnmounted } from 'vue';
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

        const isDropdownShow = reactive({});
        const dropdownToggle = (n) => {
            Object.keys(isDropdownShow).forEach(key => {
                if (String(n) !== key) isDropdownShow[key] = false;
            });
            isDropdownShow[String(n)] = !isDropdownShow[String(n)];
        };

        const dropdownOutsideClick = (event) => {
            if (isDropdownShow && !event.target.closest('.nav-link')) {
                Object.keys(isDropdownShow).forEach(key => {
                    isDropdownShow[key] = false;
                });
            }
        };

        onMounted(() => {
            document.addEventListener('click', dropdownOutsideClick);
        });

        onUnmounted(() => {
            document.addEventListener('click', dropdownOutsideClick);
        });

        return {
            isOpenSignin,
            openSignin,
            closeSignin,
            user,
            onSignout,
            isDropdownShow,
            dropdownToggle,
        };
    },
};
</script>