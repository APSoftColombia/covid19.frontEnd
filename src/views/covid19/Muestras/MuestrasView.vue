<template>
    <v-container fluid>
        <page-title-bar title="Muestras"></page-title-bar>
        <data-table
            ref="tablaMuestras"
            v-model="dataTable"
            @resetOption="item => resetOptions(item)"
            @seguimiento="item => verSeguimiento(item)"
            @apply-filters="$refs && $refs.filtrosMuestras && $refs.filtrosMuestras.aplicaFiltros()"
            @clear-filters="$refs && $refs.filtrosMuestras && $refs.filtrosMuestras.limpiarFiltros()"
        >
            <filtros
                slot="filters"
                ref="filtrosMuestras"
                :ruta-base="rutaBase"
                @filtra="val => applyFilters(val)"
            ></filtros>
        </data-table>
        <seguimiento
            ref="seguimiento"
        ></seguimiento>
    </v-container>
</template>

<script>
    import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla";
    import {mapGetters} from "vuex";
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    import Filtros from './Filtros/Filtros'
    export default {
        name: "MuestrasView",
        data: (vm) =>({
            rutaBase: 'muestras',
            dataTable: {
                advanceFilters: true,
                buttonZone: true,
                nameItemState: 'tablaMuestras',
                route: null,
                makeHeaders: [
                    {
                        text: 'ID',
                        align: 'left',
                        sortable: false,
                        value: 'id'
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
                                                value: {
                                                    nombre: context.props.value.nombre,
                                                    positivo_covid: context.props.value.positivo_covid,
                                                    sexo: context.props.value.sexo,
                                                    tipoIdentificacion: vm.tiposDocumentoIdentidad.find(x => x.id === context.props.value.tipo_identificacion).tipo,
                                                    identificacion: context.props.value.identificacion,
                                                    celular: context.props.value.celular
                                                }
                                            }
                                        }
                                    )
                                    : createElement('span', '')
                            }
                        }
                    },
                    {
                        text: 'Dirección',
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
														<v-list-item-title class="body-2">${this.value.direccion}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
														${vm.municipiosTotal && vm.municipiosTotal.length && this.value.municipio_id && vm.municipiosTotal.find(x => x.id === this.value.municipio_id)
                                                ?  `${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).nombre}, ${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).departamento.nombre}`
                                                : ''}
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
                        text: 'Estado Prueba',
                        align: 'center',
                        sortable: false,
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item style="text-align: center">
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-1">${this.value.estado_prueba}</v-list-item-title>
														<v-list-item-subtitle class="body-2">
														    ${this.value.fecha_toma ? 'Fecha Muestra: ' + this.value.fecha_toma : ''}
                                                        </v-list-item-subtitle>
                                                        <v-list-item-subtitle class="body-2">
                                                            ${this.value.fecha_resultado ? 'Fecha Resultado: ' + this.value.fecha_resultado : ''}
                                                        </v-list-item-subtitle>
                                                        <v-list-item-subtitle class="body-2 red--text">
                                                            ${this.value.deleted_at ? `No registrado en sismuestras: ${this.moment(this.value.deleted_at).format('DD/MM/YYYY')}` : ''}
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
                        text: 'Tipo',
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
													    <!--<v-list-item-title class="body-1">{!this.value.tipo && !this.value.lugar_toma && !this.value.tomado_por ? 'Sin Informacón de Muestra' : ''}</v-list-item-title>-->
														<v-list-item-title class="body-1">${this.value.tipo ? this.value.tipo : 'Por Confirmar'}</v-list-item-title>
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
                        text: 'Información de Prueba',
                        align: 'center',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,{
                                        domProps: {
                                            innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important; text-align: center;">
													<v-list-item-subtitle class="body-2">
                                                            ${this.value.lugar_toma ? 'Lugar Toma: ' + this.value.lugar_toma : ''}
                                                        </v-list-item-subtitle>
                                                        <v-list-item-subtitle class="body-2">
                                                            Tomado por: ${vm.tomadores && vm.tomadores.length && this.value.tomador_muestra_id && vm.tomadores.find(x => x.id === this.value.tomador_muestra_id)
                                                                ? vm.tomadores.find(x => x.id === this.value.tomador_muestra_id).institucion
                                                                : this.value.tomado_por ? this.value.tomado_por : 'Sin Determinar'}
                                                        </v-list-item-subtitle>
                                                        <v-list-item-subtitle class="body-2">
                                                            Laboratorio: ${vm.laboratorios && vm.laboratorios.length && this.value.laboratorio_id && vm.laboratorios.find(x => x.id === this.value.laboratorio_id)
                                                                ?  vm.laboratorios.find(x => x.id === this.value.laboratorio_id).laboratorio
                                                                : this.value.laboratorio ? this.value.laboratorio : 'Sin Determinar'}
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
                        text: 'Opciones',
                        align: 'center',
                        sortable: false,
                        actions: true,
                        singlesActions: true
                    }
                ]
            }
        }),
        components: {
            Seguimiento,
            Filtros
        },
        computed: {
            ...mapGetters([
                'tiposDocumentoIdentidad',
                'municipiosTotal',
                'tomadores',
                'laboratorios'
            ]),
        },
        methods: {
            applyFilters(route){
                this.dataTable.route = route
            },
            resetOptions(item) {
                item.options = []
                item.options.push({event: 'seguimiento', icon: 'mdi-file-find', tooltip: 'Detalle ERP', color:'success'})
            },
            verSeguimiento (item) {
                this.$refs.seguimiento.open(item.id)
            },
        },
        created() {
            this.dataTable.route = this.rutaBase
        }
    }
</script>

<style scoped>

</style>