<template>
  <v-row justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fechaEstudio"
          label="Fecha de Registro"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado"
          label="Estado"
          :items="complementos.estados || []"
          item-text="text"
          item-value="value"
          hide-details
      />
    </v-col>
<!--    <v-col class="pb-0" cols="12" sm="6" md="4">-->
<!--        <c-select-complete-->
<!--            v-model="filters.models.tipo_afiliacion"-->
<!--            label="Tipo Afiliación"-->
<!--            :items="labspTiposAfiliacion"-->
<!--            hide-details-->
<!--        />-->
<!--    </v-col>-->
<!--    <v-col class="pb-0" cols="12" sm="12" md="6">-->
<!--        <c-select-complete-->
<!--            v-model="filters.models.institucion_muestra"-->
<!--            label="IPS Origen Muestra"-->
<!--            :items="labspIpss"-->
<!--            item-text="nombre"-->
<!--            item-value="id"-->
<!--            hide-details-->
<!--        />-->
<!--    </v-col>-->
<!--    <v-col class="pb-0" cols="12" sm="6" md="6">-->
<!--        <c-select-complete-->
<!--            v-model="filters.models.eps_id"-->
<!--            label="EPS Paciente"-->
<!--            :items="labspEpss"-->
<!--            item-text="nombre"-->
<!--            item-value="id"-->
<!--            hide-details-->
<!--        />-->
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
        estado: null,
        tipo_afiliacion: null,
        institucion_muestra: null,
        eps_id: null,
        fechaEstudio: []
      }
    }
  }),
  computed: {
    ...mapState('atencionMedicaRCVModule', ['complementos']),
    ...mapGetters([
      'labspEpss',
      'labspIpss',
      'labspTiposAfiliacion'
    ])
  },
  methods: {
    applyFilters() {
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
      if (this.filters.models.estado !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
      }
      this.$emit('filtra', rutaTemp)
    }
  }
}
</script>