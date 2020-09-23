<template>
  <v-simple-table dense class="text-capitalize">
    <template v-slot:default>
      <thead>
        <tr><th v-for="(header, index) in headers" :key="index" class="text-left">{{ header }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <template v-for="(value, key) in returnValues(item)">
            <td
                :key="key"
                style="height: 40px !important;"
                :class="`${isNotNumber(value) ? 'text-right' : ''} ${lastRowBold && ((index + 1) === data.length) ? 'font-weight-bold' : 'font-weight-medium'}`"
            >
              {{ value }}
            </td>
          </template>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
  export default {
    name: "SimpleTable",
    props: {
      data: {
        type: [Array, Object],
        default: null
      },
      headers: {
        type: Array,
        default: null
      },
      lastRowBold: {
        type: Boolean,
        default: false
      },
      alignNumbersRight: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      returnValues(row){
        let values = []
        for(const[llave, valor] of Object.entries(row)){
          llave
          values.push(valor)
        }
        return values
      },
      isNotNumber(value){
        if(!isNaN(value) && this.alignNumbersRight){
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>

</style>