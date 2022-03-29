<template>
  <div>
    <v-container
        fluid
        class="pt-0 grid-list-xl"
    >
      <v-row
          justify="space-between"
          class="px-4"
      >
        <section-tooltip title="Indicadores"/>
        <template v-if="permisos && permisos.descargarIndicadores">
          <v-tooltip
              v-if="$vuetify.breakpoint.smAndDown"
              top
          >
            <template v-slot:activator="{on}">
              <v-btn
                  large
                  icon
                  v-on="on"
                  color="red"
                  class="white--text mr-2 mt-2"
                  @click="getPDFIndicadores"
                  :loading="loadingIndicadores"
              >
                <v-icon>fas fa-file-download</v-icon>
              </v-btn>
            </template>
            <span>Descargar Indicadores</span>
          </v-tooltip>
          <v-btn
              v-else
              color="red"
              class="white--text mr-2 mt-2"
              @click="getPDFIndicadores"
              :loading="loadingIndicadores"
          >
            <v-icon left>fas fa-file-download</v-icon>
            Descargar Indicadores
          </v-btn>
        </template>
      </v-row>
      <v-row>
        <app-card
            heading="COVID-19"
            colClasses="col-md-12 col-sm-12"
            customClasses="mb-0 sales-widget"
            :fullScreen="true"
            :reloadable="true"
            :closeable="true"
            @onReload="$refs.totalTamizajes.getDataChart()"
        >
          <total-tamizajes-chart ref="totalTamizajes"/>
        </app-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TotalTamizajesChart from '../charts/TotalTamizajesChart'
import {mapGetters} from 'vuex'

export default {
  name: 'Indicadores',
  components: {
    TotalTamizajesChart
  },
  data: () => ({
    total: null,
    estudio: null
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'loadingIndicadores'
    ])
  },
  methods: {
    dataLoaded(data) {
      this.total = data.total
      this.estudio = data.estudio
    }
  }
};
</script>

<style>
g[aria-labelledby$="title"] {
  display: none;
}
</style>
