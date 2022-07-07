<template>
  <div style="display: grid">
    <v-chip label small color="green" class="mb-1">
      <c-tooltip tooltip="Disponible" left>
        <v-icon left>mdi-alpha-d-circle-outline</v-icon>
      </c-tooltip>
      {{disponible}}
    </v-chip>
    <v-chip label small color="blue">
      <c-tooltip tooltip="Total" left>
        <v-icon left>mdi-alpha-t-circle-outline</v-icon>
      </c-tooltip>
      {{total}}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'ValueTable',
  props: {
    disponible: {
      type: [String, Number],
      default: null
    },
    total: {
      type: [String, Number],
      default: null
    }
  }
}
</script>