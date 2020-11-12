<template>
  <v-row align="center" justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.departamento_id"
          label="Departamento"
          :items="complementosRCV && complementosRCV.departamentos_rcv ? complementosRCV.departamentos_rcv : []"
          item-value="id"
          item-text="nombre"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.rango_updated_at"
          label="Rango Fecha de Actualización"
          :max="moment().format('YYYY-MM-DD')"
      />
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.encuesta"
          label="Encuesta"
          :items="filters.data.encuesta"
          item-value="value"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.riesgo_general"
          label="Riesgo General"
          :items="filters.data.riesgo_general"
          item-value="text"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.riesgo_findrisc"
          label="Riesgo Findrisc"
          :items="filters.data.riesgo_findrisc"
          item-value="text"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.riesgo_oms"
          label="Riesgo OMS"
          :items="filters.data.riesgo_oms"
          item-value="text"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.riesgo_morisky"
          label="Riesgo Morisky"
          :items="filters.data.riesgo_morisky"
          item-value="text"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.fecha_creacion"
          label="Rango Fecha de Creacion"
          :max="moment().format('YYYY-MM-DD')"
      >
      </c-date-range>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.user"
          label="Usuario"
          :items="complementosRCV && complementosRCV.usuarios_rcv ? complementosRCV.usuarios_rcv : []"
          item-value="id"
          item-text="Usuario"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.tension_arterial"
          label="Tensión Arterial"
          :items="filters.data.tension"
          item-value="value"
          item-text="text"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="12">
      <v-checkbox
          v-model="filters.models.hasRcv"
          label="Afiliados con Riesgo Cardiovascular"
          :true-value="true"
          :false-value="false"
          @change="aplicaFiltros"
      ></v-checkbox>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'Filtros',
  props: {
    medicos: {
      type: Array,
      default: () => []
    },
    rutaBase: {
      type: String,
      default: ''
    },
  },
  data: () => ({
    filters: {
      models: {
        municipio_id: null,
        encuesta: null,
        fecha_creacion: null,
        riesgo_general: null,
        riesgo_findrisc: null,
        riesgo_oms: null,
        riesgo_morisky: null,
        hasRcv: true,
        departamento_id: null,
        user: null,
        tension_arterial: null,
        rango_updated_at: []
        //excel: null
      },
      data: {
        encuesta: [
          {text: 'Con Encuesta', value: 1},
          {text: 'Sin Encuesta', value: 2}
        ],
        riesgo_general: [
          {text: 'Indeterminado'},
          {text: 'Bajo'},
          {text: 'Medio'},
          {text: 'Alto'}
        ],
        riesgo_findrisc: [
          {text: 'Indeterminado'},
          {text: 'Bajo'},
          {text: 'Moderado'},
          {text: 'Ligeramente elevado'},
          {text: 'Alto'},
          {text: 'Muy alto'}
        ],
        riesgo_oms: [
          {text: 'Indeterminado'},
          {text: 'Bajo'},
          {text: 'Moderado'},
          {text: 'Alto'},
          {text: 'Muy alto'},
          {text: 'Crítico'}
        ],
        riesgo_morisky: [
          {text: 'Indeterminado'},
          {text: 'No Aplica'},
          {text: 'No cumple'},
          {text: 'Cumple'}
        ],
        tension: [
          {text: 'Registra Tensión Arterial', value: 1},
          {text: 'No Registra Tensión Arterial', value: 2}
        ]
      }
    },
    users: []
  }),
  computed: {
    ...mapGetters([
      'complementosRCV'
    ]),
    /*
    canShowExcelButton(){
        return this.lengthRows.total
    }
    */
  },
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.municipio_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipio_id
      }
      if (this.filters.models.rango_updated_at.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[updated_between]=' + this.filters.models.rango_updated_at.join(',')
      }
      if (this.filters.models.encuesta !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[hasEncuestaRcv]=' + this.filters.models.encuesta
      }
      if (this.filters.models.riesgo_general !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_general]=' + this.filters.models.riesgo_general
      }
      if (this.filters.models.riesgo_findrisc !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_findrisc]=' + this.filters.models.riesgo_findrisc
      }
      if (this.filters.models.riesgo_morisky !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[morisky_green]=' + this.filters.models.riesgo_morisky
      }
      if (this.filters.models.riesgo_oms !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_oms]=' + this.filters.models.riesgo_oms
      }
      if (this.filters.models.fecha_creacion !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fecha]=' + this.filters.models.fecha_creacion.join(',')
      }
      if (this.filters.models.hasRcv !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[hasRcv]=' + this.filters.models.hasRcv
      }
      if (this.filters.models.departamento_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento]=' + this.filters.models.departamento_id
      }
      if (this.filters.models.user !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[user]=' + this.filters.models.user
      }
      if (this.filters.models.tension_arterial !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tension]=' + this.filters.models.tension_arterial
      }
      this.$emit('filtra', rutaTemp)
    },
    limpiarFiltros() {
      this.filters.models.rango_updated_at = []
      this.filters.models.municipio_id = null
      this.filters.models.encuesta = null
      this.filters.models.fecha_creacion = null
      this.filters.models.riesgo_general = null
      this.filters.models.riesgo_findrisc = null
      this.filters.models.riesgo_oms = null
      this.filters.models.riesgo_morisky = null
      this.filters.models.hasRcv = null
      this.filters.models.departamento_id = null
      this.filters.models.user = null
      this.filters.models.tension_arterial = null
    },
    getUsers() {
      this.axios.get('user').then(response => {
        this.users = response.data
      }).catch(error => {
        console.log("error al cargar usuarios ", error)
      })
    },
    download() {
      this.filters.models.excel = true
      this.aplicaFiltros()
    }
  },
  created() {
    this.aplicaFiltros()
  }
}
</script>

<style scoped>

</style>