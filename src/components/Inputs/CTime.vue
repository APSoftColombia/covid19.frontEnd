<template>
  <ValidationProvider
      :name="name"
      :vid="vid"
      :rules="(rules ? `${rules}|`: '') + 'timeValid' + (min ? `|mintime:${min}` : '') + (max ? `|maxtime:${max}` : '')"
      v-slot="{ errors, valid }"
  >
    <v-text-field
        v-model="timeFormatted"
        :label="label"
        :placeholder="placeholder"
        outlined
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :error-messages="errors"
        :clearable="clearable"
        :hint="hint"
        persistent-hint
        :hide-details="hideDetails"
        v-mask="'##:##'"
        @blur="calculaBlur"
    >
      <template v-slot:prepend-inner>
        <v-menu
            ref="theMenu"
            v-model="menuTime"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                v-on="on"
                v-bind="attrs"
                class="mr-1"
            >
              mdi-clock-outline
            </v-icon>
          </template>
          <v-time-picker
              ref="timePicker"
              v-if="menuTime"
              v-model="model"
              :min="min"
              :max="max"
              format="24hr"
              scrollable
              full-width
              @click:minute="$refs.theMenu.save(model)"
          />
        </v-menu>
      </template>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CTime',
  props: {
    value: {
      type: String,
      default: null
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
    menuTime: false
  }),
  computed: {
    timeFormatted: {
      get: function () {
        return this.value ? this.formatDate(this.value) : null
      },
      set: function (newValue) {
        this.model = newValue
        this.$emit('input', this.formatDate(newValue))
      }
    }
  },
  watch: {
    model: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : null)
      },
      immediate: false
    }
  },
  methods: {
    calculaBlur() {
      if (!this.timeFormatted) return null
      let [hours, minuts] = this.timeFormatted.split(':')
      if(minuts && minuts.length === 1) minuts = ('0' + minuts)
      if(hours && hours.length === 1) hours = ('0' + hours)
      const newTime = `${hours}:${minuts}`
      this.model = newTime
    },
    formatDate(date) {
      if (!date) return null
      const [hours, minuts] = date.split(':')
      return `${hours}:${minuts}`
    }
  }
}
</script>
