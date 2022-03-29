<template>
  <ValidationProvider
      :name="name"
      :rules="rules"
      v-slot="{ errors, valid }"
  >
    <v-autocomplete
        class="postuladorx"
        :prepend-icon="prependIcon"
        :append-icon="search && isMovil ? 'mdi-magnify' : ''"
        @click:append="enter"
        :label="value ? label : `Buscar ${label}`"
        :value="value"
        :items="items"
        :item-text="itemText"
        :hint="hint"
        persistent-hint
        :loading="loading"
        :search-input.sync="search"
        :no-data-text="textSearch"
        return-object
        outlined
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :error-messages="errors"
        :clearable="clearable"
        :multiple="multiple"
        :placeholder="placeholder"
        :filter="filtrar"
        @input="input"
        @keyup.enter="enter"
    >
      <template slot="append-outer">
        <slot name="append-outer" />
      </template>
      <template
          v-if="!itemText"
          v-slot:selection="{ attr, on, item, selected }"
      >
        <slot name="selection" v-bind="{ attr, on, item, selected }" />
      </template>
      <template v-slot:item="{ item }">
        <slot name="item" v-bind="{ item }" />
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'Postulador',
  props: {
    prependIcon: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    itemText: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    noDataText: {
      type: String,
      default: 'No hay registros para mostrar'
    },
    value: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    route: {
      type: String,
      default: null
    },
    filter: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    }
  },
  data: () => ({
    items: [],
    loading: false,
    search: '',
    textSearch: '',
    isMovil: false
  }),
  watch: {
    '$vuetify.breakpoint.name': {
      handler(val) {
        val && (this.isMovil = !!(navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/BlackBerry/i)))
      },
      immediate: true
    },
    'value': {
      immediate: true,
      handler(val) {
        if (val) {
          !this.items.find(x => x.id === val.id) && this.items.push(val)
          this.$emit('input', val)
        } else {
          this.$emit('input', null)
        }
      }
    }
  },
  created() {
    this.textSearch = this.noDataText
  },
  methods: {
    enter(event) {
      this.loading = true
      this.textSearch = `Buscando registros...`
      let stringRouteSearch = 'filter[search]=' + (event.target.value === null ? '' : event.target.value)
      let stringRoute = this.route + (this.route.includes('?') ? '&' : '?') + stringRouteSearch
      this.axios.get(stringRoute)
          .then(response => {
            if (response.data.length) {
              this.items = response.data
              this.textSearch = this.noDataText
            } else {
              this.textSearch = `Lo sentimos... no hay registros para mostrar`
            }
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al buscar los registros.`, error: e})
          })
    },
    input(value) {
      this.$emit('input', !value ? null : value)
    },
    filtrar(item, queryText) {
      let array = this.filter ? this.filter.split(',') : this.itemText ? [this.itemText] : []
      array.forEach((item, key) => {
        array[key] = 'item.' + item
      })
      const hasValue = val => val != null ? val : ''
      // eslint-disable-next-line no-eval
      const text = hasValue(eval(array.join(' + " " + ')))
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }
}
</script>

<style>
.postuladorx .v-input__append-outer {
  margin-top: 3px !important;
}

.v-menu__content.theme--light.menuable__content__active.v-autocomplete__content .v-list {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.postuladorx > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon--append > .notranslate {
  transform: inherit !important;
}
</style>
