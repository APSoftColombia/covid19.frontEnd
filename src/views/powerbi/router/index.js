import Full from 'Container/Full'
const Index = () => import('Views/powerbi/views/index')
export default {
    path: '/',
    component: Full,
    redirect: { name: 'Powerbi' },
    children: [
        {
            name: 'Powerbi',
            path: 'powerbi',
            component: Index,
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'powerbi-index',
                avatar: {
                    icon: 'fas fa-chart-bar',
                    color: 'blue',
                }
            }
        }
    ]
}