import Full from 'Container/Full'
const Index = () => import('Views/demandaInducida/views/Index')
export default {
    path: '/',
    component: Full,
    redirect: { name: 'DemandaInducida' },
    children: [
        {
            name: 'DemandaInducida',
            path: 'demanda-inducida',
            component: Index,
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'demandaInducida-index',
                avatar: {
                    icon: 'fas fa-hand-holding-medical',
                    color: 'blue',
                }
            }
        }
    ]
}