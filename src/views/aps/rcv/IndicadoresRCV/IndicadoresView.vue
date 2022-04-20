<template>
  <v-container fluid>
    <page-title-bar title="Indicadores RCV"/>
    <v-card>
      <v-card-title>RCV</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
              cols="12"
              md="5"
          >
            <c-select-complete
                v-model="parametros.departamentos"
                label="Departamentos"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
                multiple
            />
          </v-col>
          <v-col
              cols="12"
              md="5"
          >
            <c-select-complete
                :disabled="!parametros.departamentos"
                v-model="parametros.municipios"
                label="Municipio"
                :items="municipios"
                item-text="nombre"
                item-value="id"
                multiple
            />
          </v-col>
          <v-col
              cols="12"
              md="2"
          >
            <v-btn
                block
                color="green"
                class="white--text"
                @click="getIndicadores"
            >
              <span>Filtrar</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-expansion-panels
          multiple
          popout
      >
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header>Indicadores Generales</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col
                  cols="12"
                  md="6"
              >
                <encuestas-chart
                    v-if="returnIndicadoresData.dist_poblacion_encuestada && returnIndicadoresData.dist_poblacion_encuestada.length"
                    :data="returnIndicadoresData.dist_poblacion_encuestada"
                />
              </v-col>
              <v-col
                  cols="12"
                  md="6"
              >
                <find-risc-chart
                    v-if="returnIndicadoresData.dist_riesgo_findrisc && returnIndicadoresData.dist_riesgo_findrisc.length"
                    :data="returnIndicadoresData.dist_riesgo_findrisc"
                    :colors="returnIndicadoresData.dist_riesgo_findrisc_colors"
                />
              </v-col>
              <v-col
                  cols="12"
                  md="10"
                  class="mx-auto"
              >
                <o-m-s-riesgo
                    v-if="returnIndicadoresData.dist_riesgo_oms && returnIndicadoresData.dist_riesgo_oms.length"
                    :data="returnIndicadoresData.dist_riesgo_oms"
                    :colors="returnIndicadoresData.dist_riesgo_oms_colors"
                />
              </v-col>
              <v-col
                  cols="12"
                  md="10"
                  class="mx-auto"
              >
                <morisky-chart
                    v-if="returnIndicadoresData.dist_morisky && returnIndicadoresData.dist_morisky.length"
                    :data="returnIndicadoresData.dist_morisky"
                    :colors="returnIndicadoresData.dist_morisky_colors"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel class="mb-2">
          <v-expansion-panel-header>Indicadores Por Pregunta</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <preguntas-chart :parametros="parametros"/>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <app-section-loader style="z-index: 10 !important;" :status="loading"/>
    </v-card>
  </v-container>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import {mapGetters} from "vuex";

const EncuestasChart = () => import('./Charts/EncuestasChart')
const FindRiscChart = () => import('./Charts/FindRiscChart')
const OMSRiesgo = () => import('./Charts/OMSRiesgo')
const MoriskyChart = () => import('./Charts/MoriskyChart')
const PreguntasChart = () => import('./Charts/PreguntasChart')
export default {
  name: 'IndicadoresView',
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
    parametros: {},
    municipios: [],
    loading: false
  }),
  computed: {
    ...mapGetters([
      'departamentos'
    ]),
    returnIndicadoresData() {
      return this.chartData
    }
  },
  watch: {
    'parametros.departamentos': {
      handler(val) {
        val && this.returnMunicipios()
      },
      inmediate: true
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
    returnMunicipios() {
      this.municipios = []
      if (this.parametros.departamentos.length && this.departamentos.length) {
        this.parametros.departamentos.forEach((departamento) => {
          let municipiosDepto = this.departamentos.find(x => x.id === departamento).municipios
          if (municipiosDepto && municipiosDepto.length) {
            municipiosDepto.forEach((municipio) => {
              this.municipios.push(municipio)
            })
          }
        })
      }
    },
    getIndicadores() {
      this.chartData = {
        dist_poblacion_encuestada: null,
        dist_riesgo_findrisc: [],
        dist_riesgo_findrisc_colors: [],
        dist_riesgo_oms: [],
        dist_riesgo_oms_colors: [],
        dist_morisky: [],
        dist_morisky_colors: []
      }
      this.loading = true
      this.axios.get(`indicadores-rcv?departamentos=${this.parametros.departamentos ? this.parametros.departamentos : []}&municipios=${this.parametros.municipios ? this.parametros.municipios : []}`)
          .then(response => {
            this.chartData.dist_poblacion_encuestada = [{
              'country': 'Encuestados',
              'litres': response.data.distribucion_poblacion_encuestada.Encuestados,
            }, {
              'country': 'Sin Encuestar',
              'litres': response.data.distribucion_poblacion_encuestada.Sin_Encuestar,
            }]

            response.data.distribucion_riesgo_findrisc.forEach((element) => {
              let objeto = {
                'litres': element.cant,
                'country': element.riesgo,
                'porcentaje_findrisc': element.porcentaje_findrisc
              }
              this.chartData.dist_riesgo_findrisc.push(objeto)
              this.chartData.dist_riesgo_findrisc_colors.push(am4core.color(`${element.rgb_riesgo}`))
            });

            response.data.distribucion_riesgo_oms.forEach((element) => {
              let objeto = {
                'litres': element.cant,
                'country': element.riesgo + ` (${element.porcentaje_rxoms})`,
                'porcentaje_rxoms': element.porcentaje_rxoms
              }
              this.chartData.dist_riesgo_oms.push(objeto)
              this.chartData.dist_riesgo_oms_colors.push(am4core.color(`${element.rgb_riesgo}`))
            });

            response.data.distribucion_morisky.forEach((element) => {
              let objeto = {
                'litres': element.cant,
                'country': element.nivel,
              }
              this.chartData.dist_morisky.push(objeto)
              this.chartData.dist_morisky_colors.push(am4core.color(`${element.rgb_riesgo}`))
            })
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: ' al cargar indicadores', error: error})
          })
    }
  },
  created() {
    this.getIndicadores()
  }
}
</script>
