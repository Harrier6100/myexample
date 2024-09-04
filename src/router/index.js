import { createRouter, createWebHistory } from 'vue-router';
import UserRoutes from './modules/user';

const routes = [
    ...UserRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;