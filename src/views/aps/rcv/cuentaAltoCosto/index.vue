<template>
    <v-container fluid>
		<page-title-bar title="Cuenta Alto Costo"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
            <data-table
                ref="tablaCuentaAltoCosto"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @verCuentaAltoCosto="item => verCuentaAltoCosto(item)"
            >
              <template slot="top-actions-right">
                <v-btn class="green white--text"
                    @click="openReportesERC"
                >
                  <v-icon left>fas fa-file-download</v-icon>
                  Descargar reporte ERC
                </v-btn>
                <v-btn class="green white--text"
                    @click="openReportesTFG"
                >
                  <v-icon left>fas fa-file-download</v-icon>
                  Descargar reporte TFG
                </v-btn>
              </template>
            </data-table>
            <ver-cuenta-alto-costo ref="verCuentaAltoCosto" @close="loading = false"></ver-cuenta-alto-costo>
            <app-section-loader :status="loading"></app-section-loader>
				</v-card>
			</v-col>
		</v-row>
      <descargar-reporte-e-r-c
          ref="reporteERC"
      ></descargar-reporte-e-r-c>
      <descargar-reporte-t-f-g
          ref="reporteTFG"
      ></descargar-reporte-t-f-g>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import ItemListDataPaciente from '../componentes/ItemListDataPaciente'
const verCuentaAltoCosto = () => import('../cuentaAltoCosto/components/verCuenta')
const DescargarReporteERC = () => import('../cuentaAltoCosto/components/DescargarReporteERC')
const DescargarReporteTFG = () => import('../cuentaAltoCosto/components/DescargarReporteTFG')

export default {
    components: {
        verCuentaAltoCosto,
        DescargarReporteERC,
        DescargarReporteTFG
    },
    name: "CuentaAltoCosto",
    data: (vm) => ({
        loading: false,
        loadingButton: false,
        lengthData: null,
        rutaBase: 'cuenta-alto-costo',
        dataTable: {
            buttonZone: true,
            advanceFilters: true,
            nameItemState: 'tablaCuentaAltoCosto',
            route: 'cuenta-alto-costo',
            total: null,
            makeHeaders: [
                {
                    text: 'ID',
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
                                                <v-list-item-title class="body-2">${this.value.id}</v-list-item-title>
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
                                            nombre: `${context.props.value.nombre1 ? context.props.value.nombre1 : ''} ${context.props.value.nombre2 ? context.props.value.nombre2 : ''} ${context.props.value.apellido1 ? context.props.value.apellido1 : ''} ${context.props.value.apellido2 ? context.props.value.apellido2 : ''}`,
                                            tipoIdentificacion: context.props.value.tipo_doc,
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
                                                <v-list-item-subtitle class="body-2">${this.value.direccion ? this.value.direccion : '' }</v-list-item-subtitle>
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
            'municipiosTotal'
        ]),
        permisos() {
            return this.$store.getters.getPermissionModule('aps')
        }
    },
    methods: {
        openReportesERC(){
          this.$refs.reporteERC.open()
        },
        openReportesTFG(){
          this.$refs.reporteTFG.open()
        },
        goDatos(ruta) {
            this.dataTable.route = ruta
        },
        encuestaGuardada() {
            this.$store.commit('reloadTable', 'tablaCuentaAltoCosto');
        },
        verCuentaAltoCosto(item){
            this.loading = true
            this.$refs.verCuentaAltoCosto.open(item, true)
        },
        resetOptions(item) {
            item.options = []
            item.options.push({
                event: 'verCuentaAltoCosto',
                icon: 'mdi-content-paste',
                tooltip: 'Ver detalle'
            })
            return item
        }
    }
}
</script>

<style>

</style>
