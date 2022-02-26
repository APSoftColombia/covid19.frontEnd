import { mdiBloodBag } from '@mdi/js'
export default {
    path: '/',
    component: () => import('Container/Full'),
    redirect: { name: 'Referencias' },
    children: [
        {
            name: 'Referencias',
            path: 'centro-regulador/referencias',
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
        },
        {
            name: 'Hemocomponentes',
            path: 'centro-regulador/hemocomponentes',
            component: () => import('Views/centroRegulador/views/Hemocomponentes'),
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'centroRegulador-hemocomponentesIndex',
                avatar: {
                    icon: mdiBloodBag,
                    iconSize: 30,
                    color: 'red',
                }
            }
        }
    ]
}