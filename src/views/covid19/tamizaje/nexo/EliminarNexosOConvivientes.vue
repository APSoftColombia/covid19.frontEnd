<template>
  <v-dialog v-model="dialog" max-width="720px">
    <v-card>
      <v-card-title>
        Eliminar {{ sonNexos ? 'nexo' : 'conviviente' }}
      </v-card-title>
      <v-card-text class="body-1">
        ¿Esta seguro de eliminar el {{ sonNexos ? 'nexo' : 'conviviente' }} seleccionado?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" :loading="loading" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn @click="eliminarNexoConviviente" :loading="loading" :disabled="loading" class="white--text" color="indigo">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "EliminarNexosOConvivientes",
    props: {
      sonNexos: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      permisos () {
        return this.$store.getters.getPermissionModule('covid')
      },
    },
    data: () => ({
      dialog: false,
      nexoConviviente: null,
      loading: false,
      idTamizaje: null,
    }),
    methods: {
      open(nexoConviviente, idTamizaje = null){
        this.dialog = true
        this.nexoConviviente = nexoConviviente
        this.idTamizaje = idTamizaje
      },
      close(){
        this.dialog = false
        this.nexoConviviente = null
        this.loading = false
      },
      eliminarNexoConviviente(){
        this.loading = true
        this.axios.delete(`reporte_covids/${this.nexoConviviente.id}`).then(response => {
          response
          this.close()
          this.$store.commit('snackbar', {
            color: 'success',
            message: `${this.sonNexos ? 'nexo' : 'conviviente'} eliminado con exito`
          })
          this.$emit('nexoOConvivienteEliminado', this.idTamizaje)
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {
            color: 'error',
            message: `al eliminar ${this.sonNexos ? 'nexo' : 'conviviente'}`,
            error: error
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>