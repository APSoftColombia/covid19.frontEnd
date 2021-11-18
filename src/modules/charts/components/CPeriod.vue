<template>
  <v-menu
    ref="menuFecha"
    v-model="menuFecha"
    :close-on-content-click="false"
    :return-value.sync="model"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <ValidationProvider :name="name" :rules="rules" v-slot="{ errors }">
        <v-text-field
          class="cperiod"
          v-model="dateFormatted"
          :label="label"
          :placeholder="placeholder"
          prepend-inner-icon="mdi-calendar-range"
          readonly
          outlined
          v-on="on"
          :dense="dense"
          :disabled="disabled"
          :error-messages="errors"
          :clearable="clearable"
          :hint="hint"
        >
          <template v-slot:prepend>
            <v-menu
              offset-y
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  color="grey"
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list
                class="pa-0"
              >
                <v-list-item
                  v-for="(periodo, indexPeriodo) in periods"
                  :key="`periodo${indexPeriodo}`"
                  @click="selectPeriod(periodo)"
                >
                  <v-list-item-title
                    :class="selectedPeriod === periodo ? 'primary--text' : ''"
                  >
                    {{ periodo.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </ValidationProvider>
    </template>
    <v-date-picker
      v-model="model"
      :min="min"
      :max="max"
      scrollable
      no-title
      range
    />
  </v-menu>
</template>

<script>
export default {
  name: 'CPeriod',
  props: {
    periodOrigin: {
      type: String,
      default: 'today'
    },
    value: {
      type: [Array],
      default: () => []
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
      default: 'Seleccionar rango de fechas'
    },
    name: {
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
    model: [],
    menuFecha: false,
    selectedPeriod: null,
    clearSelectedPeriod: true,
    periods: [
      {
        value: 'today',
        text: 'Hoy'
      },
      {
        value: 'last_week',
        text: 'Semana Pasada'
      },
      {
        value: 'last_month',
        text: 'Mes Pasado'
      },
      {
        value: 'last_year',
        text: 'Año Pasado'
      }
    ]
  }),
  computed: {
    dateFormatted: {
      get: function () {
        if (this.$refs && this.$refs.menuFecha && ((this.value && this.value.length === 2) && (this.model && this.model.length === 2))) {
          this.$refs.menuFecha.save(this.model)
        }
        return this.value || this.value.length === 2 ? [this.formatDate(this.value[0]), this.formatDate(this.value[1])].join(' - ') : []
      },
      set: function (newValue) {
        console.log('newValue', newValue)
        if (!newValue) this.selectedPeriod = this.periods.find((periodo) => periodo.value === null)
        this.$emit('input', newValue || [])
      }
    }
  },
  watch: {
    model: {
      handler (val) {
        console.log('val model', val)
        if (typeof val === 'undefined' || val === null) {
          this.$emit('input', [])
          this.selectedPeriod = this.periods.find((periodo) => periodo.value === null)
        } else if (val && val.length === 2) {
          if ((val[0] !== val[1]) && !this.moment(val[1]).isAfter(val[0], 'day')) {
            this.$emit('input', [val[1], val[0]])
            if (this.clearSelectedPeriod) this.selectedPeriod = this.periods.find((periodo) => periodo.value === null)
          } else {
            if (this.clearSelectedPeriod && (val !== this.value)) this.selectedPeriod = this.periods.find((periodo) => periodo.value === null)
            this.$emit('input', val)
          }
        }
      },
      immediate: false
    },
    value: {
      handler (val, prev) {
        console.log('prev', prev)
        if ((typeof prev === 'undefined' || prev === null) && (!val || (val && val.length === 0))) {
          this.selectedPeriod = this.periods.find(periodo => periodo.value === this.periodOrigin)
          this.model = this.makeDatePeriod()
        } else {
          this.model = ((typeof val !== 'undefined' && val !== null) ? val : [])
        }
      },
      immediate: true
    },
    periodOrigin: {
      handler (val) {
        console.log('llega algo a wt', val)
        if (val) this.selectPeriod(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectPeriod (period) {
      this.selectedPeriod = this.periods.find(periodo => periodo.value === ((typeof period === 'string') ? period : period.value))
      this.model = this.makeDatePeriod()
    },
    makeDatePeriod () {
      this.coolTimeSelectedPeriod()
      switch (this.selectedPeriod.value) {
        case 'today':
          return [
            this.moment().format('YYYY-MM-DD'),
            this.moment().format('YYYY-MM-DD')
          ]
        case 'last_week':
          return [
            this.moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
            this.moment().subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
          ]
        case 'last_month':
          return [
            this.moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            this.moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
          ]
        case 'last_year':
          return [
            this.moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
            this.moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
          ]
      }
    },
    coolTimeSelectedPeriod () {
      this.clearSelectedPeriod = false
      setTimeout(() => {
        this.clearSelectedPeriod = true
      }, 500)
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
}
</script>
<style>
.cperiod .v-input__prepend-outer{
  margin: 0 !important;
  margin-right: 4px !important;
}
</style>
