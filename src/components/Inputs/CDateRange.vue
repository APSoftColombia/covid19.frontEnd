<template>
    <v-menu
            ref="menuFecha"
            v-model="menuFecha"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="model"
            transition="scale-transition"
            offset-y
            min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <ValidationProvider :name="name" :rules="rules" v-slot="{ errors, valid }">
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
                ></v-text-field>
            </ValidationProvider>
        </template>
        <v-date-picker
                v-model="model"
                :min="min"
                :max="max"
                scrollable
                no-title
                range
        >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuFecha = false">Cancelar</v-btn>
            <v-btn text color="primary" @click="$refs.menuFecha.save(model)">Aceptar</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
  export default {
    name: 'CDateRange',
    props: {
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
      menuFecha: false
    }),
    computed: {
      dateFormatted: {
        get: function () {
          return this.value ? this.value.join(' ~ ') : []
        },
        set: function (newValue) {
          this.$emit('input', newValue)
        }
      }
    },
    watch: {
      model: {
        handler(val) {
          this.$emit('input', (typeof val !== 'undefined' && val !== null) ? val : [])
        },
        immediate: false
      },
      value: {
        handler(val) {
          this.model = ((typeof val !== 'undefined' && val !== null) ? val : [])
        },
        immediate: true
      }
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      }
    }
  }
</script>

<style scoped>

</style>