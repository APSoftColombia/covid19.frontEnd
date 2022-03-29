<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon
          v-on="on"
          :color="color"
      >
        {{icon}}
      </v-icon>
    </template>
    <span>{{tooltip}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'IconTooltip',
  props: {
    icon: {
      type: String,
      default: 'fas fa-exclamation-triangle'
    },
    tooltip: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'orange'
    }
  }
}
</script>
