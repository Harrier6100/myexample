import { createRouter, createWebHistory } from 'vue-router';
import UserList from '@/views/UserList';
import UserEdit from '@/views/UserEdit';

const routes = [
    {
        path: '/users',
        name: 'UserList',
        component: UserList,
    },
    {
        path: '/users/add',
        name: 'UserAdd',
        component: UserEdit,
    },
    {
        path: '/users/:id',
        name: 'UserEdit',
        component: UserEdit,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;