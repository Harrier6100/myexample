import { createRouter, createWebHistory } from 'vue-router';
import UserRoutes from './modules/user';

const routes = [
    ...UserRoutes,
    {
        path: '/physical/property/names',
        name: 'PhysicalPropertyNameList',
        component: () => import('@/views/PhysicalPropertyNameList'),
    },
    {
        path: '/physical/property/names/add',
        name: 'PhysicalPropertyNameAdd',
        component: () => import('@/views/PhysicalPropertyNameEdit'),
    },
    {
        path: '/physical/property/names/:id',
        name: 'PhysicalPropertyNameEdit',
        component: () => import('@/views/PhysicalPropertyNameEdit'),
    },
    {
        path: '/production/map',
        name: 'ProductionMap',
        component: () => import('@/views/ProductionMap'),
    },
    {
        path: '/material/stocks',
        name: 'MaterialStockList',
        component: () => import('@/views/MaterialStockList'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;