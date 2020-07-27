<template>
    <v-row>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                    v-model="filtros.models.estadoPruebaD"
                    label="Estado de la Prueba"
                    :items="filtros.data.estadoPrueba"
                    item-text="name"
                    value="value"
            >
            </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                    v-model="filtros.models.erpD"
                    label="ERP"
                    :items="filtros.data.erp"
                    item-text="name"
                    value="value"
            >
            </c-select-complete>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "Filtros",
        props: {
            rutaBase: {
                type: String,
                default: null
            }
        },
        data: () => ({
            filtros: {
                models: {
                    estadoPruebaD: null,
                    erpD: null
                },
                data: {
                    estadoPrueba: [
                        'Con Resultado',
                        'Requiere Muestra'
                    ],
                    erp: [
                        {name: 'Con ERP', value: 1},
                        {name: 'Sin ERP', value: 2}
                    ],
                }
            },
        }),
        methods: {
            aplicaFiltros(){
                let rutaTemp = this.rutaBase

                if(this.filtros.models.estadoPruebaD !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado_prueba]=' + this.filters.models.caso_estudio
                }
                if(this.filtros.models.erpD !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado_prueba]=' + this.filters.models.caso_estudio
                }
                this.$emit('filtrar', rutaTemp)
            }
        }
    }
</script>

<style scoped>

</style>