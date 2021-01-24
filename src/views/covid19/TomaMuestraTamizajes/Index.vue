<template>
  <v-container fluid>
    <page-title-bar title="Asignación de Muestras"></page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
              v-model="seleccionados"
              :headers="headers"
              :items="muestras"
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <app-section-loader :status="loading"></app-section-loader>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'TomaMuestrasTamizajes',
  data: () => ({
    loading: false,
    seleccionados: [],
    muestras: [],
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
  },
  methods: {
    getTamizajesPendientes() {
      this.loading = true
      this.axios.get(`pruebas-asignacion-user`)
          .then(response => {
            this.seleccionados = []
            this.muestras = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los tamizajes con muestras pendientes`, error: error})
          })
    }
  }
}
</script>

<style scoped>

</style>