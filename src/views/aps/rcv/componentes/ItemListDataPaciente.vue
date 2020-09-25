<template>
  <v-list-item class="pa-0">
    <v-icon color="red" class="mr-1" v-if="value.positivo_covid">fas fa-virus</v-icon>
    <v-icon large class="mr-2">{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
    <v-list-item-content class="pa-0">
      <v-list-item-title :class="`body-2 text-truncate`">
        {{this.value.nombre}}
      </v-list-item-title>
      <v-list-item-subtitle :class="`body-2 text-truncate`">{{this.value.tipoIdentificacion}} {{this.value.identificacion}}{{this.value.celular ? ', Cel. ' + this.value.celular : ''}}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
    export default {
        name: 'ItemListDataPaciente',
        props: {
            value: {
                type: Object,
                Default: null
            }
        }
    }
</script>

<style scoped>

</style>