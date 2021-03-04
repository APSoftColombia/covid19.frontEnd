<template>
  <v-container fluid>
    <page-title-bar title="Informe Ejecutivo ERP"></page-title-bar>
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
          <!--<v-col class="ml-0 pl-0" cols="12" sm="12" md="1" lg="1">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn color="red" icon v-on="on" :disabled="loadingPDF" :loading="loadingPDF" @click="descargarPDF">
                  <v-icon>fas fa-file-pdf</v-icon>
                </v-btn>
              </template>
              <span>Generar PDF</span>
            </v-tooltip>
          </v-col>-->
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
                  <p>INDICADOR TOMA - PROCESAMIENTO Y ENTREGA DE RESULTADO</p>
                </div>
                <simple-table
                    :data="dataInforme.byConsolidado"
                    :headers="[
                        {text:'Departamento'},
                        {text:'Casos positivos',align:'right'}, {text:'Muestras no procesadas',align:'right'},
                        {text:'Resultados laboratorios',align:'right'}, {text:'Tiempo entre solicitud y Toma (h)',align:'right'},
                        {text:'Tiempo entre toma y resultado (h)',align:'right'},{text:'% Tasa positividad'}
                    ]"
                    :alignNumbersRight="true"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Informe General</p>
                </div>
                <simple-table
                    :data="dataInforme.byTipoResultado"
                    :headers="[
                        {text:'Regional'}, {text:'Detalle'}, {text:'Cantidad',align:'right'}
                    ]"
                    :alignNumbersRight="true"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Contactos</p>
                </div>
                <simple-table
                    :data="dataInforme.byContactos"
                    :headers="[
                        {text:'Regional'}, {text:'Detalle'}, {text:'Cantidad',align:'right'}
                    ]"
                    :alignNumbersRight="true"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Convivientes</p>
                </div>
                <simple-table
                    :data="dataInforme.byConvivientes"
                    :headers="[
                        {text:'Regional'}, {text:'Detalle'}, {text:'Cantidad',align:'right'}
                    ]"
                    :alignNumbersRight="true"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Sección SGCOVID</p>
                </div>
                <simple-table
                    :data="dataInforme.bySGCovid"
                    :headers="[
                        {text:'Regional'}, {text:'Detalle'}, {text:'Cantidad',align:'right'}
                      ]"
                    :alignNumbersRight="true"
                ></simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Diagnosticos SGCOVID</p>
                </div>
                <simple-table
                    :data="dataInforme.byDiagnosticoSismuestras"
                    :headers="[
                        {text:'Regional'}, {text:'Detalle'}, {text:'Cantidad',align:'right'}
                      ]"
                    :alignNumbersRight="true"
                ></simple-table>
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
  const SimpleTable = () => import('../../../components/SimpleTable/SimpleTable')
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
        this.axios.post('informe-ejecutivo_tamizajes', this.data).then(response => {
          this.dataInforme = response.data
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
          url: `generar-pdf-informe-ejecutivo_tamizajes?fecha_inicio=${this.data.fecha_inicio ? this.data.fecha_inicio : ''}&fecha_final=${this.data.fecha_fin ? this.data.fecha_fin : ''}&departamentos=${this.data.departamentos ? this.data.departamentos : []}`, //your url,
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
        fecha_inicio: this.moment().format('YYYY-MM-DD'),
        fecha_fin: this.moment().format('YYYY-MM-DD'),
        departamentos: this.returnDepartamentos()
      }
      this.getDataInforme()
    }
  }
</script>

<style scoped>

</style>