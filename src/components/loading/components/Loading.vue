<template>
  <v-overlay
    :absolute="absolute"
    :opacity="opacity"
    :value="value"
    color="white"
  >
    <v-container fluid>
      <v-row justify="center">
        <v-progress-circular color="primary" indeterminate size="64"/>
      </v-row>
      <v-row
        v-if="textLoading || percent !== null"
        justify="center"
      >
        <v-col
          v-if="textLoading"
          cols="12"
          class="text-center"
        >
          <span class="black--text">
            {{ textLoading }}
          </span>
        </v-col>
        <v-col
          v-if="percent"
          cols="12"
          class="text-center"
        >
          <v-progress-linear
            :value="percent"
            height="22"
          >
            <strong>{{ percent.toFixed(2) }}%</strong>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Loading',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: false
    },
    opacity: {
      type: Number,
      default: 0.5
    }
  },
  computed: {
    ...mapGetters([
      'textLoading',
      'percent'
    ])
  },
  watch: {
    value: {
      handler (val) {
        if (!val) {
          this.$store.commit('SET_TEXT_LOADING')
          this.$store.commit('SET_PERCENT_LOADING')
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
