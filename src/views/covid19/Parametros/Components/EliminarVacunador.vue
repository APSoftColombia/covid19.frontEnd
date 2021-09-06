<template>
  <v-dialog v-model="dialog" width="720px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn color="error" v-on="on" small icon>
        <v-icon>fas fa-trash-alt</v-icon>
      </v-btn>
    </template>
    <v-card v-if="vacunador">
      <v-toolbar dark color="error">
        <v-icon left>fas fa-trash-alt</v-icon>
        <v-toolbar-title>Eliminar Vacunador</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <div class="m-6">
          <p> ¿Esta seguro de eliminar al vacunador {{ `${vacunador.nombre1} ${vacunador.nombre2} ${vacunador.apellido1} ${vacunador.apellido2}` }}?</p>
        </div>
      </v-container>
      <v-card-actions>
        <v-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click.stop="eliminar" class="error white--text">
          <v-icon left>fas fa-save</v-icon>
          <span>Aceptar</span>
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EliminarVacunador",
  props: {
    vacunador: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    loading: false
  }),
  methods: {
    eliminar(){
      this.loading = true
      this.axios.delete(`vacunadores/${this.vacunador.id}`).then(response => {
        this.$store.commit('snackbar', {
          color: 'success',
          message: response.data.message
        })
        this.$emit('reloadTable')
        this.loading = false
        this.dialog = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {
          color: 'error',
          message: ` al eliminar vacunador`,
          error: error
        })
      })
    }
  }
}
</script>

<style scoped>

</style>