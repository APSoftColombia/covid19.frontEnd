<template>
    <v-row>
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                    v-model="filtros.models.estadoPruebaD"
                    label="Estado de la Prueba"
                    :items="filtros.data.estadoPrueba"
                    item-text="name"
                    item-value="value"
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
                },
                data: {
                    estadoPrueba: [
                        {name: 'Con Resultado', value: 1},
                        {name: 'Requiere Muestra', value: 2},
                    ],
                }
            },
        }),
        methods: {
            aplicaFiltros(){
                let rutaTemp = this.rutaBase

                if(this.filtros.models.estadoPruebaD !== null) {
                    rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filtros.models.estadoPruebaD
                }
                this.$emit('filtra', rutaTemp)
            }
        }
    }
</script>

<style scoped>

</style>