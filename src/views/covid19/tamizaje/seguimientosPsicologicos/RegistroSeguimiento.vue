<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <v-toolbar dark color="teal">
        <v-icon left>fas fa-chart-line</v-icon>
        <v-toolbar-title v-if="evolucion">
          {{ evolucion.id ? `Seguimiento Psicológico No. ${evolucion.id}` : 'Nuevo Seguimiento Psicológico' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <!--      <div-->
      <!--          :style="`right: ${$vuetify.breakpoint.xsOnly ? '84' : '104' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '4' : '14' }px !important; position: fixed !important; z-index: 2 !important;`">-->
      <!--        <v-chip-->
      <!--            color="darken-2 primary"-->
      <!--            label-->
      <!--        >-->
      <!--          <v-icon left>mdi-timer</v-icon>-->
      <!--          {{ time }}-->
      <!--        </v-chip>-->
      <!--      </div>-->
      <v-container fluid>
        <v-row no-gutters>
          <jitsi-meet ref="jitsimeet" v-if="enlinea && videollamar" :enlinea="enlinea"
                      @cargado="val => showbuttonmeet = !val"
                      @cerrar="enlinea = null, showbuttonmeet = true"></jitsi-meet>
          <v-col cols="12" md="6" v-if="enlinea"></v-col>
          <v-col md="6" :offset-md="enlinea ? '0' : '3'">
            <jitsi-meet-button v-if="videollamar" :show="showbuttonmeet" block :tamizaje="tamizaje"
                               @enlinea="val => enlinea = val"></jitsi-meet-button>
            <datos-personales
                :abierto="false"
                :tamizaje="tamizaje"
                @actualizarTamizaje="val => $emit('actualizarTamizaje', val)"
            />
            <ValidationObserver ref="formEvolucion" v-slot="{ invalid, validated, passes, validate }"
                                autocomplete="off">
              <v-row class="mt-3">
                <v-col class="pb-0" cols="12">
                  <c-date
                      v-model="evolucion.fecha_seguimiento"
                      rules="required"
                      label="Fecha del Seguimiento"
                      name="fecha del seguimiento"
                      :max="moment().format('YYYY-MM-DD')"
                  >
                  </c-date>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-select-complete
                      v-model="evolucion.lugar_atencion"
                      label="Tipo Atención"
                      rules="required"
                      name="tipo atención"
                      :items="ordenesMedicas || []"
                      item-text="orden"
                      item-value="id"
                  >
                  </c-select-complete>
                </v-col>
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                          v-model="evolucion.fallida"
                          label="¿Se localizó al paciente?"
                          :items="[{value: 0, text: 'SI'}, {value: 1, text: 'NO'}]"
                          item-text="text"
                          item-value="value"
                          :column="!$vuetify.breakpoint.smAndUp"
                      >
                      </c-radio>
                    </v-card-text>
                  </v-card>
                </v-col>
                <template v-if="evolucion.fallida === 1">
                  <v-col cols="12 pb-0">
                    <c-select-complete
                        v-model="evolucion.no_efectividad"
                        placeholder="Motivo de no localización"
                        rules="required"
                        name="motivo de no localización"
                        :items="tiposNoEfectiva || []"
                    >
                    </c-select-complete>
                  </v-col>
                </template>
                <template v-else>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-check
                            v-model="evolucion.cumplimiento_protocolos_bioseguridad"
                            label="¿DE LAS SIGUIENTES RAZONES EN EL CUMPLIMIENTO DE LOS PROTOCOLOS DE BIOSEGURIDAD ESCOJA CON CUAL DE ESTAS SE IDENTIFICA USTED?"
                            :items="protocolosBioseguridad || []"
                            rules="required"
                            name="Razones en el cumplimiento de los protocolos"
                        >
                        </c-check>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="evolucion.afectacion_mental"
                            label="¿Siente que su Salud Mental se encuentra afectada a causa de la situación actual?"
                            rules="required"
                            name="afectación de la salud mental"
                            :items="respuestasPsicologicas"
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
                            v-model="evolucion.tiene_alteracion_emocional"
                            label="¿En estas últimas semanas ha tenido alguna alteración emocional?"
                            rules="required"
                            name="tiene alteraciones emocionales"
                            :items="respuestasPsicologicas"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" v-if="evolucion.tiene_alteracion_emocional === 'Si'">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-check
                            v-model="evolucion.alteraciones_emocionales"
                            label="Alteraciones emocionales"
                            :items="alteracionesEmocionales || []"
                            rules="required"
                            name="alteraciones emocionales"
                        >
                        </c-check>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="evolucion.afectacion_emocional_familiar"
                            label="¿Su grupo familiar se encuentra afectado emocionalmente?"
                            rules="required"
                            name="afectación emocional"
                            :items="respuestasPsicologicas"
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
                            v-model="evolucion.red_apoyo_familiar"
                            label="¿Cuenta con una buena red de apoyo familiar?"
                            rules="required"
                            name="red de apoyo familiar"
                            :items="respuestasPsicologicas"
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
                            v-model="evolucion.pensamientos_negativos"
                            label="¿Ha presentado pensamientos negativos?"
                            rules="required"
                            name="pensamientos negativos"
                            :items="respuestasPsicologicas"
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
                            v-model="evolucion.desinteres_actividades_rutinarias"
                            label="¿Siente que ha perdido interés por las actividades rutinarias que realiza?"
                            rules="required"
                            name="desinteres por actividades rutinarias"
                            :items="respuestasPsicologicas"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </template>
                <v-col cols="12">
                  <c-text-area
                      v-model="evolucion.observaciones"
                      label="Valoración por Psicología"
                      rules="required"
                      name="valoración por psicología"
                  >
                  </c-text-area>
                </v-col>
              </v-row>
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
                <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                <v-btn
                    large
                    color="teal"
                    dark
                    @click.stop="guardarSeguimiento"
                >
                  <v-icon left>fas fa-save</v-icon>
                  Guardar Seguimiento
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog
          v-model="dialogConfirmFormPaciente"
          persistent
          max-width="520"
      >
        <v-card>
          <v-toolbar color="warning" dark>
            <v-toolbar-title>
              <v-icon large color="white">mdi-alert</v-icon>
              Información del paciente
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-3 body-1 text-center">El correcto diligenciamiento de la información de los pacientes,
            garantiza la eficiencia en los procesos de seguimiento de la pandemia y reportes de datos ante las entidades
            pertinentes.
          </v-card-text>
          <v-card-actions>
            <v-btn
                color="warning darken-1"
                text
                @click="dialogConfirmFormPaciente = false"
            >
              Omitir
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="permisos.datosPacienteEditar"
                color="warning darken-1"
                @click="() => {
                  $refs.modalPaciente.open(tamizaje)
                  dialogConfirmFormPaciente = false
                }"
            >
              Verificar Datos
            </v-btn>
            <v-chip v-else label color="grey" dark>
              Sin permisos para verificar
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <modal-paciente v-if="permisos.datosPacienteEditar" ref="modalPaciente"
                      @actualizado="val => $emit('actualizarTamizaje', val)"></modal-paciente>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

import DatosPersonales from 'Views/covid19/tamizaje/DatosPersonales'
import ModalPaciente from 'Views/covid19/tamizaje/paciente/ModalPaciente'

var intervalo
export default {
  name: 'RegistroSeguimiento',
  components: {
    DatosPersonales,
    ModalPaciente
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    enEdicion: false,
    permiteWatch: true,
    enlinea: null,
    showbuttonmeet: true,
    loading: false,
    dialog: false,
    evolucion: null,
    dialogConfirmFormPaciente: false
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    time() {
      let h = 0
      let m = 0
      let s = 0
      if (this && this.evolucion) {
        let initime = this.clone(this.evolucion.duracion)
        h = Math.trunc(initime / 3600)
        initime = initime - (h * 3600)
        m = Math.trunc(initime / 60)
        initime = initime - (m * 60)
        s = initime
      }
      return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
    },
    videollamar() {
      return this.$store.getters.getPermission('videollamadas')
    },
    ...mapGetters([
      'modelSeguimientoPscologico',
      'ordenesMedicas',
      'tiposNoEfectiva',
      'respuestasPsicologicas',
      'protocolosBioseguridad',
      'alteracionesEmocionales'
    ])
  },
  watch: {
    'evolucion.tiene_alteracion_emocional': {
      handler(val) {
        if (val !== 'Si') {
          this.evolucion.alteraciones_emocionales = []
        }
      },
      immediate: false
    }
  },
  created() {
    this.enEdicion = false
    this.evolucion = this.clone(this.modelSeguimientoPscologico)
    this.evolucion.fecha_seguimiento = this.moment().format('YYYY-MM-DD')
  },
  methods: {
    async guardarSeguimiento() {
      this.$refs.formEvolucion.validate().then(async result => {
        if (result) {
          this.loading = true
          if (this.evolucion.fallida) {
            let copia = this.clone(this.evolucion)
            this.evolucion = this.clone(this.modelSeguimientoPscologico)
            this.evolucion.id = copia.id
            this.evolucion.user_id = copia.user_id
            this.evolucion.tamizaje_id = copia.tamizaje_id
            this.evolucion.fecha_seguimiento = copia.fecha_seguimiento
            this.evolucion.lugar_atencion = copia.lugar_atencion
            this.evolucion.fallida = copia.fallida
            this.evolucion.no_efectividad = copia.no_efectividad
            this.evolucion.observaciones = copia.observaciones
            this.evolucion.duracion = copia.duracion
          } else {
            this.evolucion.no_efectividad = null
          }
          let protocolos = this.evolucion.cumplimiento_protocolos_bioseguridad && this.evolucion.cumplimiento_protocolos_bioseguridad.length ? this.evolucion.cumplimiento_protocolos_bioseguridad.join(',') : null
          let alteraciones = this.evolucion.alteraciones_emocionales && this.evolucion.alteraciones_emocionales.length ? this.evolucion.alteraciones_emocionales.join(',') : null
          let evolution = this.clone(this.evolucion)
          evolution.cumplimiento_protocolos_bioseguridad = protocolos
          evolution.alteraciones_emocionales = alteraciones
          this.enviarSeguimiento(evolution)
        }
      })
    },
    enviarSeguimiento(evolution) {
      this.loading = true
      let request = evolution.id
          ? this.axios.put(`seguimientos-psicologicos/${evolution.id}`, evolution)
          : this.axios.post(`seguimientos-psicologicos`, evolution)
      request
          .then(response => {
            this.$emit('guardado', response.data)
            this.$store.commit('snackbar', {color: 'success', message: `El seguimiento psicológico se guardo correctamente.`})
            this.close()
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al guardar el seguimiento psicológico.`, error: error})
          })
    },
    open() {
      if (this.tamizaje) {
        this.evolucion.tamizaje_id = this.tamizaje.id
        this.evolucion.lugar_atencion = this.tamizaje.orden_medica_id
        this.verificaInfoPaciente()
      }
      this.dialog = true
      intervalo = setInterval(() => {
        this.evolucion.duracion++
      }, 1000)
    },
    verificaInfoPaciente() {
      if (
          !this.tamizaje.tipo_identificacion
          || !this.tamizaje.identificacion
          || !this.tamizaje.nombre1
          || !this.tamizaje.apellido1
          || !this.tamizaje.sexo
          || !this.tamizaje.fecha_nacimiento || (this.tamizaje.fecha_nacimiento && !this.moment(this.tamizaje.fecha_nacimiento, 'YYYY-MM-DD').isValid())
          || (!this.tamizaje.celular || (this.tamizaje.celular.length && (String(parseInt(this.tamizaje.celular)).length > 10 || String(parseInt(this.tamizaje.celular)).length < 10)))
          || this.tamizaje.celular2 && this.tamizaje.celular2.length && (String(parseInt(this.tamizaje.celular2)).length > 10 || String(parseInt(this.tamizaje.celular2)).length < 10)
          || !this.tamizaje.departamento_id
          || !this.tamizaje.municipio_id
          || (!this.tamizaje.direccion || this.tamizaje.direccion.trim().length < 6 || (!isNaN(this.tamizaje.direccion) && this.tamizaje.direccion <= 0))
      ) {
        setTimeout(() => {
          this.dialogConfirmFormPaciente = true
        }, 500)
      }
    },
    close() {
      this.$refs.formEvolucion.reset()
      if (this.$refs && this.$refs.jitsimeet) this.$refs.jitsimeet.cerrarVideo()
      this.dialog = false
      this.loading = false
      clearInterval(intervalo)
      this.$emit('close')
      this.evolucion = this.clone(this.modelSeguimientoPscologico)
      this.evolucion.fecha_seguimiento = this.moment().format('YYYY-MM-DD')
    },
    editar(evolucion) {
      let copia = this.clone(evolucion)
      copia.cumplimiento_protocolos_bioseguridad = copia.cumplimiento_protocolos_bioseguridad ? copia.cumplimiento_protocolos_bioseguridad.split(',') : []
      copia.alteraciones_emocionales = copia.alteraciones_emocionales ? copia.alteraciones_emocionales.split(',') : []
      this.enEdicion = true
      this.permiteWatch = false
      this.loading = true
      this.evolucion = copia
      setTimeout(() => {
        this.permiteWatch = true
        this.loading = false
      }, 1000)
      this.dialog = true
    }
  }
}
</script>

<style>
.labelforce div div div label {
  padding-top: 6px !important;
  height: 26px !important;
  top: 5px !important;
}
</style>