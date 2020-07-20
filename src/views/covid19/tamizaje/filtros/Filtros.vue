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
                    :items="filters.data.opcionesDiagnostico"
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
                    v-model="filters.models.municipio_id"
                    label="Municipio"
                    :items="divipol"
                    item-value="id"
                    item-text="nombre"
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
                    item-value="id"
                    item-text="nombre"
                    multiple
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
        <v-col class="pb-0" cols="12" md="4">
            <v-autocomplete
                    label="Médico"
                    v-model="filters.models.medico_id"
                    :items="medicos"
                    outlined
                    dense
                    :filter="filterMedicos"
                    item-value="id"
                    persistent-hint
                    clearable
                    :hint="filters.models.medico_id && medicos.find(x => x.id === filters.models.medico_id).telefono ? `Teléfono: ${medicos.find(x => x.id === filters.models.medico_id).telefono}` : '' "
            >
                <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                        {{item.name}}
                    </div>
                </template>
                <template v-slot:item="{ item, index }">
                    <template>
                        <v-list-item-content class="pa-0">
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.telefono ? `Teléfono: ${item.telefono}` : ''}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
                </template>
            </v-autocomplete>
        </v-col>
        <v-col class="pb-0" cols="12" md="4">
            <v-autocomplete
                    label="EPS"
                    v-model="filters.models.eps_id"
                    :items="epsTamizajes"
                    outlined
                    dense
                    :filter="filterEpsTamizajes"
                    item-value="id"
                    persistent-hint
                    clearable
                    :hint="filters.models.eps_id && epsTamizajes.find(x => x.id === filters.models.eps_id).codigo ? `Código: ${epsTamizajes.find(x => x.id === filters.models.eps_id).codigo}` : '' "
            >
                <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                        {{item.nombre}}
                    </div>
                </template>
                <template v-slot:item="{ item, index }">
                    <template>
                        <v-list-item-content class="pa-0">
                            <v-list-item-title>{{item.nombre}}</v-list-item-title>
                            <v-list-item-subtitle>{{item.codigo ? `Código: ${item.codigo}` : ''}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </template>
                </template>
            </v-autocomplete>
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
            epsTamizajes: [],
            filterMedicos (item, queryText) {
                const hasValue = val => val != null ? val : ''
                const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
                const query = hasValue(queryText)
                return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
            },
            filterEpsTamizajes (item, queryText) {
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
                    municipio_id: null,
                    medico_id: null,
                    evolucion: [],
                    clasificacion: [],
                    orden_medica_id: null,
                    tamizador_id: null,
                    eps_id: null
                },
                data: {
                    opcionesCaso: [
                        {value: 1, text: 'Casos de Estudio'},
                        {value: 0, text: 'Encuestas de Riesgo Poblacional'}
                    ],
                    opcionesDiagnostico: [
                        {value: 1, text: 'Positivo'},
                        {value: 0, text: 'Negativo'}
                    ],
                    opcionesRiesgo: [
                        {value: 1, text: 'Riesgo de Procedencia'},
                        {value: 2, text: 'Riesgo de Ocupación'},
                        {value: 3, text: 'Riesgo de Contacto'}
                    ]
                }
            }
        }),
        computed: {
            ...mapGetters([
                'divipol',
                'clasificacionesCovid',
                'tiposEvolucion',
                'ordenesMedicas',
                'tamizadores'
            ]),
            tiposEvolucionFiltro () {
                return this && this.tiposEvolucion ? this.clone(this.tiposEvolucion).concat(['Sin seguimiento']) : []
            }
        },
        created () {
            this.getComplementos()
            if (this.esMedico) {
                this.filters.models.evolucion = ['Mejoró', 'Sigue igual', 'Empeoró', 'Sin seguimiento']
                this.filters.models.clasificacion = ['1','2','3', '3.1', '3.2','4','5']
                this.aplicaFiltros()
            }
        },
        methods: {
            aplicaFiltros () {
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
                if (this.filters.models.municipio_id !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipio_id
                }
                if (this.filters.models.evolucion.length) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[evolucion]=' + this.filters.models.evolucion.join(',')
                }
                if (this.filters.models.clasificacion.length) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[clasificacion]=' + this.filters.models.clasificacion.join(',')
                }
                if (this.filters.models.orden_medica_id !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[orden_medica_id]=' + this.filters.models.orden_medica_id
                }
                if (this.filters.models.tamizador_id !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tamizador_id]=' + this.filters.models.tamizador_id
                }
                if (this.filters.models.medico_id) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[medico_id]=' + this.filters.models.medico_id
                }
                if (this.filters.models.eps_id) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[eps_id]=' + this.filters.models.eps_id
                }
                this.$emit('filtra', rutaTemp)
            },
            getComplementos () {
                this.axios.get(`complementos-tamizajes`)
                    .then(response => {
                        this.epsTamizajes = response.data.eps_tamizajes
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar los complementos para los filtros de ERP.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>