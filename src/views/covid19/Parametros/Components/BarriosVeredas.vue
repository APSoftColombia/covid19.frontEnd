<template>
    <v-card>
        <v-card-title>
            <span>Barrios y Veredas</span>
            <v-spacer></v-spacer>
            <v-btn class="primary" @click="$refs.formBarrioVereda.open()">
                <v-icon left>fas fa-plus</v-icon>
                <span>Nuevo</span>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <data-table
                ref="tablaBarriosVeredas"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @editar="item => editar(item)"
                @eliminar="item => eliminar(item)"
            ></data-table>
        </v-card-text>
        <form-b-v
            ref="formBarrioVereda"
            @actualizarTabla="refreshTable"
        ></form-b-v>
        <dialog-eliminar
            ref="dialogEliminar"
            @actualizarTabla="refreshTable"
        ></dialog-eliminar>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";

    const FormBV = () => import('./FormBarriosVeredas')
    const DialogEliminar = () => import('./EliminarBarrioVereda')
    export default {
        name: "BarriosVeredas",
        data: (vm) => ({
            formDialog: false,
            dataTable: {
                advanceFilters: false,
                buttonZone: false,
                nameItemState: 'tablaBarriosVeredas',
                route: 'get-barrios-veredas',
                makeHeaders: [
                    {
                        text: 'Nombre',
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
														<v-list-item-title class="body-2">${this.value.id} - ${this.value.nombre}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
													        ${this.value.codigo}, ${this.value.tipo}
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
														    ${vm.municipiosTotal && vm.municipiosTotal.length && this.value.municipio_id && vm.municipiosTotal.find(x => x.id === this.value.municipio_id)
                                                            ?  `${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).nombre}, ${vm.municipiosTotal.find(x => x.id === this.value.municipio_id).departamento.nombre}`
                                                            : ''}
														</v-list-item-title>
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
                ]}
        }),
        computed: {
            ...mapGetters([
                'municipiosTotal'
            ]),
        },
        methods: {
            editar(item){
                this.$refs.formBarrioVereda.open(item)
            },
            refreshTable(){
                this.$store.commit('reloadTable', 'tablaBarriosVeredas')
            },
            eliminar(item){
                this.$refs.dialogEliminar.open(item)
            },
            resetOptions(item) {
                item.options = []
                item.options.push({event: 'editar', icon: 'fas fa-edit', tooltip: 'Editar', color: 'warning'})
                item.options.push({event: 'eliminar', icon: 'fas fa-trash-alt', tooltip: 'Eliminar', color: 'error'})
                return item
            },
        },
        components: {
            FormBV,
            DialogEliminar
        }
    }
</script>

<style scoped>

</style>