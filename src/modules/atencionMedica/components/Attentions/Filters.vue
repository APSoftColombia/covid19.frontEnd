<template>
  <v-row justify="end" fill-height>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.departamento"
          label="Departamento"
          name="departamento"
          :items="departamentosFiltrados"
          item-text="nombre"
          item-value="codigo"
          hide-details
      >
      </c-select-complete>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          :disabled="!filters.models.departamento"
          v-model="filters.models.municipio"
          label="Municipio"
          name="municipio"
          :items="departamentosFiltrados.length && filters.models.departamento ? departamentosFiltrados.find(x => x.codigo === filters.models.departamento).municipios : []"
          item-text="nombre"
          item-value="codigo"
          hide-details
      >
      </c-select-complete>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fechaRegistro"
          label="Fecha de Registro"
          :max="moment().format('YYYY-MM-DD')"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado"
          label="Estado"
          :items="complementos.estados || []"
          item-text="text"
          item-value="value"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.pertenenciaEtnica"
          label="Pertenencia Étnica"
          :items="complementos.pertenenciasEtnicas || []"
          item-text="text"
          item-value="value"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.grupoPoblacional"
          label="Grupo Poblacional"
          :items="complementos.gruposPoblacionales || []"
          item-text="text"
          item-value="value"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-select-complete
          v-model="filters.models.prestador"
          label="Prestador"
          :items="complementos.prestadores || []"
          item-text="nombre"
          item-value="codigohabilitacion"
          hide-details
      />
    </v-col>
<!--    <v-col cols="12" sm="12" md="6">-->
<!--      <c-select-complete-->
<!--          v-model="filters.models.usuario"-->
<!--          label="Usuario que registra"-->
<!--          :items="complementos.usuarios || []"-->
<!--          item-text="name"-->
<!--          item-value="id"-->
<!--          hide-details-->
<!--      />-->
<!--    </v-col>-->
  </v-row>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'Filters',
  props: {
    rutaBase: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    filters: {
      models: {
        departamento: null,
        municipio: null,
        fechaRegistro: [],
        estado: null,
        prestador: null,
        pertenenciaEtnica: null,
        grupoPoblacional: null,
        usuario: null
      }
    }
  }),
  computed: {
    ...mapState('atencionMedicaRCVModule', ['complementos']),
    ...mapGetters([
      'departamentos'
    ]),
    departamentosFiltrados() {
      return this.departamentos?.length ? this.departamentos.filter(x => ['15', '41'].find(z => z === x.codigo)) : []
    }
  },
  watch: {
    'filters.models.departamento': {
      handler() {
        this.filters.models.municipio = null
      },
      immediate: false
    }
  },
  created() {
    this.getComplements()
  },
  methods: {
    applyFilters() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.departamento !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento]=' + this.filters.models.departamento
      }
      if (this.filters.models.municipio !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio]=' + this.filters.models.municipio
      }
      if (this.filters.models.fechaRegistro.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[updatedBetween]=' + this.filters.models.fechaRegistro.join(',')
      }
      if (this.filters.models.estado !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
      }
      if (this.filters.models.pertenenciaEtnica !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[codigo_pertenencia_etnica]=' + this.filters.models.pertenenciaEtnica
      }
      if (this.filters.models.grupoPoblacional !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[grupo_poblacional]=' + this.filters.models.grupoPoblacional
      }
      if (this.filters.models.prestador !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[codigo_ips_primer_nivel]=' + this.filters.models.prestador
      }
      if (this.filters.models.usuario) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[user_id]=' + this.filters.models.usuario
      }
      this.$emit('filtra', rutaTemp)
    },
    getComplements(){
      this.$store.dispatch('atencionMedicaRCVModule/getComplements')
    }
  }
}
</script>