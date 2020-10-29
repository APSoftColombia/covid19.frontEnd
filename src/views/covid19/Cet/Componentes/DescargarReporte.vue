<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
          color="green"
          class="white--text mr-2"
          v-on="on"
          @click.stop="close"
      >
        <v-icon left>fas fa-file-download</v-icon>
        Descargar Reporte
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Descargar Reporte
      </v-card-title>
      <v-card-text>
        <ValidationObserver ref="formDescargaReporte" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col class="pb-0" cols="12" sm="10" md="10">
              <ValidationProvider name="nombre archivo" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    label="Nombre archivo"
                    v-model="cet_id"
                    :items="cets"
                    outlined
                    dense
                    item-value="id"
                    clearable
                    :error-messages="errors"
                >
                  <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                      {{ item.nombre_archivo + ' - ' + item.fecha_proceso }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <template>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{ item.nombre_archivo }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.fecha_proceso }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col class="pb-0" cols="12" sm="2" md="2">
              <v-btn color="green" text @click="descargarReporte" :disabled="loadingButton" :loading="loadingButton">
                <v-icon>fas fa-download</v-icon>
              </v-btn>
            </v-col>
            <v-col class="pb-0" cols="12" sm="10" md="10">
              <c-select-complete
                  label="Tipo de descarga"
                  v-model="tipoDescargaSelected"
                  outlined
                  dense
                  :items="tiposDescarga"
                  item-value="value"
                  item-text="text"
                  clearable
                  name="tipo descarga"
                  rules="required"
              ></c-select-complete>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions>
        <v-btn text block @click="close" :disabled="loadingButton" :loading="loadingButton">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "DescargarReporte",
    data: () => ({
      cets: [],
      cet_id: null,
      dialog: false,
      loadingButton: false,
      tiposDescarga: [
        {text: 'Descargar Registros Completados', value: '!='},
        {text: 'Descargar Registros sin Completar', value: '='},
        {text: 'Todos', value: 'todos'}
      ],
      tipoDescargaSelected: null
    }),
    watch: {
      'dialog': {
        handler(val) {
          if(val) {
            this.getCets()
          }
        }
      }
    },
    methods: {
      getCets(){
        this.axios.get('cets').then(response => {
          this.cets = response.data
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: ' al obtener archivos subidos', error: error})
        })
      },
      close(){
        this.dialog = false
        this.cets = []
      },
      descargarReporte(){
        this.$refs.formDescargaReporte.validate().then(result => {
          if(result) {
            this.loadingButton = true
            this.axios( {
              url: `download-reporte/${this.cet_id}?operator=${this.tipoDescargaSelected}`, //your url
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
                a.download = 'REPORTE CET.xlsx'
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
    },
    created() {
      this.getCets()
    }
  }
</script>

<style scoped>

</style>