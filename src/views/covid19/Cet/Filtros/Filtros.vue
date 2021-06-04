<template>
  <v-row align="center" justify="end" fill-height>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <v-autocomplete
          label="Archivo cargado"
          v-model="filters.models.cet_id"
          :items="cets"
          outlined
          dense
          item-value="id"
          clearable
      >
        <template v-slot:selection="{ item, index }">
          <div class="pa-0 text-truncate" style="width: 100% !important;">
            {{ item.nombre_archivo + ' - ' + item.fecha_proceso }}
          </div>
        </template>
        <template v-slot:item="{ item, index }">
          <template>
            <v-list-item-content class="pa-0">
              <v-list-item-title>{{ item.nombre_archivo }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.fecha_proceso }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-col>
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
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.estado"
          label="Estado"
          :items="filters.data.estados"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="6" md="4">
      <c-select-complete
          v-model="filters.models.tipo"
          label="Tipo Registro"
          :items="filters.data.tiposRegistros"
          item-text="text"
          item-value="value"
      >
      </c-select-complete>
    </v-col>
    <v-col class="pb-0" cols="12" sm="12" md="12">
      <v-checkbox
          v-model="filters.models.fallido"
          label="Personas no localizadas"
          :true-value="true"
          :false-value="false"
          @change="aplicaFiltros"
      ></v-checkbox>
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
          covid_contacto: null,
          cet_id: '',
          estado: null,
          tipo: null,
          fallido: null
        },
        data: {
          tipos: [
            {text: 'Confirmados', value: 1},
            {text: 'Contactos', value: 2}
          ],
          estados: [
            {text: 'Aplica devolución', value: 1},
            {text: 'No aplica devolución', value: 2},
            {text: 'Sin estado', value: 3}
          ],
          tiposRegistros: [
            {text: 'Grupos familiares completados', value: 1},
            {text: 'Grupos familiares sin completar', value: 2},
            {text: 'Registros sin gestionar', value: 3}
          ]
        }
      },
      cets: []
    }),
    methods: {
      aplicaFiltros() {
        let rutaTemp = this.rutaBase
        if (this.filters.models.covid_contacto !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[covid_contacto]=' + this.filters.models.covid_contacto
        }
        if (this.filters.models.cet_id != null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[cet_id]=' + this.filters.models.cet_id
        }
        if (this.filters.models.estado != null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[estado]=' + this.filters.models.estado
        }
        if (this.filters.models.tipo != null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[tipo]=' + this.filters.models.tipo + `,${this.filters.models.cet_id ? this.filters.models.cet_id : ''}`
        }
        if (this.filters.models.fallido !== null) {
          rutaTemp = rutaTemp + (rutaTemp.indexOf('?') > -1 ? '&' : '?') + 'filter[fallidos]=' + this.filters.models.fallido
        }
        this.$emit('filtra', rutaTemp)
      },
      getCets(){
        this.axios.get('cets').then(response => {
          this.cets = response.data
          if(this.cets && this.cets.length){
            this.filters.models.cet_id = this.cets[this.cets.length - 1].id
          }
          this.aplicaFiltros()
        })
      },
      limpiarFiltros(){
        this.filters.models.covid_contacto = null
        this.filters.models.cet_id = null
        this.filters.models.estado = null
        this.filters.models.tipo = null
        this.filters.models.fallido = false
        this.aplicaFiltros()
      }
    },
    created() {
      this.aplicaFiltros()
      this.getCets()
    }
  }
</script>

<style scoped>

</style>
