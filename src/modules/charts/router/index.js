export default {
  path: '/',
  component: () => import('Container/Full'),
  redirect: { name: 'IndicadoresCovid' },
  children: [
    {
      name: 'IndicadoresCovid19',
      path: 'indicadores/covid19',
      component: () => import('@/modules/charts/views/IndicadoresCovid19'),
      meta: {
        requiresAuth: true,
        requiresOnLine: true,
        requiresPermission: 'indicadoresCovid-index',
        avatar: {
          icon: 'fas fa-chart-pie',
          color: 'deep-purple'
        }
      }
    }
  ]
}
