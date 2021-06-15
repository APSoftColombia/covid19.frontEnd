<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <template v-slot:activator="{on}">
      <v-btn
          color="green"
          class="white--text"
          block
          v-on="on"
          @click.stop="dialog = true"
      >
        <v-icon left>fas fa-file-upload</v-icon>
        Cargar Archivos ADRES
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Carga de Archivos</v-card-title>
      <v-card-text>
        <ValidationObserver ref="formConsolidado" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                <v-file-input
                    v-model="data.cetConsolidado"
                    placeholder="Archivo consolidado adres"
                    prepend-icon="fas fa-file-csv"
                    accept=".csv,.txt"
                    outlined
                    dense
                    hint="Extensiones permitidas: .csv, .txt"
                    persistent-hint
                    :error-messages="errors"
                >
                  <template v-slot:append-outer>
                    <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarAdres" style="top: -4px !important;">
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn v-else large color="green darken-1" text @click="cargarAdres" style="top: -10px !important;">
                      <v-icon left large>mdi-file-upload</v-icon>
                      Cargar
                    </v-btn>
                  </template>
                </v-file-input>
              </ValidationProvider>
            </v-col>
          </v-row>
        </ValidationObserver>
        <ValidationObserver ref="formNeg" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                <v-file-input
                    v-model="data.cetNeg"
                    placeholder="Archivo negativos"
                    prepend-icon="fas fa-file-csv"
                    accept=".csv,.txt"
                    outlined
                    dense
                    hint="Extensiones permitidas: .csv, .txt"
                    persistent-hint
                    :error-messages="errors"
                >
                  <template v-slot:append-outer>
                    <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarNeg" style="top: -4px !important;">
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn v-else large color="green darken-1" text @click="cargarNeg" style="top: -10px !important;">
                      <v-icon left large>mdi-file-upload</v-icon>
                      Cargar
                    </v-btn>
                  </template>
                </v-file-input>
              </ValidationProvider>
            </v-col>
          </v-row>
        </ValidationObserver>
        <ValidationObserver ref="formVal" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                <v-file-input
                    v-model="data.cetVal"
                    placeholder="Archivo validados"
                    prepend-icon="fas fa-file-csv"
                    accept=".csv,.txt"
                    outlined
                    dense
                    hint="Extensiones permitidas: .csv, .txt"
                    persistent-hint
                    :error-messages="errors"
                >
                  <template v-slot:append-outer>
                    <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarVal" style="top: -4px !important;">
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn v-else large color="green darken-1" text @click="cargarVal" style="top: -10px !important;">
                      <v-icon left large>mdi-file-upload</v-icon>
                      Cargar
                    </v-btn>
                  </template>
                </v-file-input>
              </ValidationProvider>
            </v-col>
          </v-row>
        </ValidationObserver>
        <ValidationObserver ref="formPago" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12">
              <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                <v-file-input
                    v-model="data.cetPago"
                    placeholder="Archivo pagados"
                    prepend-icon="fas fa-file-csv"
                    accept=".csv,.txt"
                    outlined
                    dense
                    hint="Extensiones permitidas: .csv, .txt"
                    persistent-hint
                    :error-messages="errors"
                >
                  <template v-slot:append-outer>
                    <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarPag" style="top: -4px !important;">
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn v-else large color="green darken-1" text @click="cargarPag" style="top: -10px !important;">
                      <v-icon left large>mdi-file-upload</v-icon>
                      Cargar
                    </v-btn>
                  </template>
                </v-file-input>
              </ValidationProvider>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-card-text>
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
    name: "CargarArchivosConsolidadoAdres",
    data: () => ({
      hover: true,
      loading: false,
      dialog: false,
      data: {},
    }),
    watch: {
      'archivo': {
        handler () {
          this.errores = []
        },
        immediate: false
      }
    },
    methods: {
      cargarAdres () {
        this.$refs.formConsolidado.validate().then(result => {
          if (result) {
            this.errores = []
            this.loading = true
            let data = new FormData()
            data.append('cetConsolidado', this.data.cetConsolidado)
            this.axios.post(`upload-adres-reporte`, data)
                .then(() => {
                  this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                  this.$emit('reloadTable')
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                })
          }
        })
      },
      cargarNeg () {
        this.$refs.formNeg.validate().then(result => {
          if (result) {
            this.errores = []
            this.loading = true
            let data = new FormData()
            data.append('cetNeg', this.data.cetNeg)
            this.axios.post(`upload-neg-reporte`, data)
                .then(() => {
                  this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                  this.$emit('reloadTable')
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                })
          }
        })
      },
      cargarVal () {
        this.$refs.formVal.validate().then(result => {
          if (result) {
            this.errores = []
            this.loading = true
            let data = new FormData()
            data.append('cetVal', this.data.cetVal)
            this.axios.post(`upload-val-reporte`, data)
                .then(() => {
                  this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                  this.$emit('reloadTable')
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                })
          }
        })
      },
      cargarPag () {
        this.$refs.formPago.validate().then(result => {
          if (result) {
            this.errores = []
            this.loading = true
            let data = new FormData()
            data.append('cetPago', this.data.cetPago)
            this.axios.post(`upload-pag-reporte`, data)
                .then(() => {
                  this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                  this.$emit('reloadTable')
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                })
          }
        })
      },
      close () {
        this.$refs.formConsolidado.reset()
        this.$refs.formNeg.reset()
        this.$refs.formVal.reset()
        this.$refs.formPago.reset()
        this.errores = []
        this.dialog = false
        this.loading = false
        this.archivo = null
      }
    }
  }
</script>

<style scoped>

</style>
