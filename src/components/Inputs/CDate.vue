<template>
  <v-menu
      v-model="menuFecha"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      :disabled="disabled"
  >
    <template v-slot:activator="{ on }">
      <ValidationProvider
          :name="name" :vid="vid"
          :rules="(rules ? `${rules}`: '') + (rules && type === 'date' ? '|' : '') + (type === 'date' ? 'dateValid' : '')"
          v-slot="{ errors, valid }"
      >
        <v-text-field
            v-model="dateFormatted"
            :label="label"
            :placeholder="placeholder"
            prepend-inner-icon="mdi-calendar-month"
            readonly
            outlined
            v-on="on"
            :dense="dense"
            :disabled="disabled"
            :error-messages="errors"
            :clearable="clearable"
            :hint="hint"
            persistent-hint
            :hide-details="hideDetails"
        />
      </ValidationProvider>
    </template>
    <v-date-picker
        v-model="model"
        @input="menuFecha = false"
        :min="min"
        :max="max"
        scrollable
        :type="type"
        :disabled="disabled"
    />
  </v-menu>
</template>

<script>
export default {
  name: 'CDate',
  props: {
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'date'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: null
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
    min: {
      type: [Number, String],
      default: null
    },
    max: {
      type: [Number, String],
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    hideDetails: {
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
    }
  },
  data: () => ({
    model: null,
    menuFecha: false
  }),
  computed: {
    dateFormatted: {
      get: function () {
        return this.value ? this.type === 'date' ? this.formatDate(this.value) : this.value : null
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  watch: {
    model: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.model = ((typeof val !== 'undefined') && this.moment(val).isValid() ? val : null)
      },
      immediate: true
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
}
</script>
