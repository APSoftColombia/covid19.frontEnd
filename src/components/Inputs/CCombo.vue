<template>
  <ValidationProvider :name="name" :vid="vid" :rules="rules" v-slot="{ errors, valid }">
    <v-combobox
        v-model="model"
        :items="items"
        :label="label"
        :multiple="multiple"
        :chips="multiple"
        :small-chips="multiple"
        :error-messages="errors"
        :outlined="outlined"
        :dense="dense"
    >
      <template v-slot:selection="data" v-if="multiple">
        <v-chip
            :key="JSON.stringify(data.item)"
            v-bind="data.attrs"
            :input-value="data.selected"
            :disabled="data.disabled"
            @click:close="data.parent.selectItem(data.item)"
            label
            small
            color="accent"
        >
          {{ data.item }}
        </v-chip>
      </template>
    </v-combobox>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'CCombo',
  props: {
    value: {
      type: [String, Array],
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
    items: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: null
    },
    vid: {
      type: String,
      default: null
    },
    outlined: {
      type: Boolean,
      default: true
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
    hideDetails: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    model: null
  }),
  watch: {
    model: {
      handler(val) {
        this.$emit('input', (typeof val !== 'undefined') ? val : Array.isArray(val) ? [] : null)
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.model = ((typeof val !== 'undefined') ? val : Array.isArray(val) ? [] : null)
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>