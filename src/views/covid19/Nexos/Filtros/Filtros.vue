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
        <v-col class="pb-0" cols="12" sm="6" md="4">
            <c-select-complete
                    v-model="filtros.models.erpD"
                    label="ERP"
                    :items="filtros.data.erp"
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
                    erpD: null
                },
                data: {
                    estadoPrueba: [
                        {name: 'Con Resultado', value: 1},
                        {name: 'Requiere Muestra', value: 2},
                        {name: 'Sin Determinar', value: 3}
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
                rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filtros.models.estadoPruebaD
              }
              if(this.filtros.models.erpD !== null) {
                rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[erp]=' + this.filtros.models.erpD
              }
              this.$emit('filtra', rutaTemp)
            },
            limpiarFiltros(){
              this.filtros.models.estadoPruebaD = null
              this.filtros.models.erpD = null
            }
        }
    }
</script>

<style scoped>

</style>