<template>
  <v-snackbar
      v-model="show"
      top
      multi-line
      :color="color"
      :timeout="timeout"
  >
    <span v-html="message"></span>
    <v-btn
        icon
        @click="show = false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    timeout: 0,
    show: false,
    color: 'info',
    message: ''
  }),
  computed: {
    snackbar() {
      return this.$store.state.general.snackbar
    }
  },
  watch: {
    'snackbar'(val) {
      this.show = false
      if (val.message) {
        this.$nextTick(() => {
          this.color = val.color
          this.message = val.message
          this.timeout = val.timeout
          this.show = true
        })
      }
    }
  }
}
</script>
