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
        <v-col class="pb-0" cols="12" sm="12" md="12">
          <v-checkbox
              v-model="filters.models.tipificacionesPendientes"
              label="Bitacoras con Tipificaciones Pendientes"
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
        name: 'FiltrosBitacorasRcv',
        props: {
            rutaBase: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            filters: {
                models: {
                    rango_created_at: [],
                    tipificacionesPendientes: false,
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
                if (this.filters.models.tipificacionesPendientes) {
                  rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipificacionesPendientes]=' + this.filters.models.tipificacionesPendientes
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