<template>
    <v-row align="center" justify="end" fill-height>
        <!-- <v-col cols="12" sm="6" md="4">
            <c-date-range
                v-model="filters.models.rango_created_at"
                label="Rango Fecha de Creación de Encuesta"
                :max="moment().format('YYYY-MM-DD')"
                hide-details
            >
            </c-date-range>
        </v-col> -->
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
    // import {mapGetters} from "vuex";

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
                    rango_created_at: [],
                    tipoSeguimiento: null,
                    hasAlert: false,
                },
                data: {
                }
            },
            users: []
        }),
        methods: {
            aplicaFiltros () {
                let rutaTemp = this.rutaBase
                // if (this.filters.models.rango_created_at.length) {
                //     rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[created_between]=' + this.filters.models.rango_created_at.join(',')
                // }
                if (this.filters.models.tipoSeguimiento) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipoSeguimiento]=' + this.filters.models.tipoSeguimiento
                }
                if (this.filters.models.hasAlert) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[seguimientoHasAlert]=' + this.filters.models.hasAlert
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