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
                          <form-sintomas
                              :array-sintomas="encuesta.sintomas"
                              @changeSintomas="val => encuesta.sintomas = val"
                              :sintomas="complementos && complementos.sintomas ? complementos.sintomas : []"
                          ></form-sintomas>
                          <v-row>
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
                                  label="Peso"
                                  rules="required|min:0"
                                  name="peso"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="encuesta.imc"
                                  label="IMC"
                                  rules="required|min:0"
                                  name="imc"
                                  min="0"
                                  :hint="hintIMC"
                              >
                              </c-number>
                            </v-col>
                          </v-row>
                          <v-subheader class="title">Quien Reporta</v-subheader>
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
    const FormSintomas = () => import('Views/aps/rcv/encuestas/componentes/FormSIntomas')
    export default {
        name: 'RegistroencuestaComunitario',
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
            'encuesta.departamento_id': {
                handler (val) {
                    if (!val) {
                        this.encuesta.municipio_id = null
                    }
                },
                immediate: false
            },
            'encuesta.tipo_encuesta': {
                handler (val) {
                    if (val && val === 'telefónico') {
                        this.$nextTick(() => {
                            this.encuesta.duracion = 0
                            if (this.llamada) {
                                this.encuesta.duracion = this.clone(this.llamada.duracion)
                            }
                            this.goDuracion()
                        })
                    } else {
                        clearInterval(this.interval)
                        this.encuesta.duracion = 0
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
                        this.axios.post(`encuesta_covids`, this.encuesta)
                            .then(response => {
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
                if (encuesta) this.getencuesta(encuesta.id)
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
          }
        }
    }
</script>

<style scoped>

</style>