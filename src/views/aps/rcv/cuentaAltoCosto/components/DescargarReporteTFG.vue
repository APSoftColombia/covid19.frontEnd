<template>
  <v-dialog v-model="dialog" persistent max-width="720px">
    <v-card>
      <v-card-title>
      <p class="title ma-0">Descargar Reporte TFG</p>
      <v-spacer></v-spacer>
      <v-btn large icon @click="close" class="white--text mr-2">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      </v-card-title>
      <ValidationObserver ref="formReporte" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-container>
          <v-row justify="center" align="center">
            Parámetros
          </v-row>
          <v-row justify="center" align="center">
            <template>
              <v-col class="pb-0" cols="12" sm="12" md="6">
                <c-date
                    v-model="data.fecha1"
                    label="Fecha inicial"
                    rules="required"
                    name="Fecha inicial"
                />
              </v-col>
              <v-col class="pb-0" cols="12" sm="12" md="6">
                <c-date
                    v-model="data.fecha2"
                    label="Fecha final"
                    rules="required"
                    name="Fecha final"
                />
              </v-col>
            </template>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="primary" @click="close" :loading="loading">
            Cerrar
          </v-btn>
          <v-spacer/>
          <v-btn color="primary" dark @click="descargarReporte" :loading="loading">
            Descargar
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DescargarReporteTFG",
  data: () => ({
    data: {},
    dialog: false,
    loading: false
  }),
  methods: {
    open(){
      this.dialog = true
    },
    close(){
      this.dialog = false
      this.data = {}
    },
    descargarReporte(){
      this.$refs.formReporte.validate().then(result => {
        if(result){
          this.axios( {
            url: `download-reporte-tfg?fecha1=${this.data.fecha1}&fecha2=${this.data.fecha2}`, //your url
            method: 'GET',
            responseType: 'blob', // important
          }).then(response => {
            if(response.status === 204){
              this.$store.commit('snackbar', {color: 'info', message: "no hay registros para descargar"})
            }else{
              const file = new Blob(
                  [response.data],
                  {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
              const fileURL = URL.createObjectURL(file);
              const a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              a.href = fileURL
              a.download = 'REPORTE TFG.xlsx'
              a.click();
              this.dialog = false
            }
            this.loadingButton = false
          }).catch(error => {
            this.loadingButton = false
            this.$store.commit('snackbar', {color: 'error', message: 'al descargar excel', error: error})
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
