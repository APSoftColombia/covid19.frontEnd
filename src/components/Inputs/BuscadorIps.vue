<template>
  <ValidationProvider
      :name="name"
      :rules="rules"
      v-slot="{ errors }"
  >
    <v-autocomplete
        :label="label"
        v-model="ips"
        :item-value="itemValue"
        :items="ipss"
        :loading="ipsLoading"
        :search-input.sync="ipsSearch"
        no-filter
        placeholder="Buscar por código de habilitación, NIT o nombre"
        no-data-text="No hay resultados para mostrar"
        outlined
        :error-messages="errors"
        hide-selected
        persistent-hint
        :hint="ips && ipss.find(x => x[itemValue] === ips) ? [ipss.find(x => x[itemValue] === ips).telefono ? `Tel.${ipss.find(x => x[itemValue] === ips).telefono}`: null, `${ipss.find(x => x[itemValue] === ips).direccion} ${ipss.find(x => x[itemValue] === ips).nompio}, ${ipss.find(x => x[itemValue] === ips).nomdepto}`].filter(x => x).join(' | '): null"
        @change="val => $emit('change', val)"
    >
      <template v-slot:selection="data">
        <v-list-item
            class="pa-0"
            style="width: 100% !important;"
        >
          <v-list-item-content class="pa-0">
            <v-list-item-title class="body-2 text-truncate">
              {{ data.item.nombre }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption text-truncate">
              Código de Habilitación:{{ data.item.codigohabilitacion }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="data">
        <div style="width: 100% !important;">
          <v-list-item class="pa-0">
            <v-list-item-content class="text-truncate pa-0">
              <v-list-item-title class="body-2">
                {{ data.item.nombre }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                Código de Habilitación:{{ data.item.codigohabilitacion }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="ma-0" />
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
    }
  },
  data: () => ({
    ips: null,
    ipss: [],
    ipsSearch: null,
    ipsLoading: false
  }),
  watch: {
    'ipsSearch': {
      handler(val) {
        val && this.buscarIPS()
      },
      immediate: false
    },
    ips: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
        this.$emit('inputObject', (typeof val !== 'undefined') ? this.ipss.find(x => x[this.itemValue] === val) : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.ips = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  methods: {
    assign (item) {
      if (item) this.ipss.push(item)
    },
    buscarIPS: lodash.debounce(async function () {
      if (this.ipsSearch) {
        this.ipsLoading = true
        this.axios.get(`prestadores?filter[search]=${this.ipsSearch}`)
            .then(response => {
              this.ipss = response.data
              this.ipsLoading = false
            }).catch(e => {
          this.ipsLoading = false
          this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda de IPS.`, error: e})
        })
      }
    }, 500)
  }
}
</script>
