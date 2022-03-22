<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title>
            {{
              tamizaje && tamizaje.id ? `ERP (Encuesta de Riesgo Poblacional) No. ${tamizaje.id}` : 'Nueva ERP (Encuesta de Riesgo Poblacional)'
            }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row no-gutters>
            <v-col md="6" offset-md="3">
              <ValidationObserver ref="formTamizaje" v-slot="{ invalid, validated, passes, validate }"
                                  autocomplete="off">
                <form-tamizaje
                    v-if="tamizaje"
                    :tamizaje="tamizaje"
                    :llamada="llamada"
                    @verificado="val => verificado = val"
                    :muestra-preguntas-efectividad="muestraPreguntasEfectividad"
                    :verificar-afiliado="verificarAfiliado"
                    :remplazar-afiliado-null="remplazarAfiliadoNull"
                />
                <template v-if="tamizaje && verificado === 1 && autoriza">
                  <v-row>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="tamizaje.cirugia"
                              label="¿En preparación para cirugía?"
                              rules="required"
                              name="preparación para cirugía"
                              :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          />
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="tamizaje.esquema_completo"
                              label="¿Tiene el esquema completo?"
                              rules="required"
                              name="esquema completo"
                              :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col
                        v-if="tamizaje.esquema_completo"
                        cols="12"
                    >
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="tamizaje.refuerzo"
                              label="¿Cuenta con refuerzo aplicado?"
                              rules="required"
                              name="refuerzo aplicado"
                              :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <form-sintomas
                      :array-sintomas="tamizaje.sintomas"
                      :fecha-sintomas="tamizaje.fecha_sintomas"
                      @changeSintomas="val => tamizaje.sintomas = val"
                      @changeFecha="val => tamizaje.fecha_sintomas = val"
                  />
                  <v-divider class="ma-0" v-if="tamizaje.sintomas && tamizaje.sintomas.length"></v-divider>
                  <template>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-card outlined tile>
                          <v-card-text>
                            <c-check
                                v-model="tamizaje.signos_alarma"
                                label="Signos de Alarma"
                                :items="signosAlarma ? signosAlarma.filter(x => x.aplica_covid) : []"
                                item-text="descripcion"
                                item-value="id"
                            >
                            </c-check>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <form-comorbilidades
                        :array-comorbilidades="tamizaje.comorbilidades"
                        @changeComorbilidades="val => tamizaje.comorbilidades = val"
                    ></form-comorbilidades>
                    <v-row>
                      <v-col class="pb-0" cols="12">
                        <v-checkbox
                            class="shrink mt-0 mb-1"
                            v-model="activaPR"
                            :label="activaPR ? 'Frecuencia de Pulso (PR)' : 'Toma de Frecuencia de Pulso (PR)'"
                            :ripple="!activaPR"
                            hide-details
                            @change="!activaPR ? tamizaje.frecuencia_pulso = null : ''"
                        ></v-checkbox>
                        <c-number
                            v-if="activaPR"
                            placeholder="Frecuencia de Pulso"
                            v-model="tamizaje.frecuencia_pulso"
                            name="frecuencia de pulso"
                            rules="required|min:0"
                            min="0"
                            step="1"
                        >
                        </c-number>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="pb-0" cols="12">
                        <v-checkbox
                            class="shrink mt-0 mb-1"
                            v-model="activaSPO2"
                            :label="activaSPO2 ? 'Saturación de Oxígeno (SPO2)' : 'Toma de Saturación de Oxígeno (SPO2)'"
                            :ripple="!activaSPO2"
                            hide-details
                            @change="!activaSPO2 ? tamizaje.saturacion_oxigeno = null : ''"
                        ></v-checkbox>
                        <c-number
                            v-if="activaSPO2"
                            placeholder="Saturación de Oxígeno"
                            v-model="tamizaje.saturacion_oxigeno"
                            name="saturación de oxígeno"
                            rules="required|min:0"
                            min="0"
                        >
                        </c-number>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-checkbox
                            class="shrink mt-0 mb-1"
                            v-model="activaTemperatura"
                            :label="activaTemperatura ? 'Temperatura' : 'Toma de Temperatura'"
                            :ripple="!activaTemperatura"
                            hide-details
                            @change="!activaTemperatura ? tamizaje.temperatura = null : ''"
                        ></v-checkbox>
                        <c-number
                            v-if="activaTemperatura"
                            placeholder="Temperatura"
                            v-model="tamizaje.temperatura"
                            name="temperatura"
                            suffix="°C"
                            rules="required|min:0"
                            min="0"
                        >
                        </c-number>
                      </v-col>
                    </v-row>
                  </template>
                  <v-row>
                    <v-col class="pb-0" cols="12" v-if="esMovil">
                      <c-location
                          v-model="tamizaje.coordenadas"
                          label="Coordenadas"
                          :readonly="true"
                      />
                    </v-col>

                    <v-col
                        v-if="muestraHabilitar"
                        cols="12"
                    >
                      <v-switch
                          class="mt-0"
                          label="Solicitar Toma de Muestra"
                          v-model="tamizaje.estado_prueba"
                          :false-value="null"
                          true-value="Requiere Muestra"
                          color="primary"
                          :readonly="evaluaSolicitaPrueba"
                          persistent-hint
                          :hint="evaluaSolicitaPrueba ? 'Se selecciona automáticamente según validaciones solicitadas.' : 'El control se habilita para selección manual.'"
                      />
                      <!--                      <v-switch-->
                      <!--                          class="mt-0"-->
                      <!--                          label="Solicitar Toma de Muestra"-->
                      <!--                          v-model="tamizaje.estado_prueba"-->
                      <!--                          :false-value="null"-->
                      <!--                          true-value="Requiere Muestra"-->
                      <!--                          color="primary"-->
                      <!--                          :readonly="!permisos.cambiarSolicitudTomaMuestra"-->
                      <!--                          :persistent-hint="!permisos.cambiarSolicitudTomaMuestra"-->
                      <!--                          :hint="permisos.cambiarSolicitudTomaMuestra ? '' : 'No cuenta con permisos para interacturar con el control'"-->
                      <!--                      />-->
                      <!--                      <v-switch-->
                      <!--                          v-else-->
                      <!--                          class="mt-0"-->
                      <!--                          label="Solicitar Toma de Muestra"-->
                      <!--                          value-->
                      <!--                          :input-value="tamizaje.estado_prueba === 'Requiere Muestra'"-->
                      <!--                          persistent-hint-->
                      <!--                          hint="No cuenta con permisos para interacturar con el control"-->
                      <!--                          color="primary"-->
                      <!--                          readonly-->
                      <!--                      />-->
                    </v-col>
                  </v-row>
                </template>
                <v-row v-if="tamizaje">
<!--                  <v-col-->
<!--                      v-if="tamizaje.tamizador_id === 892"-->
<!--                      cols="12"-->
<!--                      class="pb-0"-->
<!--                  >-->
<!--                    <c-input-file-->
<!--                        label="Formato de rastreo de campo"-->
<!--                        name="formato de rastreo de campo"-->
<!--                        rules="required"-->
<!--                        directory="soportesRastreo"-->
<!--                        v-model="tamizaje.soporte_rastreo"-->
<!--                        @uuid="val => tamizaje.soporte_rastreo_uuid = val"-->
<!--                    />-->
<!--                  </v-col>-->
                  <v-col cols="12" class="pb-0">
                    <c-text-area
                        v-model="tamizaje.observaciones"
                        label="Observaciones"
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
                  <p class="caption error--text mb-0 mx-2" v-if="verificado < 1">{{
                      verificado === 0 ? 'No se ha verificado la identificación de la persona' : 'No aplica para ERP'
                    }}</p>
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
      </template>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import FormComorbilidades from 'Views/covid19/tamizaje/FormComorbilidades'
import FormTamizaje from 'Views/covid19/tamizaje/FormTamizaje'
// import CInputFile from '../../../components/Inputs/CInputFile'

const FormSintomas = () => import('Views/covid19/tamizaje/FormSIntomas')
var intervalo
export default {
  name: 'RegistroTamizaje',
  components: {
    FormComorbilidades,
    FormTamizaje,
    FormSintomas,
    // CInputFile
  },
  data: () => ({
    muestraPreguntasEfectividad: true,
    loading: false,
    dialog: false,
    activaPR: true,
    activaSPO2: true,
    activaTemperatura: true,
    tamizaje: null,
    llamada: null,
    verificado: 0,
    verificarAfiliado: false,
    remplazarAfiliadoNull: true
  }),
  computed: {
    ...mapGetters([
      'modelTamizaje',
      'signosAlarma',
      'datosEmpresa'
    ]),
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    autoriza() {
      return !!(this && this.tamizaje && this.tamizaje.localiza_persona && this.tamizaje.contesta_encuesta)
    },
    time() {
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
    },
    muestraHabilitar() {
      if (this.tamizaje) {
        if (this.tamizaje.cirugia) {
          return true
        } else if (!this.tamizaje.sintomas?.length && !this.tamizaje.signos_alarma?.length && !this.tamizaje.esquema_completo && this.tamizaje.riesgo_contacto) {
          return true
        } else if (this.tamizaje.estado_gestacion_lactancia || this.tamizaje.riesgo_ocupacional) {
          return true
        } else if (this.tamizaje.edad < 3 || this.tamizaje.edad >= 60) {
          return this.tamizaje.sintomas?.length || this.tamizaje.signos_alarma?.length
        } else {
          return (this.tamizaje.sintomas?.length || this.tamizaje.signos_alarma?.length) && (this.tamizaje.comorbilidades?.length || this.tamizaje.estado_gestacion_lactancia)
        }
      } else {
        return false
      }
    },
    evaluaSolicitaPrueba() {
      if (this && this.tamizaje && this.tamizaje.localiza_persona && this.tamizaje.contesta_encuesta) {
        // if (!this.tamizaje.sintomas?.length && !this.tamizaje.signos_alarma?.length && !this.tamizaje.esquema_completo && this.tamizaje.riesgo_contacto) {
        //   return 'Requiere Muestra'
        // } else
        if ((this.tamizaje.estado_gestacion_lactancia || this.tamizaje.riesgo_ocupacional) && (this.tamizaje.sintomas?.length || this.tamizaje.signos_alarma?.length)) {
          return 'Requiere Muestra'
        } else if (this.tamizaje.edad < 3 || this.tamizaje.edad >= 60) {
          return (this.tamizaje.sintomas?.length || this.tamizaje.signos_alarma?.length) ? 'Requiere Muestra' : null
        } else {
          return ((this.tamizaje.sintomas?.length || this.tamizaje.signos_alarma?.length) && (this.tamizaje.comorbilidades?.length || this.tamizaje.estado_gestacion_lactancia)) ? 'Requiere Muestra' : null
        }
      } else {
        return null
      }
    }
    // evaluaSolicitaPrueba () {
    //   if (this && this.tamizaje && this.tamizaje.localiza_persona && this.tamizaje.contesta_encuesta) {
    //     return (this.tamizaje.riesgo_contacto || (this.tamizaje.sintomas && (this.tamizaje.sintomas.length && ((this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length) || (this.tamizaje.riesgo_procedencia || this.tamizaje.riesgo_ocupacional) || this.tamizaje.edad >= 60))) || (this.tamizaje.comorbilidades && (this.tamizaje.comorbilidades.length && ((this.tamizaje.sintomas && this.tamizaje.sintomas.length) || (this.tamizaje.riesgo_procedencia || this.tamizaje.riesgo_ocupacional) || this.tamizaje.edad >= 60))))
    //         ? 'Requiere Muestra'
    //         : null
    //   } else {
    //     return null
    //   }
    // }
  },
  watch: {
    'tamizaje.tamizador_id': {
      handler(val) {
        if (!val || val !== 892) {
          this.tamizaje.soporte_rastreo_uuid = null
          this.tamizaje.soporte_rastreo = null
        }
      },
      immediate: false
    },
    'tamizaje.esquema_completo': {
      handler(val) {
        if (!val) {
          this.tamizaje.refuerzo = null
        }
      },
      immediate: false
    },
    evaluaSolicitaPrueba: {
      handler(val) {
        if (this && this.tamizaje) {
          this.tamizaje.estado_prueba = val
        }
      },
      immediate: false
    }
  },
  methods: {
    guardarTamizaje() {
      if (!((this.tamizaje.estado_afiliado === 'RE') && (this.tamizaje.eps_id && this.tamizaje.eps_id.toString() === this.datosEmpresa.eps_id))) {
        if (!(!this.tamizaje.afiliado_id && (this.tamizaje.eps_id && this.tamizaje.eps_id.toString() === this.datosEmpresa.eps_id))) {
          this.$refs.formTamizaje.validate().then(async result => {
            if (result) {
              this.loading = true
              let tamizajeCopia = await this.clone(this.cleanTamizajeDesautorizado(this.tamizaje))
              if (tamizajeCopia.signos_alarma && tamizajeCopia.signos_alarma.length) tamizajeCopia.sintomas = tamizajeCopia.sintomas.concat(tamizajeCopia.signos_alarma)
              let request = tamizajeCopia.id
                  ? this.axios.put(`tamizajes/${tamizajeCopia.id}`, tamizajeCopia)
                  : this.axios.post(`tamizajes`, tamizajeCopia)
              !tamizajeCopia.id ? tamizajeCopia.created_at = this.moment().format('YYYY-MM-DD hh:mm:ss') : ''
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
        } else {
          this.$store.commit('snackbar', {
            color: 'warning',
            message: `La EPS seleccionada es sujeto de validación de afiliados y no se encuentra información con el documento número ${this.tamizaje.identificacion}, <strong>el registro no podrá ser guardado</strong>.`
          })
        }
      } else {
        this.$store.commit('snackbar', {
          color: 'warning',
          message: `El afiliado se encuentra como <strong>RETIRADO</strong> en la EPS seleccionada, <strong>el registro no podrá ser guardado</strong>.`
        })
      }
    },
    open(idTamizaje = null, idReporte = null, llamada = null) {
      this.dialog = true
      this.muestraPreguntasEfectividad = true
      if (idTamizaje) {
        this.getTamizaje(idTamizaje)
      } else {
        this.tamizaje = this.clone(this.modelTamizaje)
        this.activaPR = true
        this.activaSPO2 = true
        this.activaTemperatura = true
        if (idReporte) this.tamizaje.reporte_id = idReporte
        else if (llamada) {
          this.llamada = this.clone(llamada)
          this.tamizaje.tipo_tamizaje = 'telefónico'
          this.tamizaje.llamada_entrante = this.llamada.tipo === 'entrante' ? 1 : 0
          this.tamizaje.duracion = this.llamada.duracion
        }
        intervalo = setInterval(() => {
          this.tamizaje.duracion++
        }, 1000)
      }
    },
    openData(data, modulo = '') {
      console.log('daata', data)
      console.log('modulo', modulo)
      this.verificarAfiliado = (modulo === 'reporteComunitario')
      this.remplazarAfiliadoNull = !(modulo === 'reporteComunitario')
      this.dialog = true
      this.tamizaje = this.clone(data)
      this.activaPR = true
      this.activaSPO2 = true
      this.activaTemperatura = true
      intervalo = setInterval(() => {
        this.tamizaje.duracion++

      }, 1000)
    },
    close() {
      this.$refs.formTamizaje.reset()
      this.dialog = false
      this.loading = false
      this.llamada = null
      this.verificado = 0
      clearInterval(intervalo)
      this.$emit('close')
      this.tamizaje = null
      this.verificarAfiliado = false
      this.remplazarAfiliadoNull = true
    },
    getTamizaje(idTamizaje) {
      this.loading = true
      this.axios.get(`tamizajes/${idTamizaje}`)
          .then(response => {
            if (response.data && response.data.sintomas && response.data.sintomas.length) {
              let copySintomas = this.clone(response.data.sintomas)
              response.data.sintomas = response.data.sintomas.filter(a => a.aplica_covid && a.solicita_fecha).map(x => x.id)
              response.data.signos_alarma = copySintomas.filter(b => b.aplica_covid && !b.solicita_fecha).map(x => x.id)
            } else {
              response.data.sintomas = []
              response.data.signos_alarma = []
            }
            if (response.data && response.data.comorbilidades && response.data.comorbilidades.length) {
              response.data.comorbilidades = response.data.comorbilidades.map(x => x.codigo)
            }
            this.activaPR = response.data.frecuencia_pulso !== null
            this.activaSPO2 = response.data.saturacion_oxigeno !== null
            this.activaTemperatura = response.data.temperatura !== null
            // response.data.si_eps = response.data.eps_id ? 1 : 0
            response.data.si_eps = 1
            this.muestraPreguntasEfectividad = !(response.data.localiza_persona && response.data.contesta_encuesta)
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