export default {
    path: '/',
    component: () => import('Container/Full'),
    redirect: { name: 'Referencias' },
    children: [
        {
            name: 'Referencias',
            path: 'referencias',
            component: () => import('Views/centroRegulador/views/Referencias'),
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'centroRegulador-referenciasIndex',
                avatar: {
                    icon: 'mdi-home-city',
                    color: 'blue',
                }
            }
        }
    ]
}