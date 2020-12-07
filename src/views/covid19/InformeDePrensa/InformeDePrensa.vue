<template>
  <v-container fluid>
    <page-title-bar title="Informe De Prensa"></page-title-bar>
    <v-card class="text-center">
      <v-card-title class="mb-0 pb-0">
        <v-row>
          <v-col cols="12" sm="12" md="4" lg="4">
            <c-date
                v-model="data.fecha_inicio"
                label="Fecha Inicial"
                :max="moment().format('YYYY-MM-DD')"
            >
            </c-date>
          </v-col>
          <v-col cols="12" sm="12" md="4" lg="4">
            <c-date
                v-model="data.fecha_fin"
                label="Fecha Final"
                :max="moment().format('YYYY-MM-DD')"
            >
            </c-date>
          </v-col>
          <!--<v-col cols="12" sm="12" md="3" lg="3">
            <c-select-complete
                v-model="data.departamentos"
                label="Departamentos"
                :items="departamentos"
                item-text="nombre"
                item-value="id"
                multiple
            >
            </c-select-complete>
          </v-col>-->
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
        <v-row>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Estadisticas Muestras</p>
                </div>
                <simple-table
                    :data="dataInforme.estadisticasMuestra"
                    :headers="[{text:'Departamento'},{text:'Variable'},
                    {text:'Valor'},{text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.estadisticasMuestra && !dataInforme.estadisticasMuestra.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Resultados de las muestras</p>
                </div>
                <simple-table
                    :data="dataInforme.resultadosDeMuestras"
                    :headers="[{text:'Departamento'},{text:'Variable'},
                    {text:'Tipo prueba'},{text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.resultadosDeMuestras && !dataInforme.resultadosDeMuestras.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Contactos y nexos</p>
                </div>
                <simple-table
                    :data="dataInforme.contactosNexos"
                    :headers="[{text:'Departamento'},
                    {text:'Valor'},{text:'Contactos',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.contactosNexos && !dataInforme.contactosNexos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Pruebas de nexos y contactos</p>
                </div>
                <simple-table
                    :data="dataInforme.pruebasNexosContactos"
                    :headers="[{text:'Regional'},
                    {text:'Valor'},{text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.pruebasNexosContactos && !dataInforme.pruebasNexosContactos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Pruebas positivas de nexos y contactos</p>
                </div>
                <simple-table
                    :data="dataInforme.pruebasPositivasNexosContactos"
                    :headers="[{text:'Nombre'},
                    {text:'Valor'},{text:'Contactos',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.pruebasPositivasNexosContactos && !dataInforme.pruebasPositivasNexosContactos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Pruebas negativas de nexos y contactos</p>
                </div>
                <simple-table
                    :data="dataInforme.pruebasNegativasNexosContactos"
                    :headers="[{text:'Nombre'},
                    {text:'Valor'},{text:'Contactos',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.pruebasNegativasNexosContactos && !dataInforme.pruebasNegativasNexosContactos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Estados de afectacion de afiliados positivos</p>
                </div>
                <simple-table
                    :data="dataInforme.estadosAfectacionAfiliadosPositivos"
                    :headers="[{text:'Departamento'},{text:'Variable'},
                    {text:'Valor'},{text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.estadosAfectacionAfiliadosPositivos && !dataInforme.estadosAfectacionAfiliadosPositivos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Llamadas efectivas call center</p>
                </div>
                <simple-table
                    :data="dataInforme.llamadasEfectivas"
                    :headers="[{text:'Regional'},{text:'Variable'},
                    {text:'Valor'},{text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.llamadasEfectivas && !dataInforme.llamadasEfectivas.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Llamadas fallidas call center</p>
                </div>
                <simple-table
                    :data="dataInforme.llamadasFallidas"
                    :headers="[{text:'Regional'}, {text:'Variable'},{text:'Valor'},
                    {text:'Cantidad',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.llamadasFallidas && !dataInforme.llamadasFallidas.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Aislamientos</p>
                </div>
                <simple-table
                    :data="dataInforme.aislamientos"
                    :headers="[{text:'Regional'},{text:'Variable'},
                    {text:'Valor'},{text:'Aislamiento',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.aislamientos && !dataInforme.aislamientos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" class="mx-auto">
            <v-card>
              <v-card-text>
                <div class="font-weight-bold text-center">
                  <p>Afiliados positivos</p>
                </div>
                <simple-table
                    :data="dataInforme.afiliadosPositivos"
                    :headers="[{text:'Positivos casanare',align:'right'}, {text:'Positivos bogota',align:'right'},{text:'Positivos resto',align:'right'}]"
                    :alignNumbersRight="true"
                    :lastRowBold="true"
                ></simple-table>
                <template v-if="dataInforme.afiliadosPositivos && !dataInforme.afiliadosPositivos.length">
                  <v-row>
                    <div class="grey--text mx-auto mt-2 subtitle-1">
                      No hay registros para mostrar
                    </div>
                  </v-row>
                </template>
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
  import axios from "axios";
  const SimpleTable = () => import('../../../components/SimpleTable/SimpleTable')
  export default {
    name: "InformeDePrensa",
    data: () => ({
      dataInforme: [],
      data: {},
      loading: false,
      //defaultDepartamentos: [],
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
        this.axios.post('reporte-de-prensa', this.data).then(response => {
          this.dataInforme = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'error', message: ` al conseguir datos de informe`, error: error})
        })
      },
      /*
      returnDepartamentos() {
        if (!this.defaultDepartamentos.length && (this.complementosRCV && this.complementosRCV.departamentos_rcv && this.complementosRCV.departamentos_rcv.length)) {
          this.complementosRCV.departamentos_rcv.forEach((departamento) => {
            this.defaultDepartamentos.push(departamento.id)
          })
        }
        return this.defaultDepartamentos
      },
      */
      descargarPDF(){
        const apiAxios = axios.create()
        apiAxios.defaults.baseURL = `http://apsoft-backend.test/api`
        apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
        this.loadingPDF = true
        this.axios( {
          url: `generar-pdf-reporte-de-prensa?fecha_inicio=${this.data.fecha_inicio ? this.data.fecha_inicio : ''}&fecha_final=${this.data.fecha_fin ? this.data.fecha_fin : ''}`, //your url,
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
      }
      this.getDataInforme()
    }
  }
</script>

<style scoped>

</style>