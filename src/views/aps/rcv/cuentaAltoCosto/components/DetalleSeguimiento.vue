<template>
  <v-dialog v-model="dialog" max-width="1100px" persistent>
    <v-card>
      <v-card-title>
        Detalle de seguimiento {{ seguimiento.id }}
        <v-spacer></v-spacer>
        <v-btn icon text @click="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-tabs
              class="mt-3"
              id="tabsDetalleSeguimiento"
              v-model="tab"
              fixed-tabs
              right
              icons-and-text
              show-arrows
              :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : tab === 'tab-4' ? 'deep-purple' : 'teal'"
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
              Examenes
              <v-icon>fas fa-folder-open</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
                Control Tension
              <v-icon>fas fa-heartbeat</v-icon>
            </v-tab>

            <v-tab href="#tab-3">
              Consultas AC
              <v-icon>fas fa-clipboard-list</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" class="mt-2" touchless>
            <v-tab-item value="tab-1" class="text-center">
              <examenes
                  :examenes="seguimiento.examenes"
                  :seguimiento="{seguimiento_id: seguimiento.id, afiliado_id: seguimiento.afiliado_id}"
                  @refresh="getInfoSeguimiento"
              ></examenes>
              <span class="font-weight-bold"
                    v-if="seguimiento && seguimiento.examenes && !seguimiento.examenes.length"
              >Sin resultados de examenes</span>
            </v-tab-item>
            <v-tab-item value="tab-2" class="text-center">
              <controles
                  :controles="seguimiento.controles"
                  :seguimiento="{seguimiento_id: seguimiento.id, afiliado_id: seguimiento.afiliado_id}"
                  @refresh="getInfoSeguimiento"
              ></controles>
              <span class="font-weight-bold"
                    v-if="seguimiento && seguimiento.controles && !seguimiento.controles.length"
              >Sin controles de tension</span>
            </v-tab-item>
            <v-tab-item value="tab-3" class="text-center">
              <consultas-a-c
                  :consultas="seguimiento.consultas"
                  :seguimiento="{seguimiento_id: seguimiento.id, afiliado_id: seguimiento.afiliado_id}"
                  @refresh="getInfoSeguimiento"
              ></consultas-a-c>
              <span class="font-weight-bold"
                    v-if="seguimiento && seguimiento.consultas && !seguimiento.consultas.length"
              >Sin consultas AC</span>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn block text @click="close">Cerrar</v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
const Examenes = () => import('./Examenes')
const Controles = () => import('./Controles')
const ConsultasAC = () => import('./ConsultasAC')
export default {
  name: "DetalleSeguimiento",
  components: {
    Examenes,
    Controles,
    ConsultasAC
  },
  data: () => ({
    dialog: false,
    seguimiento: {},
    tab: null,
    loading: false
  }),
  methods: {
    open(seguimiento_id){
      this.getInfoSeguimiento(seguimiento_id)
      this.dialog = true
    },
    getInfoSeguimiento(id){
      this.loading = true
      this.axios.get(`detalle-seguimiento/${id}`).then(response => {
        this.seguimiento = response.data
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {color: 'error', message: `al solicitar detalle del seguimiento.`, error: error})
        this.loading = false
      })
    },
    close(){
      this.dialog = false
      this.tab = null
      this.loading = false
      this.seguimiento = {}
    }
  }
}
</script>

<style scoped>


</style>
