<template>
  <v-chip
      class="ma-1"
      close
      color="primary darken-1"
      label
      outlined
      @click:close="$emit('close')"
  >
    <v-list-item-content class="pa-0">
      <v-list-item-subtitle class="ma-0 mt-1 font-weight-black">{{ text }}</v-list-item-subtitle>
      <v-list-item-subtitle
          v-if="subtitle"
          style="line-height:0.8rem !important; margin-bottom: 0.2rem !important;"
          class="caption text-truncate"
      >
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-chip>
</template>

<script>
export default {
  name: 'CChipFilters',
  props: {
    value: {
      type: [Number, String, Object, Array],
      default: null
    },
    text: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>

</style>