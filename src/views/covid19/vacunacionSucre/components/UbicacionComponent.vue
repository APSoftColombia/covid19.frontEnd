<template>
  <v-list-item class="pl-0">
    <v-list-item-content style="display: grid !important">
      <v-list-item-title class="body-2"
        >{{ direccion || '' }}</v-list-item-title
      >
      <v-list-item-subtitle class="body-1">
        {{ municipiosTotal && municipiosTotal.length &&
        municipio_id && municipiosTotal.find(x => x.codigo ===
        municipio_id) ? `${municipiosTotal.find(x => x.codigo ===
        municipio_id).nombre}, ${municipiosTotal.find(x => x.codigo
        === municipio_id).departamento.nombre}` : '' }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UbicacionComponent",
  props: {
    municipio_id: {
      type: String,
      required: true,
    },
    direccion: {
        type: String,
        required: true
    },
  },
  computed: {
    ...mapGetters(["municipiosTotal"]),
  },
};
</script>

<style scoped>
</style>