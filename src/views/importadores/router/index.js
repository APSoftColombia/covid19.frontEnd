import Full from 'Container/Full'
const Index = () => import('Views/importadores/views/Index')

export default {
    path: '/',
    component: Full,
    redirect: { name: 'Importadores' },
    children: [
        {
            name: 'Importadores',
            path: 'importadores',
            component: Index,
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'importadores-index',
                avatar: {
                    icon: 'fas fa-file-upload',
                    color: 'green',
                }
            }
        }
    ]
}