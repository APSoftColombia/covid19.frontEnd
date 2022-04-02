<template>
  <div>
    <template v-if="(value.sintomas_covid || value.paciente_estudio_covid || value.contacto_covid) && !value.erp_id">
      <v-icon
          color="red"
          class="mr-1"
      >
        mdi-alert
      </v-icon>
      <span class="mr-1">Se requiere ERP</span>
      <v-tooltip
          v-if="permisos.tamizajeCrear"
          top
      >
        <template v-slot:activator="{on}">
          <v-btn
              depressed
              fab
              x-small
              color="primary"
              v-on="on"
              @click="$emit('crearTamizaje')"
          >
            <v-icon>fas fa-file-medical</v-icon>
          </v-btn>
        </template>
        <span>Crear ERP</span>
      </v-tooltip>
    </template>
    <template v-if="value.erp_id">
      <v-btn
          color="primary"
          @click="$emit('detalleTamizaje')"
      >
        <v-icon>mdi-file-find</v-icon>
        ERP {{ value.erp_id }}
      </v-btn>
    </template>
  </div>
</template>
<script>
export default {
  name: 'CrearEncuestaDemanda',
  props: {
    value: {
      Object,
      required: true
    }
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    }
  }
}
</script>