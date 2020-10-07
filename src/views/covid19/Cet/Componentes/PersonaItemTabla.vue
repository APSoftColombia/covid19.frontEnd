<template>
  <v-list-item class="pa-0">
    <div class="mr-2">
      <icon-tooltip v-if="[this.value.fecha_expedicion, this.value.codigo_departamento, this.value.codigo_municipio, this.value.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
      <v-icon v-if="this.value.autoriza_eps">fas fa-dollar-sign</v-icon>
    </div>
    <v-icon large class="mr-2">{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
    <v-list-item-content class="pa-0">
      <v-list-item-title>
        {{this.value.nombre}}
      </v-list-item-title>
      <v-list-item-subtitle :class="`body-2 text-truncate`">{{this.value.tipoIdentificacion}} {{this.value.identificacion}}{{this.value.celular ? ', Cel. ' + this.value.celular : ''}}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: "PersonaItemTabla",
    props: {
      value: {
        type: Object,
        Default: null
      }
    },
  }
</script>

<style scoped>

</style>