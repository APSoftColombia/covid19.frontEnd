<template>
    <v-dialog
            v-model="dialog"
            persistent
            :fullscreen="!tamizaje"
            :hide-overlay="!tamizaje"
            :transition="!tamizaje ? 'dialog-bottom-transition' : ''"
            :max-width="tamizaje ? 720 : null"
    >
        <v-card>
            <v-chip
                    v-if="reporte.tipo_reporte === 'telefónico' && !tamizaje"
                    :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
                    color="primary darken-3"
                    label
            >
                <v-icon left>mdi-timer</v-icon>
                {{time}}
            </v-chip>
            <v-toolbar dark :color="tamizaje ? 'warning' : 'primary'">
                <v-icon left>fas fa-{{tamizaje ? 'people-arrows' : 'file-prescription'}}</v-icon>
                <v-toolbar-title>{{reporte && reporte.id ? `${sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Conviviente' : 'Reporte'} No. ${reporte.id}` : `Nuevo ${sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Conviviente' : 'Reporte'}`}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col :md="tamizaje ? 12: 6" :offset-md="tamizaje ? 0 : 3">
                        <ValidationObserver ref="formReporte" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                            <template v-if="!tamizaje">
                                <v-subheader class="title">Quien Reporta</v-subheader>
                                <v-row>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                                v-model="reporte.nombre_reportante"
                                                label="Nombre"
                                                rules="required"
                                                name="nombre reporta"
                                                upper-case
                                        >
                                        </c-texto>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                                v-model="reporte.celular_reportante"
                                                label="Celular"
                                                rules="required|numeric"
                                                name="celular reporta"
                                        >
                                        </c-texto>
                                    </v-col>
                                </v-row>
                                <v-divider class="ma-1"></v-divider>
                                <v-subheader class="title">Posible Caso</v-subheader>
                            </template>
                            <v-row>
                                <v-col class="pb-0" cols="12">
                                    <c-texto
                                            v-model="reporte.nombres"
                                            label="Nombre"
                                            rules="required"
                                            name="nombre posible caso"
                                            upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-texto
                                            v-model="reporte.celular"
                                            label="Celular"
                                            rules="numeric"
                                            name="celular posible caso"
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-select-complete
                                            v-model="reporte.sexo"
                                            label="Sexo"
                                            rules="required"
                                            name="sexo"
                                            :items="sexosCovid"
                                            item-value="value"
                                            item-text="text"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="6" md="6">
                                    <c-number
                                            v-model="reporte.edad"
                                            label="Edad"
                                            rules="numeric"
                                            name="Edad"
                                            min="0"
                                            step="1"
                                    >
                                    </c-number>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="12">
                                    <c-texto
                                            v-model="reporte.direccion"
                                            label="Dirección"
                                            rules="required"
                                            name="dirección"
                                            upper-case
                                    >
                                    </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="12">
                                    <c-select-complete
                                            v-model="reporte.departamento_id"
                                            label="Departamento"
                                            name="departamento"
                                            rules="required"
                                            :items="departamentos"
                                            item-text="nombre"
                                            item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="12">
                                    <c-select-complete
                                            :disabled="!reporte.departamento_id"
                                            v-model="reporte.municipio_id"
                                            label="Municipio"
                                            name="municipio"
                                            rules="required"
                                            :items="departamentos.length && reporte.departamento_id ? departamentos.find(x => x.id === reporte.departamento_id).municipios : []"
                                            item-text="nombre"
                                            item-value="id"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-text-area
                                            v-model="reporte.observaciones"
                                            label="Observaciones"
                                    >
                                    </c-text-area>
                                </v-col>
                            </v-row>
                        </ValidationObserver>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                    large
                                    @click.stop="close"
                            >
                                <v-icon>mdi-close</v-icon>
                                Cerrar
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    large
                                    :color="tamizaje ? 'warning' : 'primary'"
                                    @click.stop="guardarReporte"
                            >
                                <v-icon left>fas fa-save</v-icon>
                                Guardar {{sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Conviviente' : 'Reporte'}}
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'RegistroReporteComunitario',
      props: {
        sonNexos: {
          type: Boolean,
          default: null
        }
      },
        data: () => ({
            loading: false,
            dialog: false,
            reporte: null,
            tamizaje: null,
            llamada: null,
            interval: null
        }),
        computed: {
            ...mapGetters([
                'modelReporteComunitario',
                'departamentos',
                'sexosCovid',
                'datosEmpresa'
            ]),
            time () {
                let h = 0
                let m = 0
                let s = 0
                if (this && this.reporte) {
                    let initime = this.clone(this.reporte.duracion)
                    h = Math.trunc(initime / 3600)
                    initime = initime - (h * 3600)
                    m = Math.trunc(initime / 60)
                    initime = initime - (m * 60)
                    s = initime
                }
                return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
            }
        },
        watch: {
            'reporte.departamento_id': {
                handler (val) {
                    if (!val) {
                        this.reporte.municipio_id = null
                    }
                },
                immediate: false
            },
            'reporte.tipo_reporte': {
                handler (val) {
                    if (val && val === 'telefónico') {
                        this.$nextTick(() => {
                            this.reporte.duracion = 0
                            if (this.llamada) {
                                this.reporte.duracion = this.clone(this.llamada.duracion)
                            }
                            this.goDuracion()
                        })
                    } else {
                        clearInterval(this.interval)
                        this.reporte.duracion = 0
                    }
                },
                immediate: false
            }

        },
        created() {
            this.reporte = this.clone(this.modelReporteComunitario)
            if (this.datosEmpresa) this.reporte.departamento_id = parseInt(this.datosEmpresa.departamento_id)
        },
        methods: {
            guardarReporte () {
                this.$refs.formReporte.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.axios.post(`reporte_covids`, this.reporte)
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El ${this.tamizaje ? 'nexo' : 'reporte comunitario'} se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar el ${this.tamizaje ? 'nexo' : 'reporte comunitario'}.`, error: error})
                            })
                    }
                })
            },
            open (idReporte = null, tamizaje = null, llamada = null) {
                if (idReporte) {
                    this.getReporte(idReporte)
                } else if (tamizaje) {
                    this.tamizaje = tamizaje
                    this.reporte.tamizaje_id = this.tamizaje.id
                    this.reporte.nombre_reportante = [this.tamizaje.nombre1, this.tamizaje.nombre2, this.tamizaje.apellido1, this.tamizaje.apellido2].filter(x => x).join(' ')
                    this.reporte.celular_reportante = this.tamizaje.celular
                } else if (llamada) {
                    this.llamada = this.clone(llamada)
                    this.reporte.tipo_reporte = 'telefónico'
                    this.reporte.llamada_entrante = this.llamada.tipo === 'entrante' ? 1 : 0
                    this.reporte.duracion = this.llamada.duracion
                }
                this.dialog = true
            },
            close () {
                this.$refs.formReporte.reset()
                this.dialog = false
                this.loading = false
                this.reporte = this.clone(this.modelReporteComunitario)
                this.tamizaje = null
                this.llamada = null
                clearInterval(this.interval)
            },
            goDuracion () {
                this.interval = setInterval(() => {
                    this.reporte.duracion ++
                }, 1000)
            },
            getReporte (idReporte) {
                this.loading = true
                this.axios.get(`reportes/${idReporte}`)
                    .then(response => {
                        console.log('response get reporte', response)
                        // this.datos = response.data.filter(x => x.geolocalizacion)
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar el reporte comunitario.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>