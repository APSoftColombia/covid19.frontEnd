<template>
    <div>
        <data-table
                ref="tablaEncuestasRCV"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @crearEncuesta="item => crearEncuesta(item)"
                @verEncuesta="item => verEncuesta(item)"
                @apply-filters="$refs && $refs.filtrosReportesCovid && $refs.filtrosReportesCovid.aplicaFiltros()"
        >
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
        <detalle-encuesta ref="detalleEncuesta"></detalle-encuesta>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import PersonaItemTabla from "../../../../components/Tamizaje/PersonaItemTabla";
    const RegistroEncuesta = () => import('Views/aps/rcv/encuestas/RegistroEncuesta')
    const Filtros = () => import('Views/covid19/reporteComunitario/filtros/Filtros')
    const DetalleEncuesta = () => import('Views/aps/rcv/encuestas/components/DetalleEncuesta')
    export default {
        name: 'Encuestas',
        components: {
          RegistroEncuesta,
          Filtros,
          DetalleEncuesta
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
                advanceFilters: false,
                nameItemState: 'tablaEncuestasRCV',
                route: 'rcvs',
                makeHeaders: [
                  {
                    text: 'Encuesta',
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
														<v-list-item-title class="body-2">${this.value.id ? `ID: ${this.value.id}` : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.id && this.value.updated_at ? this.moment(this.value.updated_at).format('DD/MM/YYYY HH:mm') : ''}</v-list-item-subtitle>
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
                        text: 'Ubicación',
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
														<v-list-item-title class="body-2">${this.value.nombre_usuario || ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.email_usuario || ''}</v-list-item-subtitle>
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
            encuestaGuardada (item) {
                this.$store.commit('reloadTable', 'tablaEncuestasRCV')
                this.$refs.detalleEncuesta.open(item)
            },
            crearEncuesta (item) {
              this.$refs.registroEncuesta.open(item)
            },
            verEncuesta (item) {
              this.$refs.detalleEncuesta.open(item)
            },
            resetOptions(item) {
                item.options = []
                item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_documento_identidad_id && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''
                item.celular = item.numero_celular
                item.identificacion = item.numero_documento_identidad
                item.nombre = [item.nombre1, item.nombre2, item.apellido1, item.apellido1].filter(x => x).join(' ')
                if (this.permisos.encuestasRCVCrear && !item.id) item.options.push({event: 'crearEncuesta', icon: 'fas fa-file-medical', tooltip: 'Crear Encuesta'})
                if (item.id) item.options.push({event: 'verEncuesta', icon: 'mdi-file-find', tooltip: 'Detalle Encuesta', color: 'success'})
                return item
            }
        }
    }
</script>

<style scoped>

</style>