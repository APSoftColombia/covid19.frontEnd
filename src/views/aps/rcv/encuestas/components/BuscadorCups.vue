<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-autocomplete
        :label="label"
        v-model="cup"
        :item-value="itemValue"
        :items="codigos"
        :loading="cupsLoading"
        :search-input.sync="cupsSearch"
        no-filter
        placeholder="Buscar por código CUP o Descripcion"
        no-data-text="No hay resultados para mostrar"
        outlined
        :error-messages="errors"
        hide-selected
        persistent-hint
        :hint="cup && codigos.find(x => x[itemValue] === cup) ? [codigos.find(x => x[itemValue] === cup).codigo ? `Descripcion.${codigos.find(x => x[itemValue] === cup).descrip}`: null, `Codigo.${codigos.find(x => x[itemValue] === cup).codigo}`].filter(x => x).join(' | '): null"
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
    buscarCups: lodash.debounce(async function () {
      if (this.cupsSearch) {
        this.cupsLoading = true
        this.axios.get(`cups?filter[search]=${this.cupsSearch}`)
            .then(response => {
              this.codigos = response.data
              this.cupsLoading = false
            }).catch(e => {
          this.cupsLoading = false
          this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda de codigo CUP`, error: e})
        })
      }
    }, 500)
  }
}
</script>

<style scoped>

</style>