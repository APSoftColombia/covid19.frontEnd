<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <template v-slot:activator="{on}">
      <v-btn
          color="green"
          class="white--text mr-2"
          v-on="on"
          @click.stop="dialog = true"
      >
        <v-icon left>far fa-file-excel</v-icon>
        Cargar Registros
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Carga de registros</v-card-title>
      <v-card-text>
        <ValidationObserver ref="formArchivo" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12" sm="12" md="5" lg="5" class="ml-md-8 ml-lg-8">
              <c-date
                    v-model="data.fecha_proceso"
                    label="Fecha del Proceso"
                    :max="moment().format('YYYY-MM-DD')"
                    :rules="'required'"
                    name="fecha del proceso"
                >
                </c-date>
            </v-col>
            <v-col cols="12" sm="12" md="5" lg="5" class="ml-md-8 ml-lg-8">
              <c-texto
                    v-model="data.nombre_archivo"
                    label="Nombre del archivo"
                    :rules="'required'"
                    name="nombre del archivo"
                ></c-texto>
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12">
              <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                <v-file-input
                    v-model="data.archivo"
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
                    <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarArchivo" style="top: -4px !important;">
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                    <v-btn v-else large color="green darken-1" text @click="cargarArchivo" style="top: -10px !important;">
                      <v-icon left large>mdi-file-upload</v-icon>
                      Cargar Archivo
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
    name: "CargarRegistros",
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
      cargarArchivo () {
        this.$refs.formArchivo.validate().then(result => {
          if (result) {
            this.errores = []
            this.loading = true
            let data = new FormData()
            data.append('archivo', this.data.archivo)
            data.append('fecha_proceso', this.data.fecha_proceso)
            data.append('nombre_archivo', this.data.nombre_archivo)
            this.axios.post(`upload-info-cets`, data)
                .then(response => {
                  response
                  this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                  this.close()
                  this.$emit('reloadTable')
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                })
          }
        })
      },
      close () {
        this.$refs.formArchivo.reset()
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