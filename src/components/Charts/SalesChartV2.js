// Sales Widget
import { Bar } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";

export default ({
   extends: Bar,
   data: function () {
      return {
         options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  stacked: true,
                  ticks: {
                     display: false
                  },
                  gridLines: {
                     display: false,
                     drawBorder: false
                  }
               }],
               xAxes: [{
                  stacked: true,
                  ticks: {
                     padding: 10
                  },
                  gridLines: {
                     display: false,
                     drawBorder: false
                  }
               }]
            },
            legend: {
               display: false
            }
         }
      }
   },
   mounted() {
      this.renderChart({
         labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Juli', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
         datasets: [
            {
               type: 'bar',
					label: 'Realizadas',
					barPercentage: 0.4,
               categoryPercentage: 1.3,
               backgroundColor: ChartConfig.color.primary,
               hoverBackgroundColor: ChartConfig.color.primary,
               borderWidth: 0,
               data: [45, 32, 50, 42, 32, 46, 30, 25, 29, 21, 21, 25]
            },
            {
               type: 'bar',
					label: 'Estimadas',
					barPercentage: 0.4,
               categoryPercentage: 1.3,
               backgroundColor: ChartConfig.lineChartAxesColor,
               hoverBackgroundColor: ChartConfig.lineChartAxesColor,
               borderWidth: 0,
               data: [10, 20, 12, 30, 10, 32, 28, 30, 20, 18, 18, 30]
            }
         ]
      }, this.options)
   }
})
