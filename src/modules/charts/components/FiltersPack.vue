<template>
  <v-row
    dense
    justify="end"
  >
    <slot name="externalfilters"/>
    <template v-if="filters && filters.length">
      <template v-for="(filter, indexFilter) in filters">
        <v-col
          :key="`filter${indexFilter}`"
          cols="10"
          sm="6"
          md="6"
          xl="5"
        >
          <c-period
            v-if="filter.type === 'dateRange'"
            v-model="filter.vmodel"
            :label="filter.label"
            :period-origin="filter.period"
            :max="moment().format('YYYY-MM-DD')"
          />
        </v-col>
      </template>
    </template>
  </v-row>
</template>

<script>
import CPeriod from './CPeriod'
export default {
  name: 'FiltersPack',
  components: {
    CPeriod
  },
  props: {
    filters: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    filters: {
      handler () {
        this.makeStringFilters()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    makeStringFilters () {
      let string = ''
      console.log('this.filters', this.filters)
      console.log('this.filters', this.filters.filter((filter) => !['', null, undefined, []].find((x) => x === filter.vmodel)))
      this.filters.filter((filter) => !['', null, undefined, []].find((x) => x === filter.vmodel)).forEach((filter) => {
        switch (filter.type) {
          case 'dateRange':
            if (filter.vmodel.length === 2) string = string + (`fecha_inicial=${filter.vmodel[0]}&fecha_final=${filter.vmodel[1]}`)
            break
        }
      })
      console.log('string', string)
      this.$emit('reloadFilter', string)
    }
  }
}
</script>

<style scoped>

</style>
