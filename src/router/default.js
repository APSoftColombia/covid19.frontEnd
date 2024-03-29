import Full from 'Container/Full'

const Home = () => import('Views/home/Home')
const Encuestas = () => import('Views/encuestas/Encuestas')
const Formularios = () => import('Views/formularios/Formularios')
const ConstructorFormulario = () => import('Views/formularios/ConstructorFormulario')
const DiligenciaEncuesta = () => import('Views/encuestas/DiligenciaEncuesta')
const ListadoEncuestas = () => import('Views/encuestas/ListadoEncuestas')
const FuentesDatos = () => import('Views/fuentesDatos/FuentesDatos')
const Complementos = () => import('Views/complementos/Complementos')
const Poblacion = () => import('Views/poblacion/Poblacion')
const Indicadores = () => import('Views/indicadores/Indicadores')
const Resultados = () => import('Views/encuestas/ResultadoEncuesta')
const Usuarios = () => import('Views/usuarios/Usuarios')
const RolesPermisos = () => import('Views/rolesPermisos/RolesPermisos')
const HerramientasGestion = () => import('Views/herramientasGestion/HerramientasGestion')

const Mapa = () => import('Views/mapa/Mapa')


const MapaCovid19 = () => import('Views/covid19/mapaCovid/MapaCovid')
// const Covid19 = () => import('Views/covid19/Covid19')
const ReportesCovid19 = () => import('Views/covid19/reportesCovid19/ReportesCovid19')
const ReportesDeLey = () => import('Views/covid19/ReportesDeLey/ReportesDeLey')

const TamizajeView = () => import('Views/covid19/tamizaje/TamizajeView')
const ReporteComunitarioView = () => import('Views/covid19/reporteComunitario/ReporteComunitarioView')
const LlamadaView = () => import('Views/covid19/llamada/LlamadaView')
const AutopsiaView = () => import('Views/covid19/autopsia/AutopsiaView')
const VehiculoView = () => import('Views/covid19/vehiculo/VehiculoView')
const Nexos = () => import('Views/covid19/Nexos/NexosView')
const Parametros = () => import('Views/covid19/Parametros/ParametrosView')
const Muestras = () => import('Views/covid19/Muestras/MuestrasView')
const HogarView = () => import('Views/covid19/hogar/HogarView')
const InformeEjecutivoERP = () => import('Views/covid19/InformeEjecutivo/InformeEjecutivo')
const InformeDePrensa = () => import('Views/covid19/InformeDePrensa/InformeDePrensa.vue')
const Cets = () => import('Views/covid19/Cet/Cets')
const AsignacionRastreo = () => import('Views/covid19/tamizaje/asignacionRastreo/AsignacionRastreo')

const AsignacionMuestras = () => import('Views/covid19/AsignacionMuestras/Index')
const RegistroTomaMuestra = () => import('Views/covid19/TomaMuestraTamizajes/Index')
const Vacunacion = () => import('Views/covid19/vacunacion/Index')

//RCV
const EncuestasViewRCV = () => import('Views/aps/rcv/encuestas/EncuestasView')
const IndicadoresViewRCV = () => import('Views/aps/rcv/IndicadoresRCV/IndicadoresView')
const InformeEjecutivo = () => import('Views/aps/rcv/InformeEjecutivo/InformeEjecutivo')
const BitacorasRCV = () => import('Views/aps/rcv/bitacorasRcv/Index')
const CuentaAltoCosto = () => import('Views/aps/rcv/cuentaAltoCosto/index')

const VacunacionSucre = () => import('Views/covid19/vacunacionSucre/Index')
const Bodega = () => import('Views/covid19/Bodega/Index')

