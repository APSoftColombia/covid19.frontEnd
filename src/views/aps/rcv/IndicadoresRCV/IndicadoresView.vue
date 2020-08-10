<template>
    <v-container fluid>
        <page-title-bar title="Indicadores RCV"></page-title-bar>
        <v-card>
            <v-card-title>
                RCV
            </v-card-title>
            <v-row>
                <v-col cols="12" sm="12" md="6" lg="6">
                    <encuestas-chart
                        v-if="returnIndicadoresData.dist_poblacion_encuestada && returnIndicadoresData.dist_poblacion_encuestada.length"
                        :data="returnIndicadoresData.dist_poblacion_encuestada"
                    ></encuestas-chart>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="6">
                    <find-risc-chart
                        v-if="returnIndicadoresData.dist_riesgo_findrisc && returnIndicadoresData.dist_riesgo_findrisc.length"
                        :data="returnIndicadoresData.dist_riesgo_findrisc"
                        :colors="returnIndicadoresData.dist_riesgo_findrisc_colors"
                    ></find-risc-chart>
                </v-col>
                <v-col cols="12" sm="12" md="10" lg="10" class="mx-auto">
                    <o-m-s-riesgo
                            v-if="returnIndicadoresData.dist_riesgo_oms && returnIndicadoresData.dist_riesgo_oms.length"
                            :data="returnIndicadoresData.dist_riesgo_oms"
                            :colors="returnIndicadoresData.dist_riesgo_oms_colors"
                    ></o-m-s-riesgo>
                </v-col>
                <v-col cols="12" sm="12" md="10" lg="10" class="mx-auto">
                    <morisky-chart
                            v-if="returnIndicadoresData.dist_morisky && returnIndicadoresData.dist_morisky.length"
                            :data="returnIndicadoresData.dist_morisky"
                            :colors="returnIndicadoresData.dist_morisky_colors"
                    ></morisky-chart>
                </v-col>
                <div class="mx-auto mt-3 mb-3">
                    <h4>Indicadores por Pregunta</h4>
                </div>
                <preguntas-chart></preguntas-chart>
            </v-row>
            <app-section-loader style="z-index: 10 !important;" :status="loading"></app-section-loader>
        </v-card>
    </v-container>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    const EncuestasChart = () => import('./Charts/EncuestasChart')
    const FindRiscChart = () => import('./Charts/FindRiscChart')
    const OMSRiesgo = () => import('./Charts/OMSRiesgo')
    const MoriskyChart = () => import('./Charts/MoriskyChart')
    const PreguntasChart = () => import('./Charts/PreguntasChart')
    export default {
        name: "IndicadoresView",
        data: () => ({
            chartData: {
                dist_poblacion_encuestada: null,
                dist_riesgo_findrisc: [],
                dist_riesgo_findrisc_colors: [],
                dist_riesgo_oms: [],
                dist_riesgo_oms_colors: [],
                dist_morisky: [],
                dist_morisky_colors: []
            },
            loading: false
        }),
        computed: {
            returnIndicadoresData(){
                return this.chartData
            }
        },
        components: {
            EncuestasChart,
            FindRiscChart,
            OMSRiesgo,
            MoriskyChart,
            PreguntasChart
        },
        methods: {
            getIndicadores(){
                this.loading = true
                this.axios.get('indicadores-rcv').then(response => {
                    this.chartData.dist_poblacion_encuestada = [{
                            "country": "Encuestados",
                            "litres": response.data.distribucion_poblacion_encuestada.Encuestados,
                        }, {
                            "country": "Sin Encuestar",
                            "litres": response.data.distribucion_poblacion_encuestada.Sin_Encuestar,
                        }]

                    response.data.distribucion_riesgo_findrisc.forEach((element) => {
                        let objeto = {
                            "litres": element.cant,
                            "country": element.riesgo,
                            "porcentaje_findrisc": element.porcentaje_findrisc
                        }
                        this.chartData.dist_riesgo_findrisc.push(objeto)
                        this.chartData.dist_riesgo_findrisc_colors.push(am4core.color(`${element.rgb_riesgo}`))
                    });

                    response.data.distribucion_riesgo_oms.forEach((element) => {
                        let objeto = {
                            "litres": element.cant,
                            "country": element.riesgo +` (${element.porcentaje_rxoms})`,
                            "porcentaje_rxoms": element.porcentaje_rxoms
                        }
                        this.chartData.dist_riesgo_oms.push(objeto)
                        this.chartData.dist_riesgo_oms_colors.push(am4core.color(`${element.rgb_riesgo}`))
                    });

                    response.data.distribucion_morisky.forEach((element) => {
                        let objeto = {
                            "litres": element.cant,
                            "country": element.nivel,
                        }
                        this.chartData.dist_morisky.push(objeto)
                        this.chartData.dist_morisky_colors.push(am4core.color(`${element.rgb_riesgo}`))
                    });
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {color: 'error', message: ` al cargar indicadores`, error: error})
                })
            }
        },
        created() {
            this.getIndicadores()
        }
    }
</script>

<style scoped>

</style>
