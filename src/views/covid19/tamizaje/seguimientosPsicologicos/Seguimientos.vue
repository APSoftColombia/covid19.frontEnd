<template>
  <v-card flat>
    <v-toolbar dark color="teal" dense>
      <v-icon left>fas fa-street-view</v-icon>
      <v-toolbar-title>Seguimientos Psicológicos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-btn @click="viewTable = !viewTable" icon v-on="on" class="mr-2">
            <v-icon>mdi-{{ viewTable ? $vuetify.breakpoint.smAndUp ? 'timeline' : 'view-agenda' : 'table-large' }}
            </v-icon>
          </v-btn>
        </template>
        <span>Vista de {{ viewTable ? $vuetify.breakpoint.smAndUp ? 'línea de tiempo' : 'secciones' : 'tabla' }}</span>
      </v-tooltip>
      <template v-if="permisos.seguimientoPsicologicoCrear && editable">
        <v-tooltip top v-if="$vuetify.breakpoint.xsOnly">
          <template v-slot:activator="{on}">
            <v-btn dark @click="agregarEvolucion" icon color="primary darken-3" v-on="on">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar seguimiento</span>
        </v-tooltip>
        <v-btn v-else dark @click="agregarEvolucion" color="teal darken-3" class="mr-2">
          <v-icon left>mdi-plus</v-icon>
          Agregar seguimiento
        </v-btn>
      </template>
      <v-tooltip top v-if="tamizaje.seguimientos_psicologicos && tamizaje.seguimientos_psicologicos.length > 1">
        <template v-slot:activator="{on}">
          <v-btn @click="panelFilters = !panelFilters" icon v-on="on">
            <v-icon>mdi-chevron-{{ panelFilters ? 'up' : 'down' }}</v-icon>
          </v-btn>
        </template>
        <span>Filtros</span>
      </v-tooltip>
    </v-toolbar>
    <v-expand-transition v-if="tamizaje.seguimientos_psicologicos && tamizaje.seguimientos_psicologicos.length > 1">
      <div v-if="panelFilters">
        <v-container
            fluid
        >
          <v-row align="center" justify="end" fill-height>
            <v-col class="pb-0" cols="12" sm="6" md="4">
              <c-select-complete
                  v-model="filters.models.estadoSeguimiento"
                  label="Estado"
                  :items="filters.data.opcionesEstado"
                  item-text="text"
                  item-value="value"
                  :clearable="false"
                  hide-details
              >
              </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12" sm="6" md="4">
              <c-select-complete
                  v-model="filters.models.misSeguimientos"
                  label="Realizados por"
                  :items="filters.data.opcionesSeguimiento"
                  item-text="text"
                  item-value="value"
                  :clearable="false"
                  hide-details
              >
              </c-select-complete>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
    <v-card-text class="text-center font-lg" v-if="!evoluciones.length">
      No registra seguimientos
    </v-card-text>
    <v-row v-else>
      <v-col cols="12" class="pt-0 ma-0">
        <template v-if="viewTable">
          <datos-evolucion-tabla
              @editarEvolucion="val => editarEvolucion(val)"
              :evoluciones="evoluciones"
          ></datos-evolucion-tabla>
        </template>
        <template v-else>
          <v-timeline align-top dense v-if="$vuetify.breakpoint.smAndUp">
            <v-timeline-item
                v-for="(evolucion, evoIndex) in evoluciones"
                :key="`evolucion${evoIndex}`"
                :color="evolucion.fallida ? 'error' : 'primary'"
                fill-dot
            >
              <template v-slot:icon>
                <v-avatar class="white--text">
                  {{ evolucion.numero }}
                </v-avatar>
              </template>
              <datos-evolucion
                  :evolucion="evolucion"
                  :index="evoIndex"
                  @editarEvolucion="val => editarEvolucion(val)"
              />
            </v-timeline-item>
          </v-timeline>
          <div v-else>
            <template v-for="(evolucion, evoIndex) in evoluciones">
              <datos-evolucion
                  class="mt-3"
                  :key="`evolucion${evoIndex}`"
                  :evolucion="evolucion"
                  :index="evoIndex"
                  @editarEvolucion="val => editarEvolucion(val)"
              ></datos-evolucion>
            </template>
          </div>
        </template>
      </v-col>
    </v-row>
    <registro-seguimiento
        v-if="permisos.seguimientoPsicologicoCrear"
        ref="registroEvolucion"
        @guardado="item => evolucionGuardada(item)"
        @actualizarTamizaje="val => $emit('actualizarTamizaje', val)"
        @close="loading = false"
        :tamizaje="this.tamizaje"
    />
    <app-section-loader :status="loading"></app-section-loader>
  </v-card>
</template>

<script>
import DatosEvolucionTabla from 'Views/covid19/tamizaje/seguimientosPsicologicos/DatosEvolucionTabla'
import {mapState} from 'vuex'

const RegistroSeguimiento = () => import('Views/covid19/tamizaje/seguimientosPsicologicos/RegistroSeguimiento')
const DatosEvolucion = () => import('Views/covid19/tamizaje/seguimientosPsicologicos/DatosEvolucion')
export default {
  name: 'Seguimientos',
  components: {
    DatosEvolucionTabla,
    RegistroSeguimiento,
    DatosEvolucion
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    viewTable: true,
    panelFilters: false,
    filters: {
      models: {
        estadoSeguimiento: null,
        misSeguimientos: 0
      },
      data: {
        opcionesEstado: [
          {value: null, text: 'Todos'},
          {value: 0, text: 'Efectivos'},
          {value: 1, text: 'Fallidos'}
        ],
        opcionesSeguimiento: [
          {value: 0, text: 'Todos'},
          {value: 1, text: 'Mi'}
        ]
      }
    }
  }),
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    evoluciones() {
      if (this.tamizaje && this.tamizaje.seguimientos_psicologicos.length && this.user) {
        return this.tamizaje.seguimientos_psicologicos.filter(x => (this.filters.models.misSeguimientos ? x.user_id === this.user.id : x) && (this.filters.models.estadoSeguimiento === null ? x : x.fallida === this.filters.models.estadoSeguimiento))
      }
      return []
    }
  },
  watch: {},
  methods: {
    agregarEvolucion() {
      this.loading = true
      this.$refs.registroEvolucion.open(null)
    },
    editarEvolucion(evolucion_id) {
      let evolucion = this.tamizaje.seguimientos_psicologicos.find(x => x.id === evolucion_id)
      this.$refs.registroEvolucion.editar(evolucion)
    },
    evolucionGuardada(item) {
      this.$emit('change', item)
    }
  }
}
</script>

<style scoped>
.v-sheet {
  border-radius: 0 !important;
}
</style>