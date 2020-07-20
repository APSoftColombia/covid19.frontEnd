<template>
    <v-card elevation="0">
        <v-card-text>
            <div class="hello" ref="chartdiv" style="min-height: 35vh"></div>
        </v-card-text>
    </v-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";

    am4core.useTheme(am4themes_animated);
    export default {
        name: "GruposEtareosChart",
        data () {
            return {
                chart: null,
            }
        },
        methods:{
            configChart(){
                var categoryAxis = this.chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "Grupo";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.inversed = true;
                categoryAxis.title.text = "Edad (Años)";

                var valueAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.extraMin = 0.1;
                valueAxis.extraMax = 0.1;
                valueAxis.renderer.minGridDistance = 50;
                valueAxis.renderer.ticks.template.length = 5;
                valueAxis.renderer.ticks.template.disabled = false;
                valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
                valueAxis.renderer.labels.template.adapter.add("text", function(text) {
                    return text === "Hombre" || text === "Mujer" ? text : text + "";
                })

                // Create series
                var male = this.chart.series.push(new am4charts.ColumnSeries());
                male.dataFields.valueX = "Hombre";
                male.dataFields.categoryY = "Grupo";
                male.clustered = false;

                var maleLabel = male.bullets.push(new am4charts.LabelBullet());
                maleLabel.label.text = "{valueX}";
                maleLabel.label.hideOversized = false;
                maleLabel.label.truncate = false;
                //maleLabel.label.horizontalCenter = "right";
                maleLabel.label.dx = -10;
                maleLabel.label.fontSize = 12

                var female = this.chart.series.push(new am4charts.ColumnSeries());
                female.dataFields.valueX = "Mujer";
                female.dataFields.categoryY = "Grupo";
                female.clustered = false;
                female.columns.template.fill = am4core.color('#FF3390')


                var femaleLabel = female.bullets.push(new am4charts.LabelBullet());
                femaleLabel.label.text = "{valueX}";
                femaleLabel.label.hideOversized = false;
                femaleLabel.label.truncate = false;
                //femaleLabel.label.horizontalCenter = "left";
                femaleLabel.label.dx = 10;
                femaleLabel.label.fontSize = 12

                var maleRange = valueAxis.axisRanges.create();
                maleRange.value = 0;
                maleRange.endValue = 0;
                maleRange.label.text = "Hombres";
                maleRange.label.fill = this.chart.colors.list[0];
                maleRange.label.dy = 20;
                maleRange.label.dx = -50
                maleRange.label.fontWeight = '600';
                maleRange.grid.strokeOpacity = 1;
                maleRange.grid.stroke = male.stroke;

                var femaleRange = valueAxis.axisRanges.create();
                femaleRange.value = 0;
                femaleRange.endValue = 0;
                femaleRange.label.text = "Mujeres";
                femaleRange.label.fill = this.chart.colors.list[1];
                femaleRange.label.dy = 20;
                femaleRange.label.dx = 50
                femaleRange.label.fontWeight = '600';
                femaleRange.label.text.fontcolor('#FF3390')
                femaleRange.grid.strokeOpacity = 1;
                femaleRange.grid.stroke = female.stroke;
            },
            onStart(data) {
                if(this.chart){
                    this.chart.dispose()
                }
                this.chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
                this.chart.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chart.fontSize = 12
                data.forEach(item => {
                    item['Hombre'] = item['Hombre'] * -1
                })
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
