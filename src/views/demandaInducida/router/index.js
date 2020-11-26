import Full from 'Container/Full'
const Index = () => import('Views/demandaInducida/views/Index')
const Configuracion = () => import('Views/demandaInducida/views/ConfiguracionDemanda')

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
        },
        {
            name: 'ConfiguracionDemanda',
            path: 'config-demanda',
            component: Configuracion,
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'demandaInducida-config',
                avatar: {
                    icon: 'fas fa-user-cog',
                    color: 'blue',
                }
            }
        }
    ]
}