<template>
  <ValidationProvider
      :name="name"
      :vid="vid"
      :rules="rules"
      v-slot="{ errors, valid }"
  >
    <v-file-input
        v-model="model"
        :counter="counter"
        :label="label + ' ' + accept"
        :name="name"
        :error-messages="errors"
        :clearable="clearable"
        :placeholder="placeholder"
        :outlined="outlined"
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :accept="accept"
        color="deep-purple accent-4"
        :show-size="1000"
        :hint="hint"
        persistent-hint
        prepend-icon=""
        :prepend-inner-icon="icon"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip
            v-if="index < 2"
            color="deep-purple accent-4"
            dark
            label
            small
        >
          {{ text }}
        </v-chip>
        <span
            v-else-if="index === 2"
            class="overline grey--text text--darken-3 mx-2"
        >
          +{{ files.length - 2 }} File(s)
        </span>
      </template>
    </v-file-input>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CFile',
  props: {
    value: {
      type: File,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Seleccione archivo'
    },
    name: {
      type: String,
      default: null
    },
    vid: {
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
    outlined: {
      type: Boolean,
      default: true
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
    upperCase: {
      type: Boolean,
      default: false
    },
    lowerCase: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      default: null
    },
    accept: {
      type: String,
      default: '.pdf'
    },
    icon: {
      type: String,
      default: 'mdi-paperclip'
    },
    hint: {
      type: String,
      default: null
    }
  },
  data: () => ({
    model: null
  }),
  watch: {
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
}
</script>
