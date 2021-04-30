<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-autocomplete
        :label="label"
        v-model="cup"
        :item-value="itemValue"
        item-text="descrip"
        :items="codigos"
        :loading="cupsLoading"
        :search-input.sync="cupsSearch"
        no-filter
        placeholder="Buscar por código CUP o Descripción"
        no-data-text="No hay resultados para mostrar"
        outlined
        dense
        :error-messages="errors"
        hide-selected
        persistent-hint
        :hint="cup && codigos.find(x => x[itemValue] === cup) ? [codigos.find(x => x[itemValue] === cup).codigo, codigos.find(x => x[itemValue] === cup).descrip].filter(x => x).join(' | '): null"
        @change="val => $emit('change', val)"
    >
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
name: 'BuscadorCups',
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
    cup: null,
    codigos: [],
    cupsSearch: null,
    cupsLoading: false
  }),
  created(){
    if(this.value){
      this.buscarCups(this.value)
    }
  },
  watch: {
    'cupsSearch': {
      handler(val) {
        val && this.buscarCups()
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
        this.cup = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  methods: {
    assign (item) {
      if (item) this.codigos.push(item)
    },
    buscarCups: lodash.debounce(async function (value) {
      if (value || this.cupsSearch) {
        this.cupsLoading = true
        this.axios.get(`cups?filter[search]=${value || this.cupsSearch}`)
            .then(response => {
              this.codigos = response.data
              this.cupsLoading = false
            }).catch(e => {
          this.cupsLoading = false
          this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda de Registros CUP.`, error: e})
        })
      }
    }, 500)
  }
}
</script>

<style scoped>

</style>