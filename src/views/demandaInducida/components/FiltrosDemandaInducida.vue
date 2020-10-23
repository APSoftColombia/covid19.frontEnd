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
                    clasificacion: []
                },
                data: {
                    clasificacion: [
                        {value: 'cronico', text: 'Cronico'},
                        {value: 'maternoperinatal', text: 'Materno perinatal'},
                        {value: 'alto_costo', text: 'Alto costo'}
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