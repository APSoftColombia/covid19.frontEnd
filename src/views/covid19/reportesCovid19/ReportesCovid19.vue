<template>
  <v-container fluid>
    <page-title-bar title="Reportes Covid-19">
      <template slot="actions">
        <v-tooltip top v-if="permisos.crear" :disabled="$vuetify.breakpoint.smAndUp">
          <template v-slot:activator="{on}">
            <v-btn
                v-on="on"
                color="primary"
                @click.stop="crearReporte"
                class="white--text"
            >
              <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-plus</v-icon>
              {{ $vuetify.breakpoint.smAndUp ? 'Crear Reporte' : '' }}
            </v-btn>
          </template>
          <span>Crear Reporte</span>
        </v-tooltip>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" offset-md="3">
                <v-text-field
                    v-model="search"
                    placeholder="Buscar"
                    filled
                    solo
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-if="!reportesFiltrados.length" class="text-center body-1 grey--text">
            No hay reportes para mostrar
          </v-card-text>
          <v-list v-else two-line class="notification-wrap">
            <template v-for="(reporte, indexReporte) in reportesFiltrados">
              <v-hover v-slot:default="{ hover }" :key="`reporte${indexReporte}`">
                <v-list-item @click="seleccionarReporte(reporte)">
                  <v-list-item-avatar class="my-1 align-self-center">{{ reporte.id }}</v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title><h5 class="mb-0 text-truncate">{{ reporte.nombre }}</h5></v-list-item-title>
                    <p class="grey--text fs-12 fw-normal ma-0">{{ reporte.descripcion }}</p>
                    <v-list-item-subtitle class="green--text" v-if="reporte.variables && !reporte.variables.length">
                      <v-icon color="green">mdi-arrow-down-bold-circle-outline</v-icon>
                      Descarga directa
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action v-if="hover && permisos.crear">
                    <v-btn icon color="warning" @click.stop="editarReporte(reporte)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-hover>
            </template>
          </v-list>
          <app-section-loader :status="loading"/>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="7">
        <generador-reporte
            ref="generadorReporte"
            @loading="val => loading = val"
        />
      </v-col>
    </v-row>
    <registro-reporte ref="registroReporte" @guardado="getReportes"/>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";
import lodash from "lodash";

const RegistroReporte = () => import('Views/covid19/reportesCovid19/RegistroReporte')
const GeneradorReporte = () => import('Views/covid19/reportesCovid19/GeneradorReporte')

export default {
  components: {
    RegistroReporte,
    GeneradorReporte
  },
  data: () => ({
    search: '',
    loading: false,
    reportesFull: [],
    reportesFiltrados: []
  }),
  watch: {
    search: {
      handler() {
        this.buscarReportes()
      },
      immediate: false
    }
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('reportesCovid')
    },
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getReportes()
  },
  methods: {
    buscarReportes: lodash.debounce(function () {
      this.reportesFiltrados = this.search
          ? this.reportesFull.filter(x => (x.id === parseInt(this.search) || x.nombre.toLowerCase().search(this.search.toLowerCase()) > -1) || (x.descripcion.toLowerCase().search(this.search.toLowerCase()) > -1))
          : this.clone(this.reportesFull)
    }, 200),
    crearReporte() {
      this.$refs.registroReporte.open()
    },
    editarReporte(reporte) {
      this.$refs.registroReporte.open(reporte.id)
    },
    seleccionarReporte(reporte) {
      let copyReporte = this.clone(reporte)
      copyReporte.variables.map(x => {
        x.value = null
      })
      this.$refs.generadorReporte.open(copyReporte)
    },
    getReportes() {
      this.loading = true
      this.axios.get(`reportes`)
          .then(response => {
            this.reportesFull = response.data
            this.reportesFiltrados = this.clone(this.reportesFull)
            this.loading = false
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los registros de los reportes.`,
              error: error
            })
            this.loading = false
          })
    }
  }
}
</script>

<style>
.CodeMirror-gutter-wrapper {
  left: -34px !important;
}

.CodeMirror-gutters {
  left: 0px !important;
}
</style>