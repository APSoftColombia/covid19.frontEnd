<template>
  <v-row
      justify="end"
      fill-height
  >
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
    >
      <c-date-range
          v-model="filters.models.fechaEstudio"
          label="Fecha de Recepción"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
    >
      <c-select-complete
          v-model="filters.models.estado_proceso"
          label="Estado"
          :items="labspEstadosProceso"
          hide-details
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
    >
      <c-select-complete
          v-model="filters.models.tipo_afiliacion"
          label="Tipo Afiliación"
          :items="labspTiposAfiliacion"
          hide-details
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="12"
        md="6"
    >
      <c-select-complete
          v-model="filters.models.institucion_muestra"
          label="IPS Origen Muestra"
          :items="labspIpss"
          item-text="nombre"
          item-value="id"
          hide-details
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="6"
    >
      <c-select-complete
          v-model="filters.models.eps_id"
          label="EPS Paciente"
          :items="labspEpss"
          item-text="nombre"
          item-value="id"
          hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'

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
        estado_proceso: null,
        tipo_afiliacion: null,
        institucion_muestra: null,
        eps_id: null,
        fechaEstudio: []
      }
    }
  }),
  computed: {
    ...mapGetters([
      'labspEpss',
      'labspIpss',
      'labspEstadosProceso',
      'labspTiposAfiliacion'
    ])
  },
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.fechaEstudio.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaEstudio]=' + this.filters.models.fechaEstudio.join(',')
      }
      if (this.filters.models.institucion_muestra !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[institucion_muestra]=' + this.filters.models.institucion_muestra
      }
      if (this.filters.models.eps_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[eps_id]=' + this.filters.models.eps_id
      }
      if (this.filters.models.tipo_afiliacion !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipo_afiliacion]=' + this.filters.models.tipo_afiliacion
      }
      if (this.filters.models.estado_proceso !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado_proceso]=' + this.filters.models.estado_proceso
      }
      this.$emit('filtra', rutaTemp)
    }
  }
}
</script>