<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>mdi-bus-marker</v-icon>
                <v-toolbar-title>{{tamizaje && tamizaje.id ? `ERP (Encuesta de Riesgo Poblacional) Viajero No. ${tamizaje.id}` : 'Nueva ERP (Encuesta de Riesgo Poblacional) Viajero'}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col md="6" offset-md="3">
                        <ValidationObserver ref="formTamizajeViajero" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                            <v-row v-if="tamizaje">
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                            v-model="tamizaje.infoviajero.lugar"
                                            label="Lugar Encuesta"
                                            rules="required"
                                            name="lugar encuesta"
                                            :items="lugarEncuestas"
                                            :clearable="false"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12" v-if="puntoControl">
                                    <c-select-complete
                                            v-model="tamizaje.infoviajero.punto_conteo_id"
                                            label="Punto de Control"
                                            rules="required"
                                            name="punto de control"
                                            :items="puntosControl || []"
                                            item-text="title"
                                            item-value="id"
                                            :clearable="false"
                                    >
                                    </c-select-complete>
                                </v-col>
                                <v-col class="pb-0" cols="12">
                                    <c-select-complete
                                            v-if="casanare"
                                            :disabled="!tamizaje.infoviajero.lugar"
                                            :readonly="puntoFluvial || puntoAereo"
                                            v-model="tamizaje.infoviajero.municipio_control"
                                            label="Municipio Encuesta"
                                            rules="required"
                                            name="municipio encuesta"
                                            :items="divipol"
                                            item-value="id"
                                            item-text="nombre"
                                            :clearable="false"
                                    >
                                    </c-select-complete>
                                    <c-select-complete
                                            v-else
                                            :disabled="!tamizaje.infoviajero.lugar"
                                            v-model="tamizaje.infoviajero.municipio_control"
                                            label="Municipio Encuesta"
                                            rules="required"
                                            name="municipio encuesta"
                                            :items="divipol"
                                            item-value="id"
                                            item-text="nombre"
                                            :clearable="false"
                                    >
                                    </c-select-complete>
                                </v-col>
                            </v-row>
                            <form-tamizaje v-if="tamizaje" tipo="viajero" :tamizaje="tamizaje" @verificado="val => verificado = val"></form-tamizaje>
                            <template v-if="tamizaje && verificado === 1 && autoriza">
                                <v-row>
                                    <v-col class="pb-0" cols="12">
                                        <c-select-complete
                                                v-model="tamizaje.infoviajero.pais_procedencia"
                                                label="Pais Procedencia"
                                                rules="required"
                                                name="pais procedencia"
                                                :items="paises"
                                                item-text="nombre"
                                                item-value="id"
                                                :clearable="false"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <template v-if="!vieneExterior">
                                        <v-col class="pb-0" cols="12">
                                            <c-select-complete
                                                    v-model="tamizaje.infoviajero.departamento_procedencia"
                                                    label="Departamento Procedencia"
                                                    rules="required"
                                                    name="departamento procedencia"
                                                    :items="departamentos"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    :clearable="false"
                                            >
                                            </c-select-complete>
                                        </v-col>
                                        <v-col class="pb-0" cols="12">
                                            <c-select-complete
                                                    :disabled="!tamizaje.infoviajero.departamento_procedencia"
                                                    v-model="tamizaje.infoviajero.municipio_procedencia"
                                                    label="Municipio Procedencia"
                                                    rules="required"
                                                    name="municipio procedencia"
                                                    :items="departamentos.length && tamizaje.infoviajero.departamento_procedencia ? departamentos.find(x => x.id === tamizaje.infoviajero.departamento_procedencia).municipios : []"
                                                    item-text="nombre"
                                                    item-value="id"
                                                    :clearable="false"
                                            >
                                            </c-select-complete>
                                        </v-col>
                                    </template>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="tamizaje.infoviajero.transporte_llegada"
                                                        label="Medio de transporte en el que llega"
                                                        rules="required"
                                                        name="medio transporte llegada"
                                                        :items="puntoAereo ? mediosTransporte.filter(x => x.value === 'Aereo') : puntoFluvial ? mediosTransporte.filter(x => x.value === 'Fluvial') : puntoTerminal ? mediosTransporte.filter(x => x.value === 'Terrestre Público') : puntoControl ? mediosTransporte.filter(x => x.value !== 'Aereo' && x.value !== 'Fluvial') : mediosTransporte"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="!puntoAereo && !puntoFluvial">
                                        <c-texto
                                                v-model="tamizaje.infoviajero.placa"
                                                label="Placa Vehículo"
                                        >
                                        </c-texto>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                                v-model="tamizaje.infoviajero.empresa"
                                                label="Empresa Transportadora"
                                        >
                                        </c-texto>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" v-if="tamizaje.infoviajero.transporte_llegada === 'Aereo'">
                                        <c-texto
                                                v-model="tamizaje.infoviajero.numero_vuelo"
                                                label="Número Vuelo"
                                        >
                                        </c-texto>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-select-complete
                                                v-model="tamizaje.infoviajero.departamento_destino"
                                                label="Departamento Destino"
                                                rules="required"
                                                name="departamento destino"
                                                :items="departamentos"
                                                item-text="nombre"
                                                item-value="id"
                                                :clearable="false"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-select-complete
                                                :disabled="!tamizaje.infoviajero.departamento_destino"
                                                v-model="tamizaje.infoviajero.municipio_destino"
                                                label="Municipio Destino"
                                                rules="required"
                                                name="municipio destino"
                                                :items="departamentos.length && tamizaje.infoviajero.departamento_destino ? departamentos.find(x => x.id === tamizaje.infoviajero.departamento_destino).municipios : []"
                                                item-text="nombre"
                                                item-value="id"
                                                :clearable="false"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="tamizaje.infoviajero.transporte_destino"
                                                        label="Medio de transporte en el que va al destino"
                                                        rules="required"
                                                        name="medio transporte destino"
                                                        :items="tamizaje.infoviajero.municipio_control === 400 ? mediosTransporte.filter(x => x.value !== 'Fluvial') : tamizaje.infoviajero.municipio_control === 389 ? mediosTransporte.filter(x => x.value !== 'Aereo') : mediosTransporte.filter(x => x.value !== 'Aereo' && x.value !== 'Fluvial')"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-texto
                                                v-model="tamizaje.infoviajero.direccion_permanencia"
                                                label="Dirección de Permanencia"
                                                rules="required"
                                                name="dirección de permanencia"
                                                upper-case
                                        >
                                        </c-texto>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <c-number
                                                v-model="tamizaje.infoviajero.temperatura"
                                                label="Temperatura"
                                                rules="required|min:0|max:50"
                                                name="temperatura"
                                                min="0"
                                                max="50"
                                                suffix="°C"
                                                :clearable="false"
                                        >
                                        </c-number>
                                    </v-col>
                                </v-row>
                                <form-sintomas
                                        :array-sintomas="tamizaje.sintomas"
                                        :fecha-sintomas="tamizaje.fecha_sintomas"
                                        @changeSintomas="val => tamizaje.sintomas = val"
                                        @changeFecha="val => tamizaje.fecha_sintomas = val"
                                        :class="tamizaje.sintomas.length ? '' : 'pb-3'"
                                ></form-sintomas>
                                <v-row>
                                    <v-col cols="12" v-if="vieneExterior">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="tamizaje.infoviajero.aislamiento"
                                                        label="¿Al ingresar al País fue reseñado para aislamiento?"
                                                        rules="required"
                                                        name="reseñado para aislamiento"
                                                        :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </template>
                            <v-row v-if="tamizaje">
                              <v-col cols="12" class="pb-0">
                                <c-text-area
                                    v-model="tamizaje.observaciones"
                                    placeholder="Observaciones"
                                >
                                </c-text-area>
                              </v-col>
                            </v-row>
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
        name: 'RegistroViajero',
        components: {
            FormTamizaje,
            FormSintomas
        },
        data: () => ({
            verificado: 0,
            loading: false,
            dialog: false,
            tamizaje: null,
            puntosControl: []
        }),
        computed: {
            vieneExterior () {
              return this.tamizaje && this.tamizaje.infoviajero.pais_procedencia !== 44
            },
            puntoAereo () {
                return this.tamizaje && this.tamizaje.infoviajero.lugar === 'Aeropuerto'
            },
            puntoFluvial () {
                return this.tamizaje && this.tamizaje.infoviajero.lugar === 'Puerto Fluvial'
            },
            puntoTerminal () {
                return this.tamizaje && this.tamizaje.infoviajero.lugar === 'Terminal Terrestre'
            },
            puntoControl () {
                return this.tamizaje && this.tamizaje.infoviajero.lugar === 'Punto de Control'
            },
            ...mapGetters([
                'modelTamizaje',
                'modelViajero',
                'lugarEncuestas',
                'mediosTransporte',
                'divipol',
                'paises',
                'departamentos',
                'datosEmpresa'
            ]),
            casanare () {
                return this && this.datosEmpresa && this.datosEmpresa.departamento_id === 11
            },
            autoriza () {
              return !!(this && this.tamizaje && this.tamizaje.localiza_persona && this.tamizaje.contesta_encuesta)
            }
        },
        watch: {
            'vieneExterior': {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val) {
                            this.tamizaje.infoviajero.departamento_procedencia = null
                        } else {
                            this.tamizaje.infoviajero.aislamiento = null
                        }
                    }
                },
                immediate: false
            },
            puntoAereo: {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val) {
                            this.$nextTick(() => {
                                this.tamizaje.infoviajero.municipio_control = this.casanare ? 400 : null
                                this.tamizaje.infoviajero.transporte_llegada = 'Aereo'
                                this.tamizaje.infoviajero.placa = null
                            })
                        }
                    }
                },
                immediate: false
            },
            puntoFluvial: {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val) {
                            this.$nextTick(() => {
                                this.tamizaje.infoviajero.municipio_control = this.casanare ? 389 : null
                                this.tamizaje.infoviajero.transporte_llegada = 'Fluvial'
                                this.tamizaje.infoviajero.placa = null
                            })
                        }
                    }
                },
                immediate: false
            },
            puntoTerminal: {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val) {
                            this.$nextTick(() => {
                                this.tamizaje.infoviajero.transporte_llegada = 'Terrestre Público'
                            })
                        }
                    }
                },
                immediate: false
            },
            puntoControl: {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val) {
                            this.$nextTick(() => {
                                this.tamizaje.infoviajero.transporte_llegada = null
                            })
                        } else {
                            this.$nextTick(() => {
                                this.tamizaje.infoviajero.punto_conteo_id = null
                            })
                        }
                    }
                },
                immediate: false
            },
            'tamizaje.infoviajero.lugar': {
                handler () {
                    if (this && this.tamizaje) {
                        this.$nextTick(() => {
                            this.tamizaje.infoviajero.municipio_destino = null
                            this.tamizaje.infoviajero.transporte_destino = null
                        })
                    }
                },
                immediate: false
            },
            'tamizaje.infoviajero.municipio_destino': {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val && val === this.tamizaje.infoviajero.municipio_control) {
                            this.tamizaje.infoviajero.transporte_destino = this.tamizaje.infoviajero.transporte_llegada
                        }
                    }
                },
                immediate: false
            },
            'tamizaje.infoviajero.departamento_procedencia': {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (!val) {
                            this.tamizaje.infoviajero.municipio_procedencia = null
                        }
                    }
                },
                immediate: false
            },
            'tamizaje.infoviajero.transporte_llegada': {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (val !== 'Aereo') {
                            this.tamizaje.infoviajero.numero_vuelo = null
                        }
                    }
                },
                immediate: false
            },
            'tamizaje.infoviajero.departamento_destino': {
                handler (val) {
                    if (this && this.tamizaje) {
                        if (!val) {
                            this.tamizaje.infoviajero.municipio_destino = null
                        }
                    }
                },
                immediate: false
            }

        },
        created() {
            // this.assign()
            this.getPuntosCotrol()
        },
        methods: {
            assign () {
                // this.tamizaje = this.clone(this.modelTamizaje)
                // this.tamizaje.infoviajero = this.clone(this.modelViajero)
                // if (this.datosEmpresa) this.tamizaje.infoviajero.departamento_destino = parseInt(this.datosEmpresa.departamento_id)
            },
            guardarTamizaje () {
                this.$refs.formTamizajeViajero.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.tamizaje.tamizador_id = 891
                        this.tamizaje.tipo_tamizaje = 'presencial'
                        let request = this.tamizaje.id
                            ? this.axios.put(`tamizaje-viajeros/${this.tamizaje.id}`, this.tamizaje)
                            : this.axios.post(`tamizaje-viajeros`, this.tamizaje)
                        request
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El tamizaje viajero se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar el tamizaje viajero.`, error: error})
                            })
                    }
                })
            },
            open (idViajero = null) {
                this.dialog = true
                if (idViajero) {
                    this.getViajero(idViajero)
                } else {
                    this.tamizaje = this.clone(this.modelTamizaje)
                    this.tamizaje.infoviajero = this.clone(this.modelViajero)
                    if (this.datosEmpresa) this.tamizaje.infoviajero.departamento_destino = parseInt(this.datosEmpresa.departamento_id)
                }
            },
            close () {
                this.$refs.formTamizajeViajero.reset()
                this.dialog = false
                this.loading = false
                // this.assign()
                this.tamizaje = null
                this.verificado = 0
            },
            getViajero (idViajero) {
                this.loading = true
                this.axios.get(`tamizajes/${idViajero}`)
                    .then(response => {
                        if (response.data && response.data.sintomas && response.data.sintomas.length) {
                            response.data.sintomas = response.data.sintomas.map(x => x.id)
                        }
                      // response.data.localiza_persona = 1
                      // response.data.contesta_encuesta = 1
                        response.data.si_eps = response.data.eps_id ? 1 : 0
                        this.tamizaje = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar el tamizaje de viajero.`, error: error})
                    })
            },
            getPuntosCotrol () {
                this.axios.get(`conteo-vehiculos`)
                    .then(response => {
                        if (response.data && response.data.length) {
                            response.data.map(x => {
                                x.title = `${x.punto} - ${x.ubicacion}`
                            })
                        }
                        this.puntosControl = response.data
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los puntos de control.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>