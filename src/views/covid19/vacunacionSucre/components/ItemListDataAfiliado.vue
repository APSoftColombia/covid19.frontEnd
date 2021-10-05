<template>
  <v-list-item class="pa-0">
    <v-icon large class="mr-2">{{
      this.sexo === "M" ? "mdi mdi-face" : "mdi mdi-face-woman"
    }}</v-icon>
    <v-list-item-content class="pa-0">
      <v-list-item-title :class="`body-2 text-truncate`">
        {{ this.nombre }}
      </v-list-item-title>
      <v-list-item-title :class="`body-2 text-truncate`">
        {{ calculaEdad(fecha_nacimiento).stringDate }}
      </v-list-item-title>
      <v-list-item-subtitle :class="`body-2 text-truncate`"
        >{{
          this.tipo_identificacion
        }}
        {{ this.numero_identificacion }}</v-list-item-subtitle
      >
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ItemListDataAfiliado",
  props: {
    sexo: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    tipo_identificacion: {
      type: String,
      required: true,
    },
    numero_identificacion: {
      type: String,
      required: true,
    },
    fecha_nacimiento: {
      type: String,
      required: true,
    }
  },
  computed: {
    ...mapGetters(["tiposDocumentoIdentidad"]),
  },
};
</script>

<style scoped>
</style>