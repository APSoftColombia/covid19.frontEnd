<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <v-card>
      <v-card-title>
        Eliminar Seguimiento
      </v-card-title>
      <v-card-text>
        ¿Esta seguro de eliminar el seguimiento seleccionado?
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false" :loading="loading" :disabled="loading">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="eliminar" :loading="loading" :disabled="loading" class="white--text" color="indigo">
          <v-icon left>fas fa-save</v-icon>
          <span>Aceptar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "EliminarSeguimiento",
    data: () => ({
      dialog: false,
      loading: false,
      seguimiento_id: null
    }),
    methods: {
      open(seguimiento_id = null){
        this.seguimiento_id = seguimiento_id
        this.dialog = true
      },
      eliminar(){
        this.loading = true
        this.axios.delete(`seguimientos/${this.seguimiento_id}`).then(() => {
            this.loading = false
            this.$emit("refresh")
            this.dialog = null
            this.seguimiento_id = null
        }).catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al borrar el seguimiento`, error: error})
        });
      }
    }
  }
</script>

<style scoped>

</style>
