<template>
    <v-dialog
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left >mdi-home-assistant</v-icon>
                <v-toolbar-title >{{hogarDe ? 'Actualización de' : 'Nuevo'}} Hogar</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>
                                <v-avatar color="primary" class="mr-1">
                                    <v-icon color="white">mdi-account-group</v-icon>
                                </v-avatar>
                                Integrantes del hogar
                            </v-card-title>
                            <v-card-text v-if="hogar.integrantes">
                                <v-simple-table v-if="hogar.integrantes.length">
                                    <template v-slot:default>
                                        <thead>
                                        <tr>
                                            <th>Lider</th>
                                            <th>Integrante</th>
                                            <th>Email/Dirección</th>
                                            <th>Afiliación</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(integrante, indexIntegrante) in hogar.integrantes" :key="`integrante${indexIntegrante}`">
                                            <td>
                                                <v-checkbox
                                                        v-model="integrante.esCabeza"
                                                        @click="integrante.esCabeza ? '' : reloadCabeza(indexIntegrante)"
                                                        readonly
                                                        :color="integrante.esCabeza ? 'success' : 'blue-grey'"
                                                ></v-checkbox>
                                            </td>
                                            <td>
                                                <persona-item-tabla
                                                        :value="{
                                                                    identificacion: integrante.integrante.identificacion,
                                                                    tipoIdentificacion: getTipoIdentificacion(integrante.integrante),
                                                                    celular: integrante.integrante.celular,
                                                                    sexo: integrante.integrante.sexo,
                                                                    nombre: [integrante.integrante.nombre1, integrante.integrante.nombre2, integrante.integrante.apellido1, integrante.integrante.apellido2].filter(x => x).join(' ')
                                                }"
                                                    ></persona-item-tabla>
                                            </td>
                                            <td>
                                                <v-list-item>
                                                    <v-list-item-content style="display: grid !important;">
                                                        <v-list-item-title class="body-2">{{integrante.integrante.email}}</v-list-item-title>
                                                        <v-list-item-subtitle class="body-2 text-truncate">{{integrante.integrante.direccion}}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </td>
                                            <td>
                                                <v-list-item>
                                                    <v-list-item-content style="display: grid !important;">
                                                        <v-list-item-title class="body-2">{{integrante.integrante.tipo_afiliacion}}</v-list-item-title>
                                                        <v-list-item-subtitle class="body-2 text-truncate">{{getEpstext(integrante.integrante)}}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </td>
                                            <td>
                                                <v-tooltip left v-if="!integrante.esCabeza">
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn icon color="error" @click.stop="quitarIntegrante(indexIntegrante)" v-on="on">
                                                            <v-icon>mdi-close</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Quitar integrante</span>
                                                </v-tooltip>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                <v-row v-else justify="center" class="grey-text text--lighten-2">No hay integrantes seleccionados</v-row>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-text>
                                <span class="headline">
                                    <v-icon large color="orange" class="mb-3">mdi-account-search</v-icon>
                                    Personas sin hogar asignado
                                </span>
                                <data-table
                                        ref="tablaPersonasSinHogar"
                                        v-model="dataTable"
                                        @resetOption="item => resetOptions(item)"
                                        @agregarintegrante="item => agregarIntegrante(item)"
                                ></data-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PersonaItemTabla from '../../../components/Tamizaje/PersonaItemTabla'
    export default {
        name: 'RegistroHogar',
        components: {PersonaItemTabla},
        data: () => ({
            click: false,
            actualizado: false,
            loading: false,
            dialog: false,
            dataTable: {
                buttonZone: false,
                nameItemState: 'tablaPersonasSinHogar',
                route: 'personas?filter[sin_nucleo]=1',
                makeHeaders: [
                    {
                        text: 'Persona',
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
														<v-list-item-title class="body-2">${this.value.email}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.direccion}</v-list-item-subtitle>
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
														<v-list-item-title class="body-2">${this.value.tipo_afiliacion}</v-list-item-title>
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
            },
            hogar: null,
            makeHogar: {
                integrantes: []
            }
        }),
        computed: {
            hogarDe () {
              return this && this.hogar && this.hogar.integrantes && this.hogar.integrantes.length && this.hogar.integrantes.find(x => x.esCabeza) && this.hogar.integrantes.find(x => x.esCabeza).integrante
            },
            ...mapGetters([
                'tiposDocumentoIdentidad',
                'epss'
            ])
        },
        created() {
            this.hogar = this.clone(this.makeHogar)
        },
        methods: {
            guardarAutopsia () {
                if (this.autopsia.fallecido && this.autopsia.encuestado) {
                    this.$refs.formAutopsia.validate().then(result => {
                        if (result) {
                            this.loading = true
                            let data = new FormData()
                            for (const prop in this.autopsia) {
                                if (this.autopsia[prop] !== null && typeof this.autopsia.archivo !== 'undefined') data.append(`${prop}`, this.autopsia[prop])
                            }
                            let request = this.autopsia.id
                                ? this.axios.post(`autopsias/${this.autopsia.id}`, data)
                                : this.axios.post(`autopsias`, data)
                            request
                                .then(response => {
                                    this.$emit('guardado', response.data)
                                    this.$store.commit('snackbar', {color: 'success', message: `La autopsia se guardo correctamente.`})
                                    this.close()
                                })
                                .catch(error => {
                                    this.loading = false
                                    this.$store.commit('snackbar', {color: 'error', message: `al guardar la autopsia.`, error: error})
                                })
                        }
                    })
                } else {
                    this.okFallecido = this.autopsia.fallecido ? 1 : 0
                    this.okEncuestado = this.autopsia.encuestado ? 1 : 0
                }
            },
            open (idHogar = null) {
                if (idHogar) this.getHogar(idHogar)
                this.dialog = true
            },
            close () {
                if (this.actualizado) this.$store.commit('reloadTable', 'tablaHogares')
                this.dialog = false
                this.loading = false
                this.hogar = this.clone(this.makeHogar)
            },
            agregarIntegrante (integrante) {
                let hogarOriginal = this.clone(this.hogar)
                this.hogar.integrantes.push({esCabeza: this.hogar.integrantes.length ? false : true, integrante: integrante})
                let nucleo = {
                    cabeza: this.hogar.integrantes.find(x => x.esCabeza) ? this.hogar.integrantes.find(x => x.esCabeza).integrante.id : null,
                    beneficiarios: this.hogar.integrantes.find(x => !x.esCabeza) ? this.hogar.integrantes.filter(x => !x.esCabeza).map(z => z.integrante.id) : []
                }
                this.enviarNucleo(hogarOriginal, nucleo)
            },
            reloadCabeza (indexIntegrante) {
                let hogarOriginal = this.clone(this.hogar)
                this.hogar.integrantes.forEach(x => x.esCabeza = false)
                this.hogar.integrantes[indexIntegrante].esCabeza = true
                let nucleo = {
                    cabeza: this.hogar.integrantes.find(x => x.esCabeza) ? this.hogar.integrantes.find(x => x.esCabeza).integrante.id : null,
                    beneficiarios: this.hogar.integrantes.find(x => !x.esCabeza) ? this.hogar.integrantes.filter(x => !x.esCabeza).map(z => z.integrante.id) : []
                }
                this.enviarNucleo(hogarOriginal, nucleo)
            },
            quitarIntegrante (indexIntegrante) {
                let hogarOriginal = this.clone(this.hogar)
                this.hogar.integrantes = this.hogar.integrantes.filter((x, i) => i !== indexIntegrante)
                let nucleo = {
                    cabeza: this.hogar.integrantes.find(x => x.esCabeza) ? this.hogar.integrantes.find(x => x.esCabeza).integrante.id : null,
                    beneficiarios: this.hogar.integrantes.find(x => !x.esCabeza) ? this.hogar.integrantes.filter(x => !x.esCabeza).map(z => z.integrante.id) : []
                }
                this.enviarNucleo(hogarOriginal, nucleo)
            },
            enviarNucleo (hogarOriginal, nucleo) {
                this.loading = true
                this.actualizado = true
                this.axios.post(`nucleos-familiares`, nucleo)
                    .then(() => {
                        this.$store.commit('reloadTable', 'tablaPersonasSinHogar')
                        this.$store.commit('snackbar', {color: 'success', message: `El procesamiento de integrantes se realizó correctamente.`})
                        this.loading = false
                    })
                    .catch(error => {
                        this.hogar = hogarOriginal
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al guardar el registro de integrantes.`, error: error})
                    })
            },
            getHogar (idHogar) {
                this.loading = true
                this.axios.get(`nucleos-familiares/${idHogar}`)
                    .then(response => {
                        let cabeza = this.clone(response.data)
                        delete cabeza.beneficiarios
                        let integrantes = []
                        integrantes.push({esCabeza: true, integrante: cabeza})
                        response.data.beneficiarios.filter(x => x.id !== cabeza.id).forEach(x => {
                            integrantes.push({esCabeza: false, integrante: x})
                        })
                        this.hogar.integrantes = integrantes
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los integrantes del hogar.`, error: error})
                    })
            },
            resetOptions(item) {
                item.tipoIdentificacion = this.getTipoIdentificacion(item)
                item.epstext = this.getEpstext(item)
                item.options = []
                item.options.push({event: 'agregarintegrante', icon: 'mdi-plus', tooltip: 'Agregar como integrante', color: 'blue'})
                return item
            },
            getTipoIdentificacion (item) {
                return this.tiposDocumentoIdentidad && item.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : ''
            },
            getEpstext (item) {
                return this.epss && item.eps_id && this.epss.find(x => x.id === item.eps_id) ? this.epss.find(x => x.id === item.eps_id).nombre : ''
            }
        }
    }
</script>

<style scoped>

</style>