<template>
    <div>
        <data-table
                ref="tablaReportesComunitarios"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @crearTamizaje="item => crearTamizaje(item)"
                @verReporte="item => verReporte(item)"
                @seguimiento="item => verSeguimiento(item)"
                @eliminarReporte="item => eliminarReporteComunitario(item)"
                @apply-filters="$refs && $refs.filtrosReportesCovid && $refs.filtrosReportesCovid.aplicaFiltros()"
                @clear-filters="$refs && $refs.filtrosReportesCovid && $refs.filtrosReportesCovid.limpiarFiltros()"
        >
            <template slot="top-actions-right" v-if="permisos.reporteComunitarioCrear">
                <v-btn
                        color="primary"
                        @click.stop="crearReporteComunitario"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Crear Reporte
                </v-btn>
            </template>
            <filtros
                    slot="filters"
                    ref="filtrosReportesCovid"
                    :ruta-base="rutaBase"
                    @filtra="val => goDatos(val)"
            ></filtros>
        </data-table>
        <registro-reporte-comunitario
                v-if="permisos.reporteComunitarioCrear"
                ref="registroReporteComunitario"
                @guardado="val => reporteGuardado(val)"
        ></registro-reporte-comunitario>
        <registro-tamizaje
                v-if="permisos.tamizajeCrear"
                ref="registroTamizaje"
                @guardado="val => tamizajeGuardado(val)"
        ></registro-tamizaje>
        <seguimiento
                ref="seguimiento"
        ></seguimiento>
        <detalle-reporte-comunitario ref="detalleReporteComunitario"></detalle-reporte-comunitario>
      <eliminar-reporte-comunitario
          ref="eliminarReporteComunitario"
          @reporteEliminado="reloadTable()"
      ></eliminar-reporte-comunitario>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import BotonTooltip from '../../../components/Tamizaje/BotonTooltip'
    const RegistroReporteComunitario = () => import('Views/covid19/reporteComunitario/RegistroReporteComunitario')
    const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    const Filtros = () => import('Views/covid19/reporteComunitario/filtros/Filtros')
    const DetalleReporteComunitario = () => import('Views/covid19/reporteComunitario/DetalleReporteComunitario')
    const EliminarReporteComunitario = () => import('Views/covid19/reporteComunitario/EliminarReporteComunitario.vue')
    export default {
        name: 'ReportesComunitarios',
        components: {
            RegistroReporteComunitario,
            RegistroTamizaje,
            Seguimiento,
            Filtros,
            DetalleReporteComunitario,
            EliminarReporteComunitario
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            ...mapGetters([
                'modelTamizaje',
                'municipiosTotal',
                'tiposDocumentoIdentidad'
            ])
        },
        watch: {
            permisos: {
                handler (val) {
                    if (val && val.reporteComunitarioCrear) this.dataTable.buttonZone = true
                },
                immediate: true
            }
        },
        data: (vm) => ({
            rutaBase: 'reporte_covids',
            dataTable: {
                buttonZone: false,
                advanceFilters: true,
                nameItemState: 'tablaReportesComunitarios',
                route: 'reporte_covids',
                makeHeaders: [
                    {
                        text: 'Reporte',
                        align: 'left',
                        sortable: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">Id: ${this.value.id}</v-list-item-title>
														<v-list-item-subtitle class="title caption">
                                                            ${this.value.created_at ? this.moment(this.value.created_at).format('DD/MM/YYYY') : ''}
                                                        </v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Quien Reporta',
                        align: 'left',
                        sortable: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.nombre_reportante}</v-list-item-title>
														<v-list-item-subtitle class="title caption">
                                                            ${this.value.celular_reportante ? ('' + this.value.celular_reportante) : ''}
                                                        </v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Nexo de',
                        align: 'center',
                        sortable: false,
                        value: 'tamizaje_id',
                        component: {
                            functional: true,
                            render: function (createElement, context) {
                                return context.props.value.tamizaje_id
                                    ? createElement(
                                        BotonTooltip,
                                        {
                                            props: {
                                                tooltip: `Ver Encuesta de Riesgo Poblacional No. ${context.props.value.tamizaje_id}`,
                                                text: `ERP ${context.props.value.tamizaje_id}`,
                                                color: 'purple',
                                                textColor: 'white',
                                                value: context.props.value
                                            },
                                            on: {
                                                click: (item) => {
                                                    vm.verTamizaje(item)
                                                }
                                            }
                                        }
                                    )
                                    : createElement('span', '')
                            }
                        }

                    },
                    {
                        text: 'Posible Caso',
                        align: 'left',
                        sortable: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
                                                <div style="display: flex !important;">
                                                    <i class="mr-2 ${this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}" style="font-size: 2.5em !important;"></i>
                                                    <v-list-item>
                                                        <v-list-item-content style="display: grid !important; margin-top: 7px !important;">
                                                            <v-list-item-title class="body-2">${this.value.nombres}</v-list-item-title>
                                                            <v-list-item-subtitle class="title caption">${[vm.tiposDocumentoIdentidad && this.value.tipo_identificacion && vm.tiposDocumentoIdentidad.find(x => x.id === this.value.tipo_identificacion) ? vm.tiposDocumentoIdentidad.find(x => x.id === this.value.tipo_identificacion).tipo : null, this.value.identificacion || null].filter(z => z).join(' ')}</v-list-item-subtitle>
                                                            <v-list-item-subtitle class="title caption">${[this.value.edad ? ('Edad: ' + this.value.edad) : '', this.value.celular ? ('Cel: ' + this.value.celular) : ''].filter(x => x).join(', ')}</v-list-item-subtitle>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </div>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Ubicación PC',
                        tooltip: 'Ubicación Posible Caso',
                        align: 'left',
                        sortable: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item style="white-space: initial !important;">
													<v-list-item-content style="display: grid !important; min-width: 220px !important;">
														<v-list-item-title class="body-2">${vm.municipiosTotal && this.value.municipio_id && vm.municipiosTotal.find(x => x.id === this.value.municipio_id) ?  vm.municipiosTotal.find(x => x.id === this.value.municipio_id).nombre + ', ' + vm.municipiosTotal.find(x => x.id === this.value.municipio_id).departamento.nombre : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2">${this.value.direccion}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Observaciones',
                        align: 'left',
                        sortable: false,
                        visibleColumn: false,
                        value: 'observaciones',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,{
                                        domProps: {
                                            innerHTML: `
												<div style="white-space: initial !important;">
													${this.value.observaciones || ''}
												</div>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Usuario Registra',
                        align: 'left',
                        sortable: false,
                        visibleColumn: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.user ? this.value.user.name : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.user && this.value.user.telefono ? `Telefono: ${this.value.user.telefono}` : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Opciones',
                        align: 'center',
                        sortable: false,
                        actions: true,
                        singlesActions: true
                    }
                ]
            }
        }),
        methods: {
            goDatos (ruta) {
                this.dataTable.route = ruta
            },
            reporteGuardado (reporte) {
                console.log('reporte', reporte)
                this.$store.commit('reloadTable', 'tablaReportesComunitarios')
            },
            tamizajeGuardado (tamizaje) {
                console.log('tamizaje', tamizaje)
                this.$store.commit('reloadTable', 'tablaReportesComunitarios')
                if (this.$refs && this.$refs.tablaTamizajes) {
                    this.$store.commit('reloadTable', 'tablaTamizajes')
                }
            },
            verTamizaje (item) {
                this.$refs.seguimiento.open(item.tamizaje_id)
            },
            verSeguimiento (item) {
              if (item && item.tamizaje) this.$refs.seguimiento.open(item.tamizaje.id)
            },
            crearReporteComunitario () {
              this.$refs.registroReporteComunitario.open()
            },
            crearTamizaje (item) {
              this.$refs.registroTamizaje.open(null, item.id)
            },
            verReporte (item) {
              this.$refs.detalleReporteComunitario.open(item)
            },
            resetOptions(item) {
                item.options = []
                if (this.permisos.tamizajeCrear && !item.tamizaje) item.options.push({event: 'crearTamizaje', icon: 'fas fa-file-medical', tooltip: 'Crear ERP'})
                item.options.push({event: 'verReporte', icon: 'mdi-file-find', tooltip: 'Detalle Reporte', color: 'success'})
                if (this.permisos.tamizajeVer && item.tamizaje) {
                  if (item.tamizaje.medico_id) item.options.push({event: 'seguimiento', icon: 'fas fa-file-medical-alt', tooltip: 'Caso de Estudio'})
                  if (!item.tamizaje.medico_id) item.options.push({event: 'seguimiento', icon: 'fas fa-file-medical-alt', tooltip: 'Detalle ERP', color: 'success'})
                }
              if(this.permisos.eliminarReporte){
                item.options.push({
                  event: 'eliminarReporte',
                  icon: 'fas fa-trash-alt',
                  tooltip: 'Eliminar Reporte Comunitario',
                  color: 'error'
                })
              }
                return item
            },
            eliminarReporteComunitario(item){
                this.$refs.eliminarReporteComunitario.open(item)
            },
            reloadTable() {
              this.$store.commit('reloadTable', 'tablaReportesComunitarios')
            },
        }
    }
</script>

<style scoped>

</style>