<template>
  <v-dialog v-model="dialog" persistent max-width="420">
    <v-card v-if="tamizaje && evolucion">
      <v-card-title>
        Estado del caso
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid class="text-center pt-2">
        El caso {{ tamizaje.id }} perteneciente a <strong>{{
          [tamizaje.nombre1, tamizaje.nombre2, tamizaje.apellido1, tamizaje.apellido2].filter(x => x).join(' ')
        }}</strong> se encuentra en estado <strong>{{ tamizaje.estado || 'Indefinido' }}</strong>
      </v-container>
      <v-card-actions>
        <v-btn color="error" @click.stop="asignar('Cerrado')">
          <v-icon class="mr-2">mdi-folder-lock</v-icon>
          {{ tamizaje.estado === 'Cerrado' ? 'Mantener Cerrado' : 'Cerrar Caso' }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="asignar('Abierto')">
          <v-icon class="mr-2">mdi-folder-lock-open</v-icon>
          {{ tamizaje.estado === 'Abierto' ? 'Mantener Abierto' : 'Abrir Caso' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalCierre',
  data: () => ({
    dialog: false,
    tamizaje: null,
    evolucion: null,
  }),
  methods: {
    close() {
      this.dialog = false
    },
    open(data) {
      this.dialog = true
      this.tamizaje = this.clone(data.tamizaje)
      this.evolucion = this.clone(data.evolucion)
      console.log('data', data)
    },
    asignar(estado) {
      this.evolucion.estado = estado
      this.$emit('guardado', this.clone(this.evolucion))
      this.dialog = false
      setTimeout(() => {
        this.tamizaje = null
        this.evolucion = null
      }, 500)
    }
  }
}
</script>

<style scoped>

</style>