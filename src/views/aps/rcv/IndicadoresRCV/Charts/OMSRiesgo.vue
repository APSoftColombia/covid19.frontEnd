<template>
    <v-card elevation="0">
        <div id="chartdiv3"></div>
        <v-dialog v-model="dialog" width="500px" persistent>
            <v-card>
                <v-card-title>
                    {{ percentage }}
                </v-card-title>
                <v-card-text class="Subtitle 2">
                    {{ message }}
                </v-card-text>
                <v-card-actions>
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
        name: "OMSRiesgo",
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
            percentage: '',
            message: ''
        }),
        mounted() {
            am4core.useTheme(am4themes_animated);
            let chart = am4core.create("chartdiv3", am4charts.PieChart);
            chart.data = this.data;

            let title = chart.titles.create();
            title.text = "Escala RX OMS";
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
            pieSeries.labels.template.disabled = false;
            pieSeries.ticks.template.disabled = false;
            pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;
            pieSeries.slices.template.events.on("hit", function(ev){
                this.percentage = ev.target.dataItem.dataContext.country
                if(ev.target.dataItem.dataContext.porcentaje_rxoms === '<10%'){
                    this.message = "Los individuos de esta categoría tienen un riesgo bajo. Un bajo riesgo no significa “ausencia de riesgo”. Se sugiere un manejo discreto centrado en cambios del modo de vida."
                }else if(ev.target.dataItem.dataContext.porcentaje_rxoms === '10 a <20%'){
                    this.message = "Los individuos de esta categoría tienen un riesgo moderado de sufrir episodios cardiovasculares, mortales o no. Monitorización del perfil de riesgo cada 6-12 meses."
                }else if(ev.target.dataItem.dataContext.porcentaje_rxoms === '20 a <30%'){
                    this.message = "Los individuos de esta categoría tienen un riesgo alto de sufrir episodios cardiovasculares, mortales o no. Monitorización del perfil de riesgo cada 3-6 meses."
                }else if(ev.target.dataItem.dataContext.porcentaje_rxoms === '30 a <40%'){
                    this.message = "Los individuos de esta categoría tienen un riesgo muy alto de sufrir episodios cardiovasculares, mortales o no. Monitorización del perfil de riesgo cada 3-6 meses."
                }else{
                    this.message = ''
                }
                this.dialog = true
            }, this);
        }
    }
</script>

<style scoped>
    #chartdiv3 {
        width: 100%;
        height: 500px;
    }
</style>