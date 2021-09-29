export default {
    path: '/',
    component: () => import('Container/Full'),
    redirect: { name: 'EstudiosLabSaludPublica' },
    children: [
        {
            name: 'EstudiosLabSaludPublica',
            path: 'estudios-laboratorio-sp',
            component: () => import('Views/laboratorioSaludPublica/views/Estudios'),
            meta: {
                requiresAuth: true,
                requiresOnLine: true,
                requiresPermission: 'estudiosLabSP-index',
                avatar: {
                    icon: 'fas fa-microscope',
                    color: 'blue',
                }
            }
        }
    ]
}