<template>
    <div>
        <data-table
                ref="tablaTamizajesLight"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @apply-filters="$refs && $refs.filtrosTamizaje && $refs.filtrosTamizaje.aplicaFiltros()"
        >
            <template slot="top-actions-right" v-if="permisos.tamizajeCrear || permisos.tamizajeViajeroCrear">
                <v-tooltip top v-if="permisos.tamizajeViajeroCrear" :disabled="$vuetify.breakpoint.smAndUp">
                    <template v-slot:activator="{on}">
                        <v-btn
                                v-on="on"
                                color="indigo"
                                @click.stop="crearViajero"
                                class="white--text mr-2"
                        >
                            <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-bus-marker</v-icon>
                            {{$vuetify.breakpoint.smAndUp ? 'Crear ERP Viajero' : ''}}
                        </v-btn>
                    </template>
                    <span>Crear Tamizaje Viajero</span>
                </v-tooltip>
                <v-tooltip top v-if="permisos.tamizajeCrear" :disabled="$vuetify.breakpoint.smAndUp">
                    <template v-slot:activator="{on}">
                        <v-btn
                                v-on="on"
                                color="primary"
                                @click.stop="crearTamizaje"
                                class="white--text"
                        >
                            <v-icon :left="$vuetify.breakpoint.smAndUp">fas fa-file-medical</v-icon>
                            {{$vuetify.breakpoint.smAndUp ? 'Crear ERP' : ''}}
                        </v-btn>
                    </template>
                    <span>Crear Tamizaje</span>
                </v-tooltip>
            </template>
            <filtros
                    slot="filters"
                    v-if="permisos.filtrosTamizaje"
                    :medicos="medicos"
                    ref="filtrosTamizaje"
                    :ruta-base="rutaBase"
                    @filtra="val => goDatos(val)"
            ></filtros>
        </data-table>
        <registro-viajero
                v-if="permisos.tamizajeViajeroCrear"
                ref="registroViajero"
                @guardado="val => tamizajeGuardado(val)"
        ></registro-viajero>
        <registro-tamizaje
                v-if="permisos.tamizajeCrear"
                ref="registroTamizaje"
                @guardado="item => tamizajeGuardado(item)"
        ></registro-tamizaje>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla";
    const RegistroViajero = () => import('Views/covid19/viajero/RegistroViajero')
    const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
    const Filtros = () => import('Views/covid19/tamizaje/filtros/Filtros')
    export default {
        name: 'TamizajesLight',
        components: {
            RegistroViajero,
            RegistroTamizaje,
            Filtros
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            ...mapGetters([
                'tiposDocumentoIdentidad'
            ])
        },
        watch: {
            permisos: {
                handler (val) {
                    if (val && val.tamizajeViajeroCrear || val.tamizajeCrear) this.dataTable.buttonZone = true
                    if (val && val.filtrosTamizaje) this.dataTable.advanceFilters = true
                },
                immediate: true
            }
        },
        data: () => ({
            medicos: [],
            rutaBase: 'tamizajes',
            dataTable: {
                advanceFilters: false,
                buttonZone: false,
                nameItemState: 'tablaTamizajesLight',
                route: 'tamizajes',
                makeHeaders: [
                    {
                        text: 'ID',
                        align: 'left',
                        sortable: false,
                        value: 'id'
                    },
                    {
                        text: 'Creación',
                        align: 'left',
                        sortable: true,
                        visibleColumn: false,
                        value: 'created_at',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    this.value.created_at ? this.moment(this.value.created_at).format('DD/MM/YYYY HH:mm') : ''
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Actualización',
                        align: 'left',
                        sortable: true,
                        visibleColumn: false,
                        value: 'updated_at',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    this.value.updated_at ? this.moment(this.value.updated_at).format('DD/MM/YYYY HH:mm') : ''
                                )
                            },
                            props: ['value']
                        }
                    },
                    {
                        text: 'Punto ERP',
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
														<v-list-item-title class="body-2">${this.value.tamizador.nombre}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
                                                            ${this.value.infoviajero ? this.value.infoviajero.lugar : ''}
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
                        text: 'Municipio',
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
                                                        <v-list-item-title class="body-2">
                                                            ${this.value.municipio ? this.value.municipio.nombre : ''}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle class="body-1">
                                                            ${this.value.municipio ? this.value.municipio.departamento.nombre : ''}
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
                        text: 'Persona',
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
                        text: 'EPS',
                        align: 'left',
                        sortable: false,
                        visibleColumn: false,
                        value: 'eps_id',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<span>
                                                    ${this.value.eps ? this.value.eps.nombre : ''}
                                                </span>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    }
                ]
            }
        }),
        methods: {
            crearTamizaje () {
              this.$refs.registroTamizaje.open()
            },
            crearViajero () {
                this.$refs.registroViajero.open()
            },
            tamizajeGuardado (tamizaje) {
                console.log('tamizaje', tamizaje)
                this.$store.commit('reloadTable', 'tablaTamizajesLight')
            },
            resetOptions(item) {
                item.nombre = [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')
                item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : ''
                item.colortrrgba = item.total_riesgo > 0 ? `254,0,0, ${item.total_riesgo/100}`  : ''
                item.colortext = item.total_riesgo > 50 ? 'white' : ''
                item.options = []
                return item
            }
        }
    }
</script>

<style scoped>

</style>