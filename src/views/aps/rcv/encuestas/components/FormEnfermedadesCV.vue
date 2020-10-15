<template>
  <v-row>
    <v-col class="pb-0" cols="12">
      <v-card outlined tile>
        <v-card-text>
          <c-check
              label="¿Cuales?"
              v-model="lasEnfermedades"
              :rules="'required'"
              name="enfermedades cardiovasculares"
              :items="enfermedades"
          >
          </c-check>
        </v-card-text>
        <v-col cols="12">
          <c-texto
              v-model="otra_enfermedad_cv"
              label="¿Que otra enfermedad?"
              name="otro examen"
              rules="required"
              v-if="otraEnfermedadF()"
          ></c-texto>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "FormEnfermedadesCV",
    props: {
      arrayEnfermedades: {
        type: [Array, String, Number, Boolean],
        default: () => []
      },
      enfermedades: {
        type: Array,
        default: () => []
      },
      otraEnfermedad: {
        type: String,
        default: null
      }
    },
    data: () => ({
      lasEnfermedades: [],
      otra_enfermedad_cv: null
    }),
    watch: {
      'arrayEnfermedades': {
        handler (val) {
          this.lasEnfermedades = val
        },
        immediate: true
      },
      'otraEnfermedad': {
        handler (val) {
          this.otra_enfermedad_cv = val
        },
        immediate: true
      },
      'lasEnfermedades': {
        handler (val) {
          this.$emit('changueEnfermedades', val)
        },
        immediate: false
      },
      'otra_enfermedad_cv': {
        handler (val) {
          this.$emit('changeOtraEnfermedad', val)
        },
        immediate: false
      }
    },
    methods: {
      otraEnfermedadF(){
        if(this.lasEnfermedades.find(enfermedad => enfermedad === 'Otro')){
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>

</style>