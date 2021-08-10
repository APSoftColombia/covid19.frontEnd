<template>
  <v-card
      class="mx-auto elevation-0"
  >
    <v-card-actions>
      <slot name="top-actions-left"></slot>
      <v-spacer></v-spacer>
      <slot name="top-actions-right"></slot>
      <v-btn text color="primary"
             @click="panelAdvanceFilters = !panelAdvanceFilters">
        <v-icon>{{ panelAdvanceFilters ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        Filtros
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="panelAdvanceFilters">
        <v-divider></v-divider>
        <v-card flat>
          <v-container fluid grid-list-md class="py-1 px-3">
            <v-row align="center" justify="end" fill-height>
              <v-col cols="12" sm="6" md="4">
                <c-select-complete
                    v-model="filters.models.municipio_id"
                    label="Municipio"
                    :items="municipiosPruebas"
                    item-text="nombre"
                    item-value="id"
                    hide-details
                ></c-select-complete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <c-select-complete
                    v-model="filters.models.departamento_id"
                    label="Departamento"
                    :items="departamentosPruebas"
                    item-text="nombre"
                    item-value="id"
                    hide-details
                ></c-select-complete>
              </v-col>
            </v-row>
          </v-container>
          <v-divider class="ma-0 pa-0"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small @click.stop="limpiarFiltros">Limpiar Filtros</v-btn>
            <v-btn small color="primary" @click.stop="aplicaFiltros">Aplicar filtros</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "filtros",
    props: {
      rutaBase: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      panelAdvanceFilters : false,
      filters: {
        models: {
          municipio_id: null,
          departamento_id: null
        },
      }
    }),
    computed: {
      ...mapGetters([
        'municipiosPruebas',
        'departamentosPruebas',
        'datosEmpresa'
      ])
    },
    methods: {
      aplicaFiltros() {
        let rutaTemp = this.rutaBase
        if (this.filters.models.municipio_id !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[municipio_id]=' + this.filters.models.municipio_id
        }
        if (this.filters.models.departamento_id !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[departamento_id]=' + this.filters.models.departamento_id
        }
        this.$emit('filtra', rutaTemp)
      },
      limpiarFiltros(){
        this.filters.models.municipio_id = null
        this.filters.models.departamento_id = null
      },
    },
    created(){
      this.filters.models.departamento_id = this.datosEmpresa.departamento_id
      this.aplicaFiltros()
    }
  }
</script>

<style scoped>

</style>
