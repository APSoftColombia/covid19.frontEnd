<template>
  <v-row
      align="center"
      justify="end"
      fill-height
  >
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
    >
      <c-select-complete
          v-model="filters.models.clasificacion"
          label="Tipo"
          :items="filters.data.clasificacion"
          item-text="text"
          item-value="value"
          multiple
      />
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="6"
        md="4"
    >
      <c-select-complete
          v-model="filters.models.encuesta_efectiva_id"
          label="Efectividad"
          :items="filters.data.efectividad"
          item-text="text"
          item-value="value"
      />
    </v-col>
    <v-col
        cols="12"
        sm="6"
        md="4"
    >
      <c-date-range
          v-model="filters.models.rango_created_at"
          label="Rango Fecha de Creación de Encuesta"
          :max="moment().format('YYYY-MM-DD')"
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
          v-model="filters.models.grupo_etario"
          label="Grupo etario"
          :items="filters.data.rango_edad"
          item-text="text"
          item-value="value"
      />
    </v-col>
    <v-col
        v-if="esDiCoordinador"
        cols="12"
        sm="6"
        md="4"
    >
      <v-autocomplete
          label="Gestores demanda inducida"
          v-model="filters.models.gestor_id"
          :items="gestores"
          outlined
          dense
          :filter="filterGestores"
          item-value="id"
          persistent-hint
          clearable
          :hint="filters.models.gestor_id && gestores.find(x => x.id === filters.models.gestor_id).name ? `Nombre: ${gestores.find(x => x.id === filters.models.gestor_id).name}` : '' "
          hide-details
      >
        <template v-slot:selection="{ item, index }">
          <div
              class="pa-0 text-truncate"
              style="width: 100% !important;"
          >
            {{ item.name }}
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <template>
            <v-list-item-content class="pa-0">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.email ? `Correo: ${item.email}` : '' }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col
        class="pb-0"
        cols="12"
        sm="12"
        md="12"
    >
      <v-checkbox
          v-model="filters.models.erp_required"
          label="Encuestas requieren ERP"
          :true-value="true"
          :false-value="false"
          @change="aplicaFiltros"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Filtros',
  props: {
    rutaBase: {
      type: String,
      default: ''
    },
    gestores: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    filterGestores(item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
    filters: {
      models: {
        clasificacion: [],
        encuesta_efectiva_id: null,
        rango_created_at: [],
        grupo_etario: null,
        erp_required: false,
        gestor_id: null
      },
      data: {
        clasificacion: [
          {value: 'cronico', text: 'Cronico'},
          {value: 'maternoperinatal', text: 'Materno perinatal'},
          {value: 'alto_costo', text: 'Alto costo'}
        ],
        efectividad: [
          {value: 1, text: 'Con encuesta efectiva'},
          {value: 0, text: 'Sin encuesta efectiva'}
        ],
        rango_edad: [
          {value: 0, text: 'Primera infancia'},
          {value: 1, text: 'Infancia'},
          {value: 2, text: 'Adolescencia'},
          {value: 3, text: 'Juventud'},
          {value: 4, text: 'Adultez'},
          {value: 5, text: 'Vejez'},
        ]
      }
    },
    users: []
  }),
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.clasificacion.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + this.filters.models.clasificacion.map(x => `filter[${x}]=X`).join('&')
      }
      if (this.filters.models.encuesta_efectiva_id != null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + `filter[efectividad]=${this.filters.models.encuesta_efectiva_id}`
      }
      if (this.filters.models.rango_created_at.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[created_between]=' + this.filters.models.rango_created_at.join(',')
      }
      if (this.filters.models.grupo_etario != null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + `filter[edad]=${this.filters.models.grupo_etario}`
      }
      if (this.filters.models.erp_required) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[erp_required]=' + this.filters.models.erp_required
      }
      if (this.filters.models.gestor_id && this.esDiCoordinador) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[gestor_id]=' + this.filters.models.gestor_id
      }
      this.$emit('filtra', rutaTemp)
    }
  },
  created() {
    this.aplicaFiltros()
  }
}
</script>
