<template>
    <v-row align="center" justify="end" fill-height>
        <!--<v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                    v-model="filters.models.municipio_id"
                    label="Municipio"
                    :items="divipol"
                    item-value="id"
                    item-text="nombre"
            >
            </c-select-complete>
        </v-col>-->
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
          <c-date
              v-model="filters.models.fecha_creacion"
              label="Fecha de Creación"
              name="fecha de Creación"
              :max="moment().format('YYYY-MM-DD')"
          >
          </c-date>
      </v-col>
      <v-col class="pb-0" cols="12" sm="12" md="12">
          <v-checkbox
              v-model="filters.models.hasRcv"
              label="Afiliados con Riesgo Cardiovascular"
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
            }
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
                    hasRcv: null
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
                }
            }
        }),
        computed: {
            ...mapGetters([
                'divipol'
            ])
        },
        methods: {
            aplicaFiltros () {
                let rutaTemp = this.rutaBase
                if (this.filters.models.municipio_id !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipio_id
                }
                if (this.filters.models.encuesta !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[hasEncuestaRcv]=' + this.filters.models.encuesta
                }
                if (this.filters.models.riesgo_general !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[general]=' + this.filters.models.riesgo_general
                }
                if (this.filters.models.riesgo_findrisc !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[findrisc]=' + this.filters.models.riesgo_findrisc
                }
                if (this.filters.models.riesgo_morisky !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[morisky]=' + this.filters.models.riesgo_morisky
                }
                if (this.filters.models.riesgo_oms !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[oms]=' + this.filters.models.riesgo_oms
                }
                if (this.filters.models.fecha_creacion !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fecha]=' + this.filters.models.fecha_creacion
                }
                if (this.filters.models.hasRcv !== null) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[hasRcv]=' + this.filters.models.hasRcv
                }
                this.$emit('filtra', rutaTemp)
            }
        },
      created() {
          this.filters.models.hasRcv = true
          this.aplicaFiltros()
      }
    }
</script>

<style scoped>

</style>