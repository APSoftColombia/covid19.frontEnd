<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <template>
        <v-chip
            v-if="tamizaje"
            :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
            color="primary darken-3"
            label
        >
          <v-icon left>mdi-timer</v-icon>
          {{ time }}
        </v-chip>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title>
            {{ tamizaje && tamizaje.id ? `ERP (Encuesta de Riesgo Poblacional) No. ${tamizaje.id}` : 'Nueva ERP (Encuesta de Riesgo Poblacional)' }}
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
                <form-tamizaje v-if="tamizaje" :tamizaje="tamizaje" :llamada="llamada"
                               @verificado="val => verificado = val"></form-tamizaje>
                <template v-if="tamizaje && verificado === 1 && autoriza">
                  <form-sintomas
                      :array-sintomas="tamizaje.sintomas"
                      :fecha-sintomas="tamizaje.fecha_sintomas"
                      @changeSintomas="val => tamizaje.sintomas = val"
                      @changeFecha="val => tamizaje.fecha_sintomas = val"
                  ></form-sintomas>
                  <v-divider class="ma-0" v-if="tamizaje.sintomas && tamizaje.sintomas.length"></v-divider>
                  <template>
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
                  </template>
                  <v-row>
                    <v-col class="pb-0" cols="12" v-if="esMovil">
                      <c-location
                          v-model="tamizaje.coordenadas"
                          label="Coordenadas"
                          :readonly="true"
                      >
                      </c-location>
                    </v-col>
                    <v-col class="pb-0" cols="12">
                      <v-switch
                          class="mt-0"
                          label="Solicitar Toma de Muestra"
                          v-model="tamizaje.estado_prueba"
                          :false-value="null"
                          true-value="Requiere Muestra"
                          color="primary"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </template>
                <v-row v-if="tamizaje">
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
import FormTamizaje from 'Views/covid19/tamizaje/FormTamizaje'

const FormSintomas = () => import('Views/covid19/tamizaje/FormSIntomas')
var intervalo
export default {
  name: 'RegistroTamizaje',
  components: {
    FormTamizaje,
    FormSintomas
  },
  data: () => ({
    loading: false,
    dialog: false,
    activaPR: true,
    activaSPO2: true,
    activaTemperatura: true,
    tamizaje: null,
    llamada: null,
    verificado: 0
  }),
  computed: {
    ...mapGetters([
      'modelTamizaje',
      'signosAlarma',
    ]),
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
    }
  },
  methods: {
    guardarTamizaje() {
      this.$refs.formTamizaje.validate().then(async result => {
        if (result) {
          this.loading = true
          let tamizajeCopia = await this.clone(this.cleanTamizajeDesautorizado(this.tamizaje))
          if(tamizajeCopia.signos_alarma && tamizajeCopia.signos_alarma.length) tamizajeCopia.sintomas = tamizajeCopia.sintomas.concat(tamizajeCopia.signos_alarma)
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
    },
    open(idTamizaje = null, idReporte = null, llamada = null) {
      this.dialog = true
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
    close() {
      this.$refs.formTamizaje.reset()
      this.dialog = false
      this.loading = false
      this.llamada = null
      this.verificado = 0
      clearInterval(intervalo)
      this.tamizaje = null
      // setTimeout(() => {
      //     // this.tamizaje = this.clone(this.modelTamizaje)
      // }, 400)
    },
    getTamizaje(idTamizaje) {
      this.loading = true
      this.axios.get(`tamizajes/${idTamizaje}`)
          .then(response => {
            console.log('response guardado tamizaje', response)
            if (response.data && response.data.sintomas && response.data.sintomas.length) {
              let copySintomas = this.clone(response.data.sintomas)
              response.data.sintomas = response.data.sintomas.filter(a => a.aplica_covid && a.solicita_fecha).map(x => x.id)
              response.data.signos_alarma = copySintomas.filter(b => b.aplica_covid && !b.solicita_fecha).map(x => x.id)
            }
            this.activaPR = response.data.frecuencia_pulso !== null
            this.activaSPO2 = response.data.saturacion_oxigeno !== null
            this.activaTemperatura = response.data.temperatura !== null
            response.data.si_eps = response.data.eps_id ? 1 : 0
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