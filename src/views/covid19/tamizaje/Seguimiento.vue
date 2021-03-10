<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <v-toolbar dark color="primary" v-if="tamizaje">
        <v-icon left> {{ tamizaje.medico_id ? 'fas fa-file-medical-alt' : 'mdi-file-find' }}</v-icon>
        <v-list-item>
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
<!--          <v-alert-->
<!--              v-if="tamizaje.medico"-->
<!--              class="mt-3"-->
<!--              v-model="alertPurebas"-->
<!--              dismissible-->
<!--              close-icon="mdi-delete"-->
<!--              color="orange"-->
<!--              border="left"-->
<!--              elevation="2"-->
<!--              colored-border-->
<!--              icon="mdi-alert"-->
<!--          >-->
<!--            Recuerde cargar las <strong>muestras y resultados pendientes</strong>, para que los seguimientos y nexos se-->
<!--            relacionen correctamente.-->
<!--          </v-alert>-->
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
              <v-tabs
                  class="mt-3"
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
                      v-if="permisos.seguimientoVer"
                      :tamizaje="tamizaje"
                      :editable="editable"
                      @change="changeTamizaje(tamizaje.id)"
                      @actualizarTamizaje="val => changeTamizaje(val.id)"
                  ></evoluciones>
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
                      v-if="permisos.aislamientoVer"
                      :tamizaje="tamizaje"
                      :editable="editable"
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
                      v-if="permisos.nexoVer"
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
                      v-if="permisos.tomaMuestrasIndex"
                      :tamizaje="tamizaje"
                      :editable="editable"
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
                      v-if="permisos.seguimientoPsicologicoVer"
                      :tamizaje="tamizaje"
                      :editable="editable"
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
                      v-if="permisos.muestraVer"
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
                  :color="tab === 'tab-1' ? 'warning' : tab === 'tab-2' ? 'error' : 'indigo'"
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
              </v-tabs>
              <v-tabs-items v-model="tab" class="mt-2" touchless>
                <v-tab-item
                    value="tab-1"
                >
                  <nexos
                      v-if="permisos.nexoVer"
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
                      v-if="permisos.tomaMuestrasIndex"
                      :tamizaje="tamizaje"
                      :editable="editableNexos"
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
                      v-if="permisos.muestraVer"
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
          </template>
        </template>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
//import {store} from "../../../store/store";
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
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    verAlertAislamiento() {
      if (this && this.tamizaje && (this.tamizaje.evoluciones && this.tamizaje.evoluciones.length && this.tamizaje.evoluciones.filter(x => !x.fallida).length) && (this.tamizaje.aislamientos && !this.tamizaje.aislamientos.length)) {
        return !(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6')
      }
      return false
    },
    editable() {
      if (this && this.tamizaje && this.tamizaje.medico_id) {
        return !(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6') || this.esSuperAdmin
      }
      return false
    },
    editableNexos() {
      if (this && this.tamizaje) {
        return !(this.tamizaje.estado_afectacion === 'Fallecido' || this.tamizaje.estado_afectacion === 'Recuperado' || this.tamizaje.clasificacion === '4' || this.tamizaje.clasificacion === '6') || this.esSuperAdmin
      }
      return false
    },
    // editable() {
    //   return this && this.tamizaje && this.tamizaje.id && (this.tamizaje.estado === null || this.tamizaje.estado === 'Abierto')
    // },
    ...mapGetters([
      'modelTamizaje'
    ]),
    sonNexos() {
      return !!(this.tamizaje.muestras && this.tamizaje.muestras.filter(x => x.resultado).length)
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

</style>