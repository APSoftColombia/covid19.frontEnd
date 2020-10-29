<template>
    <v-row align="center" justify="end" fill-height>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                v-model="filters.models.clasificacion"
                label="Tipo"
                :items="filters.data.clasificacion"
                item-text="text"
                item-value="value"
                multiple
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                v-model="filters.models.encuesta_efectiva_id"
                label="Efectividad"
                :items="filters.data.efectividad"
                item-text="text"
                item-value="value"
            >
            </c-select-complete>
        </v-col>
        <v-col cols="12" sm="6" md="4">
            <c-date-range
                v-model="filters.models.rango_created_at"
                label="Rango Fecha de Creación de Encuesta"
                :max="moment().format('YYYY-MM-DD')"
                hide-details
            >
            </c-date-range>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                v-model="filters.models.grupo_etario"
                label="Grupo etario"
                :items="filters.data.rango_edad"
                item-text="text"
                item-value="value"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="12">
          <v-checkbox
              v-model="filters.models.erp_required"
              label="Encuestas requieren ERP"
              :true-value="true"
              :false-value="false"
              @change="aplicaFiltros"
          ></v-checkbox>
      </v-col>
    </v-row>
</template>

<script>
    // import {mapGetters} from "vuex";

    export default {
        name: 'Filtros',
        props: {
            rutaBase: {
                type: String,
                default: ''
            },
        },
        data: () => ({
            filters: {
                models: {
                    clasificacion: [],
                    encuesta_efectiva_id: null,
                    rango_created_at: [],
                    grupo_etario: null,
                    erp_required: false,
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
                        {value: 0, text:'Primera infancia'},
                        {value: 1, text:'Infancia'},
                        {value: 2, text:'Adolescencia'},
                        {value: 3, text:'Juventud'},
                        {value: 4, text:'Adultez'},
                        {value: 5, text:'Vejez'},
                    ]
                }
            },
          users: []
        }),
        methods: {
            aplicaFiltros () {
                let rutaTemp = this.rutaBase
                if (this.filters.models.clasificacion.length) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + this.filters.models.clasificacion.map(x => `filter[${x}]=X`).join('&')
                }
                if(this.filters.models.encuesta_efectiva_id != null){
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + `filter[efectividad]=${this.filters.models.encuesta_efectiva_id}`
                }
                if (this.filters.models.rango_created_at.length) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[created_between]=' + this.filters.models.rango_created_at.join(',')
                }
                if(this.filters.models.grupo_etario != null){
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + `filter[edad]=${this.filters.models.grupo_etario}`
                }
                if (this.filters.models.erp_required) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[erp_required]=' + this.filters.models.erp_required
                }
                this.$emit('filtra', rutaTemp)
            }
        },
        created() {
            this.aplicaFiltros()
        }
    }
</script>

<style scoped>

</style>