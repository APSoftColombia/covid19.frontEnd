<template>
    <v-row align="center" justify="end" fill-height>
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
                    municipio_id: null
                },
                data: null
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
                this.$emit('filtra', rutaTemp)
            }
        }
    }
</script>

<style scoped>

</style>