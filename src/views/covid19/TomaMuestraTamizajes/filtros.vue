<template>
  <v-row>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.ips"
          label="IPS"
          :items="ipss"
          item-text="nombre"
          item-value="codigohabilitacion"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado"
          label="Estado de la muestra"
          :items="filters.data.estados"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: "filtros",
    props: {
      rutaBase: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      ipss: [],
      filters: {
        models: {
          estado: null,
          ips: null
        },
        data: {
          estados: [
            {value: 1, text: 'Muestra Tomada'},
            {value: 2, text: 'Muestra no Tomada'},
            {value: 3, text: 'Muestra Pendiente'},
          ]
        }
      }
    }),
    methods: {
      getIPSS(){
        this.axios.get('/ajustes-generales/iniciales').then(response => {
          this.ipss = response.data.parametros.ipss_pruebas
        }).catch(error => {
          this.$store.commit('snackbar', {
            color: 'error',
            message: `al conseguir parametros`,
            error: error
          })
        })
      },
      aplicaFiltros() {
        let rutaTemp = this.rutaBase
        if (this.filters.models.estado !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
        }
        if (this.filters.models.ips !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[cod_habilitacion_ips]=' + this.filters.models.ips
        }
        this.$emit('filtra', rutaTemp)
      },
      limpiarFiltros(){
        this.filters.models.estado = null
        this.filters.models.ips = null
      },
    },
    created() {
      this.getIPSS()
    }
  }
</script>

<style scoped>

</style>