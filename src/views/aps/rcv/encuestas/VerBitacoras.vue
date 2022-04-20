<template>
  <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
          dark
          color="primary"
      >
        <v-icon left>far fa-clipboard</v-icon>
        <v-toolbar-title id="inicio">Seguimientos RCV</v-toolbar-title>
        <v-spacer/>
        <v-btn
            icon
            dark
            @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <datos-afiliado
            :afiliado="estadoAfiliado"
            :abierto="datosAbierto"
        />
        <v-data-table
            :headers="headers"
            :items="estadoAfiliado.bitacoras"
            class="elevation-1 mt-4"
            :loading="loadingTable"
            loading-text="Cargando... por favor espere"
        >
          <template v-slot:progress>
            <v-progress-linear
                color="purple"
                :height="5"
                indeterminate
            />
          </template>
          <template v-slot:top>
            <v-toolbar
                flat
            >
              <v-toolbar-title>Listado de bitacoras</v-toolbar-title>
              <v-spacer/>
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="crearNuevaBitacora"
              >
                Nuevo Seguimiento
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.alerta_inmediata="{ item }">
            <span>{{ item ? item.alerta_inmediata ? 'Si' : 'No' : '-' }}</span>
          </template>
          <template v-slot:item.tipificaciones="{ item }">
            <template v-for="tipificacion in item.tipificaciones">
              <v-row
                  :key="tipificacion.id"
                  justify="center"
                  align="center"
              >
                <v-chip
                    v-if="!tipificacion.fecha_prestacion"
                    class="pa-4"
                    color="red"
                    outlined
                >
                  <template v-if="tipificacion.codigo_servicio">
                    {{ `Cod: ${tipificacion.codigo_servicio}` }}
                    <br>
                  </template>
                  {{
                    complementosRCV ? complementosRCV.ref_tipificaciones.find(x => x.id == tipificacion.reftipificacion_id).descripcion : ''
                  }}
                </v-chip>
              </v-row>
            </template>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <div class="title grey--text text-center pa-4">No hay registros para mostrar</div>
          </template>
        </v-data-table>
        <crear-bitacora
            ref="crearNuevaBitacora"
            @guardado="getAfiliado(estadoAfiliado.id)"
        />
        <eliminar-bitacora
            ref="eliminarBitacora"
            @eliminada="getAfiliado(estadoAfiliado.id)"
        />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

const DatosAfiliado = () => import('Views/aps/rcv/encuestas/components/DatosAfiliado')
const CrearBitacora = () => import('Views/aps/rcv/encuestas/components/CrearBitacora')
const EliminarBitacora = () => import('Views/aps/rcv/encuestas/components/EliminarBitacora')
export default {
  name: 'verBitacoras',
  components: {
    DatosAfiliado,
    CrearBitacora,
    EliminarBitacora
  },
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
    dialogNuevaBitacora: false,
    datosAbierto: false,
    estadoAfiliado: {},
    headers: [
      {text: 'Identificador', value: 'id'},
      {text: 'Fecha Creacion', value: 'fecha'},
      {text: 'Periodicidad (meses)', value: 'periodicidad_seguimientos'},
      {text: 'Alerta inmediata', value: 'alerta_inmediata'},
      {text: 'Tipifica. Pendientes', value: 'tipificaciones'},
      {text: 'Opciones', value: 'actions'}
    ],
    loadingTable: false
  }),
  computed: {
    ...mapGetters([
      'complementosRCV'
    ])
  },
  methods: {
    open(item = null, abierto = false) {
      this.dialog = true
      this.datosAbierto = abierto
      if (item && item.id_afiliado) this.getAfiliado(item.id_afiliado)
    },
    close() {
      this.datosAbierto = false
      this.dialog = false
      this.loading = false
      this.$emit('close')
    },
    crearNuevaBitacora() {
      this.$refs.crearNuevaBitacora.open(this.estadoAfiliado)
    },
    editItem(item) {
      this.$refs.crearNuevaBitacora.open(this.estadoAfiliado, item)
    },
    deleteItem(item) {
      this.$refs.eliminarBitacora.open(item)
    },
    getAfiliado(id_afiliado) {
      this.loadingTable = true
      this.loading = true
      this.axios.get(`bitacoras-afiliado/${id_afiliado}`)
          .then(response => {
            console.log('response get encuesta', response)
            this.loadingTable = false
            this.estadoAfiliado = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: 'al recuperar la encuesta.', error: error})
          })
    },
  }

}
</script>
