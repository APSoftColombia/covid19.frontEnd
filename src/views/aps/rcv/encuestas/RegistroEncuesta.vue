<template>
    <v-dialog
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
    >
        <v-card>
            <v-chip
                    :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
                    color="primary darken-3"
                    label
            >
                <v-icon left>mdi-timer</v-icon>
                {{time}}
            </v-chip>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-edit</v-icon>
                <v-toolbar-title>{{encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Nueva encuesta`}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <v-col md="6" offset-md="3">
                        <ValidationObserver ref="formencuesta" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                          <v-row v-if="encuestaBase">
                            <v-col cols="12">
                              <v-list two-line>
                                <v-list-item class="pa-0">
                                  <v-list-item-avatar color="cyan" size="50">
                                    <v-icon large color="white">{{encuestaBase.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                                  </v-list-item-avatar>
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title class="body-2 font-weight-bold text-truncate">
                                      {{encuestaBase.nombre}}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="body-2 text-truncate">{{encuestaBase.tipoIdentificacion}} {{encuestaBase.identificacion}}{{encuestaBase.celular ? ', Cel. ' + encuestaBase.celular : ''}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="px-0 pb-0">
                              <v-system-bar
                                  dark
                                  color="indigo"
                                  :height="40"
                                  :window="true"
                              >
                                <v-icon>fas fa-bookmark</v-icon>
                                <span>AMBITO DE ATENCIÓN INMEDITA</span>
                              </v-system-bar>
                            </v-col>
                            <v-col cols="12" class="pt-0">
                              <form-sintomas
                                  :array-sintomas="encuesta.sintomas"
                                  @changeSintomas="val => encuesta.sintomas = val"
                                  :sintomas="complementos && complementos.sintomas ? complementos.sintomas : []"
                              ></form-sintomas>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="px-0 pb-0">
                              <v-system-bar
                                  dark
                                  color="indigo"
                                  :height="40"
                                  :window="true"
                              >
                                <v-icon>fas fa-bookmark</v-icon>
                                <span>AMBITO PREVENCIÓN DE LA ENFERMEDAD</span>
                              </v-system-bar>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                              <v-label class="font-weight-bold font-weight-black">2. Conoce usted su peso y talla?. (Registrar e identificar IMC)</v-label>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="encuesta.peso"
                                  label="Peso"
                                  rules="required|min:0"
                                  name="peso"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="encuesta.talla"
                                  label="Talla"
                                  rules="required|min:0"
                                  name="talla"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-number
                                  v-model="encuesta.imc"
                                  label="IMC"
                                  rules="required|min:0"
                                  name="imc"
                                  min="0"
                                  :hint="hintIMC"
                                  readonly
                                  :clearable="false"
                              >
                              </c-number>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="pb-0">
                              <v-label class="font-weight-bold font-weight-black">3. Se ha tomado la tensión arterial el día de hoy? (Registrar e identificar riesgo)</v-label>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="encuesta.sistolica"
                                  label="Presión Sistólica"
                                  rules="required|min:0"
                                  name="presión sitólica"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="encuesta.diastolica"
                                  label="Presión Diastólica"
                                  rules="required|min:0"
                                  name="presión diastólica"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  :value="encuesta.sistolica && encuesta.diastolica ? `${encuesta.sistolica}/${encuesta.diastolica}` : ''"
                                  label="Tensión Arterial"
                                  rules="required"
                                  name="tensión arterial"
                                  :hint="hintTension"
                                  readonly
                                  :clearable="false"
                              >
                              </c-texto>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.actividad_fisica"
                                      label="4. ¿Realiza diariamente al menos 30 minutos de actividad física, en el trabajo y/o en el tiempo libre?"
                                      rules="required"
                                      name="actividad física"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.frutas_verduras"
                                      label="5. ¿Con qué frecuencia come verduras o frutas?"
                                      rules="required"
                                      name="ingesta de frutas y verduras"
                                      :items="complementos && complementos.frutas_verduras ? complementos.frutas_verduras.map(x => {return {value: x, text: x}}) : []"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.medicacion_hta"
                                      label="6. ¿Toma medicación para la hipertensión regularmente?"
                                      rules="required"
                                      name="medicación para la hipertensión"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.antecedente_glucosa"
                                      label="7. ¿Le han encontrado alguna vez valores de azucar altos?"
                                      rules="required"
                                      name="azucar alta"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.familiares_diabetes"
                                      label="8. ¿Se le ha diagnosticado diabetes (tipo 1 o tipo 2) a alguno de sus familiares allegados u otros parientes?"
                                      rules="required"
                                      name="familiares con diabetes"
                                      :items="complementos && complementos.familiares_diabetes ? complementos.familiares_diabetes.map(x => {return {value: x, text: x}}) : []"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.diabetes"
                                      label="9. Es usted diabetico?"
                                      rules="required"
                                      name="diabetico"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                      :column="!$vuetify.breakpoint.smAndUp"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-expand-x-transition>
                              <v-col cols="12" v-if="encuesta.diabetes === 'Si'">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.tipo_diabetes"
                                        label="10. Tipo de diabetes"
                                        rules="required"
                                        name="tipo de diabetes"
                                        :items="complementos && complementos.tipo_diabetes ? complementos.tipo_diabetes.map(x => {return {value: x, text: x}}) : []"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-expand-x-transition>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.fumador"
                                      label="11. Fuma?"
                                      rules="required"
                                      name="fuma"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                      :column="!$vuetify.breakpoint.smAndUp"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.diagnosticado_rcv"
                                      label="12. Tiene diagnosticado ya una enfermedad cardiovascular (HTA-IAM-ACV-RENAL)"
                                      rules="required"
                                      name="diagnosticado RCV"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" class="px-0 pb-0">
                              <v-system-bar
                                  dark
                                  color="indigo"
                                  :height="40"
                                  :window="true"
                              >
                                <v-icon>fas fa-bookmark</v-icon>
                                <span>AMBITO DE ATECIÓN AMBULATORIA</span>
                              </v-system-bar>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.consulta_medicina_g"
                                      label="9. Señor usuario cuando fue su ultima consulta por medicina general?  (Registrar e identificar riesgo)"
                                      rules="required"
                                      name="consulta por medicina general"
                                      :items="complementos && complementos.consulta_medicina_g ? complementos.consulta_medicina_g.map(x => {return {value: x, text: x}}) : []"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.consulta_medicina_i"
                                      label="10. Señor usuario cuando fue su última consulta por medicina interna?"
                                      rules="required"
                                      name="consulta por medicina interna"
                                      :items="complementos && complementos.consulta_medicina_i ? complementos.consulta_medicina_i.map(x => {return {value: x, text: x}}) : []"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.laboratorios"
                                      label="11. Señor usuario cuando fue la ultima vez que le tomaron laboratorios clinicos, recuerda que examenes le tomaron?"
                                      rules="required"
                                      name="toma de laboratorios"
                                      :items="complementos && complementos.laboratorios ? complementos.laboratorios.map(x => {return {value: x, text: x}}) : []"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-card outlined tile>
                                <v-card-text>
                                  <c-radio
                                      v-model="encuesta.formula_hta_dm"
                                      label="12. Señor usuario actualmente su medico tratante le ha formulado medicamentos para la HTA y/o DM?"
                                      rules="required"
                                      name="formulación de medicamentos"
                                      :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                      item-text="text"
                                      item-value="value"
                                  >
                                  </c-radio>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-expand-transition>
                              <v-col v-if="encuesta.formula_hta_dm === 'Si'" cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.tiene_medicamentos"
                                        label="13. Cuenta con medicamentos actualmente?"
                                        rules="required"
                                        name="tiene medicamentos"
                                        :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-expand-transition>
                            <v-expand-transition>
                              <v-col v-if="encuesta.formula_hta_dm === 'Si'" cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <v-label>14. Me puede indicar cuando fue la ultima entrega de medicamentos? y/o para cuando tiene programada la proxima entrega?</v-label>
                                    <c-date
                                        v-model="encuesta.entrega_medicamentos"
                                        rules="required"
                                        placeholder="Última entrega de medicamentos"
                                        name="última entrega de medicamentos"
                                    >
                                    </c-date>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-expand-transition>
                          </v-row>
                          <v-expand-transition>
                            <v-row v-if="encuesta.formula_hta_dm === 'Si'">
                              <v-col cols="12" class="px-0 pb-0">
                                <v-system-bar
                                    dark
                                    color="indigo"
                                    :height="40"
                                    :window="true"
                                >
                                  <v-icon>fas fa-bookmark</v-icon>
                                  <span>EVALUACIÓN ADHERENCIA AL TRATAMIENTO (Test Morisky Green)</span>
                                </v-system-bar>
                              </v-col>
                              <v-col cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.interrumpe_tto"
                                        label="15. ¿Deja de tomar alguna vez los medicamentos para tratar su enfermedad?"
                                        rules="required"
                                        name="interrumpe toma de medicamentos"
                                        :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.a_tiempo_tto"
                                        label="16. Toma los medicamentos a las horas indicadas?"
                                        rules="required"
                                        name="toma medicamentos a la hora indicada"
                                        :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.suspende_mejora_tto"
                                        label="17. Cuando se encuentra bien, ¿deja de tomar la medicación? "
                                        rules="required"
                                        name="suspende medicamentos al encontrarse bien"
                                        :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12">
                                <v-card outlined tile>
                                  <v-card-text>
                                    <c-radio
                                        v-model="encuesta.suspende_adverso_tto"
                                        label="18. Si le cae mal un medicamento, ¿deja usted de tomarlo?"
                                        rules="required"
                                        name="suspende medicamento cuando este le cae mal"
                                        :items="[{value: 'Si', text: 'SI'}, {value: 'No', text: 'NO'}]"
                                        item-text="text"
                                        item-value="value"
                                    >
                                    </c-radio>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-expand-transition>
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
                                    color="primary"
                                    @click.stop="guardarencuesta"
                            >
                                <v-icon left>fas fa-save</v-icon>
                                Guardar encuesta
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
    const FormSintomas = () => import('Views/aps/rcv/encuestas/components/FormSIntomas')
    export default {
        name: 'RegistroEncuesta',
      components: {
        FormSintomas
      },
        data: () => ({
            loading: false,
            dialog: false,
            encuesta: null,
            encuestaBase: null,
            interval: null,
            hintIMC: '',
            hintTension: '',
            complementos: []
        }),
        computed: {
            ...mapGetters([
                'modelEncuestaRCV'
            ]),
            time () {
                let h = 0
                let m = 0
                let s = 0
                if (this && this.encuesta) {
                    let initime = this.clone(this.encuesta.duracion)
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
            'encuesta.peso': {
                handler () {
                  this.getIMC()
                },
                immediate: false
            },
            'encuesta.talla': {
                handler () {
                  this.getIMC()
                },
                immediate: false
            },
            'encuesta.diastolica': {
              handler () {
                this.getTension()
              },
              immediate: false
            },
            'encuesta.sistolica': {
              handler () {
                this.getTension()
              },
              immediate: false
            },
          'encuesta.formula_hta_dm': {
              handler (val) {
                if (!val || val === 'No') {
                  this.encuesta.tiene_medicamentos = null
                  this.encuesta.entrega_medicamentos = null
                  this.encuesta.interrumpe_tto = null
                  this.encuesta.a_tiempo_tto = null
                  this.encuesta.suspende_mejora_tto = null
                  this.encuesta.suspende_mejora_tto = null
                }
              },
              immediate: false
            },
          'encuesta.diabetes': {
              handler (val) {
                if (!val || val === 'No') {
                  this.encuesta.tipo_diabetes = null
                }
              },
              immediate: false
            }
        },
        created() {
            this.encuesta = this.clone(this.modelEncuestaRCV)
        },
        methods: {
            guardarencuesta () {
                this.$refs.formencuesta.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.axios.post(`rcvs`, this.encuesta)
                            .then(response => {
                              console.log('response encuesta', response)
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `La encuesta se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar la encuesta.`, error: error})
                            })
                    }
                })
            },
            open (encuesta = null) {
                this.getComplementos()
                this.encuestaBase = encuesta
                if (this.encuestaBase && this.encuestaBase.id) {
                  this.getencuesta(this.encuestaBase.id)
                } else {
                  this.encuesta.afiliado_id = this.encuestaBase.id_afiliado
                  this.encuesta.id_afiliado = this.encuestaBase.id_afiliado
                }
                this.dialog = true
                this.goDuracion()
            },
            close () {
                this.$refs.formencuesta.reset()
                this.dialog = false
                this.loading = false
                clearInterval(this.interval)
                this.encuesta = this.clone(this.modelEncuestaRCV)
                this.encuestaBase = null
                this.hintIMC = ''
                this.hintTension = ''
            },
            goDuracion () {
                this.interval = setInterval(() => {
                    this.encuesta.duracion ++
                }, 1000)
            },
          getComplementos () {
            this.axios.get(`complementos-rcv`)
                .then(response => {
                  console.log('response get encuesta', response)
                  this.complementos = response.data
                })
                .catch(error => {
                  this.$store.commit('snackbar', {color: 'error', message: `al recuperar los complementos para la encuesta.`, error: error})
                })
          },
            getencuesta (idencuesta) {
                this.loading = true
                this.axios.get(`rcvs/${idencuesta}`)
                    .then(response => {
                        console.log('response get encuesta', response)
                        // this.datos = response.data.filter(x => x.geolocalizacion)
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                    })
            },
          getIMC () {
            if (Number(this.encuesta.peso) && Number(this.encuesta.talla)) {
              let resultado = Number((this.encuesta.peso / Math.pow(this.encuesta.talla, 2)).toFixed(2))
              if (resultado < 18.5) this.hintIMC = 'Peso inferior al normal'
              if (resultado >= 18.5 && resultado < 25) this.hintIMC = 'Normal'
              if (resultado >= 25 && resultado < 30) this.hintIMC = 'Peso superior al normal'
              if (resultado >= 30 && resultado < 35) this.hintIMC = 'Obesidad'
              if (resultado >= 35) this.hintIMC = 'Obesidad Morbida'
              this.encuesta.imc = resultado
            } else {
              this.encuesta.imc = null
            }
          },
          getTension () {
            if (Number(this.encuesta.sistolica) && Number(this.encuesta.diastolica)) {
              if (this.encuesta.sistolica >= 140 || this.encuesta.diastolica >= 90) {
                this.hintTension = 'Con hipertensión'
              } else {
                this.hintTension = 'Tensión Controlada'
              }
            } else {
              this.hintTension = ''
            }
          }
        }
    }
</script>

<style scoped>

</style>