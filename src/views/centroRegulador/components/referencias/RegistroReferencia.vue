<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
  >
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title>
            {{ item && item.id ? `Referencia No. ${item.id}` : 'Nueva Referencia' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row no-gutters>
            <v-col md="6" offset-md="3">
              <ValidationObserver
                  ref="formItem"
                  v-slot="{ invalid, validated, passes, validate }"
                  autocomplete="off"
              >
                <template v-if="item">
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <c-date-manual
                          v-model="item.fecha_solicitud"
                          label="Fecha Solicitud"
                          name="Fecha Solicitud"
                          rules="required"
                          :max="moment().format('YYYY-MM-DD')"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-time
                          v-model="item.hora_solicitud"
                          label="Hora Solicitud"
                          name="Hora Solicitud"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-date-manual
                          v-model="item.fecha_orden"
                          label="Fecha Orden"
                          name="Fecha Orden"
                          rules="required"
                          :max="moment().format('YYYY-MM-DD')"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-time
                          v-model="item.hora_orden"
                          label="Hora Orden"
                          name="Hora Orden"
                          rules="required"
                      />
                    </v-col>
                  </v-row>
                  <form-persona
                      :value="item"
                      @verificado="val => verificar(val)"
                      @responseReferencia="val => respuestaPersona = val"
                      @responseFallecido="val => respuestaFallecido = val"
                  />
                  <v-row dense>
                    <v-col cols="12">
                      <ValidationProvider name="Modalidad del Servicio" rules="required" v-slot="{ errors }">
                        <v-select
                            v-model="item.modservicio_id"
                            label="Modalidad del Servicio"
                            :items="ref_modalidadesServicio || []"
                            item-value="id"
                            outlined
                            dense
                            :disabled="!verificado"
                            :error-messages="errors"
                            clearable
                            persistent-hint
                            :hint="item.modservicio_id && ref_modalidadesServicio && ref_modalidadesServicio.length && ref_modalidadesServicio.find(x => x.id === item.modservicio_id) ? ref_modalidadesServicio.find(x => x.id === item.modservicio_id).modalidad : ''"
                        >
                          <template v-slot:selection="{ item, index }">
                            {{ item.codigo }} - {{ item.tipo }}
                          </template>
                          <template v-slot:item="data">
                            <div style="width: 100% !important;">
                              <v-list-item class="pa-0">
                                <v-list-item-content class="text-truncate pa-0">
                                  <v-list-item-title class="body-2">
                                    {{ data.item.codigo }} - {{ data.item.tipo }}
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ data.item.modalidad }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                              <v-divider class="ma-0"></v-divider>
                            </div>
                          </template>
                        </v-select>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                        <c-select-complete
                            v-model="item.tipo_origen"
                            label="Tipo de Atención"
                            name="tipo de atención"
                            :items="tiposOrigen"
                            rules="required"
                        />
                    </v-col>
                    <v-col cols="12">
                      <buscador-ips
                          label="IPS de Origen"
                          name="IPS de Origen"
                          v-model="item.codigo_prestador_origen"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12">
                      <buscador-cies
                          label="Diagnóstico"
                          name="Diagnóstico"
                          v-model="item.codigo_cie10_ingreso"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12">
                      <buscador-cups
                          label="Procedimiento"
                          name="Procedimiento"
                          v-model="item.codigo_cup"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                      <c-file
                          label="Historia Clinica"
                          name="historial clinica"
                          v-model="archivos.fileHistoriaClinica"
                          rules="size:750"
                          :hint="item.historia_clinica && item.historia_clinica.id ? 'cargado actualmente: ' + `${item.historia_clinica.ruta.split('/')[1]}` : ''"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                      <c-file
                          label="Orden Médica"
                          name="orden médica"
                          v-model="archivos.fileOrdenMedica"
                          rules="size:750"
                          :hint="item.orden_medica && item.orden_medica.id ? 'cargado actualmente: ' + `${item.orden_medica.ruta.split('/')[1]}` : ''"
                      />
                    </v-col>
                    <v-col cols="12">
                      <c-text-area
                          label="Observaciones"
                          v-model="item.observaciones"
                      />
                    </v-col>
                  </v-row>
                </template>
                <v-divider class="mt-0"/>
                <p class="body-2 error--text mb-0 text-center" v-if="invalid && validated">Hay errores en el formulario</p>
                <v-card-actions>
                  <v-btn
                      large
                      @click.stop="close"
                  >
                    <v-icon>mdi-close</v-icon>
                    Cancelar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      large
                      color="primary"
                      @click.stop="guardarItem"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <dialog-referencias-afiliado
          ref="dialogReferenciaAfiliado"
          :value="respuestaPersona"
      />
      <dialog-fallecido
          ref="dialogFallecido"
          :value="respuestaFallecido"
      />
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../models'
import FormPersona from 'Views/centroRegulador/components/referencias/FormPersona'
import DialogReferenciasAfiliado from 'Views/centroRegulador/components/referencias/DialogReferenciasAfiliado'
import DialogFallecido from 'Views/centroRegulador/components/referencias/DialogFallecido'
import BuscadorCies from 'Views/centroRegulador/components/referencias/BuscadorCies'
import BuscadorCups from 'Views/centroRegulador/components/referencias/BuscadorCups'
import BuscadorIps from 'Views/centroRegulador/components/referencias/BuscadorIps'
import { mapGetters } from 'vuex'
export default {
  name: 'RegistroReferencia',
  components: {
    BuscadorIps,
    BuscadorCups,
    BuscadorCies,
    FormPersona,
    DialogReferenciasAfiliado,
    DialogFallecido
  },
  data: () => ({
    loading: false,
    dialog: false,
    verificado: 0,
    respuestaPersona: null,
    respuestaFallecido: null,
    item: null,
    archivos: {
        fileOrdenMedica: null,
        fileHistoriaClinica: null
    },
    tiposOrigen: [
      'Ambulatorio',
      'Hospitalario',
      'Urgencias'
    ]
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    },
    ...mapGetters([
      'ref_modalidadesServicio'
    ])
  },
  watch: {
      'archivos.fileOrdenMedica': {
          handler(val){
              if(val && val.size <= 750000){
                  val && this.guardarOrdenMedica()
              }
          }
      },
      'archivos.fileHistoriaClinica': {
          handler(val){
              if(val && val.size <= 750000){
                  val && this.guardarHistoriaClinica()
              }
          }
      },
  },
  methods: {
    guardarItem() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          itemCopia.fecha_solicitud = `${itemCopia.fecha_solicitud} ${itemCopia.hora_solicitud}`
          itemCopia.fecha_orden = `${itemCopia.fecha_orden} ${itemCopia.hora_orden}`
          let request = itemCopia.id
              ? this.axios.put(`referencias/${itemCopia.id}`, itemCopia)
              : this.axios.post(`referencias`, itemCopia)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `La referencia se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la referencia.`, error: error})
              })
        }
      })
    },
    async guardarOrdenMedica(){
        let archivo = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(this.archivos.fileOrdenMedica)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        this.axios.post(`subir-archivos`, {fileOrdenMedica: archivo}).then(response => {
            this.item.orden_medica_id = response.data
          this.$store.commit('snackbar', {color: 'success', message: 'Archivo guardado con exito'})
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: `al guardar archivo.`, error: error})
        })
    },
    async guardarHistoriaClinica(){
        let archivo = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(this.archivos.fileHistoriaClinica)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        this.axios.post(`subir-archivos`, {fileHistoriaClinica: archivo}).then(response => {
            this.item.historia_clinica_id = response.data
          this.$store.commit('snackbar', {color: 'success', message: 'Archivo guardado con exito'})
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: `al guardar archivo.`, error: error})
        })
    },
    open(item = null) {
      this.dialog = true
      if (item) {
        this.getItem(item.id)
      } else {
        this.item = this.clone(models.referencia)
        this.item.fecha_solicitud = this.moment().format('YYYY-MM-DD')
        this.item.hora_solicitud = this.moment().format('HH:mm')
        this.item.fecha_orden = this.moment().format('YYYY-MM-DD')
        this.item.hora_orden = this.moment().format('HH:mm')
      }
    },
    close() {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      this.$emit('close')
      this.item = null
      this.archivos = {
          fileOrdenMedica: null,
          fileHistoriaClinica: null
      }
    },
    getItem(id) {
      this.loading = true
      this.axios.get(`referencias/${id}`)
          .then(response => {
            const fechaSolicitud = this.clone(response.data.fecha_solicitud)
            response.data.fecha_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('YYYY-MM-DD') : null
            response.data.hora_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('HH:mm') : null

            const fechaOrden = this.clone(response.data.fecha_orden)
            response.data.fecha_orden = fechaOrden ? this.moment(fechaOrden).format('YYYY-MM-DD') : null
            response.data.hora_orden = fechaOrden ? this.moment(fechaOrden).format('HH:mm') : null
            response.data.si_eps = response.data.eps_id ? 1 : 0
            this.item = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar el registro de la referencia.`, error: error})
          })
    },
    verificar(val) {
      this.verificado = val
      this.$emit('verificado', val)
      if (val === -2 && this.respuestaFallecido) this.$refs.dialogFallecido.open()
      if (((val === -1) || (val === 1)) && this.respuestaPersona) this.$refs.dialogReferenciaAfiliado.open()
    }
  }
}
</script>
