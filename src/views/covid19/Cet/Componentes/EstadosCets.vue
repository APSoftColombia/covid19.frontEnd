<template>
  <div class="text-center">
    <v-menu max-width="350px" v-if="value" offset-x left open-on-hover transition="slide-x-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-on="on"
               :color="`${value.aplica_devolucion ? 'red' : 'green'}`"
               icon
        >
          <v-icon size="20px">fas fa-info-circle</v-icon>
        </v-btn>
      </template>
      <v-list class="p-8">
        <v-list-item two-line class="text-center">
          <v-list-item-content class="pa-0">
            <v-list-item-title class="font-weight-bold">
              Descripción
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ value.descripcion }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: "EstadosCets",
    props: {
      value: {
        type: Object,
        Default: null
      },
    }
  }
</script>

<style scoped>

</style>
