<template>
  <v-dialog
      v-model="dialog"
      max-width="720px"
  >
    <v-card>
      <v-card-title>
        Eliminar Bitacora
      </v-card-title>
      <v-card-text>
        ¿Esta seguro de eliminar la bitacora?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" :loading="loading" :disabled="loading">
          <span>Cerrar</span>
        </v-btn>
        <v-btn @click="deleteItem" :loading="loading" :disabled="loading" class="white--text" color="primary">
          <span>Aceptar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "EliminarBitacora",
    data: () => ({
      bitacora: null,
      dialog: false,
      loading: false
    }),
    methods: {
      deleteItem(){
        this.loading = true
        this.axios.delete(`bitacoras/${this.bitacora.id}`).then(response => {
          this.loading = false
          this.$emit('eliminada')
          this.dialog = false
          response
          this.$store.commit('snackbar', {color: 'success', message: 'Bitacora eliminada correctamente'})
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {
            color: 'error',
            message: ' al eliminar bitacora',
            error: error
          })
        })
      },
      open(bitacora){
        this.bitacora = bitacora
        this.dialog = true
      }
    }
  }
</script>

<style scoped>

</style>