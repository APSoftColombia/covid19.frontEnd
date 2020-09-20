<template>
  <v-container fluid>
    <page-title-bar title="Informe Ejecutivo RCV"></page-title-bar>
    <v-card class="text-center">
      <v-card-title class="mb-0 pb-0">
        <v-row>
          <v-col cols="12" sm="12" md="3" lg="3">
            <c-date
                v-model="data.fecha_inicio"
                label="Fecha Inicial"
                :max="moment().format('YYYY-MM-DD')"
            >
            </c-date>
          </v-col>
          <v-col cols="12" sm="12" md="3" lg="3">
            <c-date
                v-model="data.fecha_fin"
                label="Fecha Final"
                :max="moment().format('YYYY-MM-DD')"
            >
            </c-date>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <c-select-complete
                v-model="data.departamentos"
                label="Departamentos"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
                multiple
            >
            </c-select-complete>
          </v-col>
          <v-col cols="12" sm="12" md="2" lg="2">
            <v-btn color="green" class="white--text" @click="getDataInforme" block>
              <span>Filtrar</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Distribución Por Riesgo General</p>
                </div>
                <simple-table
                    :titulo="'Por Riesgo OMS'"
                    :data="dataInforme.resumen_operativo"
                    :headers="['Usuario','Regional', 'Cantidad', 'Duración Promedio', 'Bajo', 'Medio', 'Alto', 'Indeterminado']"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12" md="4" lg="4">
                    <div class="font-weight-bold text-center">
                      <p>Por Riesgo OMS</p>
                    </div>
                    <simple-table
                        :data="dataInforme.riesgo_oms"
                        :headers="['Riesgo','Cantidad']"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="4" lg="4">
                    <div class="font-weight-bold text-center">
                      <p>Por Riesgo FindRisc</p>
                    </div>
                    <simple-table
                        :data="dataInforme.riesgo_findrisc"
                        :headers="['Riesgo','Cantidad']"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="4" lg="4">
                    <div class="font-weight-bold text-center">
                      <p>Por Riesgo MoriskyGreen</p>
                    </div>
                    <simple-table
                        :data="dataInforme.riesgo_morisky"
                        :headers="['Riesgo','Cantidad']"
                    ></simple-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Encuestas de Riesgo Cardiovascular Por Departamento</p>
                </div>
                <v-row class="justify-center">
                  <v-col cols="12" sm="12" md="5" lg="5">
                    <simple-table
                        :titulo="'Encuestas de Riesgo Cardiovascular por Departamento'"
                        :data="dataInforme.por_departamento"
                        :headers="['Departamento','Cantidad']"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="5" lg="5">
                    <simple-table
                        :data="dataInforme.por_departamento_regimen"
                        :headers="['Departamento', 'Régimen','Cantidad']"
                    ></simple-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex";

const SimpleTable = () => import('../../../../components/SimpleTable/SimpleTable')
export default {
  name: "InformeEjecutivo",
  data: () => ({
    dataInforme: [],
    data: {},
    loading: false,
    defaultDepartamentos: []
  }),
  components: {
    SimpleTable
  },
  computed: {
    ...mapGetters([
      'complementosRCV',
      'departamentos'
    ]),
  },
  methods: {
    getDataInforme() {
      this.loading = true
      let data = this.setParametros()
      this.axios.post('informe-ejecutivo_rcv', data).then(response => {
        this.dataInforme = response.data
        this.returnTotales()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: ` al conseguir datos de informe`, error: error})
      })
    },
    setParametros() {
      this.data = {
        fecha_inicio: this.data.fecha_inicio ? this.data.fecha_inicio : this.moment().format('YYYY-MM-DD'),
        fecha_fin: this.data.fecha_fin ? this.data.fecha_fin : this.moment().format('YYYY-MM-DD'),
        departamentos: this.data.departamentos && this.data.departamentos.length ? this.data.departamentos : this.returnDepartamentos()
      }
      return this.data
    },
    returnDepartamentos() {
      if (!this.defaultDepartamentos.length && (this.complementosRCV && this.complementosRCV.departamentos_rcv && this.complementosRCV.departamentos_rcv.length)) {
        this.complementosRCV.departamentos_rcv.forEach((departamento) => {
          this.defaultDepartamentos.push(departamento.id)
        })
      }
      return this.defaultDepartamentos
    },
    returnTotales() {
      if (this.dataInforme.resumen_operativo.length) {
        let total = {c1: "TOTAL", c2: "", c3: 0, c4: 0, c5: 0, c6: 0, c7: 0, c8: 0}
        for (const [llave, valor] of Object.entries(this.dataInforme.resumen_operativo)) {
          llave
          total.c3 += valor.cantidad
          total.c4 += parseFloat(valor.promedio)
          total.c5 += valor.Bajo
          total.c6 += valor.Medio
          total.c7 += valor.Alto
          total.c8 += valor.Indeterminado
        }
        this.dataInforme.resumen_operativo.push(total)
        let promedioTotal = this.clone(this.dataInforme.resumen_operativo)
        promedioTotal.pop()
        this.dataInforme.resumen_operativo[this.dataInforme.resumen_operativo.length - 1].c4 = parseFloat(window.lodash.sumBy(promedioTotal, x => parseFloat(x.promedio)) / (this.dataInforme.resumen_operativo.length - 1)).toFixed(1)
      }
    }
  },
  created() {
    this.setParametros()
    this.getDataInforme()
  }
}
</script>

<style scoped>

</style>