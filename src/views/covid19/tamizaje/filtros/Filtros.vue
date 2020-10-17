<template>
  <v-row align="center" justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.caso_estudio"
          label="Tipo"
          :items="filters.data.opcionesCaso"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4" v-if="verDiagnosticados">
      <c-select-complete
          v-model="filters.models.diagnostico"
          label="Diagnóstico"
          :items="tiposResultadosCovid"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.rango_created_at"
          label="Rango Fecha de Creación"
          :max="moment().format('YYYY-MM-DD')"
      >
      </c-date-range>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.rango_updated_at"
          label="Rango Fecha de Actualización"
          :max="moment().format('YYYY-MM-DD')"
      >
      </c-date-range>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.riesgo"
          label="Riesgo"
          :items="filters.data.opcionesRiesgo"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.evolucion"
          label="Evolución"
          :items="tiposEvolucionFiltro"
          multiple
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.clasificacion"
          label="Clasificación"
          :items="clasificacionesCovid"
          item-value="idShow"
          item-text="nombre"
          multiple
          :return-object="true"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado_afectacion"
          label="Estado de Afectación"
          :items="estadosAfectacion"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado_prueba"
          label="Estado de la Prueba"
          :items="filters.data.estadoPrueba"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.orden_medica_id"
          label="Orden Médica"
          :items="ordenesMedicas"
          item-text="orden"
          item-value="id"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4"
           v-if="complementos.departamentos && complementos.departamentos.length > 1">
      <c-select-complete
          v-model="filters.models.departamentos"
          label="Departamento"
          :items="complementos.departamentos"
          item-value="id"
          item-text="nombre"
          multiple
          @change="filters.models.municipios = []"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.municipios"
          label="Municipio"
          :items="filters.models.departamentos && filters.models.departamentos.length ? complementos.municipios.filter(x => filters.models.departamentos.find(z => z === x.departamento_id)) : complementos.municipios"
          item-value="id"
          item-text="nombre"
          multiple
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.tamizador_id"
          label="Punto de ERP"
          :items="tamizadores"
          item-text="nombre"
          item-value="id"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.localiza_persona"
          label="Localiza paciente"
          :items="filters.data.opcionesLocaliza"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.contesta_encuesta"
          label="Contesta encuesta"
          :items="filters.data.opcionesContestaEncuesta"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <v-autocomplete
          label="Usuario"
          v-model="filters.models.user_id"
          :items="complementos.usuarios"
          outlined
          dense
          :filter="filterMedicos"
          item-value="id"
          persistent-hint
          clearable
          :hint="filters.models.user_id && complementos.usuarios.find(x => x.id === filters.models.user_id).telefono ? `Teléfono: ${complementos.usuarios.find(x => x.id === filters.models.user_id).telefono}` : '' "
      >
        <template v-slot:selection="{ item, index }">
          <div class="pa-0 text-truncate" style="width: 100% !important;">
            {{ item.name }}
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <template>
            <v-list-item-content class="pa-0">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.telefono ? `Teléfono: ${item.telefono}` : '' }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <v-autocomplete
          label="Médico"
          v-model="filters.models.medico_id"
          :items="complementos.medicos"
          outlined
          dense
          :filter="filterMedicos"
          item-value="id"
          persistent-hint
          clearable
          :hint="filters.models.medico_id && complementos.medicos.find(x => x.id === filters.models.medico_id).telefono ? `Teléfono: ${complementos.medicos.find(x => x.id === filters.models.medico_id).telefono}` : '' "
      >
        <template v-slot:selection="{ item, index }">
          <div class="pa-0 text-truncate" style="width: 100% !important;">
            {{ item.name }}
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <template>
            <v-list-item-content class="pa-0">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.telefono ? `Teléfono: ${item.telefono}` : '' }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <v-autocomplete
          label="EPS"
          v-model="filters.models.eps_id"
          :items="complementos.eps"
          outlined
          dense
          :filter="filterEpsTamizajes"
          item-value="id"
          persistent-hint
          clearable
          :hint="filters.models.eps_id && complementos.eps.find(x => x.id === filters.models.eps_id).codigo ? `Código: ${complementos.eps.find(x => x.id === filters.models.eps_id).codigo}` : '' "
      >
        <template v-slot:selection="{ item, index }">
          <div class="pa-0 text-truncate" style="width: 100% !important;">
            {{ item.nombre }}
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <template>
            <v-list-item-content class="pa-0">
              <v-list-item-title>{{ item.nombre }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.codigo ? `Código: ${item.codigo}` : '' }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <v-checkbox
          class="mt-0"
          label="Sin Seguimientos"
          v-model="filters.models.sin_seguimientos"
          :true-value="1"
          :false-value="null"
          @change="aplicaFiltros"
      ></v-checkbox>
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
    filterMedicos(item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
    filterEpsTamizajes(item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.codigo + ' ' + item.nombre)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
    filters: {
      models: {
        caso_estudio: null,
        diagnostico: null,
        rango_created_at: [],
        rango_updated_at: [],
        fecha_nacimiento: null,
        riesgo: null,
        departamentos: [],
        municipios: [],
        medico_id: null,
        user_id: null,
        evolucion: [],
        clasificacion: [],
        orden_medica_id: null,
        tamizador_id: null,
        eps_id: null,
        estado_afectacion: null,
        estado_prueba: null,
        sin_seguimientos: null,
        localiza_persona: null,
        contesta_encuesta: null
      },
      data: {
        opcionesLocaliza: [
          {value: null, text: 'Todos'},
          {value: 1, text: 'Se localiza al paciente'},
          {value: 0, text: 'No se localiza al paciente'}
        ],
        opcionesContestaEncuesta: [
          {value: null, text: 'Todos'},
          {value: 1, text: 'Contesta la encuesta'},
          {value: 0, text: 'No contesta la encuesta'}
        ],
        opcionesCaso: [
          {value: 1, text: 'Casos de Estudio'},
          {value: 0, text: 'Encuestas de Riesgo Poblacional'}
        ],
        opcionesRiesgo: [
          {value: 1, text: 'Riesgo de Procedencia'},
          {value: 2, text: 'Riesgo de Ocupación'},
          {value: 3, text: 'Riesgo de Contacto'}
        ],
        estadoPrueba: [
          'Requiere Muestra',
          'Con Resultado',
          'Sin Resultado'
        ]
      }
    }
  }),
  computed: {
    ...mapGetters([
      'tiposResultadosCovid',
      'clasificacionesCovid',
      'tiposEvolucion',
      'ordenesMedicas',
      'tamizadores',
      'estadosAfectacion'
    ]),
    tiposEvolucionFiltro() {
      return this && this.tiposEvolucion ? this.clone(this.tiposEvolucion).concat(['Sin seguimiento']) : []
    }
  },
  created() {
    this.getComplementos()
    if (this.esMedico) {
      this.filters.models.evolucion = ['Mejoró', 'Sigue igual', 'Empeoró', 'Sin seguimiento']
      this.filters.models.clasificacion = this.clasificacionesCovid && this.clasificacionesCovid.length ? this.clasificacionesCovid.filter(x => x.id !== '6') : []
      this.aplicaFiltros()
    }
  },
  methods: {
    aplicaFiltros() {
      let rutaTemp = this.rutaBase
      if (this.filters.models.caso_estudio !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[caso_estudio]=' + this.filters.models.caso_estudio
      }
      if (this.filters.models.diagnostico !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[positivo_covid]=' + this.filters.models.diagnostico
      }
      if (this.filters.models.rango_created_at.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[created_between]=' + this.filters.models.rango_created_at.join(',')
      }
      if (this.filters.models.rango_updated_at.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[updated_between]=' + this.filters.models.rango_updated_at.join(',')
      }
      if (this.filters.models.riesgo !== null) {
        if (this.filters.models.riesgo === 1) rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_procedencia]=1'
        if (this.filters.models.riesgo === 2) rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_ocupacional]=1'
        if (this.filters.models.riesgo === 3) rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[riesgo_contacto]=1'
      }
      if (this.filters.models.departamentos.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento_id]=' + this.filters.models.departamentos.join(',')
      }
      if (this.filters.models.municipios.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipios.join(',')
      }
      if (this.filters.models.evolucion.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[evolucion]=' + this.filters.models.evolucion.join(',')
      }
      if (this.filters.models.clasificacion.length) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[clasificacion]=' + this.filters.models.clasificacion.map(x => x.id).join(',')
      }
      if (this.filters.models.estado_afectacion !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado_afectacion]=' + this.filters.models.estado_afectacion
      }
      if (this.filters.models.estado_prueba !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado_prueba]=' + this.filters.models.estado_prueba
      }
      if (this.filters.models.orden_medica_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[orden_medica_id]=' + this.filters.models.orden_medica_id
      }
      if (this.filters.models.tamizador_id !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tamizador_id]=' + this.filters.models.tamizador_id
      }
      if (this.filters.models.user_id) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[user_id]=' + this.filters.models.user_id
      }
      if (this.filters.models.medico_id) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[medico_id]=' + this.filters.models.medico_id
      }
      if (this.filters.models.eps_id) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[eps_id]=' + this.filters.models.eps_id
      }
      if (this.filters.models.sin_seguimientos !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[sin_seguimientos]=' + this.filters.models.sin_seguimientos
      }
      if (this.filters.models.localiza_persona !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[localiza_persona]=' + this.filters.models.localiza_persona
      }
      if (this.filters.models.contesta_encuesta !== null) {
        rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[contesta_encuesta]=' + this.filters.models.contesta_encuesta
      }
      this.$emit('filtra', rutaTemp)
    },
    getComplementos() {
      this.axios.get(`complementos-tamizajes`)
          .then(response => {
            this.complementos = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los complementos para los filtros de ERP.`,
              error: error
            })
          })
    }
  }
}
</script>

<style scoped>

</style>