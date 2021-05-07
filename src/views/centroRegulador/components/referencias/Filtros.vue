<template>
  <v-row justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-select-complete
            label="Tipo de Atención"
            v-model="filters.models.tiposOrigen"
            :items="filters.data.tiposOrigen"
            multiple
            hide-details
        />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-select-complete
            v-model="filters.models.estados"
            label="Estado Direccionamiento"
            :items="filters.data.estados"
            multiple
            hide-details
        />
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="4">
        <c-select-complete
            v-model="filters.models.codigo_prestador_origen"
            label="IPS Origen"
            :items="ref_ipss"
            item-text="nombre"
            item-value="id"
            hide-details
        />
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="12">
        <v-autocomplete
            label="Modalidades de Servicio"
            v-model="filters.models.modServicios"
            :items="ref_modalidadesServicio"
            outlined
            dense
            multiple
            item-value="id"
            clearable
            persistent-hint
            hide-details
        >
          <template v-slot:selection="{ item, index }">
            <div class="pa-0 text-truncate" style="width: 100% !important;">
              {{ item.tipo }}
            </div>
          </template>
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
    <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-select-complete
            v-model="filters.models.eps_id"
            label="EPS"
            :items="ref_epss"
            item-text="nombre"
            item-value="id"
            hide-details
        />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fecha_orden"
          label="Fecha de Orden"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fecha_solicitud"
          label="Fecha de Solicitud"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fecha_ultima_gestion"
          label="Fecha de Ultima Gestión"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-select-complete
            v-model="filters.models.regimen"
            label="Tipo Afiliación"
            :items="filters.data.regimenes"
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
        tiposOrigen: [],
        fecha_orden: [],
        fecha_solicitud: [],
        estados: [],
        fecha_ultima_gestion: [],
        codigo_prestador_origen: null,
        eps_id: null,
        modServicios: [],
        regimen: null
      },
      data: {
          tiposOrigen: [
            'Ambulatorio',
            'Hospitalario',
            'Urgencias'
          ],
          estados: [
              'Solicitud',
              'Presentado',
              'Aceptado',
              'Ips Seleccionada',
              'Transporte Seleccionado',
              'En Traslado',
              'Traslado Finalizado',
              'Proceso Terminado',
              'Solicitud Servicio',
              'Servicio Aceptado',
              'Servicio No Aceptado',
              'Seleccionada',
              'Solicitud Traslado',
              'Traslado Iniciado',
              'Cancelado'
          ],
          regimenes: [
              'Régimen Subsidiado',
              'Régimen Contributivo',
              'Régimen Especial'
          ]
      }
    }
  }),
  computed: {
    ...mapGetters([
      'ref_epss',
      'ref_ipss',
      'ref_modalidadesServicio'
    ])
  },
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.tiposOrigen !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tiposOrigen]=' + this.filters.models.tiposOrigen.map(x => x).join(',')
      }
      if (this.filters.models.estados.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estados]=' + this.filters.models.estados.map(x => x).join(',')
      }
      if (this.filters.models.fecha_orden.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaOrden]=' + this.filters.models.fecha_orden.join(',')
      }
      if (this.filters.models.fecha_solicitud.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fechaSolicitud]=' + this.filters.models.fecha_solicitud.join(',')
      }
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
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[modServicios]=' + this.filters.models.modServicios.map(x => x).join(',')
      }
      if (this.filters.models.regimen !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipo_afiliacion]=' + this.filters.models.regimen
      }
      this.$emit('filtra', rutaTemp)
    }
  }
}
</script>

<style scoped>

</style>
