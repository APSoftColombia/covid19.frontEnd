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
    <v-col cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.rango_dosis1"
          label="Rango Fecha de Dosis 1"
          :max="moment().format('YYYY-MM-DD')"
          hide-details
      >
      </c-date-range>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <c-date-range
          v-model="filters.models.rango_dosis2"
          label="Rango Fecha de Dosis 2"
          :max="moment().format('YYYY-MM-DD')"
          hide-details
      >
      </c-date-range>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.priorizacion"
          label="Tipo de Priorizacion"
          :items="priorizaciones"
          item-text="descripcion"
          item-value="id"
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
      priorizaciones: [],
      filters: {
        models: {
          estado: null,
          ips: null,
          priorizacion: null,
          rango_dosis1: null,
          rango_dosis2: null
        },
        data: {
          estados: [
            {value: 1, text: 'Sin vacuna'},
            {value: 2, text: 'Primera Dosis'},
            {value: 3, text: 'Segunda Dosis'},
          ]
        }
      }
    }),
    methods: {
      getIPSS(){
        this.axios.get('/ajustes-generales/iniciales').then(response => {
          this.ipss = response.data.parametros.ipss_vacunas,
          this.priorizaciones = response.data.parametros.priorizaciones_vacunas
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
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[codhabilitacion_ips]=' + this.filters.models.ips
        }
        if (this.filters.models.rango_dosis1 !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[dosis1Between]=' + this.filters.models.rango_dosis1
        }
        if (this.filters.models.rango_dosis2 !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[dosis2Between]=' + this.filters.models.rango_dosis2
        }
        if (this.filters.models.priorizacion !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[priorizacion]=' + this.filters.models.priorizacion
        }
        this.$emit('filtra', rutaTemp)
      },
      limpiarFiltros(){
        this.filters.models.estado = null
        this.filters.models.ips = null
        this.filters.models.rango_dosis1 = null
        this.filters.models.rango_dosis2 = null
        this.filters.models.priorizacion = null
      },
    },
    created() {
      this.getIPSS()
    }
  }
</script>

<style scoped>

</style>