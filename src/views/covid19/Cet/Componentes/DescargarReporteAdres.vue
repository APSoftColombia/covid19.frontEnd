<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
          color="green"
          class="white--text"
          block
          v-on="on"
          @click.stop="close"
      >
        <v-icon left>fas fa-file-download</v-icon>
        Descargar Archivo Consolidado ADRES
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Descargar Reporte
      </v-card-title>
      <v-card-text>
        <ValidationObserver ref="formDescargaReporteAdres" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col class="pb-0" cols="12" sm="10" md="10">
              <ValidationProvider name="nombre archivo" rules="required" v-slot="{ errors, valid }">
                <v-autocomplete
                    label="Nombre archivo"
                    v-model="filters.models.archivo_adres"
                    :items="archivos"
                    outlined
                    dense
                    item-value="id"
                    clearable
                    :error-messages="errors"
                >
                  <template v-slot:selection="{ item, index }">
                    <div class="pa-0 text-truncate" style="width: 100% !important;">
                      {{ item.nombre_archivo + ' - ' + item.created_at }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, index }">
                    <template>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>{{ item.nombre_archivo }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.created_at }}</v-list-item-subtitle>
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
            <v-col cols="12" sm="6" md="6"
                   v-if="departamentos && departamentos.length > 1">
              <c-select-complete
                  v-model="filters.models.departamentos"
                  label="Departamento"
                  :items="departamentos"
                  item-value="codigo"
                  item-text="nombre"
                  multiple
                  @change="filters.models.municipios = []"
                  hide-details
              >
              </c-select-complete>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <c-select-complete
                  v-model="filters.models.municipios"
                  label="Municipio"
                  :items="filters.models.departamentos && filters.models.departamentos.length ? municipiosTotal.filter(x => filters.models.departamentos.find(z => z === x.codigo.substring(0,2))) : municipiosTotal"
                  item-value="codigo"
                  item-text="nombre"
                  multiple
                  hide-details
              >
              </c-select-complete>
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
import {mapGetters} from "vuex";
  export default {
    name: "DescargarReporteAdres",
    data: () => ({
      archivos: [],
      dialog: false,
      loadingButton: false,
      filters: {
        models: {
          departamentos: [],
          municipios: [],
          archivo_adres: null,
        },
      }
    }),
    watch: {
      'dialog': {
        handler(val) {
          if(val) {
            this.getArchivosADRES()
          }
        }
      }
    },
    computed: {
      ...mapGetters([
          "departamentos",
          "municipiosTotal"
      ])
    },
    methods: {
      getArchivosADRES(){
        this.axios.get('get-archivos-adres').then(response => {
          this.archivos = response.data
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: ' al obtener archivos subidos', error: error})
        })
      },
      close(){
        this.dialog = false
        this.archivos = []
      },
      descargarReporte(){
        this.$refs.formDescargaReporteAdres.validate().then(result => {
          if(result) {
            this.loadingButton = true
            this.axios( {
              url: `download-reporte-general${this.filters.models.departamentos.length ? '?departamentos=' + this.filters.models.departamentos.join(',') : ''}${this.filters.models.municipios.length ? '&municipios=' + this.filters.models.municipios.join(',') : ''}${this.filters.models.archivo_adres ? '&archivo=' + this.filters.models.archivo_adres : ''}`, //your url
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
                a.download = 'REPORTE CONSOLIDADO ADRES.xlsx'
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
      this.getArchivosADRES()
    }
  }
</script>

<style scoped>

</style>
