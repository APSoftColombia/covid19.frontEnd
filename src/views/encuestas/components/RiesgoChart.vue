<template>
  <div class="pos-relative overflow-hidden server-load-widget">
    <div class="d-custom-flex justify-space-between align-items-center">
      <div style="text-align: center">
        <span class="fs-12 fw-normal grey--text">Puntaje Mínimo</span>
        <h5 class="mb-0">
          <span class="success--text">{{ riesgo.minimo }}</span>
        </h5>
      </div>
      <div style="text-align: center">
        <span class="fs-12 fw-normal grey--text">Puntaje Máximo</span>
        <h5 class="mb-0">
          <span class="error--text">{{ riesgo.maximo }}</span>
        </h5>
      </div>
    </div>
    <div>
      <ECharts
          v-if="visible"
          :options="data"
          autoresize
          id="barChart"
          style="width:100%; height:260px"
      />
    </div>
    <div class="d-custom-flex justify-center align-items-center">
      <div style="text-align: center">
        <span class="fs-12 fw-bold grey--text">Puntaje Obtenido</span>
        <h5 class="mb-0">
          <span
            :class="`${riesgo.riesgo === 'Bajo' ? 'success' : riesgo.riesgo === 'Medio' ? 'warning' : 'error'}--text`"
          >
            {{ riesgo.acumulado }}
          </span>
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/title'
import {ChartConfig} from 'Constants/chart-config'

export default {
  name: 'RiesgoChart',
  props: {
    riesgo: {
      type: Object,
      default: null
    }
  },
  components: {
    ECharts
  },
  data() {
    return {
      visible: false,
      data: null,
      gauge: {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: 'Server Load',
            type: 'gauge',
            startAngle: 225,
            endAngle: -45,
            detail: {
              formatter: '{value}%',
              fontSize: 22
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0.4, ChartConfig.color.success],
                  [0.8, ChartConfig.color.warning],
                  [1, ChartConfig.color.danger]
                ],
                width: 20
              }
            },
            data: [{value: 0, name: 'RIESGO'}],
            radius: 130
          }
        ]
      }
    };
  },
  mounted() {
    this.gauge.series[0].axisLine.lineStyle.color[0][0] = this.riesgo.breakPointMinimoP
    this.gauge.series[0].axisLine.lineStyle.color[1][0] = this.riesgo.breakPointMedioP
    this.gauge.series[0].data[0].value = Number((this.riesgo.acumuladoP * 100).toFixed(2))
    this.data = this.gauge
    this.visible = true
  }
}
</script>