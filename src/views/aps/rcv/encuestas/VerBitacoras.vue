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
            <v-toolbar-title id="inicio">Bitacoras</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container fluid>
            <datos-afiliado :afiliado="estadoAfiliado" :abierto="datosAbierto"></datos-afiliado>
            <v-data-table
                :headers="headers"
                :items="estadoAfiliado.bitacoras"
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
                    <v-toolbar-title>Listado de bitacoras</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    @click="crearNuevaBitacora"
                    >
                        Nueva bitacora
                    </v-btn>
                    <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                    </v-dialog> -->
                </v-toolbar>
                </template>
                <template v-slot:item.alerta_inmediata="{ item }">
                    <span>{{ item ? item.alerta_inmediata ? 'Si' : 'No' : '-' }}</span>
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
            <crear-bitacora ref="crearNuevaBitacora" @guardado="getAfiliado(estadoAfiliado.id)"></crear-bitacora>
        </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
const DatosAfiliado = () => import('Views/aps/rcv/encuestas/components/DatosAfiliado')
const CrearBitacora = () => import('Views/aps/rcv/encuestas/components/CrearBitacora')
export default {
    name: "verBitacoras",
    components: {
        DatosAfiliado,
        CrearBitacora
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
            { text: 'Bitacora', value: 'bitacora' },
            { text: 'Opciones', value: 'actions'}
        ],
        loadingTable: false
    }),
    methods: {
        open(item = null, abierto = false){
            this.dialog = true
            this.datosAbierto = abierto
            if(item && item.id_afiliado) this.getAfiliado(item.id_afiliado)
        },
        close(){
            this.datosAbierto = false
            this.dialog = false
            this.loading = false
            this.$emit('close')
        },
        crearNuevaBitacora(){
            this.$refs.crearNuevaBitacora.open(this.estadoAfiliado)
        },
        editItem(item){
            console.log(item);
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
                    this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                })
        },
    }

}
</script>

<style>

</style>