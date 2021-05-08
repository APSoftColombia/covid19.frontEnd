<template>
  <v-col cols="12" class="py-0">
    <c-chip-filters
        v-for="(tag, keytag) in tags.estados"
        :key="`tag${keytag}`"
        :text="tag"
        subtitle="Estado"
        @close="closeTag(keytag)"
    />
    <!--                <c-chip-filters-->
    <!--                    v-if="tags.direccionado"-->
    <!--                    :text="tags.direccionado.text"-->
    <!--                    @close="() => {-->
    <!--                      tags.direccionado = null-->
    <!--                      $refs && $refs.filtros && $refs.filtros.aplicaFiltros()-->
    <!--                    }"-->
    <!--                />-->
    <!--                <c-chip-filters-->
    <!--                    v-if="tags.fecha_between && tags.fecha_between.length"-->
    <!--                    :text="`Desde ${tags.fecha_between[0]} hasta ${tags.fecha_between[1]}`"-->
    <!--                    @close="() => {-->
    <!--                      tags.fecha_between = []-->
    <!--                      $refs && $refs.filtros && $refs.filtros.aplicaFiltros()-->
    <!--                    }"-->
    <!--                />-->
  </v-col>
</template>

<script>
export default {
  name: 'TagsFilters',
  props: {
    tags: {
      type: [Object, Array]
    }
  },
  methods: {
    closeTag(keytag) {
      this.tags.estados.splice(keytag, 1)
      this.$emit('change')
    }
  }
}
</script>

<style scoped>

</style>