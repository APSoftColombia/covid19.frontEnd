<template>
  <v-card flat>
    <v-list-item two-line class="pa-0">
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ chartData.label }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="chartData.subtitle">
          {{ chartData.subtitle }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-row align="center">
      <v-col
        class="text-h2"
        cols="12"
      >
        {{ chartData.value }}
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'QuantityChart',
  props: {
    chartData: {
      type: Object,
      default: null
    },
    height: {
      type: Number,
      default: 200
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
