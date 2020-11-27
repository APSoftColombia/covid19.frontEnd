<template>
  <v-list-item class="pa-0">
    <div class="mr-2">
      <v-icon class="mr-2" v-if="this.value.covid_contacto === 1">fas fa-virus</v-icon>
      <v-tooltip top v-if="this.value.contactosPorDiligenciar > 0">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon >
            <v-icon color="orange">fas fa-users-slash</v-icon>
          </v-btn>
        </template>
        <span>Hay contactos vinculados con campos sin diligenciar</span>
      </v-tooltip>
      <v-tooltip top v-if="this.value.sin_beneficiarios && this.value.comparte_gastos">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon>
            <v-icon size="32px">mdi mdi-currency-usd-off</v-icon>
          </v-btn>
        </template>
        <span>Sin contactos beneficiarios</span>
      </v-tooltip>
      <icon-tooltip v-if="[this.value.fecha_expedicion, this.value.codigo_departamento, this.value.codigo_municipio, this.value.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
      <v-icon v-if="this.value.autoriza_eps" size="32px">mdi mdi-currency-usd</v-icon>
      <v-icon class="mr-2" v-if="this.value.fue_confirmado === 1" color="orange">fas fa-virus</v-icon>
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