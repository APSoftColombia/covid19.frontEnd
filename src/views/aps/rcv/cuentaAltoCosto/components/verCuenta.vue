<template>
  <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <v-card>
        <v-toolbar dark color="primary">
            <v-icon left>far fa-clipboard</v-icon>
            <v-toolbar-title id="inicio">Detalle Cuenta alto costo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid>
            <datos-afiliado :afiliado="estadoAfiliado" :abierto="datosAbierto"></datos-afiliado>
            <v-tabs
                class="mt-3"
                id="tabsAltoCosto"
                v-model="tab"
                fixed-tabs
                right
                icons-and-text
                show-arrows
                :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : tab === 'tab-4' ? 'deep-purple' : 'teal'"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    href="#tab-1"
                >
                  Seguimientos
                  <v-icon>fas fa-chart-line</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-2"
                >
                  Examenes
                  <v-icon>fas fa-folder-open</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-3"
                >
                    Control Tension
                  <v-icon>fas fa-heartbeat</v-icon>
                </v-tab>
                <v-tab
                    href="#tab-4"
                >
                  Consultas AC
                  <v-icon>fas fa-clipboard-list</v-icon>
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="mt-2" touchless>
                <v-tab-item
                    value="tab-1"
                >
                  <span>Sin Seguimientos</span>
                </v-tab-item>
                <v-tab-item
                    value="tab-2"
                >
                  <span>Sin resultados de examenes</span>
                </v-tab-item>
                <v-tab-item
                    value="tab-3"
                >
                  <span>Sin controles de tension</span>
                </v-tab-item>
                <v-tab-item
                    value="tab-4"
                >
                  <span>Sin consultas Ac</span>
                </v-tab-item>
              </v-tabs-items>
        </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
const DatosAfiliado = () => import('Views/aps/rcv/encuestas/components/DatosAfiliado')
export default {
    name: "verCuentaAltoCosto",
    components: {
        DatosAfiliado
    },
    data: () => ({
        loading: false,
        dialog: false,
        dialogDelete: false,
        dialogNuevaBitacora: false,
        datosAbierto: false,
        estadoAfiliado: {},
        headers: [
            { text: 'Identificador', value: 'id'},
            { text: 'Fecha Creacion', value: 'fecha' },
            { text: 'Periodicidad (meses)', value: 'periodicidad_seguimientos' },
            { text: 'Alerta inmediata', value: 'alerta_inmediata' },
            { text: 'Tipifica. Pendientes', value: 'tipificaciones' },
            { text: 'Opciones', value: 'actions'}
        ],
        loadingTable: false,
        tab: null
    }),
    computed: {
        ...mapGetters([
            'complementosRCV'
        ])
    },
    methods: {
        open(item = null, abierto = false){
            this.dialog = true
            this.datosAbierto = abierto
            if(item && item.id) this.getAfiliado(item.id)
        },
        close(){
            this.datosAbierto = false
            this.dialog = false
            this.loading = false
            this.$emit('close')
        },
        getAfiliado(id_afiliado) {
            this.loadingTable = true
            this.loading = true
            this.axios.get(`cuenta-alto-costo/${id_afiliado}`)
                .then(response => {
                    console.log('response get encuesta', response)
                    this.loadingTable = false
                    this.estadoAfiliado = response.data
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                })
        },
    }

}
</script>

<style>

</style>