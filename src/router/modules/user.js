const UserRoutes = [
    {
        path: '/users',
        name: 'UserList',
        component: () => import('@/views/UserList'),
    },
    {
        path: '/users/add',
        name: 'UserAdd',
        component: () => import('@/views/UserEdit'),
    },
    {
        path: '/users/:id',
        name: 'UserEdit',
        component: () => import('@/views/UserEdit'),
    },
];

export default UserRoutes;