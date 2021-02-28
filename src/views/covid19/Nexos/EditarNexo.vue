<template>
  <v-dialog
      v-model="dialog"
      persistent
      width="720"
  >
    <v-card>
      <v-chip
          v-if="reporte.tipo_reporte === 'telefónico'"
          :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
          color="primary darken-3"
          label
      >
        <v-icon left>mdi-timer</v-icon>
        {{ time }}
      </v-chip>
      <v-toolbar dark :color="'warning'">
        <v-icon left>fas fa-{{ 'file-prescription' }}</v-icon>
        <v-toolbar-title>
          Nexo No. {{ reporte.id }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col>
            <ValidationObserver ref="formReporte" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
              <v-row>
                <v-col class="pb-0" cols="12" md="6">
                  <c-identificacion
                      v-model="reporte.identificacion"
                      label="Identificación"
                  >
                  </c-identificacion>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-select-complete
                      v-model="reporte.tipo_identificacion"
                      label="Tipo identificación"
                      :items="tiposDocumentoIdentidad"
                      item-text="descripcion"
                      item-value="id"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.nombre1"
                      label="Primer Nombre"
                      rules="required"
                      name="primer nombre"
                      upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.nombre2"
                      label="Segundo Nombre"
                      upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.apellido1"
                      label="Primer Apellido"
                      rules="required"
                      name="primer apellido"
                      upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.apellido2"
                      label="Segundo Apellido"
                      upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.celular"
                      label="Celular"
                      :rules="'required|numeric'"
                      name="celular posible caso"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-select-complete
                      v-model="reporte.parentesco_id"
                      label="Parentesco"
                      rules="required"
                      name="parentesco"
                      :items="parentescos"
                      item-value="id"
                      item-text="descripcion"
                  >
                  </c-select-complete>
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
                <v-col class="pb-0" cols="12">
                  <c-texto
                      v-model="reporte.direccion"
                      label="Dirección"
                      rules="required"
                      name="dirección"
                      upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12">
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
                <v-col class="pb-0" cols="12">
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
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                          v-model="reporte.PresupuestoComun"
                          label="¿Presupuesto Común?"
                          rules="required"
                          name="presupuesto común"
                          :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
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
                          v-model="reporte.esConviviente"
                          :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                          itemValue="value"
                          itemText="text"
                          name="es conviviente"
                          label="¿Es conviviente?"
                      ></c-radio>
                    </v-card-text>
                  </v-card>
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
                  :color="'warning'"
                  @click.stop="guardarReporte"
              >
                <v-icon left>fas fa-save</v-icon>
                Guardar Nexo
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
  name: 'EditarNexo',
  data: () => ({
    watcher: false,
    loading: false,
    dialog: false,
    reporte: null,
    llamada: null,
    interval: null
  }),
  computed: {
    ...mapGetters([
      'modelReporteComunitario',
      'tiposDocumentoIdentidad',
      'departamentos',
      'sexosCovid',
      'datosEmpresa',
      'parentescos'
    ]),
    time() {
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
      handler() {
        if (this && this.watcher) {
          this.reporte.municipio_id = null
        }
      },
      immediate: false
    },
    'reporte.tipo_reporte': {
      handler(val) {
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
    guardarReporte() {
      this.$refs.formReporte.validate().then(result => {
        if (result) {
          this.loading = true
          this.axios.put(`reporte_covids/${this.reporte.id}`, this.reporte).then(response => {
                this.$emit('editado', response.data)
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Información del nexo actualizada con exito.`
                })
                this.close()
              }).catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al actualizar la informacion del nexo información`,
                  error: error
                })
              })
        }
      })
    },
    open(reporte = null) {
      this.watcher = false
      if (reporte) {
        this.reporte = this.clone(reporte)
        this.reporte.nombre_reportante = reporte.nombre_origen
        this.reporte.celular_reportante = reporte.celular_origen
      }
      this.dialog = true
      setTimeout(() => {
        this.watcher = true
      }, 500)
    },
    close() {
      this.$refs.formReporte.reset()
      this.dialog = false
      this.loading = false
      this.reporte = this.clone(this.modelReporteComunitario)
      this.llamada = null
      clearInterval(this.interval)
    },
    goDuracion() {
      this.interval = setInterval(() => {
        this.reporte.duracion++
      }, 1000)
    },
    getReporte(idReporte) {
      this.loading = true
      this.axios.get(`reportes/${idReporte}`)
          .then(response => {
            console.log('response get reporte', response)
            // this.datos = response.data.filter(x => x.geolocalizacion)
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar el reporte comunitario.`,
              error: error
            })
          })
    }
  }
}
</script>

<style scoped>

</style>