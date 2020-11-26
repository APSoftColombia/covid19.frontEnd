<template>
    <v-container fluid>
		<page-title-bar title="Seguimientos RCV"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
                    <data-table
                        ref="tablaBitacorasRcv"
                        v-model="dataTable"
                        @resetOption="item => resetOptions(item)"
                        @verBitacoras="item => verBitacoras(item)"
                        @apply-filters="$refs && $refs.filtrosBitacorasRcv && $refs.filtrosBitacorasRcv.aplicaFiltros()"
                    >
                    <filtros
                        slot="filters"
                        ref="filtrosBitacorasRcv"
                        :ruta-base="rutaBase"
                        @filtra="val => goDatos(val)"
                    ></filtros>
                    </data-table>
                    <ver-bitacoras ref="verBitacoras" @close="loading = false"></ver-bitacoras>
                    <app-section-loader :status="loading"></app-section-loader>.
				</v-card>
			</v-col>
		</v-row>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import ItemListDataPaciente from '../componentes/ItemListDataPaciente'
const verBitacoras = () => import('../encuestas/VerBitacoras')
const Filtros = () => import('../bitacorasRcv/components/FiltrosBitacorasRcv')

export default {
    components: {
        verBitacoras,
        Filtros
    },
    name: "BitacorasRcv",
    data: (vm) => ({
        loading: false,
        loadingButton: false,
        lengthData: null,
        rutaBase: 'bitacoras',
        dataTable: {
            buttonZone: true,
            advanceFilters: true,
            nameItemState: 'tablaBitacorasRcv',
            route: 'bitacoras',
            total: null,
            makeHeaders: [
                {
                    text: 'Identificador',
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
                                                <v-list-item-title class="body-2">${this.value.id_afiliado ? `ID: ${this.value.id_afiliado}` : ''}</v-list-item-title>
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
                                ItemListDataPaciente,
                                {
                                    props: {
                                        value: {
                                            sexo: context.props.value.sexo,
                                            nombre: context.props.value.nombre,
                                            tipoIdentificacion: context.props.value.tipo_documento_identidad_id && vm.tiposDocumentoIdentidad ? vm.tiposDocumentoIdentidad.find(x => x.id === context.props.value.tipo_documento_identidad_id).tipo : '',
                                            identificacion: context.props.value.numero_documento_identidad,
                                            celular: context.props.value.numero_celular,
                                        }
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
                                                <v-list-item-title class="body-2">${vm.municipiosTotal && this.value.centro_poblado_id && vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id) ? vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).nombre + ', ' + vm.municipiosTotal.find(x => x.id === this.value.centro_poblado_id).departamento.nombre : ''}</v-list-item-title>
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
                    text: 'Opciones',
                    align: 'center',
                    sortable: false,
                    actions: true,
                    singlesActions: true
                }
            ]
        }
    }),
    computed: {
        ...mapGetters([
            'municipiosTotal',
            'tiposDocumentoIdentidad'
        ]),
        permisos() {
            return this.$store.getters.getPermissionModule('aps')
        }
    },
    methods: {
        goDatos(ruta) {
            this.dataTable.route = ruta
        },
        encuestaGuardada() {
            this.$store.commit('reloadTable', 'tablaBitacorasRcv');
        },
        verBitacoras(item){
            this.loading = true
            this.$refs.verBitacoras.open(item, true)
        },
        resetOptions(item) {
            item.options = []
            if (this.permisos.verBitacoras) {
                item.options.push({
                    event: 'verBitacoras',
                    icon: 'mdi-content-paste',
                    tooltip: 'Ver seguimientos'
                })
            }
            return item
        }
    }
}
</script>

<style>

</style>