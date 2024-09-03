import { createRouter, createWebHistory } from 'vue-router';
import UserList from '@/views/UserList';

const routes = [
    {
        path: '/users',
        name: 'UserList',
        component: UserList,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;