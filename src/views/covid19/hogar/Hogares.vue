<template>
    <div>
        <data-table
                ref="tablaHogares"
                v-model="dataTable"
                @verhogar="item => verHogar(item)"
                @editarhogar="item => editarHogar(item)"
                @resetOption="item => resetOptions(item)"
        >
            <template slot="top-actions-right" v-if="permisos.crear">
                <v-btn
                        color="primary"
                        @click.stop="crearHogar"
                >
                    <v-icon left>mdi-plus</v-icon>
                    Crear Hogar
                </v-btn>
            </template>
        </data-table>
<!--        <autopsia ref="autopsia"></autopsia>-->
        <registro-hogar
                v-if="permisos.crear"
                ref="registroHogar"
                @guardado="val => hogarGuardado(val)"
        ></registro-hogar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PersonaItemTabla from '../../../components/Tamizaje/PersonaItemTabla'
    const registroHogar = () => import('Views/covid19/hogar/RegistroHogar')
    // const Autopsia = () => import('Views/covid19/autopsia/Autopsia')
    export default {
        name: 'Autopsias',
        components: {
            registroHogar
            // Autopsia
        },
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('hogaresCovid')
            },
            ...mapGetters([
                'tiposDocumentoIdentidad',
                'epss'
            ])
        },
        watch: {
            permisos: {
                handler (val) {
                    if (val && val.crear) this.dataTable.buttonZone = true
                },
                immediate: true
            }
        },
        data: () => ({
            dataTable: {
                buttonZone: false,
                nameItemState: 'tablaHogares',
                route: 'nucleos-familiares',
                makeHeaders: [
                    {
                        text: 'Hogar',
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
                        text: 'Lider del Hogar',
                        align: 'left',
                        sortable: false,
                        component: {
                            functional: true,
                            render: function (createElement, context) {
                                return createElement(
                                    PersonaItemTabla,
                                    {
                                        props: {
                                            value: {
                                                identificacion: context.props.value.identificacion,
                                                tipoIdentificacion: context.props.value.tipoIdentificacion,
                                                celular: context.props.value.celular,
                                                sexo: context.props.value.sexo,
                                                nombre: [context.props.value.nombre1, context.props.value.nombre2, context.props.value.apellido1, context.props.value.apellido2].filter(x => x).join(' ')
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    },
                    {
                        text: 'Email / Dirección',
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
														<v-list-item-title class="body-2">${this.value.email || ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.direccion || ''}</v-list-item-subtitle>
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
                        text: 'Afiliación',
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
														<v-list-item-title class="body-2">${this.value.tipo_afiliacion || ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.epstext}</v-list-item-subtitle>
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
            hogarGuardado (autopsia) {
                console.log('autopsia', autopsia)
                this.$store.commit('reloadTable', 'tablaHogares')
            },
            verHogar (item) {
                this.$refs.autopsia.open(item.id)
            },
            crearHogar () {
              this.$refs.registroHogar.open()
            },
            editarHogar (item) {
              this.$refs.registroHogar.open(item.id)
            },
            resetOptions(item) {
                item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : ''
                item.epstext = this.epss && item.eps_id && this.epss.find(x => x.id === item.eps_id) ? this.epss.find(x => x.id === item.eps_id).nombre : ''
                item.options = []
                // item.options.push({event: 'verhogar', icon: 'mdi-home-search', tooltip: 'Detalle del Hogar', color: 'success'})
                if (this.permisos.crear) item.options.push({event: 'editarhogar', icon: 'mdi-home-edit', tooltip: 'Edición del Hogar', color: 'orange'})
                return item
            }
        }
    }
</script>

<style scoped>

</style>