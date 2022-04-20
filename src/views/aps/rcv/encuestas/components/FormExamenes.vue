<template>
  <v-row dense>
    <v-col cols="12">
      <v-card
          outlined
          tile
      >
        <v-card-text>
          <c-check
              label="17. ¿Que examenes le tomaron?"
              v-model="losExamenes"
              :rules="sinExamenes ? '' : 'required'"
              name="examenes"
              :items="examenes"
              :disabled="sinExamenes"
          />
          <v-checkbox
              class="mt-1 ml-2"
              v-model="sinExamenes"
              label="No sabe o no recuerda"
              hide-details
          />
        </v-card-text>
        <v-col
            v-if="otroExamenF()"
            cols="12"
        >
          <c-texto
              v-model="otro_examen"
              label="¿Que otro examen?"
              name="otro examen"
              :rules="sinExamenes ? '' : 'required'"
          />
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FormExamenes',
  props: {
    arrayExamenes: {
      type: [Array, String, Number, Boolean],
      default: () => []
    },
    examenes: {
      type: Array,
      default: () => []
    },
    otroExamen: {
      type: String,
      default: null
    }
  },
  data: () => ({
    sinExamenes: false,
    losExamenes: [],
    otro_examen: null
  }),
  watch: {
    'arrayExamenes': {
      handler(val) {
        this.losExamenes = val
      },
      immediate: true
    },
    'otroExamen': {
      handler(val) {
        this.otro_examen = val
      },
      immediate: true
    },
    'sinExamenes': {
      handler(val) {
        if (val) {
          this.$emit('changeExamenes', ['No sabe o no recuerda'])
        } else {
          this.$emit('changeExamenes', [])
        }
      },
      immediate: false
    },
    'losExamenes': {
      handler(val) {
        this.$emit('changeExamenes', val)
      },
      immediate: false
    },
    'otro_examen': {
      handler(val) {
        this.$emit('changeOtroExamen', val)
      },
      immediate: false
    }
  },
  methods: {
    noSaber() {
      this.sinExamenes = true
    },
    otroExamenF() {
      if (this.losExamenes.find(examen => examen === 'Otro')) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>