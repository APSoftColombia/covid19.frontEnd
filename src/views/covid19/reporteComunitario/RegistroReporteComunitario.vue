<template>
  <v-dialog
      v-model="dialog"
      persistent
      :fullscreen="!tamizaje"
      :transition="!tamizaje ? 'dialog-bottom-transition' : 'dialog-transition'"
      :max-width="tamizaje ? 720 : null"
  >
    <v-card>
<!--      <v-chip-->
<!--          v-if="reporte.tipo_reporte === 'telefónico' && !tamizaje"-->
<!--          :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"-->
<!--          color="primary darken-3"-->
<!--          label-->
<!--      >-->
<!--        <v-icon left>mdi-timer</v-icon>-->
<!--        {{ time }}-->
<!--      </v-chip>-->
      <v-toolbar dark :color="tamizaje ? 'warning' : 'primary'">
        <v-icon left>fas fa-{{ tamizaje ? 'people-arrows' : 'file-prescription' }}</v-icon>
        <v-toolbar-title>
          {{ reporte && reporte.id ? `${sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Contacto' : 'Reporte'} No. ${reporte.id}` : `Nuevo ${sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Contacto' : 'Reporte'}` }}
        </v-toolbar-title>
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
                <v-col class="pb-0" cols="12" md="6">
                  <c-select-complete
                      v-model="reporte.tipo_identificacion"
                      label="Tipo identificación"
                      name="tipo identificación"
                      :items="tiposDocumentoIdentidad"
                      item-text="descripcion"
                      item-value="id"
                      :rules="tamizaje ? 'required' : ''"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" md="6">
                  <c-texto
                      v-model="reporte.identificacion"
                      label="Identificación"
                      name="identificación"
                      :rules="tamizaje && ![13].find(x => x === reporte.tipo_identificacion) ? 'required' : ''"
                  />
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
                      :rules="!tamizaje ? 'numeric|minlength:10' : 'required|numeric|minlength:10'"
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
                      rules="numeric|max:120"
                      suffix="Años"
                      name="Edad"
                      min="0"
                      max="120"
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
                <template v-if="tamizaje">
                  <v-col class="pb-0" cols="12">
                    <c-select-complete
                        v-model="reporte.tipo_poblacion"
                        label="Tipo población"
                        rules="required"
                        name="Tipo población"
                        :items="tipoPoblaciones"
                    />
                  </v-col>
                  <v-col
                      v-if="reporte.tipo_poblacion === 'Población Asegurada'"
                      class="pb-0"
                      cols="12"
                  >
                    <c-select-complete
                        v-model="reporte.eps_id"
                        label="¿A que EPS está afiliado?"
                        name="EPS de afiliación"
                        :items="epss"
                        item-value="id"
                        item-text="nombre"
                    />
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
                            rules="required"
                            name="es conviviente"
                            label="¿Es conviviente?"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </template>
                <v-col class="pb-0" cols="12">
                  <c-text-area
                      v-model="reporte.observaciones"
                      label="Observaciones"
                  />
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
                Guardar {{ sonNexos && tamizaje ? 'Nexo' : !sonNexos && tamizaje ? 'Contacto' : 'Reporte' }}
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
    watcher: false,
    loading: false,
    dialog: false,
    reporte: null,
    tamizaje: null,
    llamada: null,
    interval: null,
    filterEpsReporte (item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.codigo + ' ' + item.nombre)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }),
  computed: {
    ...mapGetters([
      'modelReporteComunitario',
      'tiposDocumentoIdentidad',
      'departamentos',
      'sexosCovid',
      'datosEmpresa',
      'parentescos',
      'epss',
      'tipoPoblaciones'
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
    'reporte.tipo_poblacion': {
      handler(val) {
        if (val !== 'Población Asegurada') {
          this.reporte.eps_id = null
        }
      },
      immediate: false
    },
    'reporte.eps_id': {
      handler(val) {
        if (val) {
          this.reporte.tipo_poblacion = 'Población Asegurada'
        }
      },
      immediate: false
    },
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
          this.reporte.eps_id = this.reporte.eps_id ? this.reporte.eps_id : null;
          let request = this.reporte.id ? this.axios.put(`reporte_covids/${this.reporte.id}`, this.reporte) : this.axios.post(`reporte_covids`, this.reporte)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `El ${this.tamizaje ? 'nexo' : 'reporte comunitario'} se guardo correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al guardar el ${this.tamizaje ? 'nexo' : 'reporte comunitario'}.`,
                  error: error
                })
              })
        }
      })
    },
    open(reporte = null, tamizaje = null, llamada = null) {
      this.tamizaje = tamizaje
      this.dialog = true
      this.watcher = false
      if (reporte) {
        this.reporte = this.clone(reporte)
      } else if (tamizaje) {
        this.reporte.tamizaje_id = this.tamizaje.id
        this.reporte.nombre_reportante = [this.tamizaje.nombre1, this.tamizaje.nombre2, this.tamizaje.apellido1, this.tamizaje.apellido2].filter(x => x).join(' ')
        this.reporte.celular_reportante = this.tamizaje.celular
      } else if (llamada) {
        this.llamada = this.clone(llamada)
        this.reporte.tipo_reporte = 'telefónico'
        this.reporte.llamada_entrante = this.llamada.tipo === 'entrante' ? 1 : 0
        this.reporte.duracion = this.llamada.duracion
      }
      setTimeout(() => {
        this.watcher = true
      }, 500)
    },
    close() {
      this.$refs.formReporte.reset()
      this.dialog = false
      this.loading = false
      this.reporte = this.clone(this.modelReporteComunitario)
      setTimeout(() => {
        this.tamizaje = null
        this.llamada = null
        clearInterval(this.interval)
      }, 400)
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