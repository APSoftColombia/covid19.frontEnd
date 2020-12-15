<template>
  <v-row align="center" justify="end" fill-height>
    <v-col cols="12" sm="6" md="4" v-if="verDiagnosticados">
      <c-select-complete
          v-model="filters.models.diagnostico"
          label="Diagnóstico"
          :items="tiposResultadosCovid"
          item-text="text"
          item-value="value"
          hide-details
      >
      </c-select-complete>
    </v-col>
    <v-col cols="12" sm="6" md="4"
           v-if="complementos.departamentos && complementos.departamentos.length > 1">
      <c-select-complete
          v-model="filters.models.departamentos"
          label="Departamento"
          :items="complementos.departamentos"
          item-value="id"
          item-text="nombre"
          multiple
          @change="filters.models.municipios = []"
          hide-details
      >
      </c-select-complete>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.municipios"
          label="Municipio"
          :items="filters.models.departamentos && filters.models.departamentos.length ? complementos.municipios.filter(x => filters.models.departamentos.find(z => z === x.departamento_id)) : complementos.municipios"
          item-value="id"
          item-text="nombre"
          multiple
          hide-details
      >
      </c-select-complete>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'Filtros',
  props: {
    rutaBase: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    complementos: [],
    filters: {
      models: {
        diagnostico: null,
        departamentos: [],
        municipios: []
      }
    }
  }),
  computed: {
    ...mapGetters([
      'tiposResultadosCovid'
    ])
  },
  created() {
    this.getComplementos()
  },
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.diagnostico !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[positivo_covid]=' + this.filters.models.diagnostico
      }
      if (this.filters.models.departamentos.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento_id]=' + this.filters.models.departamentos.join(',')
      }
      if (this.filters.models.municipios.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipios.join(',')
      }
      this.$emit('filtra', rutaTemp)
    },
    limpiarFiltros(){
          this.filters.models.diagnostico = null
          this.filters.models.departamentos = []
          this.filters.models.municipios = []
    },
    getComplementos() {
      this.axios.get(`complementos-tamizajes`)
          .then(response => {
            this.complementos = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los complementos para los filtros del mapa covid-19.`,
              error: error
            })
          })
    }
  }
}
</script>

<style scoped>

</style>