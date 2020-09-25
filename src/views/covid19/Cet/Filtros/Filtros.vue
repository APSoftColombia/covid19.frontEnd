<template>
  <v-row align="center" justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.covid_contacto"
          label="Tipo"
          :items="filters.data.tipos"
          item-text="text"
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
        default: ''
      },
    },
    data: () => ({
      filters: {
        models: {
          covid_contacto: 1,
        },
        data: {
          tipos: [
            {text: 'Confirmados', value: 1},
            {text: 'Contactos', value: 2}
          ],
        }
      },
    }),
    methods: {
      aplicaFiltros() {
        let rutaTemp = this.rutaBase
        if (this.filters.models.covid_contacto !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[covid_contacto]=' + this.filters.models.covid_contacto
        }
        this.$emit('filtra', rutaTemp)
      },
    },
    created() {
      this.aplicaFiltros()
    }
  }
</script>

<style scoped>

</style>