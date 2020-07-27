<template>
    <v-container fluid>
        <page-title-bar title="Nexos"></page-title-bar>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <data-table
                            ref="tablaNexos"
                            v-model="dataTable"
                            @resetOption="item => resetOptions(item)"
                            @seguimiento="item => verSeguimiento(item)"
                            @crearERP="item => crearTamizaje(item)"
                            @apply-filters="$refs && $refs.filtrosNexos && $refs.filtrosNexos.aplicaFiltros()"
                    >
                        <filtros
                            slot="filters"
                            ref="filtrosNexos"
                            :ruta-base="rutaBase"
                            @filtrar="val => goDatos(val)"
                        ></filtros>
                    </data-table>
                </v-card>
            </v-col>
        </v-row>
        <seguimiento
                ref="seguimiento"
        ></seguimiento>
        <registro-tamizaje
                v-if="permisos.tamizajeCrear"
                ref="registroTamizaje"
                @guardado="item => tamizajeGuardado()"
        ></registro-tamizaje>
        <app-section-loader :status="loading"></app-section-loader>
    </v-container>
</template>

<script>
    import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla"
    import Filtros from './Filtros/Filtros'
    const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    export default {
        name: "NexosView",
        data: () => ({
            loading: false,
            rutaBase:"nexos",
            dataTable: {
                advanceFilters: true,
                buttonZone: true,
                nameItemState: 'tablaNexos',
                route: "nexos",
                makeHeaders: [
                    {
                        text: 'Nombre',
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
                                                value: context.props.value,
                                                isNotFromNexos: false
                                            }
                                        }
                                    )
                                    : createElement('span', '')
                            }
                        }
                    },
                    {
                        text: 'Nexo',
                        align: 'left',
                        sortable: false,
                        value: 'nombre_origen'
                    },
                    {
                        text: 'Muestra',
                        align: 'left',
                        sortable: false,
                        value: 'estado_prueba'
                    },
                    {
                        text: 'Dirección',
                        align: 'left',
                        sortable: false,
                        value: 'direccion'
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
            goDatos(ruta) {
                this.dataTable.route = ruta
            },
            resetOptions(item) {
                item.options = []
                if (item.erp_generado_id) item.options.push({event: 'seguimiento', icon: 'mdi-file-find', tooltip: 'Detalle ERP', color:'success'})
                if (!item.erp_generado_id) item.options.push({event: 'crearERP', icon: 'fas fa-file-medical', tooltip: 'Crear ERP'})
            },
            verSeguimiento (item) {
                this.$refs.seguimiento.open(item.erp_generado_id)
            },
            crearTamizaje () {
                this.$refs.registroTamizaje.open()
            },
            tamizajeGuardado () {
                this.$store.commit('reloadTable', 'tablaNexos')
            },
        },
        components : {
            Seguimiento,
            RegistroTamizaje,
            Filtros
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
        }
    }
</script>

<style scoped>

</style>