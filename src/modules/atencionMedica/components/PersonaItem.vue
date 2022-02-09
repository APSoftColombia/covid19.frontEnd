<template>
  <v-list-item class="pa-0">
    <v-icon
        v-if="value.positivo_covid && verDiagnosticados"
        class="mr-2"
        large
    >
      fas fa-virus
    </v-icon>
    <v-card
        align="center"
        color="transparent"
        class="elevation-0"
    >
      <v-icon large>{{value.sexo === 'M' ? 'mdi mdi-face' : value.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi-account'}}</v-icon>
    </v-card>
    <v-list-item-content class="py-1">
      <v-list-item-title class="body-2 text-truncate">
        {{[value.primer_nombre, value.segundo_nombre, value.primer_apellido, value.segundo_apellido].filter(x => x).join(' ')}}
      </v-list-item-title>
      <v-list-item-subtitle class="body-2 text-truncate">
        {{[value.tipo_identificacion || '', value.numero_identificacion].filter(x => x).join('')}}
        <template v-if="value.telefono">
          Tel.
          <a
              :href="`tel:${value.telefono}`"
              :style="`color: ${colorText}; text-decoration: underline;`"
          >
            {{ value.telefono }}
          </a>
        </template>
      </v-list-item-subtitle>
      <v-list-item-action-text v-if="value.alcohol || value.tabaquismo || value.sedentarismo">
        <c-tooltip
            v-if="value.alcohol !== null"
            :disabled="value.alcohol !== 1"
            top
            tooltip="Alcohol"
        >
          <v-icon
              class="mr-2"
              :color="value.alcohol === 1 ? 'orange' : 'grey lighten-2'"
          >
            mdi-glass-mug-variant
          </v-icon>
        </c-tooltip>
        <c-tooltip
            v-if="value.tabaquismo !== null"
            :disabled="value.tabaquismo !== 1"
            top
            tooltip="Tabaquismo"
        >
          <v-icon
              class="mr-2"
              :color="value.tabaquismo === 1 ? 'orange' : 'grey lighten-2'"
          >
            mdi-smoking
          </v-icon>
        </c-tooltip>
        <c-tooltip
            v-if="value.sedentarismo !== null"
            :disabled="value.sedentarismo !== 1"
            top
            tooltip="Sedentarismo"
        >
          <v-icon
              class="mr-2"
              :color="value.sedentarismo === 1 ? 'orange' : 'grey lighten-2'"
          >
            mdi-seat
          </v-icon>
        </c-tooltip>
      </v-list-item-action-text>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'PersonaItem',
        props: {
            value: {
                type: Object,
                Default: null
            },
            isNotFromNexos: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            goSeguimiento(){
                this.$refs.seguimiento.open(this.value.erp_origen)
            }
        },
        computed: {
          ...mapGetters([
            'labspTiposDocumento'
          ]),
            colorText () {
            return this.value.total_riesgo > 50 ? 'white' : ''
            }
        }
    }
</script>

<style scoped>

</style>