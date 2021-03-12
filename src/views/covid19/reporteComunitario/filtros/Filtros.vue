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
      <v-col class="pb-0" cols="12" sm="6" md="4">
        <c-select-complete
            v-model="filters.models.erp"
            label="Estado"
            :items="filters.data.erp"
            item-value="value"
            item-text="text"
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
                    municipio_id: null,
                    erp: null
                },
                data: {
                  erp: [
                    {text: 'Reportes Pendientes de ERP', value: 1},
                    {text: 'Con ERP Pendiente de Asignación de Caso de Estudio', value: 2},
                    {text: 'Con ERP con caso de Estudio', value: 3},
                  ]
                }
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
              if (this.filters.models.erp !== null) {
                rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estadoErp]=' + this.filters.models.erp
              }
                this.$emit('filtra', rutaTemp)
            },
          limpiarFiltros(){
              this.filters.models.municipio_id = null
          }
        }
    }
</script>

<style scoped>

</style>