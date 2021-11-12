<template>
  <v-tooltip top v-if="item && item.length">
    <template v-slot:activator="{on}">
      <v-btn
          v-on="on"
          :class="`${textColor}--text`"
          @click="$emit('click', item)"
          text
          icon
      >
        <v-icon>mdi mdi-needle</v-icon>
      </v-btn>
    </template>
    <span>Este registro tiene {{ item.length }} vacunas aplicadas</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "BotonVacunacion",
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