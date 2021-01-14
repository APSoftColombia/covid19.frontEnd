<template>
  <v-container fluid>
    <page-title-bar title="Asignación de encuestas a rastreo"></page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
              v-model="seleccionados"
              :headers="headers"
              :items="items"
              item-key="name"
              show-select
              class="elevation-1"
          >
            <template v-slot:item.identificacion="{ item }">
              <v-list-item class="pa-0">
                <v-icon color="primary" large class="mr-2">{{item.sexo === null ? 'mdi mdi-emoticon-happy' : item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">{{[item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')}}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ [tiposDocumentoIdentidad && item.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : null, item.identificacion].filter(x => x).join(' ') }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.celular="{ item }">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">Celular: {{ item.celular || '' }}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">Email: {{ item.email || '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.direccion="{ item }">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">{{ [municipiosTotal && item.municipio_id ? municipiosTotal.find(x => x.id === item.municipio_id).nombre : null, departamentos && item.departamento_id ? departamentos.find(x => x.id === item.departamento_id).nombre : null].filter(x => x).join(', ') }}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ item.direccion || '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:top>
              <asignador
                  v-if="seleccionados.length"
                  :seleccionados="seleccionados"
                  :rastreadores="rastreadores"
                  @guardado="getTamizajesPendientes"
              />
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
        text: 'Ubicación',
        sortable: false,
        value: 'direccion'
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
      this.axios.get(`users-role?role=Médico`)
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