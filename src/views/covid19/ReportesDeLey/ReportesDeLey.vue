<template>
  <v-container fluid>
    <page-title-bar title="Reportes De Ley"></page-title-bar>
    <v-row>
      <v-col cols="12" sm="12" md="5">
        <v-card>
          <v-card-text v-if="reportesFiltrados.length === 0" class="text-center body-1 grey--text">
            No hay reportes para mostrar
          </v-card-text>
          <v-list two-line class="notification-wrap">
            <v-list-item-group v-model="indexSeleccionado" color="pink">
              <template v-for="(reporte, indexReporte) in reportesFiltrados">
                <v-hover v-slot:default="{ hover }" :key="`reporte${indexReporte}`">
                  <v-list-item @click="seleccionarReporte(reporte)">
                    <v-list-item-avatar class="my-1 align-self-center">{{reporte.id}}</v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-title><h5 class="mb-0 text-truncate">{{reporte.nombre}}</h5></v-list-item-title>
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal text-truncate">{{reporte.descripcion}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-hover>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="7">
        <generador-reporte v-if="seleccionado && seleccionado.id" :reporte="seleccionado"></generador-reporte>
        <v-card v-else>
          <v-card-text class="text-center headline">
            No hay un reporte seleccionado
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <app-section-loader :status="loading"></app-section-loader>
  </v-container>
</template>

<script>
  const GeneradorReporte = () => import('Views/covid19/ReportesDeLey/GeneradorReporte')

  export default {
    name: "ReportesDeLey",
    components: {
      GeneradorReporte
    },
    data: () => ({
      loading: false,
      reportesFull: [],
      reportesFiltrados: [],
      seleccionado: null,
      indexSeleccionado: null
    }),
    methods: {
      seleccionarReporte (reporte) {
        let copyReporte = this.clone(reporte)
        copyReporte.variables.map(x => {
          x.value = null
        })
        this.seleccionado = copyReporte
      },
      getReportes () {
        this.loading = true
        this.axios.get(`get-reportes-de-ley`).then(response => {
          this.reportesFull = response.data
          this.reportesFiltrados = this.clone(this.reportesFull)
          this.seleccionado = null
          this.indexSeleccionado = null

          this.loading = false
        })
        .catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: `al recuperar los registros de los reportes.`, error: error})
          this.loading = false
        })
      }
    },
    created () {
      this.getReportes()
    },
  }
</script>

<style scoped>

</style>