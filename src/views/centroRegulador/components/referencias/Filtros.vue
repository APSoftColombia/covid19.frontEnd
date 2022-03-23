<template>
  <div>
    <v-row justify="end" fill-height>
      <v-col class="pb-0" cols="12" sm="6">
        <c-select-complete
            label="Tipo de Atención"
            v-model="filters.models.tiposOrigen"
            :items="filters.data.tiposOrigen"
            multiple
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6">
        <c-select-complete
            v-model="filters.models.estados"
            label="Estado de Referencia"
            :items="filters.data.estados"
            multiple
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6">
        <c-select-complete
            v-model="filters.models.regimen"
            label="Régimen"
            item-text="descripcion"
            item-value="id"
            :items="ref_regimenes"
            hide-details
        />
      </v-col>
      <!--    <v-col class="pb-0" cols="12" sm="12" md="6">-->
      <!--      <c-select-complete-->
      <!--          v-model="filters.models.tipo_poblacion"-->
      <!--          label="Tipo población"-->
      <!--          :items="ref_cr_tiposPoblacion"-->
      <!--          hide-details-->
      <!--      />-->
      <!--    </v-col>-->
      <v-col class="pb-0" cols="12" sm="12" md="6">
        <c-select-complete
            v-model="filters.models.codigo_prestador_origen"
            label="IPS Origen"
            :items="ref_ipss"
            item-text="nombre"
            item-value="id"
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6" md="6">
        <c-select-complete
            v-model="filters.models.eps_id"
            label="EPS"
            :items="ref_epss"
            item-text="nombre"
            item-value="id"
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6">
        <c-select-complete
            label="Medio de Solicitud"
            v-model="filters.models.medios"
            :items="ref_medios"
            multiple
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="12">
        <v-autocomplete
            label="Modalidades de Servicio"
            v-model="filters.models.modServicios"
            :items="ref_modalidadesServicio"
            outlined
            dense
            multiple
            chips
            small-chips
            item-value="id"
            item-text="tipo"
            clearable
            persistent-hint
            hide-details
        >
          <template v-slot:item="{ item, index }">
            <template>
              <v-list-item-content class="pa-0">
                <v-list-item-title>{{ item.tipo }}</v-list-item-title>
                <v-list-item-subtitle>{{ `Modalidad: ${item.modalidad}` }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row justify="end" fill-height>
      <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-date-range
            v-model="filters.models.fecha_orden"
            label="Fecha de Orden"
            :max="moment().format('YYYY-MM-DD')"
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-date-range
            v-model="filters.models.fecha_solicitud"
            label="Fecha de Solicitud"
            :max="moment().format('YYYY-MM-DD')"
            hide-details
        />
      </v-col>
      <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-date-range
            v-model="filters.models.fecha_ultima_gestion"
            label="Fecha de Ultima Gestión"
            :max="moment().format('YYYY-MM-DD')"
            hide-details
        />
      </v-col>
    </v-row>
  </div>
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
        tiposOrigen: [],
        fecha_orden: [],
        fecha_solicitud: [],
        estados: ['Solicitud', 'gestión IPS', 'gestión Transporte'],
        medios: [],
        fecha_ultima_gestion: [],
        codigo_prestador_origen: null,
        eps_id: null,
        modServicios: [],
        regimen: null,
        // tipo_poblacion: null
      },
      data: {
        tiposOrigen: [
          'Ambulatorio',
          'Hospitalario',
          'Urgencias'
        ],
        estados: ['Solicitud', 'gestión IPS', 'gestión Transporte', 'Proceso Terminado', 'Cancelado'],
          // 'Solicitud Servicio',
          // 'Servicio Aceptado',
          // 'Servicio No Aceptado',
          // 'Seleccionada',
          // 'Solicitud Traslado',
          // 'Traslado Iniciado',,
      }
    }
  }),
  computed: {
    ...mapGetters([
      'ref_epss',
      'ref_ipss',
      'ref_medios',
      'ref_modalidadesServicio',
      // 'ref_cr_tiposPoblacion',
      'ref_regimenes',
    ])
  },
  methods: {
    aplicaFiltros() {
      console.log('pasa por aquiii')
      let rutaTemp = this.rutaBase
      if (this.filters.models.tiposOrigen.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipo_origen]=' + this.filters.models.tiposOrigen.map(x => x).join(',')
      }
      if (this.filters.models.estados.length) {
        let estados = []
        if (this.filters.models.estados.find(x => x === 'Solicitud')) estados = estados.concat(['Solicitud'])
        if (this.filters.models.estados.find(x => x === 'gestión IPS')) estados = estados.concat(['Presentado', 'Aceptado', 'Ips Seleccionada'])
        if (this.filters.models.estados.find(x => x === 'gestión Transporte')) estados = estados.concat(['Transporte Seleccionado', 'En Traslado', 'Traslado Finalizado'])
        if (this.filters.models.estados.find(x => x === 'Proceso Terminado')) estados = estados.concat(['Proceso Terminado'])
        if (this.filters.models.estados.find(x => x === 'Cancelado')) estados = estados.concat(['Cancelado'])

        console.log('estados', estados)
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + estados.join(',')
      }
      if (this.filters.models.fecha_orden.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaOrden]=' + this.filters.models.fecha_orden.join(',')
      }
      if (this.filters.models.fecha_solicitud.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaSolicitud]=' + this.filters.models.fecha_solicitud.join(',')
      }
      // if (this.filters.models.tipo_poblacion !== null) {
      //   rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipo_poblacion]=' + this.filters.models.tipo_poblacion
      // }
      if (this.filters.models.fecha_ultima_gestion.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaUltimaGestion]=' + this.filters.models.fecha_ultima_gestion.join(',')
      }
      if (this.filters.models.codigo_prestador_origen !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[codigo_prestador_origen]=' + this.filters.models.codigo_prestador_origen
      }
      if (this.filters.models.eps_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[eps_id]=' + this.filters.models.eps_id
      }
      if (this.filters.models.modServicios.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[modservicio_id]=' + this.filters.models.modServicios.map(x => x).join(',')
      }
      if (this.filters.models.regimen !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[regimen_id]=' + this.filters.models.regimen
      }
      if (this.filters.models.medios.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[medio_solicitud]=' + this.filters.models.medios.map(x => x).join(',')
      }
      this.$emit('filtra', rutaTemp)
    }
  }
}
</script>

<style scoped>

</style>
