<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-chip
                    v-if="tamizaje.tipo_tamizaje === 'telefónico'"
                    :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
                    color="primary darken-3"
                    label
            >
                <v-icon left>mdi-timer</v-icon>
                {{time}}
            </v-chip>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-file-medical</v-icon>
                <v-toolbar-title>{{tamizaje && tamizaje.id ? `ERP (Encuesta de Riesgo Poblacional) No. ${tamizaje.id}` : 'Nueva ERP (Encuesta de Riesgo Poblacional)'}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col md="6" offset-md="3">
                        <ValidationObserver ref="formTamizaje" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                            <form-tamizaje :tamizaje="tamizaje" :llamada="llamada" @verificado="val => verificado = val"></form-tamizaje>
                            <template v-if="verificado === 1">
                                <form-sintomas
                                        :array-sintomas="tamizaje.sintomas"
                                        :fecha-sintomas="tamizaje.fecha_sintomas"
                                        @changeSintomas="val => tamizaje.sintomas = val"
                                        @changeFecha="val => tamizaje.fecha_sintomas = val"
                                ></form-sintomas>
                                <v-divider v-if="tamizaje.sintomas && tamizaje.sintomas.length"></v-divider>
                                <v-row class="mt-4">
                                    <v-col class="pb-0" cols="12" v-if="esMovil">
                                        <c-location
                                                v-model="tamizaje.coordenadas"
                                                label="Coordenadas"
                                                :readonly="true"
                                        >
                                        </c-location>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="esMovil && tamizaje.tamizador_id === 892">
                                        <v-switch
                                                class="mt-0"
                                                label="Solicitar Toma de Muestra"
                                                v-model="tamizaje.estado_prueba"
                                                :false-value="null"
                                                true-value="Requiere Muestra"
                                                color="primary"
                                        ></v-switch>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <c-text-area
                                                v-model="tamizaje.observaciones"
                                                placeholder="Observaciones"
                                        >
                                        </c-text-area>
                                    </v-col>
                                </v-row>
                            </template>
                            <v-card-actions>
                                <v-btn
                                        large
                                        @click.stop="close"
                                >
                                    <v-icon>mdi-close</v-icon>
                                    Cerrar
                                </v-btn>
                                <v-spacer></v-spacer>
                                <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                                <p class="caption error--text mb-0 mx-2" v-if="verificado < 1">{{verificado === 0 ? 'No se ha verificado la identificación de la persona' : 'No aplica para ERP' }}</p>
                                <v-btn
                                        v-if="verificado === 1"
                                        large
                                        color="primary"
                                        @click.stop="guardarTamizaje"
                                >
                                    <v-icon left>fas fa-save</v-icon>
                                    Guardar ERP
                                </v-btn>
                            </v-card-actions>
                        </ValidationObserver>
                    </v-col>
                </v-row>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    const FormTamizaje = () => import('Views/covid19/tamizaje/FormTamizaje')
    const FormSintomas = () => import('Views/covid19/tamizaje/FormSIntomas')
    export default {
        name: 'RegistroTamizaje',
        components: {
            FormTamizaje,
            FormSintomas
        },
        data: () => ({
            loading: false,
            dialog: false,
            tamizaje: null,
            llamada: null,
            interval: null,
            verificado: 0
        }),
        computed: {
            ...mapGetters([
                'modelTamizaje'
            ]),
            time () {
                let h = 0
                let m = 0
                let s = 0
                if (this && this.tamizaje) {
                    let initime = this.clone(this.tamizaje.duracion)
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
            'tamizaje.tamizador_id': {
                handler (val) {
                    if (val && val !== 892) {
                        this.tamizaje.estado_prueba = null
                    }
                },
                immediate: false
            },
            'tamizaje.tipo_tamizaje': {
                handler (val) {
                    if (val && val === 'telefónico') {
                        this.$nextTick(() => {
                            this.tamizaje.duracion = 0
                            if (this.llamada) {
                                this.tamizaje.duracion = this.clone(this.llamada.duracion)
                            }
                            this.goDuracion()
                        })
                    } else {
                        clearInterval(this.interval)
                        this.tamizaje.duracion = 0
                    }
                },
                immediate: false
            }
        },
        created() {
            this.tamizaje = this.clone(this.modelTamizaje)
        },
        methods: {
            guardarTamizaje () {
                this.$refs.formTamizaje.validate().then(result => {
                    if (result) {
                        this.loading = true
                        let request = this.tamizaje.id
                            ? this.axios.put(`tamizajes/${this.tamizaje.id}`, this.tamizaje)
                            : this.axios.post(`tamizajes`, this.tamizaje)
                        request
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El tamizaje se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar el tamizaje.`, error: error})
                            })
                    }
                })
            },
            open (idTamizaje = null, idReporte = null, llamada = null) {
                if (idTamizaje) this.getTamizaje(idTamizaje)
                else if (idReporte) this.tamizaje.reporte_id = idReporte
                else if (llamada) {
                    this.llamada = this.clone(llamada)
                    this.tamizaje.tipo_tamizaje = 'telefónico'
                    this.tamizaje.llamada_entrante = this.llamada.tipo === 'entrante' ? 1 : 0
                    this.tamizaje.duracion = this.llamada.duracion
                }
                this.dialog = true
            },
            close () {
                this.$refs.formTamizaje.reset()
                this.dialog = false
                this.loading = false
                this.tamizaje = this.clone(this.modelTamizaje)
                this.llamada = null
                this.verificado = 0
                clearInterval(this.interval)
            },
            goDuracion () {
                this.interval = setInterval(() => {
                    this.tamizaje.duracion ++
                }, 1000)
            },
            getTamizaje (idTamizaje) {
                this.loading = true
                this.axios.get(`tamizajes/${idTamizaje}`)
                    .then(response => {
                        console.log('response guardado tamizaje', response)
                        if (response.data && response.data.sintomas && response.data.sintomas.length) {
                            response.data.sintomas = response.data.sintomas.map(x => x.id)
                        }
                        this.tamizaje = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar el tamizaje.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>