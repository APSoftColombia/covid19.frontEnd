<template>
    <v-card elevation="0">
        <v-card-text>
            <v-layout row>
                <v-flex xs12>
                    <h2 v-if="data" class="ma-0 pa-0" >Total Encuestas de Riesgo ({{data.total_tamizajes}}) | Total Confirmados {{data.CovidConfirmados}} </h2>
                </v-flex>
                <v-flex xs12 md5>
                    <h4>Clasificacion de Riesgo</h4>
                    <div class="hello" ref="chartRiesgos" style="min-height: 24vh"></div>
                </v-flex>
                <v-flex xs12 md2 v-if="legendRiesgos.show && $vuetify.breakpoint.mdAndUp"  >
                    <h4 class="pa-0 ma-0">Tabla Riesgo</h4>
                        <v-layout row wrap v-for="(item, i) in legendRiesgos.data" :id="'item-'+i" :key="'item-'+i" class="ma-0 pa-0">
                            <v-flex class="ma-0 pa-0" xs12 style="font-size: 12px">
                                <label :style="{ backgroundColor: chartRiesgos.colors.getIndex(i*3)}"  ></label>
                                {{item.category }}: {{item.value}} | {{Math.round(item.values.value.percent * 100) / 100}} % {{item.propertyFields}}</v-flex>
                        </v-layout>
                </v-flex>
                <v-flex xs12 md5>
                    <h4>Grupo Etario</h4>
                    <div class="hello" ref="chartGrupoEtario" style="min-height: 350px"></div>
                </v-flex>
            </v-layout>
            <v-layout row>

            </v-layout>
            <v-layout row>
                <v-flex xs12 v-if="$vuetify.breakpoint.mdAndUp">
                    <h4>Encuestas de Riesgo por día</h4>
                    <div class="hello" ref="chartTamizajeTiempo" style="min-height: 550px"></div>
                </v-flex>
                <v-flex xs12>
                    <h4>Municipios</h4>
                    <div class="hello" ref="chartMunicipioSexo" style="min-height: 550px"></div>
                </v-flex>
                <v-flex xs12 md6>
                    <h4>Encuestas de Riesgo en punto de control</h4>
                    <div class="hello" ref="chartViajeroMunicipio" style="min-height: 400px"></div>
                </v-flex>
                <v-flex xs12 md6>
                    <h4>Punto de Encuesta</h4>
                    <div class="hello" ref="chartTipoTamizador" style="min-height: 400px"></div>
                </v-flex>
                <v-flex xs12 md5>
                    <h4>Aplica caso de estudio</h4>
                    <v-data-table
                        :items="data ? data.caso_si_no_municipio: []"
                        :headers="clasificacionTableHeader"
                        :items-per-page="7"
                        dense
                    ></v-data-table>
                </v-flex>
                <v-flex xs12 md7>
                    <h4>Clasficación casos de estudio</h4>
                    <div class="hello" ref="chartEstudiosClasificacion" style="min-height: 400px"></div>
                </v-flex>
                <v-flex xs12 class="mt-10">
                    <v-divider></v-divider>
                    <h2 v-if="data" style="margin-top: 30px" >Casos de Estudio ({{data.total_casos_estudio}}) </h2>
                </v-flex>

                <v-flex xs12>
                    <h4>Evolución casos de estudio</h4>
                    <div class="hello" ref="chartCasosEvolucion" style="min-height: 400px"></div>
                </v-flex>

                <v-flex xs12>
                    <h4>Caso de estudio por municipio</h4>
                    <v-data-table
                            :items=" data ? data.clasificacion_municipio: []"
                            :headers="clasificacionCasosTableHeader"
                            :items-per-page="5"
                            dense
                    ></v-data-table>
                </v-flex>
                <v-flex xs12>
                    <h4>Atención</h4>
                    <div class="hello" ref="chartLugarAtencion" style="min-height: 400px"></div>
                </v-flex>

            </v-layout>

        </v-card-text>
        <app-section-loader :status="loading"></app-section-loader>

    </v-card>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES"
    //import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    import AppSectionLoader from "../../components/AppSectionLoader/AppSectionLoader";


    // Themes
    //am4core.useTheme(am4themes_animated);

    export default {
        name: "TotalTamizajesChart",
        components: {AppSectionLoader},
        data () {
            return {
                loading: false,
                timer: null,
                chartRiesgos: null,
                legendRiesgos: {
                    data: null,
                    colors: [],
                    show: false
                },
                chartEtario: null,
                chartTamizajeTiempo: null,
                chartMunicipioSexo: null,
                chartCasosClasificacion: null,
                chartTamizajeEps: null,
                chartViajeroMunicipio: null,
                chartCasosEvolucion: null,
                chartTipoTamizador: null,
                chartLugarAtencion: null,
                data: null,
                colors: [
                    am4core.color("#845EC2"),
                    am4core.color("#FF6F91"),
                    am4core.color("#0A9A98"),
                    am4core.color("#808080"),
                    am4core.color("#800000"),
                    am4core.color("#008000"),
                    am4core.color("#008080"),
                    am4core.color("#D65DB1"),
                    am4core.color("#000080"),
                    am4core.color("#800080"),
                    am4core.color("#0B71B4"),
                    am4core.color("#FA8072"),
                    am4core.color("#B40B65"),
                    am4core.color("#8BB40B"),
                    am4core.color("#B48B0B"),
                    am4core.color("#989EFD"),
                    am4core.color("#DFBF64"),
                    am4core.color("#98F7FD"),
                ],
                clasificacionTableHeader: [
                    {
                        text: 'Municipio',
                        align: 'start',
                        sortable: true,
                        value: 'Municipio',
                    },
                    { text: 'Si', value: 'Si' },
                    { text: 'No', value: 'No' },
                    { text: 'En clasificacion', value: 'En clasificacion' },

                ],
                clasificacionCasosTableHeader: [
                    {
                        text: 'Municipio',
                        align: 'start',
                        sortable: true,
                        value: 'Municipio',
                    },
                    { text: 'Caso 1', value: 'caso_1' },
                    { text: 'Caso 2', value: 'caso_2' },
                    { text: 'Caso 3', value: 'caso_3' },
                    { text: 'Caso 4', value: 'caso_4' },
                    { text: 'Caso 5', value: 'caso_5' },


                ],
            }
        },
        mounted() {
            this.initGraficos()
            this.getDataChart()
            const self = this
            this.timer = setInterval(() => self.getDataChart(), 3600000);
        },
        methods: {
            initGraficos(){
                //this.loading = true

                //this.$emit('onDataLoaded', {total: data.data.total_tamizajes, estudio: data.data.total_casos_estudio})
                //if(!this.data) return
                //this.loading = false
                this.initRiesgosChart()
                this.initGrupoEtariochart()
                this.initMunicipioSexoChart()
                this.initCasosClasificacionChart()
                //this.initTamizajeEpschart()
                this.initViajerosMunicipiosChart()
                this.initCasosEvolucionchart()
                this.initTipoTamizadorChart()
                this.initLugarAtencionchart()
            },
             getDataChart() {
                this.axios.get('indicadores-covid').then(result => {
                    this.data = result.data
                    this.data.tamizajes_etareo_sexo.forEach(item => {
                        item['none'] = 0
                    })
                    this.data.tamizajes_clasificacion.push(this.data.tamizajes_clasificacion[0])
                    this.data.tamizajes_clasificacion.shift()
                    if(!this.chartTamizajeTiempo) this.initTamizajeTiempoChart()

                    this.chartRiesgos.data = this.data.tamizajes_riesgo
                    this.chartEtario.data = this.data.tamizajes_etareo_sexo
                    this.chartTamizajeTiempo.data = this.data.tamizajes_mes_municipio
                    this.chartCasosClasificacion.data = this.data.tamizajes_clasificacion
                    this.chartViajeroMunicipio.data = this.data.ViajerosXMunicipio
                    this.chartCasosEvolucion.data = this.data.casosXEvolucion
                    this.chartTipoTamizador.data = this.data.tamizajes_tipo
                    this.chartMunicipioSexo.data = this.data.tamizajes_sexo_municipio
                    this.data.tamizajes_sexo_municipio.forEach(item => {
                        item['none'] = 0
                    })
                    //this.chartTamizajeEps.data = this.data.tamizajesXEPS
                    this.chartLugarAtencion.data = this.data.CasosXAtencion
                })
            },
            initRiesgosChart(){
                /*if(this.chartRiesgos){
                    this.chartRiesgos.data = this.data.tamizajes_riesgo
                    return
                }*/
                this.chartRiesgos = am4core.create(this.$refs.chartRiesgos, am4charts.PieChart);
                this.chartRiesgos.hiddenState.properties.opacity = 0;
                this.chartRiesgos.exporting.menu = new am4core.ExportMenu();
                //this.chartRiesgos.data = this.data.tamizajes_riesgo
                this.chartRiesgos.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartRiesgos.fontSize = 12
                this.chartRiesgos.innerRadius = am4core.percent(40);
                this.chartRiesgos.depth = 120;

                let series = this.chartRiesgos.series.push(new am4charts.PieSeries());
                series.dataFields.value = "casos";
                series.dataFields.category = "riesgo";
                series.labels.template.text = "{category}: {value.value}"

                series.colors.steps = 3;
                series.hiddenState.properties.endAngle = -90;

                //this.chartRiesgos.legend = new am4charts.Legend();
                const  self = this
                this.chartRiesgos.events.on("ready", function() {
                    self.legendRiesgos.data = series.dataItems.values
                    self.legendRiesgos.show = true
                    console.log('las series')
                })
            },
            initGrupoEtariochart(){
                /*if(this.chartEtario){
                    this.chartEtario.data = this.data.tamizajes_etareo_sexo
                    return
                }*/
                this.chartEtario = am4core.create(this.$refs.chartGrupoEtario, am4charts.XYChart);
                this.chartEtario.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartEtario.exporting.menu = new am4core.ExportMenu();
                this.chartEtario.fontSize = 12
                this.chartEtario.colors.list = this.colors
                //this.chartEtario.data = this.data.tamizajes_etareo_sexo
                var categoryAxis = this.chartEtario.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "Grupo";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 1
                //categoryAxis.renderer.inversed = true;
                categoryAxis.title.text = "Edad (Años)";

                var valueAxis = this.chartEtario.xAxes.push(new am4charts.ValueAxis());
                //valueAxis.extraMin = 0.1;
                valueAxis.extraMax = 0.1;
                valueAxis.min = 0;
                valueAxis.renderer.minWidth = 50;
                valueAxis.renderer.minGridDistance = 50;
                //valueAxis.renderer.ticks.template.length = 5;
                //valueAxis.renderer.ticks.template.disabled = false;
                valueAxis.calculateTotals = true;

                /*valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
                valueAxis.renderer.labels.template.adapter.add("text", function(text) {
                    return text === "Hombre" || text === "Mujer" ? text : text + "";
                })*/

                // Create series
                var male = this.chartEtario.series.push(new am4charts.ColumnSeries());
                male.dataFields.valueX = "Hombre";
                male.dataFields.categoryY = "Grupo";
                //male.clustered = false;
                male.stacked = true;

                var maleLabel = male.bullets.push(new am4charts.LabelBullet());
                maleLabel.label.text = "{valueX}";
                maleLabel.label.hideOversized = false;
                maleLabel.label.truncate = false;
                //maleLabel.label.horizontalCenter = "right";
                maleLabel.label.dx = -15;
                maleLabel.label.fontSize = 12
                maleLabel.locationY = 0.5;

                var female = this.chartEtario.series.push(new am4charts.ColumnSeries());
                female.dataFields.valueX = "Mujer";
                female.dataFields.categoryY = "Grupo";
                //female.clustered = false;
                female.stacked = true;
                female.columns.template.fill = am4core.color('#FF3390')


                var femaleLabel = female.bullets.push(new am4charts.LabelBullet());
                femaleLabel.label.text = "{valueX}";
                femaleLabel.label.hideOversized = false;
                femaleLabel.label.truncate = false;
                //femaleLabel.label.horizontalCenter = "left";
                femaleLabel.label.dx = -15;
                femaleLabel.label.fontSize = 12

                let totalSeries = this.chartEtario.series.push(new am4charts.ColumnSeries());
                totalSeries.dataFields.valueX = "none";
                totalSeries.dataFields.categoryY = "Grupo";
                totalSeries.stacked = true;
                totalSeries.hiddenInLegend = true;
                totalSeries.columns.template.strokeOpacity = 0;

                var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
                //totalBullet.dy = -20;
                totalBullet.label.text = "({valueX.total})";
                totalBullet.label.hideOversized = false;
                totalBullet.label.truncate = false;
                totalBullet.label.fontSize = 12;
                //totalBullet.label.background.fill = totalSeries.stroke;
                //totalBullet.label.background.fillOpacity = 0.2;
                //totalBullet.label.padding(5, 10, 5, 10);
                totalBullet.label.dx = 30;

                //this.chartEtario.legend = new am4charts.Legend();
                //this.chartEtario.legend.position = "top";

                var maleRange = valueAxis.axisRanges.create();
                maleRange.value = 0;
                maleRange.endValue = 0;
                maleRange.label.text = "Hombres";
                maleRange.label.fill = this.chartEtario.colors.list[0];
                maleRange.label.dy = 20;
                maleRange.label.dx = 30
                maleRange.label.fontWeight = '600';
                maleRange.grid.strokeOpacity = 1;
                maleRange.grid.stroke = male.stroke;

                var femaleRange = valueAxis.axisRanges.create();
                femaleRange.value = 0;
                femaleRange.endValue = 0;
                femaleRange.label.text = "Mujeres";
                femaleRange.label.fill = this.chartEtario.colors.list[1];
                femaleRange.label.dy = 20;
                femaleRange.label.dx = 100
                femaleRange.label.fontWeight = '600';
                femaleRange.label.fill = am4core.color('#FF3390')
                femaleRange.grid.strokeOpacity = 1;
                femaleRange.grid.stroke = female.stroke;
            },
            initTamizajeTiempoChart(){
                /*if(this.chartTamizajeTiempo){
                    setTimeout(() => {
                        this.chartTamizajeTiempo.data = this.data.tamizajes_mes_municipio
                    },5000)
                    return
                }*/
                let self = this
                this.chartTamizajeTiempo = am4core.create(this.$refs.chartTamizajeTiempo, am4charts.XYChart);
                //this.chartTamizajeTiempo.colors.list = this.colors
                //this.chartTamizajeTiempo.data = this.data.tamizajes_mes_municipio
                this.chartTamizajeTiempo.language.locale = am4lang_es_ES
                this.chartTamizajeTiempo.fontSize = 12
                this.chartTamizajeTiempo.exporting.menu = new am4core.ExportMenu();


                // Enable chart cursor
                this.chartTamizajeTiempo.cursor = new am4charts.XYCursor();
                this.chartTamizajeTiempo.cursor.maxTooltipDistance = -1;

                // Enable scrollbar
                let scrollbar = new am4charts.XYChartScrollbar();

                var dateAxis = this.chartTamizajeTiempo.xAxes.push(new am4charts.DateAxis());
                dateAxis.dataFields.category = "date";
                dateAxis.title.text = "Fecha";
                dateAxis.renderer.grid.template.location = 0.5;
                dateAxis.dateFormatter.inputDateFormat = "yyyy-MM-dd";
                dateAxis.renderer.minGridDistance = 40;
                dateAxis.tooltipDateFormat = "dd MMM, yyyy";
                dateAxis.dateFormats.setKey("dia", "dd");

                let valueAxis = this.chartTamizajeTiempo.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;

                if (this.data.tamizajes_mes_municipio.length < 1) return
                Object.keys(this.data.tamizajes_mes_municipio[0]).filter(item => {
                    return item !== 'date'
                }).forEach(item => {
                    let series = this.chartTamizajeTiempo.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = item;
                    series.dataFields.dateX = "date";
                    series.tooltipText = "[bold font-size: 10px]" + item+": {valueY}";


                    series.name = item;
                    series.strokeWidth = 2;
                    series.tensionX = 0.9;
                    //series.stacked = true;

                        series.tooltip.events.on("shown", function(ev) {
                            self.toggleSeries(ev.target.targetSprite, true);
                        });
                        series.tooltip.events.on("hidden", function(ev) {
                            if (ev.target.targetSprite) {
                                self.toggleSeries(ev.target.targetSprite, false);
                            } else {
                                self.chartTamizajeTiempo.series.each(function (series) {
                                    self.toggleSeries(series, false);
                                });
                            }
                        })


                    let bullet = series.bullets.push(new am4charts.CircleBullet());
                    bullet.circle.radius = 2
                    bullet.setStateOnChildren = true;
                    //bullet.propertyFields.fillOpacity = 0.8;
                    //bullet.propertyFields.strokeOpacity = 0.8;

                    let hoverState = bullet.states.create("hover");
                    hoverState.properties.scale = 1.5

                    let segment = series.segments.template;
                    segment.interactionsEnabled = true;

                    let hs = segment.states.create("hover");
                    hs.properties.strokeWidth = 2;

                    scrollbar.series.push(series)

                    //var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                    //labelBullet.label.text = "{valueY}";
                })
                let legend = this.chartTamizajeTiempo.legend = new am4charts.Legend()
                legend.fontSize = 10
                legend.itemContainers.template.events.on("over", function(ev) {
                    self.toggleSeries(ev.target.dataItem.dataContext, true);
                });

                legend.itemContainers.template.events.on("out", function(ev) {
                    self.toggleSeries(ev.target.dataItem.dataContext, false);
                });

                this.chartTamizajeTiempo.scrollbarX = scrollbar
            },
            initMunicipioSexoChart(){
                /*if(this.chartMunicipioSexo){
                    setTimeout(() => {
                        this.chartMunicipioSexo.data = this.data.tamizajes_sexo_municipio
                    },20000)
                    return
                }*/
                // let self = this
                this.chartMunicipioSexo = am4core.create(this.$refs.chartMunicipioSexo, am4charts.XYChart);
                this.chartMunicipioSexo.fontSize = 12
                this.chartMunicipioSexo.legend = new am4charts.Legend();
                this.chartMunicipioSexo.legend.position = "top";
                this.chartMunicipioSexo.exporting.menu = new am4core.ExportMenu();
                //this.chartMunicipioSexo.data = this.data.tamizajes_sexo_municipio

                let categoryAxis = this.chartMunicipioSexo.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "Municipio";
                categoryAxis.renderer.grid.template.opacity = 0;
                categoryAxis.title.text = "Municipios";
                categoryAxis.fontSize = 10
                categoryAxis.renderer.minGridDistance = 1


                let valueAxis = this.chartMunicipioSexo.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.renderer.grid.template.opacity = 0;
                valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
                valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
                valueAxis.renderer.ticks.template.length = 10;
                valueAxis.renderer.line.strokeOpacity = 0.5;
                valueAxis.renderer.baseGrid.disabled = true;
                valueAxis.renderer.minGridDistance = 50;
                valueAxis.calculateTotals = true;

                //Masculino
                let seriesMasculino = this.chartMunicipioSexo.series.push(new am4charts.ColumnSeries());
                seriesMasculino.dataFields.valueX = 'Hombres';
                seriesMasculino.dataFields.categoryY = "Municipio";
                seriesMasculino.stacked = true;
                seriesMasculino.name = 'Hombres';

                let labelBulletMasculino = seriesMasculino.bullets.push(new am4charts.LabelBullet());
                labelBulletMasculino.locationX = 0.5;
                labelBulletMasculino.label.text = "{valueX}";
                labelBulletMasculino.label.fill = am4core.color("#fff");
                labelBulletMasculino.label.fontSize = 10

                //Femenino
                let seriesFemenino = this.chartMunicipioSexo.series.push(new am4charts.ColumnSeries());
                seriesFemenino.dataFields.valueX = 'Mujeres';
                seriesFemenino.dataFields.categoryY = "Municipio";
                seriesFemenino.stacked = true;
                seriesFemenino.name = 'Mujeres';
                seriesFemenino.columns.template.fill = am4core.color('#FF3390')


                let labelBulletFemenino = seriesFemenino.bullets.push(new am4charts.LabelBullet());
                labelBulletFemenino.locationX = 0.5;
                labelBulletFemenino.label.text = "{valueX}";
                labelBulletFemenino.label.fill = am4core.color("#fff");
                labelBulletFemenino.label.fontSize = 10

                let totalSeries = this.chartMunicipioSexo.series.push(new am4charts.ColumnSeries());
                totalSeries.dataFields.valueX = "none";
                totalSeries.dataFields.categoryY = "Municipio";
                totalSeries.stacked = true;
                totalSeries.hiddenInLegend = true;
                totalSeries.columns.template.strokeOpacity = 0;

                var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
                //totalBullet.dy = -20;
                totalBullet.label.text = "({valueX.total})";
                totalBullet.label.hideOversized = false;
                totalBullet.label.truncate = false;
                totalBullet.label.fontSize = 12;
                //totalBullet.label.background.fill = totalSeries.stroke;
                //totalBullet.label.background.fillOpacity = 0.2;
                //totalBullet.label.padding(5, 10, 5, 10);
                totalBullet.label.dx = 30;

            },
            initCasosClasificacionChart(){
                /*if(this.chartCasosClasificacion){
                    this.chartCasosClasificacion.data = this.data.tamizajes_clasificacion
                    return
                }*/

                this.chartCasosClasificacion = am4core.create(this.$refs.chartEstudiosClasificacion, am4charts.SlicedChart);
                this.chartCasosClasificacion.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartCasosClasificacion.hiddenState.properties.opacity = 0;
                //this.chartCasosClasificacion.data = this.data.tamizajes_clasificacion
                this.chartCasosClasificacion.paddingLeft = 30
                this.chartCasosClasificacion.paddingRight = 30

                this.chartCasosClasificacion.radius = am4core.percent(70);
                this.chartCasosClasificacion.innerRadius = am4core.percent(40);
                this.chartCasosClasificacion.startAngle = 180;
                this.chartCasosClasificacion.endAngle = 360;
                this.chartCasosClasificacion.fontSize = 12

                let series = this.chartCasosClasificacion.series.push(new am4charts.PyramidSeries());
                series.dataFields.value = "cant";
                series.dataFields.category = "clasificacion";
                series.colors.step = 3;

                //series.ticks.template.disabled = true;
                //series.alignLabels = false;
                series.labels.template.text = "[font-size: 10px]{category} ({value.value}) ({value.percent.formatNumber('#.0')}%)";
                //series.labels.template.radius = am4core.percent(-50);
                //series.labels.template.fill = am4core.color("white");


                series.slices.template.cornerRadius = 10;
                series.slices.template.innerCornerRadius = 7;
                series.slices.template.draggable = true;
                series.slices.template.inert = true;

                series.hiddenState.properties.startAngle = 90;
                series.hiddenState.properties.endAngle = 90;

                //this.chartCasosClasificacion.legend = new am4charts.Legend();

            },
            initTamizajeEpschart(){
                /*if(this.chartTamizajeEps){
                    this.chartTamizajeEps.data = this.data.tamizajesXEPS
                    return
                }*/

                this.chartTamizajeEps = am4core.create(this.$refs.chartTamizajeEps, am4charts.PieChart);
                this.chartTamizajeEps.hiddenState.properties.opacity = 0;
                this.chartTamizajeEps.exporting.menu = new am4core.ExportMenu();
                //this.chartTamizajeEps.data = this.data.tamizajesXEPS
                this.chartTamizajeEps.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartTamizajeEps.fontSize = 12
                this.chartTamizajeEps.innerRadius = am4core.percent(40);
                this.chartTamizajeEps.depth = 120;

                let series = this.chartTamizajeEps.series.push(new am4charts.PieSeries());
                series.dataFields.value = "tamizajes";
                series.dataFields.category = "nombre";
                series.labels.template.text = "[font-size: 10px]{category}: {value.value}"

                series.colors.step = 3;
                series.hiddenState.properties.endAngle = -90;

                this.chartTamizajeEps.legend = new am4charts.Legend();
                this.chartTamizajeEps.legend.fontSize = 10

            },
            initViajerosMunicipiosChart(){
                /*if(this.chartViajeroMunicipio){
                    this.chartViajeroMunicipio.data = this.data.ViajerosXMunicipio
                    return
                }*/

                this.chartViajeroMunicipio = am4core.create(this.$refs.chartViajeroMunicipio, am4charts.RadarChart);
                this.chartViajeroMunicipio.hiddenState.properties.opacity = 0;
                this.chartViajeroMunicipio.exporting.menu = new am4core.ExportMenu();
                //this.chartViajeroMunicipio.data = this.data.ViajerosXMunicipio
                this.chartViajeroMunicipio.innerRadius = am4core.percent(40)

                var categoryAxis = this.chartViajeroMunicipio.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "municipio";
                categoryAxis.renderer.minGridDistance = 1;
                categoryAxis.renderer.inversed = true;
                categoryAxis.renderer.labels.template.location = 0.5;
                categoryAxis.renderer.labels.template.fontSize = 10
                categoryAxis.renderer.labels.template.inside = true
                categoryAxis.renderer.grid.template.strokeOpacity = 0.08;
                categoryAxis.tooltip.disabled = true

                var valueAxis = this.chartViajeroMunicipio.yAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
                valueAxis.extraMax = 0.1;
                valueAxis.renderer.grid.template.strokeOpacity = 0.08;
                valueAxis.tooltip.disabled = true;
                this.chartViajeroMunicipio.seriesContainer.zIndex = -10;


                var series = this.chartViajeroMunicipio.series.push(new am4charts.RadarColumnSeries());
                series.dataFields.categoryX = "municipio";
                series.dataFields.valueY = "tamizajes";
                series.tooltipText = "{categoryX} {valueY.value}"
                series.columns.template.radarColumn.cornerRadius = 5;
                series.columns.template.radarColumn.innerCornerRadius = 0;
                //series.colors.step = 3

                this.chartViajeroMunicipio.zoomOutButton.disabled = true;

                series.columns.template.adapter.add("fill", (fill, target) => {
                    return this.chartViajeroMunicipio.colors.getIndex(target.dataItem.index * 3);
                });

                categoryAxis.sortBySeries = series;

                this.chartViajeroMunicipio.cursor = new am4charts.RadarCursor();
                this.chartViajeroMunicipio.cursor.behavior = "none";
                this.chartViajeroMunicipio.cursor.lineX.disabled = true;
                this.chartViajeroMunicipio.cursor.lineY.disabled = true;
            },
            initCasosEvolucionchart(){
                /*if(this.chartCasosEvolucion){
                    this.chartCasosEvolucion.data = this.data.casosXEvolucion
                    return
                }*/

                this.chartCasosEvolucion = am4core.create(this.$refs.chartCasosEvolucion, am4charts.PieChart3D);
                this.chartCasosEvolucion.hiddenState.properties.opacity = 0;
                this.chartCasosEvolucion.exporting.menu = new am4core.ExportMenu();
                //this.chartCasosEvolucion.data = this.data.casosXEvolucion
                this.chartCasosEvolucion.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartCasosEvolucion.fontSize = 12
                this.chartCasosEvolucion.innerRadius = am4core.percent(30);
                this.chartCasosEvolucion.depth = 10;

                let series = this.chartCasosEvolucion.series.push(new am4charts.PieSeries3D());
                series.dataFields.value = "casos";
                series.dataFields.depthValue = "casos";
                series.dataFields.category = "evolucion";
                series.labels.template.text = "[font-size: 10px]{category}: {value.value}"
                //series.slices.template.cornerRadius = 5;
                series.colors.step = 3;
                series.hiddenState.properties.endAngle = -120;

                this.chartCasosEvolucion.legend = new am4charts.Legend();
                this.chartCasosEvolucion.legend.fontSize = 10

            },
            initTipoTamizadorChart(){
                /*if(this.chartTipoTamizador){
                    this.chartTipoTamizador.data = this.data.tamizajes_tipo
                    return
                }*/

                this.chartTipoTamizador = am4core.create(this.$refs.chartTipoTamizador, am4charts.PieChart3D);
                this.chartTipoTamizador.hiddenState.properties.opacity = 0;
                this.chartTipoTamizador.exporting.menu = new am4core.ExportMenu();
                //this.chartTipoTamizador.data = this.data.tamizajes_tipo
                this.chartTipoTamizador.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartTipoTamizador.fontSize = 12
                this.chartTipoTamizador.innerRadius = am4core.percent(30);
                this.chartTipoTamizador.depth = 0;

                let series = this.chartTipoTamizador.series.push(new am4charts.PieSeries3D());
                series.dataFields.value = "cant";
                series.dataFields.depthValue = "cant";
                series.dataFields.category = "nombre";
                series.labels.template.text = "[font-size: 10px]{category}: {value.value}"
                //series.slices.template.cornerRadius = 5;
                series.colors.step = 3;
                series.hiddenState.properties.endAngle = -120;

                this.chartTipoTamizador.legend = new am4charts.Legend();
                this.chartTipoTamizador.legend.fontSize = 10

            },
            initLugarAtencionchart(){
                //chartLugarAtencion
                this.chartLugarAtencion = am4core.create(this.$refs.chartLugarAtencion, am4charts.PieChart3D);
                this.chartLugarAtencion.hiddenState.properties.opacity = 0;
                this.chartLugarAtencion.exporting.menu = new am4core.ExportMenu();
                this.chartLugarAtencion.numberFormatter.numberFormat = "#,###|#,###s|'0'";
                this.chartLugarAtencion.fontSize = 12
                //this.chartLugarAtencion.innerRadius = am4core.percent(30);
                //this.chartLugarAtencion.depth = 0;

                let pieSeries = this.chartLugarAtencion.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = "cant";
                pieSeries.dataFields.category = "atencion";
                pieSeries.innerRadius = am4core.percent(30);
                //pieSeries.ticks.template.disabled = true;
                //pieSeries.labels.template.disabled = true;
                pieSeries.colors.step = 3
                pieSeries.labels.template.text = "[font-size: 10px]{category}: ({value.value}) ({value.percent.formatNumber('#.0')}%)"



                this.chartLugarAtencion.legend = new am4charts.Legend();
                this.chartLugarAtencion.legend.position = "right";
            },
            toggleSeries(series, over){
                series.segments.each(function(segment) {
                    segment.isHover = over;
                });
            }
        },
        beforeDestroy() {
            if (this.chartRiesgos) this.chartRiesgos.dispose();
            if (this.chartEtario) this.chartEtario.dispose();
            if (this.chartTamizajeTiempo) this.chartTamizajeTiempo.dispose();
            if (this.chartMunicipioSexo) this.chartMunicipioSexo.dispose();
            if (this.chartCasosClasificacion) this.chartCasosClasificacion.dispose();
            if (this.chartTamizajeEps) this.chartTamizajeEps.dispose();
            if (this.chartViajeroMunicipio) this.chartViajeroMunicipio.dispose();
            if (this.chartCasosEvolucion) this.chartCasosEvolucion.dispose();
            if (this.chartTipoTamizador) this.chartTipoTamizador.dispose();
            if (this.chartLugarAtencion) this.chartLugarAtencion.dispose();
            clearInterval(this.timer)
        }
    }
</script>

<style scoped >
    >>>.v-data-table__wrapper table thead tr th{
        background-color: dodgerblue !important;
        font-size: 10px !important;
        color: white !important;
    }
    >>>.v-data-table__wrapper table tbody tr td{
        font-size: 12px !important;
    }

</style>
