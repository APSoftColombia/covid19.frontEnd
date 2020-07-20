<template>
    <v-card elevation="0">
        <v-card-text>
            <div class="hello" ref="chartdiv" style="min-height: 24vh; width: 90%"></div>
        </v-card-text>
    </v-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";

    am4core.useTheme(am4themes_animated);
    export default {
        name: "TamizajeTipo",
        data () {
            return {
                chart: null,
            }
        },
        methods:{
            configChart(){
                this.chart.radius = am4core.percent(70);
                this.chart.innerRadius = am4core.percent(40);
                this.chart.startAngle = 180;
                this.chart.endAngle = 360;
                this.chart.fontSize = 12

                var series = this.chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = "cant";
                series.dataFields.category = "nombre";
                series.colors.step = 3;

                //series.ticks.template.disabled = true;
                //series.alignLabels = false;
                //series.labels.template.text = "{category} {value.percent.formatNumber('#.0')}%";
                series.labels.template.radius = am4core.percent(-40);
                //series.labels.template.fill = am4core.color("white");


                series.slices.template.cornerRadius = 10;
                series.slices.template.innerCornerRadius = 7;
                series.slices.template.draggable = true;
                series.slices.template.inert = true;

                series.hiddenState.properties.startAngle = 90;
                series.hiddenState.properties.endAngle = 90;

                //this.chart.legend = new am4charts.Legend();
            },
            onStart(data) {
                if(this.chart){
                    this.chart.dispose()
                }
                this.chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);
                this.chart.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chart.hiddenState.properties.opacity = 0;
                this.chart.data = data
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
