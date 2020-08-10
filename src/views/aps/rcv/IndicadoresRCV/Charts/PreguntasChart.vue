<template>
    <v-expansion-panels multiple>
        <template v-for="(chart, index) in chartsNames">
            <v-col cols="12" sm="12" md="6" lg="6" :key="index">
                <v-expansion-panel :key="index">
                    <v-expansion-panel-header @click="getQuestionData(chart)">{{ chart.description }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="chartQuestion" :id="chart.chartName"></div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-col>
        </template>
    </v-expansion-panels>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    export default {
        name: "PreguntasChart",
        data: () => ({
            chartsNames: [
                {parameter: 'Sintomas_paciente', chartName: 'chartQdiv-4', open: false, step: 1, description: '¿Usted presenta Alguno de los siguientes síntomas?', data: []},
                {parameter: 'Edad', chartName: 'chartQdiv-5', open: false, step: 2, description: 'Edad', data: []},
                {parameter: 'IMC', chartName: 'chartQdiv-6', open: false, step: 3, description: '¿Conoce usted su peso y talla?', data: []},
                {parameter: 'Sistolica', chartName: 'chartQdiv-7', open: false, step: 4, description: '¿Se ha tomado la tensión arterial el día de hoy?', data: []},
                {parameter: 'Actividad_fisica', chartName: 'chartQdiv-8', open: false, step: 5, description: '¿Realiza diariamente al menos 30 minutos de actividad física, en el trabajo y/o en el tiempo libre?', data: []},
                {parameter: 'Frutas_verduras', chartName: 'chartQdiv-9', open: false, step: 6, description: '¿Con qué frecuencia come verduras o frutas?', data: []},
                {parameter: 'Medicacion_HTA', chartName: 'chartQdiv-10', open: false, step: 7, description: '¿Toma medicación para la hipertensión regularmente?', data: []},
                {parameter: 'Antecedentes_glucosa', chartName: 'chartQdiv-11', open: false, step: 8, description: '¿Le han encontrado alguna vez valores de azucar altos?', data: []},
                {parameter: 'Familiares_diabetes', chartName: 'chartQdiv-12', open: false, step: 9, description: '¿Se le ha diagnosticado diabetes (tipo 1 o tipo 2) a alguno de sus familiares allegados u otros parientes?', data: []},
                {parameter: 'Diabetico', chartName: 'chartQdiv-13', open: false, step: 10, description: '¿Es usted diabetico?', data: []},
                {parameter: 'Tipo_diabetes', chartName: 'chartQdiv-14', open: false, step: 11, description: '¿Que tipo de diabetes?', data: []},
                {parameter: 'Fumador', chartName: 'chartQdiv-15', open: false, step: 12, description: '¿Fuma?', data: []},
                {parameter: 'Diagnosticado_rcv', chartName: 'chartQdiv-16', open: false, step: 13, description: '¿Tiene diagnosticado ya una enfermedad cardiovascular?', data: []},
                {parameter: 'Consulta_MG', chartName: 'chartQdiv-17', open: false, step: 14, description: '¿Cuando fue su ultima consulta por medicina general?', data: []},
                {parameter: 'Consulta_MI', chartName: 'chartQdiv-18', open: false, step: 15, description: '¿Cuando fue su última consulta por medicina interna?', data: []},
                {parameter: 'Laboratorios', chartName: 'chartQdiv-19', open: false, step: 16, description: '¿Cuando fue la ultima vez que le tomaron laboratorios clinicos?', data: []},
                {parameter: 'Formula_hta_dm', chartName: 'chartQdiv-20', open: false, step: 17, description: '¿Actualmente su medico tratante le ha formulado medicamentos para la HTA y/o DM?', data: []},
                {parameter: 'Tiene_medicamentos', chartName: 'chartQdiv-21', open: false, step: 18, description: '¿Cuenta con medicamentos actualmente?', data: []},
                {parameter: 'Interrumpe_medicamento', chartName: 'chartQdiv-22', open: false, step: 19, description: '¿Deja de tomar alguna vez los medicamentos para tratar su enfermedad?', data: []},
                {parameter: 'Toma_medicamento_a_tiempo', chartName: 'chartQdiv-23', open: false, step: 20, description: '¿Toma los medicamentos a las horas indicadas?', data: []},
                {parameter: 'Suspende_medicacion', chartName: 'chartQdiv-24', open: false, step: 21, description: 'Cuando se encuentra bien, ¿deja de tomar la medicación?', data: []},
                {parameter: 'Deja_medicamento', chartName: 'chartQdiv-25', open: false, step: 22, description: 'Si le cae mal un medicamento, ¿deja usted de tomarlo?', data: []}
            ],
            chosenChart: null,
        }),
        methods: {
            getQuestionData(data) {
                this.chartsNames.find(x => x.parameter === data.parameter).open
                    = !this.chartsNames.find(x => x.parameter === data.parameter).open
                if (this.chartsNames.find(x => x.parameter === data.parameter).open) {
                    if(data.data.length) {
                        this.createDataPie(data.data, data.chartName, data.step)
                    }else {
                        this.axios.get(`indicadores-preguntas-rcv?query=${data.parameter}`).then(response => {
                            let charData = []
                            response.data.data.forEach((element) => {
                                let object = {
                                    'country': element.label,
                                    'litres': element.cantidad
                                }

                                charData.push(object)
                            })
                            this.chartsNames.find(x => x.parameter === data.parameter).data = charData
                            this.createDataPie(data.data, data.chartName, data.step)
                        }).catch(error => {
                            this.$store.commit('snackbar', {
                                color: 'error',
                                message: ` al cargar la informacion solicitada`,
                                error: error
                            })
                        })
                    }
                }
            },
            createDataPie(pieData, chartName, colorStep) {
                am4core.useTheme(am4themes_animated);
                let chart = am4core.create(chartName, am4charts.PieChart);
                chart.data = pieData;

                /*let label = chart.chartContainer.createChild(am4core.Label);
                label.wrap = true;
                label.text = titleC;
                label.textAlign = 'middle';
                label.align = "center";*/

                chart.legend = new am4charts.Legend();
                chart.legend.position = "bottom";
                chart.legend.maxWidth = 400;

                let pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "litres";
                pieSeries.dataFields.category = "country";
                pieSeries.slices.template.stroke = am4core.color("#fff");
                pieSeries.labels.template.disabled = true;
                pieSeries.ticks.template.disabled = false;
                pieSeries.colors.step = colorStep;
                pieSeries.slices.template.strokeWidth = 2;
                pieSeries.slices.template.strokeOpacity = 1;
                pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;
            },
        }
    }
</script>

<style scoped>
    .chartQuestion {
        width: 100%;
        height: 450px;
    }
</style>