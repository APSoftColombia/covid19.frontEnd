<template>
  <v-row justify="end" fill-height>
    <v-col cols="12" sm="12" md="6">
        <c-select-complete
            v-model="filters.models.prestador"
            label="Prestador"
            :items="complementosLoads.prestadores || []"
            item-text="nombre"
            item-value="codigohabilitacion"
            hide-details
        />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-select-complete
          v-model="filters.models.departamento"
          label="Departamento prestador"
          name="Departamento prestador"
          :items="departamentos"
          item-text="nombre"
          item-value="codigo"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <c-date
          v-model="filters.models.mes"
          label="Mes de cargue"
          type="month"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <c-select-complete
          v-model="filters.models.estado"
          label="Estado"
          :items="complementosLoads.estados || []"
          item-text="text"
          item-value="value"
          hide-details
      />
    </v-col>
    <v-col cols="12" sm="12" md="6">
      <c-select-complete
          v-model="filters.models.usuario"
          label="Usuario que registra"
          :items="complementosLoads.usuarios || []"
          item-text="name"
          item-value="id"
          hide-details
      />
    </v-col>
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
        mes: null,
        prestador: null,
        usuario: null,
        estado: null,
        departamento: null
      }
    }
  }),
  computed: {
    ...mapGetters([
      'departamentos'
    ]),
    ...mapState('atencionMedicaRCVModule', ['complementosLoads']),
  },
  created() {
    this.getComplements()
  },
  methods: {
    applyFilters() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.prestador) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[cod_ips]=' + this.filters.models.prestador
      }
      if (this.filters.models.mes) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[mes]=' + this.filters.models.mes
      }
      if (this.filters.models.estado) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
      }
      if (this.filters.models.departamento) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[iddepto]=' + this.filters.models.departamento
      }
      if (this.filters.models.usuario) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[user_id]=' + this.filters.models.usuario
      }
      this.$emit('filtra', rutaTemp)
    },
    getComplements(){
      this.$store.dispatch('atencionMedicaRCVModule/getComplementsLoads')
    }
  }
}
</script>