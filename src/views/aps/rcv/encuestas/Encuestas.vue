<template>
    <div>
        <data-table
                ref="tablaEncuestasRCV"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @crearTamizaje="item => crearTamizaje(item)"
                @verReporte="item => verReporte(item)"
                @apply-filters="$refs && $refs.filtrosReportesCovid && $refs.filtrosReportesCovid.aplicaFiltros()"
                @seguimiento="item => verSeguimiento(item)"
        >
            <template slot="top-actions-right" v-if="permisos.encuestasRCVCrear">
                <v-btn
                        color="primary"
                        @click.stop="crearEncuesta"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Crear Encuesta
                </v-btn>
            </template>
            <filtros
                    slot="filters"
                    ref="filtrosReportesCovid"
                    :ruta-base="rutaBase"
                    @filtra="val => goDatos(val)"
            ></filtros>
        </data-table>
        <registro-encuesta
                v-if="permisos.encuestasRCVCrear"
                ref="registroEncuesta"
                @guardado="val => encuestaGuardada(val)"
        ></registro-encuesta>
        <seguimiento
                ref="seguimiento"
        ></seguimiento>
        <detalle-reporte-comunitario ref="detalleReporteComunitario"></detalle-reporte-comunitario>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import PersonaItemTabla from "../../../../components/Tamizaje/PersonaItemTabla";
    const RegistroEncuesta = () => import('Views/aps/rcv/encuestas/RegistroEncuesta')
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    const Filtros = () => import('Views/covid19/reporteComunitario/filtros/Filtros')
    const DetalleReporteComunitario = () => import('Views/covid19/reporteComunitario/DetalleReporteComunitario')
    export default {
        name: 'ReportesComunitarios',
        components: {
          RegistroEncuesta,
            Seguimiento,
            Filtros,
            DetalleReporteComunitario
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('aps')
            },
            ...mapGetters([
                'municipiosTotal',
              'tiposDocumentoIdentidad'
            ])
        },
        watch: {
            permisos: {
                handler (val) {
                    if (val && val.encuestasRCVCrear) this.dataTable.buttonZone = true
                },
                immediate: true
            }
        },
        data: (vm) => ({
            rutaBase: 'rcvs',
            dataTable: {
                buttonZone: false,
                advanceFilters: true,
                nameItemState: 'tablaEncuestasRCV',
                route: 'rcvs',
                makeHeaders: [
                  {
                    text: 'Afiliado',
                    align: 'left',
                    sortable: false,
                    component: {
                      functional: true,
                      render: function (createElement, context) {
                        return context.props.value
                            ? createElement(
                                PersonaItemTabla,
                                {
                                  props: {
                                    value: context.props.value
                                  }
                                }
                            )
                            : createElement('span', '')
                      }
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
														<v-list-item-title class="body-2">${vm.municipiosTotal && this.value.centro_poblado_id && vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id) ?  vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).nombre + ', ' + vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).departamento.nombre : ''}</v-list-item-title>
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
                        text: 'Estado',
                        align: 'left',
                        sortable: false,
                        visibleColumn: true,
                        value: 'id',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,{
                                        domProps: {
                                            innerHTML: `
												<div style="white-space: initial !important;">
													${this.value.id ? 'Encuestado' : 'Pendiente'}
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
                        visibleColumn: true,
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
            encuestaGuardada (tamizaje) {
                console.log('tamizaje', tamizaje)
                this.$store.commit('reloadTable', 'tablaEncuestasRCV')
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
            crearEncuesta (item) {
              this.$refs.registroEncuesta.open(item)
            },
            verReporte (item) {
              this.$refs.detalleReporteComunitario.open(item)
            },
            resetOptions(item) {
                item.options = []
                item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_documento_identidad_id && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''
                item.celular = item.numero_celular
                item.identificacion = item.numero_documento_identidad
                if (this.permisos.tamizajeCrear && !item.tamizaje) item.options.push({event: 'crearTamizaje', icon: 'fas fa-file-medical', tooltip: 'Crear ERP'})
                item.options.push({event: 'verReporte', icon: 'mdi-file-find', tooltip: 'Detalle Reporte', color: 'success'})
                if (this.permisos.tamizajeVer && item.tamizaje) {
                  if (item.tamizaje.medico_id) item.options.push({event: 'seguimiento', icon: 'fas fa-file-medical-alt', tooltip: 'Caso de Estudio'})
                  if (!item.tamizaje.medico_id) item.options.push({event: 'seguimiento', icon: 'fas fa-file-medical-alt', tooltip: 'Detalle ERP', color: 'success'})
                }
                return item
            }
        }
    }
</script>

<style scoped>

</style>