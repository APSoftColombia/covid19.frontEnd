<template>
    <v-card elevation="0">
        <div id="chartdiv2"></div>
        <v-dialog v-model="dialog" width="500px" persistent>
            <v-card>
                <v-card-text class="pt-6 Subtitle 1">
                    Riesgo de desarrollar diabetes en los próximos 10 años: {{ risk }}
                </v-card-text>
                <v-card-actions class="Subtitle 2">
                    <v-btn @click="dialog = false" width="100%" text>
                        <v-icon>fas fa-close</v-icon>
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    export default {
        name: "FindRiscChart",
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
        data: () => ({
            dialog: false,
            risk: ''
        }),
        mounted() {
            am4core.useTheme(am4themes_animated);
            let chart = am4core.create("chartdiv2", am4charts.PieChart);
            chart.data = this.data;

            let title = chart.titles.create();
            title.text = "Escala FINDRISC";
            title.fontSize = 20;
            title.marginTop = 5;

            chart.legend = new am4charts.Legend();
            chart.legend.position = "bottom";
            chart.legend.maxWidth = 300;

            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.colors.list = this.colors
            pieSeries.dataFields.value = "litres";
            pieSeries.dataFields.category = "country";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.labels.template.disabled = true;
            pieSeries.ticks.template.disabled = false;
            pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;
            pieSeries.slices.template.events.on("hit", function(ev){
                this.risk = ev.target.dataItem.dataContext.porcentaje_findrisc
                this.dialog = true
            }, this);
        }
    }
</script>

<style scoped>
    #chartdiv2 {
        width: 100%;
        height: 450px;
    }
</style>