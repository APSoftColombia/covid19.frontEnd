import { mdiBloodBag } from '@mdi/js'

// char data
export const itemsMenu = [
    {
        id: 1,
        title: 'Inicio',
        icon: 'fas fa-home',
        color: 'primary',
        routeName: 'Home',
        typeRoute: 'general'
    },
    {
        id: 2,
        title: 'Complementos',
        icon: 'fas fa-cogs',
        color: 'teal darken-2',
        routeName: 'Complementos',
        typeRoute: 'general'
    },
    {
        id: 3,
        title: 'Formularios',
        icon: 'mdi mdi-newspaper',
        color: 'red',
        routeName: 'Formularios',
        typeRoute: 'aps'
    },
    {
        id: 4,
        title: 'Usuarios',
        icon: 'fas fa-users',
        color: 'blue',
        routeName: 'Usuarios',
        typeRoute: 'seguridad'
    },
    {
        id: 5,
        title: 'Encuestas',
        icon: 'fas fa-edit',
        color: 'purple',
        routeName: 'Encuestas',
        typeRoute: 'aps'
    },
    {
        id: 6,
        title: 'Fuentes de Datos',
        icon: 'fas fa-database',
        color: 'indigo',
        routeName: 'FuentesDatos',
        typeRoute: 'covid'
    },
    {
        id: 7,
        title: 'Indicadores',
        icon: 'fas fa-chart-bar',
        color: 'teal',
        routeName: 'Indicadores',
        typeRoute: 'aps'
    },
    {
        id: 8,
        title: 'Reportes / Informes',
        icon: 'fas fa-chart-pie',
        color: 'pink',
        routeName: 'Reportes',
        typeRoute: 'aps'
    },
    {
        id: 9,
        title: 'Población',
        icon: 'mdi mdi-human-handsup',
        color: 'cyan',
        routeName: 'Poblacion',
        typeRoute: 'aps'
    },
    {
        id: 10,
        title: 'Copias de Seguridad',
        icon: 'fas fa-cloud-download-alt',
        color: 'brown',
        routeName: 'CopiasSeguridad',
        typeRoute: 'general'
    },
    {
        id: 11,
        title: 'Ayuda / Tutoriales',
        icon: 'fas fa-question',
        color: 'lime',
        routeName: 'Ayuda',
        typeRoute: 'general'
    },
    {
        id: 12,
        title: 'Más Información',
        icon: 'fas fa-info-circle',
        color: 'info',
        routeName: '',
        typeRoute: 'general'
    },
    {
        id: 13,
        title: 'Mapa',
        icon: 'fas fa-map-marked-alt',
        color: 'orange',
        routeName: 'Mapa',
        typeRoute: 'aps'
    },
    {
        id: 14,
        title: 'Covid-19',
        icon: 'fas fa-viruses',
        color: 'error',
        routeName: 'Covid19',
        typeRoute: 'covid'
    },
    {
        id: 15,
        title: 'Indicadores PRASS',
        icon: 'fas fa-chart-pie',
        color: 'deep-purple',
        routeName: 'IndicadoresCovid19',
        typeRoute: 'reportesIndicadoresCovid'
    },
    {
        id: 16,
        title: 'Reportes / Informes Covid-19',
        icon: 'mdi-file-table',
        color: 'pink',
        routeName: 'ReportesCovid',
        typeRoute: 'reportesIndicadoresCovid'
    },
    {
        id: 17,
        title: 'Mapa Covid-19',
        icon: 'fas fa-map-marked-alt',
        color: 'deep-orange',
        routeName: 'MapaCovid',
        typeRoute: 'covid'
    },
    {
        id: 18,
        title: 'ERP',
        subtitle: 'Encuestas de Riesgo Poblacional',
        icon: 'fas fa-file-medical',
        color: 'error',
        routeName: 'Tamizajes',
        typeRoute: 'covid'
    },
    {
        id: 19,
        title: 'Reportes Comunitarios',
        icon: 'fas fa-file-prescription',
        color: 'green',
        routeName: 'ReportesComunitarios',
        typeRoute: 'covid'
    },
    {
        id: 20,
        title: 'Autopsias',
        personalIcon: 'Autopsias',
        icon: '',
        color: 'blue-grey darken-3',
        routeName: 'Autopsias',
        typeRoute: 'covid'
    },
    {
        id: 21,
        title: 'Llamadas',
        icon: 'fas fa-phone-alt',
        color: 'indigo',
        routeName: 'Llamadas',
        typeRoute: 'covid'
    },
    {
        id: 22,
        title: 'Vehículos',
        icon: 'mdi-car-multiple',
        color: 'orange',
        routeName: 'Vehiculos',
        typeRoute: 'covid'
    },
    {
        id: 23,
        title: 'Hogares',
        icon: 'mdi-home-group',
        color: 'cyan darken-1',
        routeName: 'Hogares',
        typeRoute: 'covid'
    },
    {
        id: 24,
        title: 'Nexos',
        icon: 'fas fa-people-arrows',
        color: 'deep-purple darken-4',
        routeName: 'Nexos',
        typeRoute: 'covid'
    },
    {
        id: 25,
        title: 'Parametros',
        icon: 'fas fa-network-wired',
        color: 'indigo',
        routeName: 'Parametros',
        typeRoute: 'general'
    },
    {
        id: 26,
        title: 'Muestras',
        icon: 'fas fa-vials',
        color: 'red darken-3',
        routeName: 'Muestras',
        typeRoute: 'covid'
    },
    {
        id: 31,
        title: 'Informe Ejecutivo ERP',
        icon: 'mdi-file-table',
        color: 'blue darken-3',
        routeName: 'InformeEjecutivoERP',
        typeRoute: 'reportesIndicadoresCovid'
    },
    {
        id: 32,
        title: 'CET',
        subtitle: 'Compensaciones Económicas Temporal',
        icon: 'fas fa-hand-holding-usd',
        color: 'teal',
        routeName: 'Cets',
        typeRoute: 'covid'
    },
    {
        id: 34,
        title: 'Reportes de Ley',
        subtitle: '',
        icon: 'mdi-file-table',
        color: 'deep-purple',
        routeName: 'ReportesDeLey',
        typeRoute: 'reportesIndicadoresCovid'
    },
    {
        id: 37,
        title: 'Informe de Prensa',
        subtitle: '',
        icon: 'mdi-file-table',
        color: 'indigo darken-4',
        routeName: 'InformeDePrensa',
        typeRoute: 'reportesIndicadoresCovid'
    },
    // RCV
    {
        id: 27,
        title: 'Encuestas RCV',
        icon: 'fas fa-edit',
        color: 'purple',
        routeName: 'EncuestasRCV',
        typeRoute: 'aps'
    },
    {
        id: 28,
        title: 'Indicadores RCV',
        icon: 'fas fa-chart-pie',
        color: 'red',
        routeName: 'IndicadoresRCV',
        typeRoute: 'reportesIndicadoresRCV'
    },
    {
        id: 29,
        title: 'Informe Ejecutivo RCV',
        icon: 'mdi-file-table',
        color: 'blue',
        routeName: 'InformeEjecutivoRcv',
        typeRoute: 'reportesIndicadoresRCV'
    },
    {
        id: 35,
        title: 'Seguimientos RCV',
        icon: 'mdi-content-paste',
        color: 'purple',
        routeName: 'BitacorasRcv',
        typeRoute: 'aps'
    },
    {
        id: 30,
        title: 'Demanda Inducida',
        icon: 'fas fa-hand-holding-medical',
        color: 'blue',
        routeName: 'DemandaInducida',
        typeRoute: 'demandaInducida'
    },
    {
        id: 36,
        title: 'Ajustes Demanda Inducida',
        icon: 'fas fa-user-cog',
        color: 'blue',
        routeName: 'ConfiguracionDemanda',
        typeRoute: 'demandaInducida'
    },
    {
        id: 33,
        title: 'Power bi',
        icon: 'fas fa-chart-bar',
        color: 'blue',
        routeName: 'Powerbi',
        typeRoute: 'powerbi'
    },
    {
        id: 38,
        title: 'Importadores',
        icon: 'fas fa-file-upload',
        color: 'green',
        routeName: 'Importadores',
        typeRoute: 'general'
    },
    {
        id: 39,
        title: 'Asignación de Reportes',
        subtitle: 'Reportes para rastreo',
        icon: 'mdi-file-move',
        color: 'green',
        routeName: 'AsignacionTamizajesRastreo',
        typeRoute: 'covid'
    },
    {
        id: 40,
        title: 'Asignación de Muestras',
        subtitle: 'Asignación de muestras a IPS',
        icon: 'mdi-bookmark-plus',
        color: 'red',
        routeName: 'AsignacionMuestras',
        typeRoute: 'covid'
    },
    {
        id: 41,
        title: 'Toma de Muestras',
        subtitle: 'Registro fecha toma de muestra',
        icon: 'mdi-calendar-plus',
        color: 'purple',
        routeName: 'TomaMuestra',
        typeRoute: 'covid'
    },
    {
        id: 42,
        title: 'Roles y Permisos',
        subtitle: 'Gestión de Roles y Permisos',
        icon: 'mdi-account-key',
        color: 'purple',
        routeName: 'RolesPermisos',
        typeRoute: 'seguridad'
    },
    {
        id: 43,
        title: 'Herramientas de Gestión',
        subtitle: 'Gestión y Configuración',
        icon: 'fas fa-toolbox',
        color: 'indigo',
        routeName: 'HerramientasGestion',
        typeRoute: 'seguridad'
    },
    {
        id: 44,
        title: 'Vacunación',
        subtitle: 'Caracterizacion vacunación',
        icon: 'fas fa-syringe',
        color: 'deep-purple',
        routeName: 'VacunacionCovid19',
        typeRoute: 'covid'
    },
    {
        id: 45,
        title: 'Cuenta Alto Costo',
        icon: 'fas fa-book',
        color: 'red',
        routeName: 'CuentaAltoCosto',
        typeRoute: 'aps'
    },
    {
        id: 61,
        title: 'Referencias',
        icon: 'mdi-home-city',
        color: 'blue',
        routeName: 'Referencias',
        typeRoute: 'centroRegulador'
    },
    {
        id: 62,
        title: 'Gestion Vacunación',
        icon: 'fas fa-shield-virus',
        color: 'green',
        routeName: 'Vacunacion',
        typeRoute: 'covid'
    },
    {
        id: 63,
        title: 'Bodegas Vacunación',
        icon: 'fas fa-warehouse',
        iconSize: '24',
        color: 'blue',
        routeName: 'Bodega',
        typeRoute: 'covid'
    },
    {
        id: 70,
        title: 'Estudios',
        subtitle: 'Registro y gestión',
        icon: 'fas fa-microscope',
        iconSize: '24',
        color: 'blue',
        routeName: 'EstudiosLabSaludPublica',
        typeRoute: 'labSP'
    },
    {
        id: 71,
        title: 'Atenciones Médicas',
        subtitle: 'Cargue y gestión',
        icon: 'fas fa-notes-medical',
        iconSize: '24',
        color: 'teal darken-2',
        routeName: 'AtencionMedicaRCV',
        typeRoute: 'aps'
    },
    {
        id: 72,
        title: 'Hemocomponentes',
        icon: mdiBloodBag,
        iconSize: '30',
        color: 'red',
        routeName: 'Hemocomponentes',
        typeRoute: 'centroRegulador'
    },
    {
        id: 73,
        title: 'Censo de Camas',
        icon: 'mdi-bed-empty',
        iconSize: '30',
        color: 'teal',
        routeName: 'CensoCamas',
        typeRoute: 'centroRegulador'
    },
    {
        id: 74,
        title: 'Reportes / Informes RCV',
        icon: 'mdi-file-table',
        color: 'pink',
        routeName: 'ReportesRCV',
        typeRoute: 'reportesIndicadoresRCV'
    },
]