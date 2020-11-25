<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
    <v-autocomplete
        :label="label"
        v-model="afiliado"
        :item-value="itemValue"
        :items="afiliados"
        :loading="afiliadoLoading"
        :search-input.sync="afiliadoSearch"
        no-filter
        placeholder="Buscar por nombre o documento de identidad"
        no-data-text="No hay resultados para mostrar"
        outlined
        :error-messages="errors"
        hide-selected
        persistent-hint
        :hint="afiliado && afiliados.find(x => x[itemValue] === afiliado) ? [afiliados.find(x => x[itemValue] === afiliado).numero_celular ? `Tel.${afiliados.find(x => x[itemValue] === afiliado).numero_celular}`: null, `${afiliados.find(x => x[itemValue] === afiliado).direccion},`].filter(x => x).join(' | '): null"
        @change="val => $emit('change', val)"
    >
      <template v-slot:selection="data">
        <v-list-item class="pa-0" style="width: 100% !important;">
          <v-list-item-content class="pa-0">
            <v-list-item-title class="body-2 text-truncate">
              {{ [data.item.nombre1, data.item.nombre2, data.item.apellido1, data.item.apellido2].filter(x => x).join(' ') }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption text-truncate">Número
              de Documento de Identidad:{{ ruta === 'buscar-afiliado' ? data.item.numero_documento_identidad : data.item.identificacion }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:item="data">
        <div style="width: 100% !important;">
          <v-list-item class="pa-0">
            <v-list-item-content class="text-truncate pa-0">
              <v-list-item-title class="body-2">
                {{ [data.item.nombre1, data.item.nombre2, data.item.apellido1, data.item.apellido2].filter(x => x).join(' ') }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">Número
                de Documento de Identidad:{{ ruta === 'buscar-afiliado' ? data.item.numero_documento_identidad : data.item.identificacion }}
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
  import lodash from "lodash";
  export default {
    name: "BuscadorAfiliado",
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
        default: 'afiliado'
      },
      rules: {
        type: String,
        default: null
      },
      ruta: {
        type: String,
        default: null
      }
    },
    data: () => ({
      afiliado: null,
      afiliados: [],
      afiliadoSearch: null,
      afiliadoLoading: false
    }),
    watch: {
      'afiliadoSearch': {
        handler(val) {
          val && this.buscarAfiliado()
        },
        immediate: false
      },
      afiliado: {
        handler(val) {
          this.$emit('input', (typeof val !== 'undefined') ? val : null)
          this.$emit('inputObject', (typeof val !== 'undefined') ? this.afiliados.find(x => x[this.itemValue] === val) : null)
        },
        immediate: false
      },
      value: {
        handler(val) {
          this.afiliado = ((typeof val !== 'undefined') ? val : null)
        },
        immediate: true
      }
    },
    methods: {
      assign (item) {
        if (item) this.afiliados.push(item)
      },
      buscarAfiliado: lodash.debounce(async function () {
        if (this.afiliadoSearch) {
          this.afiliadoLoading = true
          this.axios.get(`${this.ruta}?filter[search]=${this.afiliadoSearch}`)
              .then(response => {
                this.afiliados = response.data
                this.afiliadoLoading = false
              }).catch(e => {
            this.afiliadoLoading = false
            this.$store.commit('snackbar', {color: 'error', message: `al realizar la busqueda del afiliado.`, error: e})
          })
        }
      }, 500)
    }
  }
</script>

<style scoped>

</style>