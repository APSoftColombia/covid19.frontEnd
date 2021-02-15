<template>
  <v-card flat>
    <v-card-title class="headline">
      Nombre cargador: {{ nombreCargador }}, Separador: {{ separador }}
    </v-card-title>
    <v-card-subtitle>
      <v-btn icon @click="generateCsv(cabeceras)">
        <v-icon>mdi-file-download</v-icon>
      </v-btn>
      <span class="title font-weight-light">Descargar Plantilla</span>
    </v-card-subtitle>
    <v-card-text>
      <ValidationObserver
        ref="formArchivo"
        v-slot="{ invalid, validated, passes, validate }"
        autocomplete="off"
      >
        <ValidationProvider
          name="archivo"
          rules="required"
          v-slot="{ errors, valid }"
        >
          <v-row>
            <v-col class="pb-0" cols="12">
              <v-file-input
                v-model="archivo"
                placeholder="Archivo"
                prepend-icon="fas fa-file-csv"
                accept=".csv,.txt"
                outlined
                dense
                hint="Extensiones permitidas: .csv, .txt"
                persistent-hint
                :error-messages="errors"
              >
                <template v-slot:append-outer>
                  <v-btn
                    x-large
                    color="green darken-1"
                    v-if="$vuetify.breakpoint.xsOnly"
                    icon
                    @click="cargarArchivo(idCargador)"
                    style="top: -4px !important"
                  >
                    <v-icon>mdi-file-upload</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    large
                    color="green darken-1"
                    text
                    @click="cargarArchivo(idCargador)"
                    style="top: -10px !important"
                  >
                    <v-icon left large>mdi-file-upload</v-icon>
                    Cargar Archivo
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </ValidationProvider>
      </ValidationObserver>
    </v-card-text>
    <v-expand-transition>
      <v-card-text v-if="errores && errores.length">
        <v-row class="headline justify-center">
          <v-icon color="orange" left>mdi-alert</v-icon>
          Errores en el archivo
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-list dense>
              <v-list-item
                v-for="(error, indexError) in errores"
                :key="`Error${indexError}`"
                @click="hover = true"
              >
                <v-list-item-avatar class="ma-0">
                  <span>{{ indexError + 1 }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="error"></v-list-item-title>
                </v-list-item-content>
                <!--                                <v-list-item-action>-->
                <!--                                    <v-btn icon>-->
                <!--                                        <v-icon color="grey lighten-1">mdi-information</v-icon>-->
                <!--                                    </v-btn>-->
                <!--                                </v-list-item-action>-->
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-expand-transition>
    <app-section-loader :status="loading"></app-section-loader>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Carga exitosa: Resultados del cargador</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table
              dense
              :headers="cabecerasResult"
              :items="successResult"
              hide-default-footer
              class="elevation-1"
            ></v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "Cargador",
  props: {
    idCargador: {
      type: Number,
      required: true,
    },
    nombreCargador: {
      type: String,
      required: true,
    },
    separador: {
      type: String,
      required: true,
    },
    cabeceras: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    hover: true,
    loading: false,
    archivo: null,
    errores: [],
    successResult: [],
    cabecerasResult: [],
  }),
  watch: {
    archivo: {
      handler() {
        this.errores = [];
      },
      immediate: false,
    },
  },
  methods: {
    generateCsv(cabeceras) {
      let headers = cabeceras;
      if (typeof cabeceras[0] == "object") {
        headers = cabeceras.map((value) => {
          return value.header;
        });
      }
      this.download(headers, `Plantilla ${this.nombreCargador}`, this.separador);
    },
    convertToCSV(objArray, delimiter) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (line != "") line += delimiter;

          line += array[i][index];
        }

        str += line + "\r\n";
      }
      return str;
    },
    exportCSVFile(headers, items, fileTitle, delimiter) {
      if (headers) {
        items.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = this.convertToCSV(jsonObject, delimiter);

      var exportedFilenmae = fileTitle + ".csv" || "export.csv";

      var blob = new Blob([csv], {
        type: `text/csv;charset=utf-8${delimiter}`,
      });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    download(headers, filename, delimiter) {
      this.exportCSVFile(headers, [], filename, delimiter); // call the exportCSVFile() function to process the JSON and trigger the download
    },
    cargarArchivo() {
      this.$refs.formArchivo.validate().then((result) => {
        if (result) {
          this.errores = [];
          this.loading = true;
          let data = new FormData();
          data.append("archivo", this.archivo);
          this.axios({
              url: `execute-cargador/${this.idCargador}`,
              method: 'POST',
              responseType: 'blob',
              data: data
              })
            .then(async (response) => {
              if (response.status === 201) {
                let text = await response.data.text();
                let result = JSON.parse(text).success;
                if (result.length) {
                  Object.keys(result[0]).forEach(item => {
                    this.cabecerasResult.push(
                      {
                        text: item,
                        value: item,
                        sorteable: false
                      }
                    );
                  });
                  this.successResult = result;
                  this.dialog = true;
                }else {
                  this.$store.commit("snackbar", {
                    color: "success",
                    message: `Carga exitosa`,
                  });
                }
                this.loading = false;
              }else {
                this.$store.commit("snackbar", {
                  color: "error",
                  message: `Carga interrumpida: Revisar archivo de errores.`,
                });

                const file = new Blob(
                    [response.data],
                    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                const fileURL = URL.createObjectURL(file);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileURL
                a.download = 'errors.xlsx'
                a.click();
              }
              
              this.loading = false;
            })
            .catch((error) => {
              error.response.data.text().then(text => {
                let errorText = JSON.parse(text);
                this.loading = false;
                this.$store.commit("snackbar", {
                  color: "error",
                  message: errorText.message
                });
              });
              if (
                error &&
                error.response &&
                error.response.data &&
                error.response.data.errors &&
                error.response.data.errors.length
              ) {
                this.errores = error.response.data.errors;
              }
            });
        }
      });
    },
  },
};
</script>