export default {
   path: '/',
   component: Full,
   redirect: { name: 'Home' },
   children: [
      {
         path: 'inicio',
         name: 'Home',
         component: Home,
         meta: {
            requiresAuth: false,
            avatar: {
               icon: 'fas fa-home',
               color: 'info',
            }
         }
      },
      {
         path: 'formularios',
         name: 'Formularios',
         component: Formularios,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'formulario-index',
            title: 'Formularios',
            avatar: {
               icon: 'mdi mdi-newspaper',
               color: 'red',
            }
         }
      },
      {
         path: 'formularios/nuevo-formulario',
         name: 'NuevoFormulario',
         component: ConstructorFormulario,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'formulario-crear',
            avatar: {
               icon: 'mdi mdi-newspaper',
               color: 'red',
            }
         }
      },
      {
         path: 'formularios/formulario/:uuid',
         name: 'EditarFormulario',
         props: true,
         component: ConstructorFormulario,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'formulario-editar',
            avatar: {
               icon: 'mdi mdi-newspaper',
               color: 'red',
            }
         }
      },
      {
         path: 'fuentes-datos',
         name: 'FuentesDatos',
         component: FuentesDatos,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'fuenteDatos-index',
            avatar: {
               icon: 'fas fa-database',
               color: 'indigo',
            }
         }
      },
      {
         path: 'poblacion',
         name: 'Poblacion',
         component: Poblacion,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'poblacion-index',
            avatar: {
               icon: 'mdi mdi-human-handsup',
               color: 'cyan',
            }
         }
      },
      {
         path: 'complementos',
         name: 'Complementos',
         component: Complementos,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            // requiresPermission: 'complementos-index',
            avatar: {
               icon: 'fas fa-cogs',
               color: 'teal darken-2',
            }
         }
      },
      {
         path: 'encuestas',
         name: 'Encuestas',
         component: Encuestas,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'encuesta-index',
            avatar: {
               icon: 'fas fa-edit',
               color: 'purple',
            }
         }
      },
      {
         path: 'encuestas/resultado/:uuid',
         name: 'Resultados',
         props: true,
         component: Resultados,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'encuesta-resultado',
            avatar: {
               icon: 'mdi-file-chart',
               color: 'primary',
            }
         }
      },
      {
         path: 'encuestas/formulario/:formulariouuid',
         name: 'DiligenciaEncuesta',
         props: true,
         component: DiligenciaEncuesta,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'encuesta-diligenciar',
            avatar: {
               icon: 'fas fa-edit',
               color: 'purple',
            }
         }
      },
      {
         path: 'encuestas/encuesta/:uuid',
         name: 'EditaEncuesta',
         props: true,
         component: DiligenciaEncuesta,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'encuesta-diligenciar',
            avatar: {
               icon: 'fas fa-edit',
               color: 'purple',
            }
         }
      },
      {
         path: 'encuestas/formulario/listado/:formulariouuid',
         name: 'ListadoEncuestas',
         props: true,
         component: ListadoEncuestas,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'encuesta-listado',
            avatar: {
               icon: 'fas fa-list',
               color: 'purple',
            }
         }
      },
      {
         path: 'mapa',
         name: 'Mapa',
         component: Mapa,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'mapa-index',
            avatar: {
               icon: 'fas fa-map-marked-alt',
               color: 'orange',
            }
         }
      },
      {
         path: 'usuarios',
         name: 'Usuarios',
         component: Usuarios,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'usuario-index',
            avatar: {
               icon: 'fas fa-users',
               color: 'blue',
            }
         }
      },
      {
         path: 'indicadores',
         name: 'Indicadores',
         component: Indicadores,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'indicadores-index',
            avatar: {
               icon: 'fas fa-chart-bar',
               color: 'teal',
            }
         }
      },
      // {
      //    path: 'covid19',
      //    name: 'Covid19',
      //    component: Covid19,
      //    meta: {
      //       requiresAuth: true,
      //       requiresOnLine: true,
      //       requiresPermission: 'covid-index',
      //       avatar: {
      //          icon: 'fas fa-virus',
      //          color: 'error',
      //       }
      //    }
      // },
      {
         path: 'tamizajes',
         name: 'Tamizajes',
         component: TamizajeView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-tamizajeVer',
            avatar: {
               icon: 'fas fa-file-medical',
               color: 'error',
            }
         }
      },
      {
         path: 'hogares',
         name: 'Hogares',
         component: HogarView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'hogaresCovid-index',
            avatar: {
               icon: 'mdi-home-group',
               color: 'cyan darken-1',
            }
         }
      },
      {
         path: 'reportes-comunitarios',
         name: 'ReportesComunitarios',
         component: ReporteComunitarioView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-reporteComunitarioVer',
            avatar: {
               icon: 'fas fa-file-prescription',
               color: 'green',
            }
         }
      },
      {
         path: 'autopsias',
         name: 'Autopsias',
         component: AutopsiaView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-autopsiaVer',
            avatar: {
               personalIcon: 'Autopsias',
               icon: '',
               color: 'blue-grey darken-3',
            }
         }
      },
      {
         path: 'llamadas',
         name: 'Llamadas',
         component: LlamadaView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-llamadaVer',
            avatar: {
               icon: 'fas fa-phone-alt',
               color: 'indigo',
            }
         }
      },
      {
         path: 'vehiculos',
         name: 'Vehiculos',
         component: VehiculoView,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-vehiculoVer',
            avatar: {
               icon: 'mdi-car-multiple',
               color: 'orange',
            }
         }
      },
      // {
      //    path: 'indicadores-covid19',
      //    name: 'IndicadoresCovid',
      //    component: Indicadores,
      //    meta: {
      //       requiresAuth: true,
      //       requiresOnLine: true,
      //       requiresPermission: 'indicadoresCovid-index',
      //       avatar: {
      //          icon: 'fas fa-chart-pie',
      //          color: 'deep-purple',
      //       }
      //    }
      // },
      {
         path: 'reportes-covid19',
         name: 'ReportesCovid',
         component: ReportesCovid19,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'reportesCovid-index',
            avatar: {
               icon: 'mdi-file-table',
               color: 'pink',
            }
         }
      },
      {
         path: 'reportes-rcv',
         name: 'ReportesRCV',
         component: ReportesCovid19,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'reportesRCV-index',
            avatar: {
               icon: 'mdi-file-table',
               color: 'pink',
            }
         }
      },
      {
         path: 'mapacovid',
         name: 'MapaCovid',
         component: MapaCovid19,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'mapaCovid-index',
            avatar: {
               icon: 'fas fa-map-marked-alt',
               color: 'deep-orange',
            }
         }
      },
      {
         path: 'nexos',
         name: 'Nexos',
         component: Nexos,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-nexosVer',
            avatar: {
               icon: 'fas fa-people-arrows',
               color: 'deep-purple darken-4',
            }
         }
      },
      {
         path: 'parametros',
         name: 'Parametros',
         component: Parametros,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-parametrosVer',
            avatar: {
               icon: 'fas fa-network-wired',
               color: 'indigo',
            }
         }
      },
      {
         path: 'muestras',
         name: 'Muestras',
         component: Muestras,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-muestrasVer',
            avatar: {
               icon: 'fas fa-vials',
               color: 'red darken-3',
            }
         }
      },
      {
         path: 'cet',
         name: 'Cets',
         component: Cets,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-cetsVer',
            avatar: {
               icon: 'fas fa-hand-holding-usd',
               color: 'teal',
            }
         }
      },
      {
         path: 'informe-ejecutivo-erp',
         name: 'InformeEjecutivoERP',
         component: InformeEjecutivoERP,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-informeEjecutivoTamizajesIndex',
            avatar: {
               icon: 'mdi-file-table',
               color: 'blue darken-3',
            }
         }
      },
      {
         path: 'informe-de-prensa',
         name: 'InformeDePrensa',
         component: InformeDePrensa,
         meta: {
            requiresAuth: true,
            requiresOnLine: true,
            requiresPermission: 'covid-informeDePrensa',
            avatar: {
               icon: 'mdi-file-table',
               color: 'indigo darken-4',
            }
         }
      },
      {
         path: 'encuestas-rcv',
         name: 'EncuestasRCV',
         component: EncuestasViewRCV,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'aps-encuestasRCVIndex',
            avatar: {
               icon: 'fas fa-edit',
               color: 'purple',
            }
         }
      },
      {
         path: 'indicadores-rcv',
         name: 'IndicadoresRCV',
         component: IndicadoresViewRCV,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'aps-indicadoresRCVIndex',
            avatar: {
               icon: 'fas fa-chart-pie',
               color: 'red',
            }
         }
      },
      {
         path: 'informe-ejecutivo-rcv',
         name: 'InformeEjecutivoRcv',
         component: InformeEjecutivo,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'aps-informeEjecutivoRcvIndex',
            avatar: {
               icon: 'mdi-file-table',
               color: 'blue',
            }
         }
      },
      {
         path: 'reportes-de-ley',
         name: 'ReportesDeLey',
         component: ReportesDeLey,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'covid-reportesDeLeyVer',
            avatar: {
               icon: 'mdi-file-table',
               color: 'deep-purple',
            }
         }
      },
      {
         path: 'bitacoras-rcv',
         name: 'BitacorasRcv',
         component: BitacorasRCV,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'aps-bitacorasRcvIndex',
            avatar: {
               icon: 'mdi-content-paste',
               color: 'purple',
            }
         }
      },
      {
         path: 'asignacion-rastreo',
         name: 'AsignacionTamizajesRastreo',
         component: AsignacionRastreo,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'covid-asignacionERPRastreoIndex',
            avatar: {
               icon: 'mdi-file-move',
               color: 'green',
            }
         }
      },
      {
         path: 'asignacion-muestras',
         name: 'AsignacionMuestras',
         component: AsignacionMuestras,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'covid-asignacionMuestras',
            avatar: {
               icon: 'mdi-bookmark-plus',
               color: 'red',
            }
         }
      },
      {
         path: 'registro-toma-muestra',
         name: 'TomaMuestra',
         component: RegistroTomaMuestra,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'covid-tomaMuestrasIndex',
            avatar: {
               icon: 'mdi-calendar-plus',
               color: 'purple',
            }
         }
      },
      {
         path: 'roles-permisos',
         name: 'RolesPermisos',
         component: RolesPermisos,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'rolesPermisos-index',
            avatar: {
               icon: 'mdi-account-key',
               color: 'purple',
            }
         }
      },
      {
         path: 'herramientas-gestion',
         name: 'HerramientasGestion',
         component: HerramientasGestion,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'herramientasGestion-index',
            avatar: {
               icon: 'fas fa-toolbox',
               color: 'indigo',
            }
         }
      },
      {
         path: 'vacunacion-covid19',
         name: 'VacunacionCovid19',
         component: Vacunacion,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'covidVacunacion-index',
            avatar: {
               icon: 'fas fa-syringe',
               color: 'deep-purple',
            }
         }
      },
      {
         path: 'cuenta-alto-costo',
         name: 'CuentaAltoCosto',
         component: CuentaAltoCosto,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'aps-cuentaAltoCostoIndex',
            avatar: {
               icon: 'fas fa-book',
               color: 'red',
            }
         }
      },
      {
         path: 'vacunacion',
         name: 'Vacunacion',
         component: VacunacionSucre,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'vacunacion-index',
            avatar: {
               icon: 'fas fa-shield-virus',
               color: 'green',
            }
         }
      },
      {
         path: 'bodega',
         name: 'Bodega',
         component: Bodega,
         meta: {
            requiresAuth: true,
            requiresOnLine: false,
            requiresPermission: 'bodega-index',
            avatar: {
               icon: 'fas fa-warehouse',
               color: 'blue',
            }
         }
      },
   ]
}