<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
      :retain-focus="false"
  >
    <v-card tile flat>
      <v-card-title
          v-if="tamizaje"
          class="py-1"
          style="background-color: #125a9c"
      >
        <v-list-item class="pa-0" dark>
          <v-list-item-avatar class="mr-1">
            <v-icon> {{ tamizaje.medico_id ? 'fas fa-file-medical-alt' : 'mdi-file-find' }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">{{ tamizaje.medico_id ? 'Caso de Estudio, ' : '' }}
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
          <v-list-item-action>
            <v-btn
                large
                icon
                @click="close"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card-title>
      <v-card-text class="pa-4">
        <div style="padding-bottom: 15px; text-align: right" v-if="permisos.descargarERPPDF">
          <v-btn :loading="loadingPDF" class="red darken-4" @click.stop="descargarPDF">
            <v-icon color="white" left>fas fa-file-pdf</v-icon>
            <span class="font-weight-bold white--text">Descargar PDF</span>
          </v-btn>
        </div>
        <datos-personales
            :tamizaje="tamizaje"
            @actualizarTamizaje="val => changeTamizaje(val.id)"
        />
        <datos-tamizaje
            class="mt-3"
            :tamizaje="tamizaje"
        />
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
          <template v-if="tamizaje && tamizaje.id">
            <template v-if="tamizaje.medico">
              <v-alert
                  v-if="tamizaje.afiliado_id && (tamizaje.estado_afiliado === 'RE' || tamizaje.estado_afiliado === 'AF') && tamizaje.estado === 'Activo'"
                  dark
                  class="my-3"
                  color="warning"
                  border="left"
                  elevation="2"
                  icon="mdi-alert"
              >
                El estado de afiliación actual es
                <strong>{{ estadosAfiliacion && estadosAfiliacion.length ? estadosAfiliacion.find(x => x.value === tamizaje.estado_afiliado).text : tamizaje.estado_afiliado }}</strong>,
                solo se permitirá realizar un seguimiento más y el caso será cerrado de acuerdo a los lineamientos de la EPS.
              </v-alert>
              <v-tabs
                  class="mt-8"
                  id="tabsSeguimiento"
                  v-model="tab"
                  fixed-tabs
                  right
                  icons-and-text
                  show-arrows
                  :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : tab === 'tab-4' ? 'deep-purple' : tab === 'tab-5' ? 'indigo' : 'teal'"
              >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    href="#tab-1"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-1' ? 'primary' : 'grey'"
                      :content="String(tamizaje.evoluciones.length)"
                      :class="tab === 'tab-1' ? 'primary--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Seguimientos</span>
                  </v-badge>
                  <v-icon>fas fa-chart-line</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-2"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-2' ? 'warning' : 'grey'"
                      :content="String(tamizaje.nexos.length)"
                      :class="tab === 'tab-2' ? 'warning--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">{{ sonNexos ? 'Nexos' : 'Contactos' }}</span>
                  </v-badge>
                  <v-icon>fas fa-people-arrows</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-4"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-4' ? 'deep-purple' : 'grey'"
                      :content="String(tamizaje.aislamientos.length)"
                      :class="tab === 'tab-4' ? 'deep-purple--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Aislamientos</span>
                  </v-badge>
                  <v-icon>mdi-door-closed-lock</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-5"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-5' ? 'indigo' : 'grey'"
                      :content="String(tamizaje.asignacion_pruebas.length)"
                      :class="tab === 'tab-5' ? 'indigo--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Tomas Muestras</span>
                  </v-badge>
                  <v-icon>fas fa-vial</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-3"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-3' ? 'error' : 'grey'"
                      :content="String(tamizaje.muestras.length)"
                      :class="tab === 'tab-3' ? 'error--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">SISMUESTRAS</span>
                  </v-badge>
                  <v-icon>fas fa-vials</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-6"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-6' ? 'teal' : 'grey'"
                      :content="String(tamizaje.seguimientos_psicologicos.length)"
                      :class="tab === 'tab-6' ? 'teal--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Psicología</span>
                  </v-badge>
                  <v-icon>fas fa-street-view</v-icon>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="mt-2" touchless>
                <v-tab-item
                    value="tab-1"
                >
                  <evoluciones
                      v-if="permisos.seguimientoVer && (tab === 'tab-1')"
                      :tamizaje="tamizaje"
                      :editable="editable"
                      @change="changeTamizaje(tamizaje.id)"
                      @actualizarTamizaje="val => changeTamizaje(val.id)"
                  />
                  <div v-if="!permisos.seguimientoVer"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="primary" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-4"
                >
                  <aislamientos
                      v-if="permisos.aislamientoVer && (tab === 'tab-4')"
                      :tamizaje="tamizaje"
                      :editable="editable && activoEPS"
                      @change="changeTamizaje(tamizaje.id)"
                  ></aislamientos>
                  <div v-if="!permisos.aislamientoVer"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="deep-purple" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-2"
                >
                  <nexos
                      v-if="permisos.nexoVer && (tab === 'tab-2')"
                      :tamizaje="tamizaje"
                      :editable="true"
                      @change="changeTamizaje(tamizaje.id)"
                      @nexoEliminado="getTamizaje(tamizaje.id)"
                      :sonNexos="sonNexos"
                  ></nexos>
                  <div v-if="!permisos.nexoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="warning" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-5"
                >
                  <toma-muestras
                      v-if="permisos.tomaMuestrasIndex && (tab === 'tab-5')"
                      :tamizaje="tamizaje"
                      :editable="editable && activoEPS"
                      @change="changeTamizaje(tamizaje.id)"
                  ></toma-muestras>
                  <div v-if="!permisos.tomaMuestrasIndex"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="indigo" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-6"
                >
                  <seguimientos
                      v-if="permisos.seguimientoPsicologicoVer && (tab === 'tab-6')"
                      :tamizaje="tamizaje"
                      :editable="editable && activoEPS"
                      @change="changeTamizaje(tamizaje.id)"
                      @actualizarTamizaje="val => changeTamizaje(val.id)"
                  ></seguimientos>
                  <div v-if="!permisos.seguimientoPsicologicoVer"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="teal" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-3"
                >
                  <muestras
                      v-if="permisos.muestraVer && (tab === 'tab-3')"
                      :tamizaje="tamizaje"
                      :editable="false"
                      @change="changeTamizaje(tamizaje.id)"
                  ></muestras>
                  <div v-if="!permisos.muestraVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="error" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
              </v-tabs-items>
            </template>
            <template v-else>
              <v-tabs
                  class="mt-3"
                  v-model="tab"
                  fixed-tabs
                  right
                  icons-and-text
                  show-arrows
                  :color="tab === 'tab-1' ? 'warning' : tab === 'tab-2' ? 'error' : tab === 'tab-3' ? 'indigo': 'teal'"
              >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    href="#tab-1"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-1' ? 'warning' : 'grey'"
                      :content="String(tamizaje.nexos.length)"
                      :class="tab === 'tab-1' ? 'warning--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">{{ sonNexos ? 'Nexos' : 'Contactos' }}</span>
                  </v-badge>
                  <v-icon>fas fa-people-arrows</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-3"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-3' ? 'indigo' : 'grey'"
                      :content="String(tamizaje.asignacion_pruebas.length)"
                      :class="tab === 'tab-3' ? 'indigo--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Tomas Muestras</span>
                  </v-badge>
                  <v-icon>fas fa-vial</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-2"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-2' ? 'error' : 'grey'"
                      :content="String(tamizaje.muestras.length)"
                      :class="tab === 'tab-2' ? 'error--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">SISMUESTRAS</span>
                  </v-badge>
                  <v-icon>fas fa-vials</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-4"
                >
                  <v-badge
                      overlap
                      :color="tab === 'tab-6' ? 'teal' : 'grey'"
                      :content="String(tamizaje.seguimientos_psicologicos.length)"
                      :class="tab === 'tab-6' ? 'teal--text' : 'text--secondary'"
                  >
                    <span class="subtitle-1">Psicología</span>
                  </v-badge>
                  <v-icon>fas fa-street-view</v-icon>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="mt-2" touchless>
                <v-tab-item
                    value="tab-1"
                >
                  <nexos
                      v-if="permisos.nexoVer && (tab === 'tab-1')"
                      :tamizaje="tamizaje"
                      :editable="true"
                      @change="changeTamizaje(tamizaje.id)"
                      @nexoEliminado="getTamizaje(tamizaje.id)"
                      :sonNexos="sonNexos"
                  ></nexos>
                  <div v-if="!permisos.nexoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="warning" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-3"
                >
                  <toma-muestras
                      v-if="permisos.tomaMuestrasIndex && (tab === 'tab-3')"
                      :tamizaje="tamizaje"
                      :editable="editableNexos && activoEPS"
                      @change="changeTamizaje(tamizaje.id)"
                  ></toma-muestras>
                  <div v-if="!permisos.tomaMuestrasIndex"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="indigo" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-2"
                >
                  <muestras
                      v-if="permisos.muestraVer && (tab === 'tab-2')"
                      :tamizaje="tamizaje"
                      :editable="false"
                      @change="changeTamizaje(tamizaje.id)"
                  ></muestras>
                  <div v-if="!permisos.muestraVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="error" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
                <v-tab-item
                    value="tab-4"
                >
                  <seguimientos
                      v-if="permisos.seguimientoPsicologicoVer && (tab === 'tab-4')"
                      :tamizaje="tamizaje"
                      :editable="editableNexos && activoEPS"
                      @change="changeTamizaje(tamizaje.id)"
                      @actualizarTamizaje="val => changeTamizaje(val.id)"
                  ></seguimientos>
                  <div v-if="!permisos.seguimientoPsicologicoVer"
                       class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                    <v-icon color="teal" large left>mdi-alert-outline</v-icon>
                    No tiene permisos para ver ésta sección.
                  </div>
                </v-tab-item>
              </v-tabs-items>
            </template>
          </template>
        </template>
        <app-section-loader :status="loading"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
const DatosTamizaje = () => import('Views/covid19/tamizaje/DatosTamizaje')

const Evoluciones = () => import('Views/covid19/tamizaje/evolucion/Evoluciones')
const Aislamientos = () => import('Views/covid19/tamizaje/aislamiento/Aislamientos')
const Muestras = () => import('Views/covid19/tamizaje/muestra/Muestras')
const Nexos = () => import('Views/covid19/tamizaje/nexo/Nexos')
const Seguimientos = () => import('Views/covid19/tamizaje/seguimientosPsicologicos/Seguimientos')
const TomaMuestras = () => import('Views/covid19/tamizaje/tomaMuestra/TomaMuestras')
export default {
  name: 'Seguimiento',
  components: {
    TomaMuestras,
    Seguimientos,
    DatosPersonales,
    DatosTamizaje,
    Evoluciones,
    Aislamientos,
    Muestras,
    Nexos
  },
  data: () => ({
    alertPurebas: true,
    dialog: false,
    loading: false,
    loadingPDF: false,
    tamizaje: null,
    tab: null
  }),
  computed: {
    actualizaPorGlobal() {
      return this.$store.state.settings.actualizadorGlobal
    },
    activoEPS () {
      return !(this && this.tamizaje && this.tamizaje.afiliado_id && this.tamizaje.estado_afiliado && ((this.tamizaje.estado_afiliado === 'RE' && this.getUser?.tipo_cliente_id === 2) || this.tamizaje.estado_afiliado === 'AF'))
    },
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    verAlertAislamiento() {
      if (this && this.tamizaje && (this.tamizaje.evoluciones && this.tamizaje.evoluciones.length && this.tamizaje.evoluciones.filter(x => !x.fallida).length) && (this.tamizaje.aislamientos && !this.tamizaje.aislamientos.length)) {
        return !(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6') && this.tamizaje.estado !== 'Cerrado'
      }
      return false
    },
    editable() {
      if (this && this.tamizaje && this.tamizaje.medico_id) {
        return (!(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6') && this.tamizaje.estado !== 'Cerrado') || this.esSuperAdmin
      }
      return false
    },
    editableNexos() {
      if (this && this.tamizaje) {
        return (!(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6') && this.tamizaje.estado !== 'Cerrado') || this.esSuperAdmin
      }
      return false
    },
    ...mapGetters([
      'modelTamizaje',
        'estadosAfiliacion',
        'getUser'
    ]),
    sonNexos() {
      return !!(this.tamizaje.muestras && this.tamizaje.muestras.filter(x => x.resultado).length)
    }
  },
  watch: {
    actualizaPorGlobal: {
      handler (val) {
        if (val && this.tamizaje && this.tamizaje.id) this.getTamizaje(this.tamizaje.id)
      },
      immediate: false
    }
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