<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      persistent
      :retain-focus="false"
  >
    <v-card>
      <v-toolbar dark color="primary" v-if="tamizaje">
        <v-icon left> {{ tamizaje.medico_id ? 'fas fa-file-medical-alt' : 'mdi-file-find' }}</v-icon>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">prueba 1.8 {{ tamizaje.medico_id ? 'Caso de Estudio, ' : '' }}
              <template v-if="tamizaje.id">
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <span v-on="on" class="border-bottom-1">ERP</span>
                  </template>
                  <span>Encuesta de Riesgo Poblacional</span>
                </v-tooltip>
                No. {{ tamizaje.id }}
              </template>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid v-if="tamizaje">
        <div style="padding-bottom: 15px; text-align: right" v-if="permisos.descargarERPPDF">
          <v-btn :loading="loadingPDF" class="red darken-4" @click.stop="descargarPDF">
            <v-icon color="white" left>fas fa-file-pdf</v-icon>
            <span class="font-weight-bold white--text">Descargar PDF</span>
          </v-btn>
        </div>
        <datos-personales :tamizaje="tamizaje" @actualizarTamizaje="val => changeTamizaje(val.id)"></datos-personales>
        <datos-tamizaje class="mt-3" :tamizaje="tamizaje"></datos-tamizaje>
        <template v-if="tamizaje.localiza_persona && tamizaje.contesta_encuesta">
          <v-alert
              v-if="verAlertAislamiento"
              dark
              class="mt-3"
              :value="true"
              color="error"
              border="left"
              elevation="2"
              icon="mdi-alert"
          >
            Este caso aún no registra aislamientos
          </v-alert>
          <opciones-seguimiento
              v-if="tamizaje && tamizaje.id"
              :tabx="tab"
              :tamizaje="tamizaje"
          />
        </template>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
const DatosTamizaje = () => import('Views/covid19/tamizaje/DatosTamizaje')
const OpcionesSeguimiento = () => import('Views/covid19/tamizaje/OpcionesSeguimiento')
export default {
  name: 'Seguimiento',
  components: {
    DatosPersonales,
    DatosTamizaje,
    OpcionesSeguimiento
  },
  data: () => ({
    alertPurebas: true,
    dialog: false,
    loading: false,
    loadingPDF: false,
    tamizaje: null,
    tab: null,
    idTamizaje: null
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    verAlertAislamiento() {
      if (this && this.tamizaje && (this.tamizaje.evoluciones && this.tamizaje.evoluciones.length && this.tamizaje.evoluciones.filter(x => !x.fallida).length) && (this.tamizaje.aislamientos && !this.tamizaje.aislamientos.length)) {
        return !(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6')
      }
      return false
    },
    ...mapGetters([
      'modelTamizaje'
    ])
  },
  created() {
    this.tamizaje = this.clone(this.modelTamizaje)
  },
  methods: {
    descargarPDF() {
      this.loadingPDF = true
      this.axios({
        url: `/pdf-tamizaje/${this.tamizaje.id}`, //your url
        method: 'GET',
        responseType: 'blob', // important
      }).then(async response => {
        const fileURL = window.URL.createObjectURL(new Blob(
            [response.data],
            {type: 'application/pdf'}));
        await window.open(fileURL, '_blank')
        this.loadingPDF = false
      }).catch(error => {
        this.loadingPDF = false
        this.$store.commit('snackbar', {color: 'error', message: 'al cargar el pdf', error: error})
      })
    },
    open(idTamizaje = null) {
      this.idTamizaje = idTamizaje
      this.alertPurebas = true
      if (idTamizaje) this.getTamizaje(idTamizaje)
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.tamizaje = this.clone(this.modelTamizaje)
      }, 500)
    },
    changeTamizaje(idTamizaje) {
      this.$emit('change')
      this.getTamizaje(idTamizaje)
      this.$store.commit('reloadTable', 'tablaTamizajes')
    },
    getTamizaje(idTamizaje) {
      this.loading = true
      this.axios.get(`tamizajes/${idTamizaje}`)
          .then(response => {
            if (response.data.evoluciones.length) response.data.evoluciones.map((x, i) => {
              x.numero = (response.data.evoluciones.length - i)
            })
            if (response.data.seguimientos_psicologicos.length) response.data.seguimientos_psicologicos.map((x, i) => {
              x.numero = (response.data.seguimientos_psicologicos.length - i)
            })
            this.tamizaje = response.data
            this.tab = 1
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
  .v-dialog__content { position: absolute; }
</style>