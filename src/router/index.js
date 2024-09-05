import { createRouter, createWebHistory } from 'vue-router';
import UserRoutes from './modules/user';

const routes = [
    ...UserRoutes,
    {
        path: '/production/map',
        name: 'ProductionMap',
        component: () => import('@/views/ProductionMap'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;