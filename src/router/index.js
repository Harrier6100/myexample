import { createRouter, createWebHistory } from 'vue-router';
import UserList from '@/views/UserList';
import UserEdit from '@/views/UserEdit';

const routes = [
    {
        path: '/users',
        name: 'UserList',
        component: UserList,
        props: true,
    },
    {
        path: '/users/add',
        name: 'UserAdd',
        component: UserEdit,
        props: true,
    },
    {
        path: '/users/:id',
        name: 'UserEdit',
        component: UserEdit,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;