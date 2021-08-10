<template>
  <v-container fluid>
    <page-title-bar title="Asignación de Muestras"></page-title-bar>
    <v-row>
      <v-col cols="12">
        <filtros @filtra="goDatos" :ruta-base="'pruebas-asignacion'"></filtros>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar"
                clearable
                hide-details
                outlined
                dense
                append-icon="search"
                @keyup.enter="reloadCurrentPage"
            ></v-text-field>
          </v-card-title>
          <v-data-table
              v-model="seleccionados"
              :headers="headers"
              :items="muestras"
              show-select
              class="elevation-1"
          >
            <template v-slot:item.identificacion="{ item }">
              <v-list-item class="px-0 py-1">
                <v-icon color="primary" large class="mr-2">{{item.sexo === null ? 'mdi mdi-emoticon-happy' : item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">{{[item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')}}</v-list-item-title>
                  <v-list-item-subtitle class="text-truncate">{{ [tiposDocumentoIdentidad && item.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : null, item.identificacion].filter(x => x).join(' ') }}</v-list-item-subtitle>
                  <v-list-item-title class="body-2 text-truncate">
                    <span v-if="item.celular">
                      <v-icon>mdi-cellphone-settings</v-icon>{{ item.celular }}
                    </span>
                    <span v-if="item.email">
                      <v-icon>mdi-email</v-icon>{{ item.email }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.nombre_eps" class="body-2 text-truncate">
                    {{ item.nombre_eps }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.estado="{ item }">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title v-if="item.prestador" class="body-2 text-truncate">
                    IPS Asignada: {{item.prestador}}
                  </v-list-item-title>
                  <v-list-item-title class="body-2 text-truncate">
                    {{
                      item.toma_prueba
                          ? `Tomada: ${moment(item.fecha_toma_prueba).format('DD/MM/YYYY HH:mm')}`
                          : !item.toma_prueba && item.toma_prueba !== null
                          ? `No Tomada: ${moment(item.updated_at).format('DD/MM/YYYY HH:mm')}`
                          : item.fecha_reprogramacion
                              ? `Reprogramada: ${moment(item.fecha_reprogramacion).format('DD/MM/YYYY')}`
                              : 'Pendiente'
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate" v-if="item.razon_no_toma">{{item.razon_no_toma}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:item.direccion="{ item }">
              <v-list-item class="pa-0">
                <v-list-item-content class="pa-0">
                  <v-list-item-title class="body-2 text-truncate">{{ [municipiosTotal && item.municipio_id && municipiosTotal.find(x => x.id === item.municipio_id) ? municipiosTotal.find(x => x.id === item.municipio_id).nombre : null, departamentos && item.departamento_id && departamentos.find(x => x.id === item.departamento_id) ? departamentos.find(x => x.id === item.departamento_id).nombre : null].filter(x => x).join(', ') }}</v-list-item-title>
                  <v-list-item-subtitle class="body-2 text-truncate">{{ item.direccion || '' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:top>
              <v-expand-transition>
                <v-container fluid class="px-2 py-0" v-if="seleccionados.length">
                  <v-row>
                    <v-col cols="12" justify="end" align="end">
                      <asignar-muestra
                          :seleccionados="seleccionados"
                          :muestras="muestras"
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
import AsignarMuestra from 'Views/covid19/AsignacionMuestras/AsignarMuestra'
const Filtros = () => import('Views/covid19/AsignacionMuestras/filtros.vue')
export default {
  name: 'AsignacionPruebas',
  components: {AsignarMuestra, Filtros},
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
        text: 'Ubicación',
        sortable: false,
        value: 'direccion'
      },
      {
        text: 'Estado',
        sortable: false,
        value: 'estado'
      }
    ],
    ruta: 'pruebas-asignacion',
    search: ''
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
  watch: {
    'search': {
      handler(val){
        if(!val){
          this.search = ''
          this.getTamizajesPendientes(false)
        }
        if(val && val.length === 0){
          this.getTamizajesPendientes(false)
        }
      }
    }
  },
  methods: {
    getTamizajesPendientes(loadingP = true) {
      if (loadingP){
        this.loading = true
      }
      this.axios.get(this.ruta + (this.ruta.indexOf('?') > -1 ? '&' : '?') + `filter[searchAsignacion]=${this.search}`)
          .then(response => {
            this.seleccionados = []
            this.muestras = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los registros de tamizajes que requieren pruebas.`, error: error})
          })
      },
      goDatos(val){
        this.ruta = val
        this.getTamizajesPendientes()
      },
      reloadCurrentPage(){
        this.getTamizajesPendientes(false)
      },
  },
}
</script>

<style scoped>

</style>
