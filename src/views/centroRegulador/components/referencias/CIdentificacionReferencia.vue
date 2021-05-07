<template>
  <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
    <v-text-field
        ref="refIdentificacion"
        v-model="model"
        :label="label"
        outlined
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :error-messages="errors"
        :clearable="clearable"
        :counter="counter"
        :append-icon="model && isMovil ? 'mdi-magnify' : ''"
        @click:append="enter"
        @keyup.enter="enter"
        :loading="loading"
        :hint="model ? !isMovil ? 'Enter para verificar' : 'Touch en lupa para verificar': ''"
    ></v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CIdentificacionReferencia',
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    rules: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: true
    },
    counter: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    model: null,
    loading: false,
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
    model: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.model = ((typeof val !== 'undefined') ? val : null)
      },
      immediate: true
    }
  },
  methods: {
    enter() {
      if (this.model) {
        this.$emit('keyup')
        this.loading = true
        this.axios.get(`afiliado_referencias/${this.model}`)
            .then(response => {
              this.$emit('response', (typeof response !== 'undefined') ? response.data : null)
              this.loading = false
            })
            .catch(error => {
              this.$store.commit('snackbar', {
                color: 'error',
                message: `al hacer la búsqueda del afiliado.`,
                error: error
              })
              this.loading = false
            })
      }
    }
  }
}
</script>

<style scoped>

</style>