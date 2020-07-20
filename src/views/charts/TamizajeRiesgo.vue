<template>
    <v-card elevation="0">
        <v-card-text>
            <div class="hello" ref="chartdiv" style="min-height: 24vh"></div>
        </v-card-text>
    </v-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";

    am4core.useTheme(am4themes_animated);
    export default {
        name: "TamizajeRiesgo",
        data () {
            return {
                chart: null,
            }
        },
        methods:{
            configChart(){
                this.chart.innerRadius = am4core.percent(40);
                this.chart.depth = 120;
                var series = this.chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = "casos";
                series.dataFields.category = "riesgo";
                series.colors.step = 3;
                series.hiddenState.properties.endAngle = -90;

                //this.chart.legend = new am4charts.Legend();
            },
            onStart(data) {
                if(this.chart){
                    this.chart.dispose()
                }
                this.chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);
                this.chart.hiddenState.properties.opacity = 0;
                this.chart.data = data
                this.chart.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chart.fontSize = 12
                this.configChart()
            }
        },
        beforeDestroy() {
            if (this.chart) {
                this.chart.dispose();
            }
        }
    }
</script>

<style scoped>

</style>
