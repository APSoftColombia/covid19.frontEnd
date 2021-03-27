<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <template v-slot:activator="{onx}">
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-btn
              icon
              x-large
              color="primary"
              v-on="on"
              @click.stop="dialog = true"
          >
            <v-icon>fas fa-upload</v-icon>
          </v-btn>
        </template>
        <span>Cargar Archivo</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title class="headline">Cargue masivo Sismuestras PCR y Antigenos</v-card-title>
      <v-card-text>
        <ValidationObserver ref="formArchivo" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
            <v-file-input
                v-model="archivo"
                placeholder="Archivo comprimido SISMUESTRAS"
                prepend-icon="fas fa-file-archive"
                accept=".zip,.rar"
                outlined
                dense
                hint="Extensiones permitidas: .zip, .rar"
                persistent-hint
                :error-messages="errors"
                :disabled="!enableSismuestras"
            >
              <template v-slot:append-outer>
                <v-btn :disabled="!enableSismuestras" x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarArchivo" style="top: -4px !important;">
                  <v-icon>mdi-file-upload</v-icon>
                </v-btn>
                <v-btn v-else large color="green darken-1" text @click="cargarArchivo" style="top: -10px !important;" :disabled="!enableSismuestras">
                  <v-icon left large>mdi-file-upload</v-icon>
                  Cargar Archivo
                </v-btn>
              </template>
            </v-file-input>
          </ValidationProvider>
        </ValidationObserver>
      </v-card-text>
      <v-card-text>
        <ValidationObserver ref="formAntigenos" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <ValidationProvider name="antigenos" rules="required" v-slot="{ errors, valid }">
            <v-file-input
                v-model="antigenos"
                placeholder="Archivo comprimido ANTIGENOS"
                prepend-icon="fas fa-file-archive"
                accept=".zip,.rar"
                outlined
                dense
                hint="Extensiones permitidas: .zip, .rar"
                persistent-hint
                :error-messages="errors"
                :disabled="!enableAntigenos"
            >
              <template v-slot:append-outer>
                <v-btn :disabled="!enableAntigenos" x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarArchivoAntigenos" style="top: -4px !important;">
                  <v-icon>mdi-file-upload</v-icon>
                </v-btn>
                <v-btn :disabled="!enableAntigenos" v-else large color="green darken-1" text @click="cargarArchivoAntigenos" style="top: -10px !important;">
                  <v-icon left large>mdi-file-upload</v-icon>
                  Cargar Archivo
                </v-btn>
              </template>
            </v-file-input>
          </ValidationProvider>
        </ValidationObserver>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="10" align-self="center">
            <v-btn block class="primary" @click="executeQuerys" :disabled="!enableQuerys">
              Crear ERPs
            </v-btn>

          </v-col>
          <v-col cols="2">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon x-large color="green" v-on="on" @click="downloadResultado" :disabled="!enableReporte">
                  <v-icon>mdi-file-table</v-icon>
                </v-btn>
              </template>
              <span>Descargar resultados</span>
            </v-tooltip>
          </v-col>
        </v-row>
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
                    <span>{{indexError + 1}}</span>
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
      <v-divider class="pa-0 ma-0"></v-divider>
      <v-card-actions class="justify-center">
        <v-btn block text @click="close">Cerrar</v-btn>
      </v-card-actions>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CargadorSismuestras',
  data: () => ({
    hover: true,
    loading: false,
    dialog: false,
    enableSismuestras: true,
    archivo: null,
    enableAntigenos: false,
    antigenos: null,
    enableQuerys: false,
    enableReporte: false,
    errores: []
  }),
  watch: {
    'archivo': {
      handler () {
        this.errores = []
      },
      immediate: false
    },
    'antigenos': {
      handler () {
        this.errores = []
      },
      immediate: false
    }
  },
  methods: {
    cargarArchivo () {
      this.$refs.formArchivo.validate().then(result => {
        if (result) {
          this.errores = []
          this.loading = true
          let data = new FormData()
          data.append('archivo', this.archivo)
          this.axios.post(`import-sismuestras`, data)
              .then(response => {
                this.loading = false
                this.enableSismuestras = false;
                this.enableAntigenos = true;
                console.log('response', response)
                this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
              })
              .catch(error => {
                console.log('error', error)
                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
                  this.errores = error.response.data.errors
                }
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
              })
        }
      })
    },
    cargarArchivoAntigenos() {
      this.$refs.formAntigenos.validate().then(result => {
        if (result) {
          this.errores = []
          this.loading = true
          let data = new FormData()
          data.append('archivo', this.antigenos)
          this.axios.post(`import-antigenos`, data)
              .then(response => {
                this.loading = false
                this.enableAntigenos = false;
                this.enableQuerys = true;
                console.log('response', response)
                this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
              })
              .catch(error => {
                console.log('error', error)
                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
                  this.errores = error.response.data.errors
                }
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
              })
        }
      })
    },
    executeQuerys() {
      this.loading = true;
      this.axios.get('execute-querys').then(response => {
        console.log(response);
        this.loading = false;
        this.enableQuerys = false;
        this.enableReporte = true;
        this.$store.commit('snackbar', {color: 'success', message: `Querys ejecutadas correctamente`})
      }).catch(error => {
        console.log('error', error)
        if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
          this.errores = error.response.data.errors
        }
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: `al ejecutar las querys`, error: error})
      })
    },
    downloadResultado() {
      this.axios({
        url: 'reporte-cargue-sismuestras',
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        if (response.status === 201) {
          this.loading = false
          this.$store.commit('snackbar', {color: 'warning', message: "no hay resultados para mostrar"})
        }else {
          const file = new Blob(
              [response.data],
              {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = fileURL
          a.download = 'ResultadoSismuestraAntigenos.xlsx'
          a.click();
          this.loading = false
        }
      }).catch(error => {
        console.log('error', error)
        if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
          this.errores = error.response.data.errors
        }
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: `al obtener el reporte`, error: error})
      })
    },
    close () {
      this.$refs.formArchivo.reset()
      this.$refs.formAntigenos.reset()
      this.errores = []
      this.dialog = false
      this.loading = false
      this.archivo = null
      this.antigenos = null
    }
  }
}
</script>

<style scoped>

</style>