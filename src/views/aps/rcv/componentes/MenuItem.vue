<template>
  <div class="text-center">
    <v-menu v-if="value" offset-x left open-on-hover transition="slide-x-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark v-on="on"
               :color="`darken-1 ${value.riesgo_general === 'Alto' ? 'error' : value.riesgo_general === 'Medio' ? 'warning' : value.riesgo_general === 'Indeterminado' ? 'grey' : 'success'}`"
               rounded
        >
          {{ value.riesgo_general }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in value.items"
            :key="index"
        >
          <v-list-item-title>
            <span class="font-weight-bold">
              {{ item.title }}
            </span>
            {{ item.value }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    value: {
      type: Object,
      Default: null
    },
  }
}
</script>

<style scoped>

</style>