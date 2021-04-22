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
            <v-toolbar-title id="inicio">Detalle {{ estadoAfiliado.id }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid>
            <datos-afiliado :afiliado="estadoAfiliado" :abierto="datosAbierto"></datos-afiliado>
            <v-data-table
                :headers="headers"
                :items="estadoAfiliado.seguimientos"
                class="elevation-1 mt-4"
                :loading="loadingTable"
                loading-text="Cargando... por favor espere"
            >
                <template v-slot:progress>
                    <v-progress-linear color="purple" :height="5" indeterminate></v-progress-linear>
                </template>
                <template v-slot:top>
                <v-toolbar
                    flat
                >
                    <v-toolbar-title>Listado de Seguimientos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="crearNuevoSeguimiento"
                    >
                        Nuevo Seguimiento
                    </v-btn>
                </v-toolbar>
                </template>
                <template v-slot:item.examenes="{ item }">
                    <template v-for="(examen, index) in item.examenes">
                        <v-chip-group
                            :key="index"
                            column
                            multiple
                        >
                            <v-chip x-small label class="white--text" color="indigo">
                                <span class="text-truncate">{{ examen.examen.prueba }}</span>
                            </v-chip>
                        </v-chip-group>
                    </template>
                    <span v-if="item.examenes && !item.examenes.length">Sin examenes</span>
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
                    class="mr-2"
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
                  <v-icon
                      small
                      @click="openInfo(item.id)"
                  >
                    fas fa-info-circle
                  </v-icon>
                </template>
                <template v-slot:no-data>
                    <div class="title grey--text text-center pa-4">No hay registros para mostrar</div>
                </template>
            </v-data-table>
        </v-container>
      <detalle-seguimiento
          ref="detalleSeguimiento"
      ></detalle-seguimiento>
      <form-seguimientos
        ref="formSeguimientos"
        @refresh="getAfiliado"
      ></form-seguimientos>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
const DatosAfiliado = () => import('Views/aps/rcv/encuestas/components/DatosAfiliado')
const DetalleSeguimiento = () => import('Views/aps/rcv/cuentaAltoCosto/components/DetalleSeguimiento.vue')
const FormSeguimientos = () => import('Views/aps/rcv/cuentaAltoCosto/components/FormSeguimientos.vue')
export default {
    name: "verCuentaAltoCosto",
    components: {
        DatosAfiliado,
        DetalleSeguimiento,
        FormSeguimientos
    },
    data: () => ({
        loading: false,
        dialog: false,
        dialogDelete: false,
        dialogNuevaBitacora: false,
        datosAbierto: false,
        estadoAfiliado: {},
        headers: [
            { text: 'Id.', value: 'id'},
            { text: 'Ingreso Nefro.', value: 'ingreso_nefroproteccion' },
            { text: 'Clasf. IMC', value: 'clasificacion_imc' },
            { text: 'Clasf. RCV', value: 'clasificacion_rcv' },
            { text: 'Examenes', value: 'examenes' },
            { text: 'Observaciones', value: 'observaciones' },
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
        openInfo(seguimiento_id){
            this.$refs.detalleSeguimiento.open(seguimiento_id)
        },
        close(){
            this.datosAbierto = false
            this.dialog = false
            this.loading = false
            this.$emit('close')
        },
        crearNuevoSeguimiento() {
            this.$refs.formSeguimientos.open(null, null, this.estadoAfiliado.sexo)
        },
        editItem(item) {
            this.$refs.formSeguimientos.open(item, this.estadoAfiliado.id, this.estadoAfiliado.sexo)
        },
        deleteItem(item) {
            console.log("delete", item);
        },
        getAfiliado(id_afiliado) {
            this.loadingTable = true
            this.loading = true
            this.axios.get(`cuenta-alto-costo/${id_afiliado}`)
                .then(response => {
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
