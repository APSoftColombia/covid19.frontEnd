<template>
  <v-container fluid>
    <page-title-bar title="Asignación de reportes para rastreo"></page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
              v-model="seleccionados"
              :headers="headers"
              :items="items"
              show-select
              class="elevation-1"
          >
            <template v-slot:item.identificacion="{ item }">
              <v-list-item class="pa-0">
                <v-icon color="primary" large class="mr-2">{{item.sexo === null ? 'mdi mdi-emoticon-happy' : item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">{{[item.nombres].filter(x => x).join(' ')}}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ [tiposDocumentoIdentidad && item.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : null, item.identificacion].filter(x => x).join(' ') }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.celular="{ item }">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">Celular: {{ item.celular || '' }}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ [municipiosTotal && item.municipio_id ? municipiosTotal.find(x => x.id === item.municipio_id).nombre : null, departamentos && item.departamento_id ? departamentos.find(x => x.id === item.departamento_id).nombre : null].filter(x => x).join(', ') }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ item.direccion || '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.observaciones="{ item }">
              <div style="white-space: initial !important;">{{item.observaciones}}</div>
            </template>
            <template v-slot:top>
              <v-expand-transition>
                <v-container fluid class="px-2 py-0" v-if="seleccionados.length">
                  <v-row>
                    <v-col cols="12" justify="end" align="end">
                      <asignador
                          :seleccionados="seleccionados"
                          :rastreadores="rastreadores"
                          @guardado="getTamizajesPendientes"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-expand-transition>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <app-section-loader :status="loading"></app-section-loader>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import Asignador from 'Views/covid19/tamizaje/asignacionRastreo/Asignador'
export default {
  name: 'AsignacionRastreo',
  components: {Asignador},
  data: () => ({
    loading: false,
    seleccionados: [],
    rastreadores: [],
    headers: [
      {
        text: 'Persona',
        sortable: false,
        value: 'identificacion'
      },
      {
        text: 'Contacto',
        sortable: false,
        value: 'celular'
      },
      {
        text: 'Observaciones',
        sortable: false,
        value: 'observaciones'
      },
      {
        text: 'Fecha de creacion',
        sortable: false,
        value: 'created_at'
      }
    ],
    items: []
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal'
    ])
  },
  created () {
    this.getTamizajesPendientes()
    this.getRastreadores()
  },
  methods: {
    getTamizajesPendientes() {
      this.loading = true
      this.axios.get(`tamizajes-asignacion`)
          .then(response => {
            this.seleccionados = []
            this.items = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los registros de personas sin encuesta.`, error: error})
          })
    },
    getRastreadores() {
      this.axios.get(`users-role?role=Agente Rastreador`)
          .then(response => {
            this.rastreadores = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los registros de los rastreadores.`,
              error: error
            })
          })
    }
  }
}
</script>

<style scoped>

</style>