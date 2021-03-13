<template>
  <v-list-item class="pa-0" v-if="value">
    <v-icon color="red" large class="mr-2" v-if="value.positivo_covid">fas fa-virus</v-icon>
    <v-card align="center" color="transparent" class="elevation-0">
      <v-icon color="primary" large>{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
      <v-card-actions class="py-0 px-1" v-if="value && (typeof value.cantidad_nexos !== 'undefined')">
        <v-chip
            align="center"
            color="primary"
            class="font-weight-bold pl-2 pr-1"
            label
            x-small
        >
          <v-icon left x-small>
            fas fa-users
          </v-icon>
          <p class="ma-0 align-center">{{ value && value.cantidad_nexos ? value.cantidad_nexos : '0' }}</p>
        </v-chip>
      </v-card-actions>
    </v-card>
    <v-list-item-content class="pa-0">
      <v-list-item-title class="body-2 text-truncate">{{ [value.nombre1, value.nombre2, value.apellido1, value.apellido2].filter(x => x).join(' ') }}</v-list-item-title>
      <v-list-item-subtitle class="body-2 text-truncate">{{ [[value.tipo_identificacion && tiposDocumentoIdentidad ? tiposDocumentoIdentidad.find(x => x.id === value.tipo_identificacion).tipo : null, value.identificacion].filter(x => x).join(' '), this.value.telefono ? 'Tel: ' + this.value.telefono : null, this.value.edad ? "Edad: " + this.value.edad + "Años" : null].filter(z => z).join(', ') }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'PersonaItemTabla',
        props: {
            value: {
                type: Object,
                Default: null
            }
        },
        computed: {
          ...mapGetters([
            'tiposDocumentoIdentidad'
          ])
        }
    }
</script>

<style scoped>

</style>