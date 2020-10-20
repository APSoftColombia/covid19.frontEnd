<template>
  <v-dialog v-model="dialog" max-width="720px">
    <v-card>
      <v-card-title>
        Eliminar reporte comunitario
      </v-card-title>
      <v-card-text class="body-1">
        ¿Esta seguro de eliminar el reporte comunitario seleccionado?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" :loading="loading" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn @click="eliminarReporteComunitario" :loading="loading" :disabled="loading" class="white--text" color="indigo">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EliminarReporteComunitario",
  data: () => ({
    dialog: false,
    loading: false,
    reporteComunitario: null
  }),
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('covid')
    },
  },
  methods: {
    open(reporteComunitario){
      this.dialog = true
      this.reporteComunitario = reporteComunitario
    },
    close(){
      this.dialog = false
      this.reporteComunitario = null
      this.loading = false
    },
    eliminarReporteComunitario(){
      this.loading = true
      this.axios.delete(`reporte_covids/${this.reporteComunitario.id}`).then(response => {
        response
        this.close()
        this.$store.commit('snackbar', {
          color: 'success',
          message: `Reporte comunitario eliminado con exito`
        })
        this.$emit('reporteEliminado')
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al eliminar reporte comunitario'}`,
          error: error
        })
      })
    }
  }
}
</script>

<style scoped>

</style>