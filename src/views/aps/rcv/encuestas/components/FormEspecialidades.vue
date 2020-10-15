<template>
  <v-row>
    <v-col class="pb-0" cols="12">
      <v-card outlined tile>
        <v-card-text>
          <c-check
              label="15. ¿Qué especialidades?"
              v-model="lasEspecialidades"
              :rules="sinEspecialidades ? '' : 'required'"
              name="especialidades"
              :items="especialidades"
              :disabled="sinEspecialidades"
          >
          </c-check>
          <v-checkbox
              class="mt-1 ml-2"
              v-model="sinEspecialidades"
              label="No sabe o no recuerda"
              hide-details
          ></v-checkbox>
        </v-card-text>
        <v-col cols="12">
          <c-texto
              v-model="otra_especialidad"
              label="¿Que otra especialidad?"
              name="otra especialidad"
              :rules="sinEspecialidades ? '' : 'required'"
              v-if="otraEspecialidadF()"
          ></c-texto>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FormEspecialidades',
  props: {
    arrayEspecialidades: {
      type: [Array, String, Number, Boolean],
      default: () => []
    },
    especialidades: {
      type: Array,
      default: () => []
    },
    otraEspecialidad: {
      type: String,
      default: null
    }
  },
  data: () => ({
    sinEspecialidades: false,
    lasEspecialidades: [],
    otra_especialidad: null,
  }),
  watch: {
    'arrayEspecialidades': {
      handler (val) {
        this.lasEspecialidades = val
      },
      immediate: true
    },
    'otraEspecialidad': {
      handler (val) {
        this.otra_especialidad = val
      },
      immediate: true
    },
    'sinEspecialidades': {
      handler (val) {
        if (val) {
          this.$emit('changeEspecialidades', ['No sabe o no recuerda'])
        }else{
          this.$emit('changeEspecialidades', [])
        }
      },
      immediate: false
    },
    'lasEspecialidades': {
      handler (val) {
        this.$emit('changeEspecialidades', val)
      },
      immediate: false
    },
    'otra_especialidad': {
      handler (val) {
        this.$emit('changeOtraEspecialidad', val)
      },
      immediate: true
    },
  },
  methods: {
    noSaber() {
      this.sinEspecialidades = true
    },
    otraEspecialidadF(){
      if(this.lasEspecialidades.find(especialidad => especialidad === 'Otra especialidad')){
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>

</style>