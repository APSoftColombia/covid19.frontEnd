<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
      <tr>
        <th v-for="(header, index) in headers" :key="index" class="text-left">{{ header }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <template v-for="(value, key) in returnValues(item)">
          <td :key="key" style="height: 40px !important;">{{ value }}</td>
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
    },
    methods: {
      returnValues(row){
        let values = []
        for(const[llave, valor] of Object.entries(row)){
          llave
          values.push(valor)
        }
        return values
      }
    }
  }
</script>

<style scoped>

</style>