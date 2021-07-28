<template>
  <div>
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
  </div>
</template>

<script>
const Evoluciones = () => import('Views/covid19/tamizaje/evolucion/Evoluciones')
const Aislamientos = () => import('Views/covid19/tamizaje/aislamiento/Aislamientos')
const Muestras = () => import('Views/covid19/tamizaje/muestra/Muestras')
const Nexos = () => import('Views/covid19/tamizaje/nexo/Nexos')
const Seguimientos = () => import('Views/covid19/tamizaje/seguimientosPsicologicos/Seguimientos')
const TomaMuestras = () => import('Views/covid19/tamizaje/tomaMuestra/TomaMuestras')
export default {
  name: 'OpcionesSeguimiento',
  props: {
    tabx: {
      type: Number,
      default: null
    },
    tamizaje: {
      type: Object,
      default: null
    }
  },
  components: {
    TomaMuestras,
    Seguimientos,
    Evoluciones,
    Aislamientos,
    Muestras,
    Nexos
  },
  data: () => ({
    tab: null
  }),
  watch: {
    tabx: {
      handler (val) {
        this.tab = val
      },
      immediate: true
    }
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
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
    sonNexos() {
      return !!(this.tamizaje.muestras && this.tamizaje.muestras.filter(x => x.resultado).length)
    }
  }
}
</script>