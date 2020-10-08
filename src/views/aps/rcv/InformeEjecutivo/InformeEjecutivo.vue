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
          <v-col cols="12" sm="12" md="3" lg="3">
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
          <v-col class="ml-0 pl-0" cols="12" sm="12" md="1" lg="1">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn color="red" icon v-on="on" :disabled="loadingPDF" :loading="loadingPDF" @click="descargarPDF">
                  <v-icon>fas fa-file-pdf</v-icon>
                </v-btn>
              </template>
              <span>Generar PDF</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-card class="mt-5">
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Distribución Por Riesgo General</p>
                </div>
                <simple-table
                    :data="dataInforme.resumen_operativo"
                    :lastRowBold="true"
                    :alignNumbersRight="true"
                    :headers="[
                        {text:'Usuario'},{text:'Regional'},
                        {text:'Cantidad',align:'right'},{text:'Duración Promedio',align:'right'},
                        {text:'Bajo',align:'right'},{text:'Medio',align:'right'},
                        {text:'Alto',align:'right'},{text:'Indeterminado',align:'right'}
                     ]"
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
                        :headers="[{text:'Riesgo'},{text:'Cantidad',align:'right'}]"
                        :alignNumbersRight="true"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="4" lg="4">
                    <div class="font-weight-bold text-center">
                      <p>Por Riesgo FindRisc</p>
                    </div>
                    <simple-table
                        :data="dataInforme.riesgo_findrisc"
                        :headers="[{text:'Riesgo'},{text:'Cantidad',align:'right'}]"
                        :alignNumbersRight="true"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="4" lg="4">
                    <div class="font-weight-bold text-center">
                      <p>Por Riesgo MoriskyGreen</p>
                    </div>
                    <simple-table
                        :data="dataInforme.riesgo_morisky"
                        :headers="[{text:'Riesgo'},{text:'Cantidad',align:'right'}]"
                        :alignNumbersRight="true"
                    ></simple-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Encuestas por Grupos Etarios y Decenios</p>
                </div>
                <simple-table
                    :data="dataInforme.etario_genero"
                    :headers="[{text:'Edades'},{text:'Mujer',align:'right'},{text:'Hombre',align:'right'}]"
                    :alignNumbersRight="true"
                ></simple-table>
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
                        :data="dataInforme.por_departamento"
                        :headers="[{text:'Departamento'},{text:'Cantidad',align:'right'}]"
                        :alignNumbersRight="true"
                    ></simple-table>
                  </v-col>
                  <v-col cols="12" sm="12" md="5" lg="5">
                    <simple-table
                        :data="dataInforme.por_departamento_regimen"
                        :headers="[{text:'Departamento'},{text:'Régimen'},{text:'Cantidad',align:'right'}]"
                        :alignNumbersRight="true"
                    ></simple-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" xl="4">
            <div class="font-weight-bold text-center">
              <p>Por Efectividad de la Encuesta</p>
            </div>
            <simple-table
                :data="dataInforme.no_efectivas"
                :headers="[{text:'Tipo'},{text:'Cantidad',align:'right'}]"
                :alignNumbersRight="true"
            ></simple-table>
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
    defaultDepartamentos: [],
    loadingPDF: false
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
      this.axios.post('informe-ejecutivo_rcv', this.data).then(response => {
        this.dataInforme = response.data
        let por_edad = response.data.etario_genero.find(x => x.Hombre > 0 || x.Mujer > 0)
        if(!por_edad) {
          this.dataInforme.etario_genero = []
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: ` al conseguir datos de informe`, error: error})
      })
    },
    returnDepartamentos() {
      if (!this.defaultDepartamentos.length && (this.complementosRCV && this.complementosRCV.departamentos_rcv && this.complementosRCV.departamentos_rcv.length)) {
        this.complementosRCV.departamentos_rcv.forEach((departamento) => {
          this.defaultDepartamentos.push(departamento.id)
        })
      }
      return this.defaultDepartamentos
    },
    descargarPDF(){
      this.loadingPDF = true
      this.axios( {
        url: `generar-pdf-informe-ejecutivo_rcv?fecha_inicio=${this.data.fecha_inicio ? this.data.fecha_inicio : ''}&fecha_final=${this.data.fecha_fin ? this.data.fecha_fin : ''}&departamentos=${this.data.departamentos ? this.data.departamentos : []}`, //your url,
        method: 'GET',
        responseType: 'blob', // important
      }).then(async response => {
        if(response.status === 204) {
          this.$store.commit('snackbar', {color: 'info', message: 'Los parametros aplicados no han generado registros para crear PDF'})
        }else{
          const fileURL = window.URL.createObjectURL(
              new Blob([response.data], {type: 'application/pdf'}))
          await window.open(fileURL, '_blank')
        }
        this.loadingPDF = false
      }).catch(error => {
        this.loadingPDF = false
        this.$store.commit('snackbar', {color: 'error', message: 'al descargar el PDF', error: error})
      })
    },
  },
  created() {
    this.data = {
      fecha_inicio: this.data.fecha_inicio ? this.data.fecha_inicio : this.moment().format('YYYY-MM-DD'),
      fecha_fin: this.data.fecha_fin ? this.data.fecha_fin : this.moment().format('YYYY-MM-DD'),
      departamentos: this.data.departamentos && this.data.departamentos.length ? this.data.departamentos : this.returnDepartamentos()
    }
    this.getDataInforme()
  }
}
</script>

<style scoped>

</style>