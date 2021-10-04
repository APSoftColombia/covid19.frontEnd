<template>
  <v-dialog
      v-model="dialog"
      width="620px"
      persistent
  >
    <v-card>
      <v-toolbar dark color="error">
        <v-icon left>fas fa-trash-alt</v-icon>
        <v-toolbar-title>Eliminar Dependencia</v-toolbar-title>
        <v-spacer/>
        <v-btn
            icon
            dark
            @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <div
            v-if="item"
            class="m-6"
        >
          <p> ¿Esta seguro de eliminar la dependencia <strong>{{ `${item.dependencia}` }}</strong>?</p>
        </div>
      </v-container>
      <v-card-actions>
        <v-btn @click="dialog = false">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer/>
        <v-btn
            @click.stop="eliminar"
            class="error white--text"
        >
          <v-icon left>fas fa-save</v-icon>
          <span>Aceptar</span>
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EliminarDependencia',
  data: () => ({
    item: null,
    dialog: false,
    loading: false
  }),
  methods: {
    open (item) {
      this.item = item
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.loading = false
      setTimeout(() => {
        this.item = null
      }, 400)
    },
    eliminar(){
      this.loading = true
      this.axios.delete(`dependencias/${this.item.id}`).then(() => {
        this.$store.commit('snackbar', {
          color: 'success',
          message: 'La dependencia se eliminó correctamente'
        })
        this.$emit('guardado')
        this.close()
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {
          color: 'error',
          message: ` al eliminar la dependencia`,
          error: error
        })
      })
    }
  }
}
</script>