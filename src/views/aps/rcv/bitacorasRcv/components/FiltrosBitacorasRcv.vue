<template>
    <v-row align="center" justify="end" fill-height>
        <v-col class="pb-0" cols="12" sm="12" md="6" align-self="baseline">
            <c-date-range
                v-model="filters.models.rango_updated_at"
                label="Rango Fecha Actualizacion de Seguimiento"
                :max="moment().format('YYYY-MM-DD')"
                hide-details
            >
            </c-date-range>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6">
            <c-select-complete
                v-model="filters.models.departamento_id"
                label="Departamento"
                :items="complementosRCV && complementosRCV.departamentos_rcv ? complementosRCV.departamentos_rcv : []"
                item-value="id"
                item-text="nombre"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6">
            <v-checkbox
                v-model="filters.models.hasAlert"
                label="Seguimientos con Alertas"
                :true-value="true"
                :false-value="false"
                @change="aplicaFiltros"
            ></v-checkbox>
        </v-col>
        <v-col class="pb-0" cols="12" sm="12" md="6">
            <c-select-complete
                v-model="filters.models.tipoSeguimiento"
                label="Tipo de seguimientos"
                :items="items"
                item-value="id"
                item-text="text"
            >
            </c-select-complete>
        </v-col>
    </v-row>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'FiltrosBitacorasRcv',
        props: {
            rutaBase: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            items: [
                {id: 1, text: 'Con Tipificaciones pendientes' },
                {id: 2, text: 'Con Tipificaciones Efectivas'}
            ],
            filters: {
                models: {
                    rango_updated_at: [],
                    tipoSeguimiento: null,
                    hasAlert: false,
                    departamento_id: null,
                },
                data: {
                }
            },
            users: []
        }),
        computed: {
            ...mapGetters([
                'complementosRCV'
            ]),
        },
        methods: {
            aplicaFiltros () {
                let rutaTemp = this.rutaBase
                if (this.filters.models.rango_updated_at.length) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[updated_between]=' + this.filters.models.rango_updated_at.join(',')
                }
                if (this.filters.models.tipoSeguimiento) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipoSeguimiento]=' + this.filters.models.tipoSeguimiento
                }
                if (this.filters.models.hasAlert) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[seguimientoHasAlert]=' + this.filters.models.hasAlert
                }
                if (this.filters.models.departamento_id !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento]=' + this.filters.models.departamento_id
                }
                this.$emit('filtra', rutaTemp)
            },
            limpiarFiltros() {
                this.filters.models.rango_updated_at = []
                this.filters.models.departamento_id = null
                this.filters.models.tipoSeguimiento = null
                this.filters.models.hasAlert = false
            },
        },
        created() {
            this.aplicaFiltros()
        }
    }
</script>

<style scoped>

</style>