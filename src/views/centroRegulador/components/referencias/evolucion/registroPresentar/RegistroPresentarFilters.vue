<template>
  <v-row
      justify="end"
      fill-height
  >
    <v-col cols="12">
      <c-select-complete
          v-model="model.departamento"
          label="Departamento"
          :items="departamentos"
          item-text="nombre"
          item-value="codigo"
          hide-details
      />
    </v-col>
    <v-col cols="12">
      <c-select-complete
          v-model="model.especialidad"
          label="Especialidad"
          :items="ref_especialidades || []"
          item-text="serv_nombre"
          item-value="serv_codigo"
          hide-details
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title>{{item.serv_nombre}}</v-list-item-title>
            <v-list-item-subtitle>{{item.tipo_servicio}}</v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </c-select-complete>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'RegistroPresentarFilters',
  data: () => ({
    model: {
      departamento: null,
      especialidad: null
    },
    string: ''
  }),
  computed: {
    ...mapGetters([
      'departamentos',
      'ref_especialidades'
    ])
  },
  watch: {
    model: {
      handler () {
        this.makeRouteFilter()
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    makeRouteFilter () {
      let string = ''
      console.log('this.model', this.model)
      if (this.model.departamento) string = string + `filter[codigo_departamento]=${this.model.departamento}`
      if(this.model.especialidad) string = `${string}${string ? '&' : ''}filter[serv_codigo]=${this.model.especialidad}`
      this.filterRows(string, 'rowsRefPrestadores')
    }
  }
}
</script>