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
                  />
                  <v-row dense>
                    <v-col cols="12">
                      <c-select-complete
                          v-model="item.modservicio_id"
                          label="Modalidad del Servicio"
                          name="Modalidad del Servicio"
                          rules="required"
                          :items="ref_modalidadesServicio || []"
                          item-text="descripcion"
                          item-value="id"
                          :disabled="!verificado"
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
                          v-model="item.rs_cup_id"
                          rules="required"
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
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../models'
import FormPersona from 'Views/centroRegulador/components/referencias/FormPersona'
import DialogReferenciasAfiliado from 'Views/centroRegulador/components/referencias/DialogReferenciasAfiliado'
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
    DialogReferenciasAfiliado
  },
  data: () => ({
    loading: false,
    dialog: false,
    verificado: 0,
    respuestaPersona: null,
    item: null
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
  },
  methods: {
    guardarItem() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
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
    open(item = null) {
      this.dialog = true
      if (item) {
        this.getItem(item.id)
      } else {
        this.item = this.clone(models.referencia)
      }
    },
    close() {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      this.$emit('close')
      this.item = null
    },
    getItem(id) {
      this.loading = true
      this.axios.get(`referencias/${id}`)
          .then(response => {
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
      if (((val === -1) || (val === 1)) && this.respuestaPersona) this.$refs.dialogReferenciaAfiliado.open()
    }
  }
}
</script>