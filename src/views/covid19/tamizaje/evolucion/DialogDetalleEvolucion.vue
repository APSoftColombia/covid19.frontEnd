<template>
  <v-dialog v-model="dialog" max-width="920">
    <datos-evolucion v-if="evolucion" :evolucion="evolucion"></datos-evolucion>
  </v-dialog>
</template>

<script>
import DatosEvolucion from 'Views/covid19/tamizaje/evolucion/DatosEvolucion'

export default {
  name: 'DialogDetalleEvolucion',
  components: {
    DatosEvolucion
  },
  data: () => ({
    evolucion: null,
    dialog: false
  }),
  methods: {
    open(evolucion = null) {
      this.evolucion = evolucion
      this.dialog = true
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>