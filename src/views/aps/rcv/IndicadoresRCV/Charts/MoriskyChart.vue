<template>
  <v-card elevation="0">
    <div id="chartdiv4"/>
  </v-card>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import * as am4charts from '@amcharts/amcharts4/charts'

export default {
  name: 'MoriskyChart',
  props: {
    data: {
      type: Array,
      default: null
    },
    colors: {
      type: Array,
      default: null
    }
  },
  mounted() {
    am4core.useTheme(am4themes_animated)
    let chart = am4core.create('chartdiv4', am4charts.PieChart)
    chart.data = this.data

    let title = chart.titles.create()
    title.text = 'Test Morisky'
    title.fontSize = 20
    title.marginTop = 5

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'bottom'
    chart.legend.maxWidth = 300

    let pieSeries = chart.series.push(new am4charts.PieSeries())
    pieSeries.colors.list = this.colors
    pieSeries.dataFields.value = 'litres'
    pieSeries.dataFields.category = 'country'
    pieSeries.slices.template.stroke = am4core.color("#fff")
    pieSeries.labels.template.disabled = true
    pieSeries.ticks.template.disabled = false
    pieSeries.slices.template.states.getKey('hover').properties.scale = 1.1
  }
}
</script>

<style scoped>
#chartdiv4 {
  width: 100%;
  height: 450px;
}
</style>