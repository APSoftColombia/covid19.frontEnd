export default {
  path: '/',
  component: () => import('Container/Full'),
  redirect: { name: 'AtencionMedicaRCV' },
  children: [
    {
      name: 'AtencionMedicaRCV',
      path: 'rcv/atencion-medica',
      component: () => import('@/modules/atencionMedica/views/AtencionMedica'),
      meta: {
        requiresAuth: true,
        requiresOnLine: true,
        requiresPermission: 'atencionMedicaRCV-index',
        avatar: {
          icon: 'fas fa-notes-medical',
          color: 'teal darken-2'
        }
      }
    }
  ]
}
