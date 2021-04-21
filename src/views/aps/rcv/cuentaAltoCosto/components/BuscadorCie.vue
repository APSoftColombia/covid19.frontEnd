<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-autocomplete
        :label="label"
        v-model="cie"
        :item-value="itemValue"
        :items="codigos"
        :loading="ciesLoading"
        :search-input.sync="ciesSearch"
        no-filter
        placeholder="Buscar por código CIE o Descripcion"
        no-data-text="No hay resultados para mostrar"
        outlined
        :error-messages="errors"
        hide-selected
        persistent-hint
        :hint="cie && codigos.find(x => x[itemValue] === cie) ? [codigos.find(x => x[itemValue] === cie).codigo ? `Descripcion.${codigos.find(x => x[itemValue] === cie).descrip}`: null, `Codigo.${codigos.find(x => x[itemValue] === cie).codigo}`].filter(x => x).join(' | '): null"
        @change="val => $emit('change', val)"
    >
      <template v-slot:selection="data">
        <v-list-item class="pa-0" style="width: 100% !important;">
          <v-list-item-content class="pa-0">
            <v-list-item-title class="body-2 text-truncate">
              {{ data.item.descrip }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption text-truncate">Código:{{ data.item.codigo }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="data">
        <div style="width: 100% !important;">
          <v-list-item class="pa-0">
            <v-list-item-content class="text-truncate pa-0">
              <v-list-item-title class="body-2">
                {{ data.item.descrip }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">Código: {{ data.item.codigo }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="ma-0"></v-divider>
        </div>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import lodash from 'lodash'
export default {
name: 'BuscadorCies',
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: [String, Number, Object],
      default: null
    },
    name: {
      type: String,
      default: null
    },
    itemValue: {
      type: String,
      default: 'codigo'
    },
    rules: {
      type: String,
      default: null
    }
  },
  data: () => ({
    cie: null,
    codigos: [],
    ciesSearch: null,
    ciesLoading: false
  }),
  created(){
    if(this.value){
      this.buscarCies(this.value)
    }
  },
  watch: {
    'ciesSearch': {
      handler(val) {
        val && this.buscarCies()
      },
      immediate: false
    },
    cup: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
        this.$emit('inputObject', (typeof val !== 'undefined') ? this.codigos.find(x => x[this.itemValue] === val) : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.cie = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  methods: {
    assign (item) {
      if (item) this.codigos.push(item)
    },
    buscarCies: lodash.debounce(async function (value) {
      if (value || this.ciesSearch) {
        this.ciesLoading = true
        this.axios.get(`cie10?filter[search]=${value || this.ciesSearch}`)
            .then(response => {
              this.codigos = response.data
              this.ciesLoading = false
            }).catch(e => {
          this.ciesLoading = false
          this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda de codigo CIE10`, error: e})
        })
      }
    }, 500)
  }
}
</script>

<style scoped>

</style>
