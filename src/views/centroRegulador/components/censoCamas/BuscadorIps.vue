<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-autocomplete
        :label="label"
        v-model="item"
        :item-value="itemValue"
        item-text="nombre"
        :items="codigos"
        :loading="itemLoading"
        :search-input.sync="itenSearch"
        no-filter
        placeholder="Buscar por código de Habilitación o Nombre"
        no-data-text="No hay resultados para mostrar"
        outlined
        dense
        clearable
        :error-messages="errors"
        :disabled="disabled"
        hide-selected
        persistent-hint
        :hint="seleccionado ? [seleccionado.codigohabilitacion ? `Cód: ${seleccionado.codigohabilitacion}` : null, seleccionado.telefono ? `Tel.${seleccionado.telefono}` : null, seleccionado.email ? `Email:${seleccionado.email}` : null, [seleccionado.direccion, seleccionado.nomdepto, seleccionado.nompio].filter(x => x).join(', ')].filter(x => x).join(' | '): null"
        @change="val => $emit('change', val)"
    >
      <template v-slot:item="data">
        <div style="width: 100% !important;">
          <v-list-item class="pa-0">
            <v-list-item-content class="text-truncate pa-0">
              <v-list-item-title class="body-2">
                {{ data.item.codigohabilitacion }} | {{ data.item.nombre }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{
                  [data.item.direccion, data.item.nomdepto, data.item.nompio].filter(x => x).join(', ')
                }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="caption">
                {{
                  [data.item.telefono ? `Tel.${data.item.telefono}` : null, data.item.email ? `Email:${data.item.email}` : null].filter(x => x).join(' | ')
                }}
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
  name: 'BuscadorIps',
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
      default: 'codigohabilitacion'
    },
    rules: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    municipio: {
      type:Object,
      default: null
    }
  },
  data: () => ({
    item: null,
    codigos: [],
    itenSearch: null,
    itemLoading: false
  }),
  created() {
    if (this.value) {
      this.buscarItem(this.value)
    }
  },
  watch: {
    municipio: {
      handler(val) {
        val && this.buscarItem()
      },
      immediate: false
    },
    itenSearch: {
      handler(val) {
        val && this.buscarItem()
      },
      immediate: false
    },
    item: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
        this.$emit('inputObject', (typeof val !== 'undefined') ? this.codigos.find(x => x[this.itemValue] === val) : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.item = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  computed: {
    seleccionado() {
      return this.item && this.codigos && this.codigos.find(x => x[this.itemValue] === this.item) ? this.codigos.find(x => x[this.itemValue] === this.item) : null
    }
  },
  methods: {
    assign(item) {
      if (item) this.codigos.push(item)
    },
    buscarItem: lodash.debounce(async function (value) {
      if (value || this.itenSearch || this.municipio) {
        this.itemLoading = true
        this.axios.get(`prestadores?filter[search]=${value || this.itenSearch || ''}`)
            .then(response => {
              this.codigos = response.data
              this.itemLoading = false
            }).catch(e => {
          this.itemLoading = false
          this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda de registros IPS.`, error: e})
        })
      }
    }, 500)
  }
}
</script>