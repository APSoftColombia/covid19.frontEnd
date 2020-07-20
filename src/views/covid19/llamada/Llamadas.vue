<template>
    <div>
        <data-table
                ref="tablaLlamadas"
                v-model="dataTable"
                @resetOption="item => resetOptions(item)"
                @crearTamizaje="item => crearTamizaje(item)"
        >
            <template slot="top-actions-right" v-if="permisos.llamadaCrear">
                <v-btn
                        color="primary"
                        @click.stop="crearLlamada"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Registrar Llamada
                </v-btn>
            </template>
        </data-table>
        <registro-llamada
                v-if="permisos.llamadaCrear"
                ref="registroLlamada"
                @guardado="val => llamdaGuardada(val)"
        ></registro-llamada>
    </div>
</template>

<script>
    const RegistroLlamada = () => import('Views/covid19/llamada/RegistroLlamada')
    export default {
        name: 'Llamadas',
        components: {
            RegistroLlamada
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            }
        },
        watch: {
            permisos: {
                handler (val) {
                    if (val && val.llamadaCrear) this.dataTable.buttonZone = true
                },
                immediate: true
            }
        },
        data: () => ({
            dataTable: {
                buttonZone: false,
                nameItemState: 'tablaLlamadas',
                route: 'llamadas',
                makeHeaders: [
                    {
                        text: 'Llamada',
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
														<v-list-item-title class="body-2">${this.value.tipo ? (this.value.tipo.charAt(0).toUpperCase() + this.value.tipo.slice(1)) : ''}</v-list-item-title>
														<v-list-item-subtitle class="${this.value.covid ? 'body-2 font-weight-bold error--text' : 'body-2 info--text'}">
                                                            ${this.value.covid ? 'Covid-19' : 'Otro tema'}
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
                            render: function (createElement) {
                                return createElement(
                                    `div`,
                                    {
                                        domProps: {
                                            innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.nombre ? this.value.nombre : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2">${this.value.celular ? ('Celular: ' + this.value.celular) : ''}</v-list-item-subtitle>
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
                        text: 'Motivo',
                        align: 'left',
                        sortable: false,
                        value: 'motivo',
                        component: {
                            render: function (createElement) {
                                return createElement(
                                    `div`,{
                                        domProps: {
                                            innerHTML: `
												<div style="white-space: initial !important;">
													${this.value.motivo}
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
                        text: 'Responsable',
                        align: 'left',
                        sortable: false,
                        value: 'responsable'
                    },
                    {
                        text: 'Usuario',
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
														<v-list-item-title class="body-2">${this.value.usuario ?  this.value.usuario.name : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.usuario ? 'Teléfono: ' + this.value.usuario.telefono : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                                        }
                                    }
                                )
                            },
                            props: ['value']
                        }
                    }
                    // {
                    //     text: 'Opciones',
                    //     align: 'center',
                    //     sortable: false,
                    //     actions: true,
                    //     singlesActions: true
                    // }
                ]
            }
        }),
        methods: {
            llamdaGuardada (reporte) {
                console.log('reporte', reporte)
                this.$store.commit('reloadTable', 'tablaLlamadas')
            },
            crearLlamada () {
              this.$refs.registroLlamada.open()
            },
            resetOptions(item) {
                item.options = []
                return item
            }
        }
    }
</script>

<style scoped>

</style>