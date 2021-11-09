<template>
  <v-tooltip top v-if="item">
    <template v-slot:activator="{on}">
      <v-btn
          v-on="on"
          :class="`${textColor}--text`"
          @click="$emit('click', item)"
          text
          icon
      >
        <v-icon>mdi mdi-currency-usd</v-icon>
      </v-btn>
    </template>
    <span>Este registro tiene Cet pago</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "BotonCet",
  props: {
    item: {
      type: [Array, Object],
      Default: null
    },
    textColor: {
      type: String,
      default: null
    }
  },
}
</script>

<style scoped>

</style>