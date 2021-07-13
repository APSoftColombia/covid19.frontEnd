<template>
  <v-row>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.ips"
          label="IPS"
          :items="ipssPruebas"
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
    <v-col class="pb-0" cols="12" sm="6" md="4" v-if="filters.models.estado === 2">
      <c-select-complete
          v-model="filters.models.razon"
          label="Estado de la muestra"
          :items="filters.data.razones"
      >
      </c-select-complete>
    </v-col>
  </v-row>
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
      filters: {
        models: {
          estado: null,
          ips: null,
          razon: null
        },
        data: {
          estados: [
            {value: 1, text: 'Muestra Tomada'},
            {value: 2, text: 'Muestra no Tomada'},
            {value: 3, text: 'Muestra Pendiente'},
            {value: 4, text: 'Muestras Reprogramadas'},
          ],
          razones: [
            'No contactado por teléfono sin señal',
            'apagado',
            'numero equivocado',
            'Paciente manifiesta que ya tiene prueba',
            'Paciente no desea  prueba',
            'Prueba Reprogramada por causa particular',
            'Paciente al ser contactado el contacto reporta que falleció',
            'hospitalizado o se fue de la ciudad'
          ]
        }
      }
    }),
    computed: {
      ...mapGetters([
        'ipssPruebas',
      ])
    },
    watch: {
      'filters.models.estado': {
        handler(val){
          if(!val || val != 2) {
            this.filters.models.razon = null
          }
        }
      }
    },
    methods: {
      aplicaFiltros() {
        let rutaTemp = this.rutaBase
        if (this.filters.models.estado !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
        }
        if (this.filters.models.ips !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[cod_habilitacion_ips]=' + this.filters.models.ips
        }
        if (this.filters.models.razon !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[razon]=' + this.filters.models.razon
        }
        this.$emit('filtra', rutaTemp)
      },
      limpiarFiltros(){
        this.filters.models.estado = null
        this.filters.models.ips = null
      },
    },
  }
</script>

<style scoped>

</style>
