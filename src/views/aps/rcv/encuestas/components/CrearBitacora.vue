<template>
  <v-dialog
      v-model="dialogNuevaBitacora"
      max-width="1200px"
      transition="dialog-bottom-transition"
      persistent
  >
    <v-toolbar dark color="primary">
      <v-toolbar-title>
        {{ bitacora.id ? 'Editar Seguimiento RCV' : 'Crear Seguimiento RCV' }}
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
          icon
          dark
          @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <ValidationObserver
        ref="formBitacora"
        v-slot="{ invalid, validated, passes, validate }"
    >
      <v-card>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="6">
                <c-date
                    v-model="bitacora.fecha"
                    placeholder="Fecha de seguimiento"
                    :max="moment().format('YYYY-MM-DD')"
                    rules="required"
                    name="fecha bitacora"
                />
              </v-col>
              <v-col cols="6">
                <c-texto
                    v-model="bitacora.periodicidad_seguimientos"
                    label="Periodicidad (meses)"
                    name="periodicidad"
                    rules="required|numeric"
                    upper-case
                />
              </v-col>
              <v-col cols="12">
                <c-text-area
                    label="Bitacora"
                    v-model="bitacora.bitacora"
                    name="bitacora"
                    rules="required"
                />
              </v-col>
              <v-col cols="4">
                <ValidationProvider
                    name="alerta"
                    rules="required"
                    v-slot="{ errors }"
                >
                  <v-checkbox
                      v-model="bitacora.alerta"
                      label="Alerta"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="4">
                <ValidationProvider
                    name="alerta inmediata"
                    rules="required"
                    v-slot="{ errors }"
                >
                  <v-checkbox
                      v-model="bitacora.alerta_inmediata"
                      label="Alerta inmediata"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="4">
                <ValidationProvider
                    name="patologia"
                    rules="required"
                    v-slot="{ errors }"
                >
                  <v-checkbox
                      v-model="bitacora.paciente_no_rcv"
                      label="Usuario que refiere no tener ninguna patologia"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col
                  class="pb-0"
                  cols="12"
                  v-if="bitacora.alerta_inmediata"
              >
                <c-text-area
                    label="Descripcion de la alerta"
                    v-model="bitacora.descripcion_alerta_inmediata"
                    name="descripcion de alerta inmediata"
                    rules="required"
                />
              </v-col>
              <v-col cols="6">
                <ValidationProvider
                    name="calidad"
                    rules="required"
                    v-slot="{ errors }"
                >
                  <v-checkbox
                      v-model="bitacora.remision_por_calidad"
                      label="Remision por Calidad"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <ValidationProvider
                    name="aseguramiento"
                    rules="required"
                    v-slot="{ errors }"
                >
                  <v-checkbox
                      v-model="bitacora.remitir_a_aseguramiento"
                      label="Remitir a aseguramiento"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col
                  v-if="bitacora.remision_por_calidad"
                  cols="12"
              >
                <c-text-area
                    label="Razon de la remision por Calidad"
                    v-model="bitacora.razon_remision_calidad"
                    name="descripcion de alerta inmediata"
                    rules="required"
                />
              </v-col>
              <v-col cols="12">
                <c-text-area
                    label="Observaciones"
                    v-model="bitacora.observaciones"
                    name="observaciones"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-toolbar flat>
                  <v-toolbar-title>Tipificaciones</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip
                      top
                      v-if="!bitacora.paciente_no_rcv"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          dark
                          class="mb-2"
                          @click="crearNuevaTipificacion"
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Agregar tipificacion</span>
                  </v-tooltip>
                </v-toolbar>
                <v-simple-table v-if="bitacora.tipificaciones && bitacora.tipificaciones.length">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th
                          class="text-left"
                          v-for="item in headers"
                          :key="item.value"
                      >
                        {{ item.text }}
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="(item, index) in bitacora.tipificaciones"
                        :key="index"
                    >
                      <td>
                        {{
                          complementosRCV
                              ? complementosRCV.ref_tipificaciones.find(x => x.id == item.reftipificacion_id).descripcion
                              : '-'
                        }}
                      </td>
                      <td>{{ item.fecha_solicitud }}</td>
                      <td>{{ item.fecha_prestacion }}</td>
                      <td>{{ item.resultado }}</td>
                      <td>
                        <v-icon
                            small
                            class="mr-2"
                            @click="editTipificacion(item)"
                        >
                          mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteTipificacion(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>

                    </tbody>
                  </template>
                </v-simple-table>
                <div v-else class="title grey--text text-center pa-4">Sin tipificaciones</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
          <v-btn
              large
              @click="close"
              :disabled="loadingButtons"
              :loading="loadingButtons"
          >
            Cancelar
          </v-btn>
          <v-btn
              large
              color="primary"
              @click="bitacora.id ? update() : save()"
              :disabled="loadingButtons"
              :loading="loadingButtons"
          >
            <v-icon left>fas fa-save</v-icon>
            {{ bitacora.id ? 'Editar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
    <crear-tipificacion
        ref="crearTipificacion"
        :listTipificaciones="complementosRCV ? complementosRCV.ref_tipificaciones: []"
        @add-tipificacion="addTipificacion"
        @update-tipificacion="updateTipificacion"
    />
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

const CrearTipificacion = () => import('Views/aps/rcv/encuestas/components/CrearTipificacion')
export default {
  components: {
    CrearTipificacion
  },
  data: () => ({
    dialogNuevaBitacora: false,
    bitacora: null,
    loadingButtons: false,
    bitacorasModel: {
      rcv_id: null,
      fecha: null,
      afiliado_id: null,
      periodicidad_seguimientos: null,
      bitacora: null,
      alerta_inmediata: 0,
      paciente_no_rcv: 0,
      observaciones: null,
      tipificaciones: [],
      descripcion_alerta_inmediata: null,
      remision_por_calidad: 0,
      remitir_a_aseguramiento: 0,
      razon_remision_calidad: null,
      alerta: 0
    },
    headers: [
      {text: 'Tipificacion', value: 'reftipificacion_id'},
      {text: 'F. Solicitud', value: 'fecha_solicitud'},
      {text: 'F. Prestacion', value: 'fecha_prestacion'},
      {text: 'Observaciones', value: 'resultado'},
      {text: 'Opciones', value: 'actions'}
    ],
  }),
  watch: {
    'bitacora.alerta_inmediata': {
      handler(val) {
        if (!val) this.bitacora.descripcion_alerta_inmediata = null
      }
    },
    'bitacora.remision_por_calidad': {
      handler(val) {
        if (!val) this.bitacora.razon_remision_calidad = null
      }
    }
  },
  computed: {
    ...mapGetters([
      'complementosRCV'
    ])
  },
  created() {
    this.bitacora = this.clone(this.bitacorasModel)
  },
  methods: {
    open(item, bitacora = null) {
      if (!bitacora) {
        this.getTipificacionesPendientes(item.id)
        this.bitacora = this.clone(this.bitacorasModel)

        this.bitacora.afiliado_id = item.id
        this.bitacora.fecha = this.moment().format('YYYY-MM-DD')
      } else {
        this.bitacora = {...bitacora}
        console.log(this.bitacora);
      }
      this.dialogNuevaBitacora = true
    },
    close() {
      this.$refs.formBitacora.reset()
      this.bitacora = this.clone(this.bitacorasModel)
      this.dialogNuevaBitacora = false
    },
    crearNuevaTipificacion() {
      this.$refs.crearTipificacion.open()
    },
    editTipificacion(item) {
      let editedIndex = this.bitacora.tipificaciones.indexOf(item)
      item.index = editedIndex
      this.$refs.crearTipificacion.open(this.clone(item))
    },
    addTipificacion(item) {
      this.bitacora.tipificaciones.push(item)
    },
    updateTipificacion(item) {
      Object.assign(this.bitacora.tipificaciones[item.index], item.tipificacion)
    },
    deleteTipificacion(item) {
      let editedIndex = this.bitacora.tipificaciones.indexOf(item)
      this.bitacora.tipificaciones.splice(editedIndex, 1)
    },
    save() {
      this.$refs.formBitacora.validate().then(result => {
        if (result) {
          this.loading = true
          this.loadingButtons = true
          this.axios.post(`bitacoras`, this.bitacora).then(response => {
            this.$emit('guardado', response.data)
            this.$store.commit('snackbar', {color: 'success', message: 'Bitacora creada correctamente.'})
            this.close()
            this.loadingButtons = false
          })
              .catch(error => {
                this.loading = false
                this.loadingButtons = false
                this.$store.commit('snackbar', {color: 'error', message: 'al guardar la encuesta.', error: error})
              })
        }
      })
    },
    update() {
      this.$refs.formBitacora.validate().then(result => {
        if (result) {
          this.loading = true
          this.loadingButtons = true
          this.axios.put(`bitacoras/${this.bitacora.id}`, this.bitacora).then(response => {
            this.$emit('guardado', response.data)
            this.$store.commit('snackbar', {color: 'success', message: 'Bitacora actualizada correctamente.'})
            this.close()
            this.loadingButtons = false
          })
              .catch(error => {
                this.loading = false
                this.loadingButtons = false
                this.$store.commit('snackbar', {color: 'error', message: 'al actualizar la encuesta.', error: error})
              })
        }
      })

    },
    getTipificacionesPendientes(afiliado_id) {
      this.loading = true
      this.axios.get(`tipificaciones-pendientes/${afiliado_id}`)
          .then(response => {
            console.log(response.data);
            this.bitacora.tipificaciones = response.data
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: 'al recuperar la encuesta.', error: error})
          })
    }

  }

}
</script>
