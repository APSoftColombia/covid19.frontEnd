<template>
  <v-row dense>
    <v-col cols="12">
      <v-card
          outlined
          tile
      >
        <v-card-text>
          <c-check
              label="1. Usted presenta ALGUNO de los siguientes síntomas: "
              v-model="losSintomas"
              :rules="sinSintomas ? '' : 'required'"
              name="sintomas"
              :items="sintomas"
              item-text="descripcion"
              item-value="id"
              :disabled="sinSintomas"
          />
          <v-checkbox
              class="mt-1 ml-2"
              v-model="sinSintomas"
              label="Ninguno de los anteriores"
              hide-details
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FormSIntomas',
  props: {
    arraySintomas: {
      type: [Array, String, Number, Boolean],
      default: () => []
    },
    sintomas: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    sinSintomas: false,
    losSintomas: []
  }),
  watch: {
    'arraySintomas': {
      handler(val) {
        this.losSintomas = val
      },
      immediate: true
    },
    'sinSintomas': {
      handler(val) {
        if (val) {
          this.$emit('changeSintomas', [])
        }
      },
      immediate: false
    },
    'losSintomas': {
      handler(val) {
        this.$emit('changeSintomas', val)
      },
      immediate: false
    }
  }
}
</script>
