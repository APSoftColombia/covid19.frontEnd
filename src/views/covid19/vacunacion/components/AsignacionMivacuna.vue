<template>
  <v-dialog v-model="dialog" persistent max-width="620">
    <v-card>
      <v-card-title>
        Registro de Asignación MiVacuna
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <persona-item-tabla
                :value="vacunacion"
            />
          </v-col>
        </v-row>
        <ValidationObserver
            v-if="vacunacion"
            ref="formVacunacion"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
          <v-row>
            <v-col cols="12">
              <c-select-complete
                  v-model="codhabilitacion_ips"
                  :items="complementos.prestadores_vacunas || []"
                  rules="required"
                  name="IPS Asignada"
                  dense
                  label="IPS Asignada"
                  item-text="nombre"
                  item-value="codigohabilitacion"
                  :hint="(codhabilitacion_ips && complementos.prestadores_vacunas && complementos.prestadores_vacunas.length && complementos.prestadores_vacunas.find(x => x.codigohabilitacion === codhabilitacion_ips)) ? `Cód: ${complementos.prestadores_vacunas.find(x => x.codigohabilitacion === codhabilitacion_ips).codigohabilitacion}` : ''"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
        <v-card-actions>
          <v-btn @click.stop="close">
            <v-icon>mdi-close</v-icon>
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="guardar">
            <v-icon left>fas fa-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
import PersonaItemTabla from 'Views/covid19/vacunacion/components/PersonaItemTabla'
import {mapGetters} from 'vuex'
export default {
  name: 'AsignacionMivacuna',
  components: {
    PersonaItemTabla
  },
  data: () => ({
    dialog: false,
    loading: false,
    vacunacion: null,
    complementos: {
      prestadores_vacunas: []
    },
    codhabilitacion_ips: null
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad'
    ])
  },
  methods: {
    guardar() {
      this.$refs.formVacunacion.validate().then(result => {
        if (result) {
          this.loading = true
          let copiaData = {
            TipoIDPaciente: this.vacunacion.tipo_identificacion && this.tiposDocumentoIdentidad ? this.tiposDocumentoIdentidad.find(x => x.id === this.vacunacion.tipo_identificacion).tipo : null,
            NoIDPaciente: this.vacunacion.identificacion,
            CodPrestador: this.codhabilitacion_ips
          }
          this.axios.post('asignacion-mivacuna', copiaData)
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Registro guardado correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                if(error && error.response && error.response.data && error.response.data.type === 'external-api') {
                  let mensaje = `<strong>Error MiVacuna</strong></br>`
                  mensaje = mensaje + `${error.response.data.message}.`
                  if(error.response.data.errors && error.response.data.errors.length) {
                    mensaje = mensaje + '</br></br>'
                    error.response.data.errors.forEach((x, i) => {
                      mensaje = mensaje + `${i + 1}. ${x}.</br>`
                    })
                  }
                  this.$store.commit('snackbar', {
                    color: 'error',
                    message: mensaje
                  })
                } else {
                  this.$store.commit('snackbar', {
                    color: 'error',
                    message: `al guardar el registro.`,
                    error: error
                  })
                }
              })
        }
      })
    },
    getVacunacion(id) {
      this.loading = true
      this.axios.get(`vacunaciones/${id}`).then(response => {
        this.vacunacion = response.data
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al recuperar el registro de vacunación`,
          error: error
        })
        this.close()
      })
    },
    open(vacunacion = null) {
      this.getComplementos()
      if(vacunacion) {
        this.vacunacion = this.getVacunacion(vacunacion.id)
        this.dialog = true
      } else {
        this.$store.commit('snackbar', {color: 'error', message: 'No hay un registro de vacunación seleccionado'})
        this.close()
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.vacunacion = null
        this.codhabilitacion_ips = null
        this.$refs.formVacunacion.reset()
      }, 400)
    },
    getComplementos(){
      this.axios.get('complementos-vacunas').then(response => {
        this.complementos.prestadores_vacunas = response.data.prestadores_vacunas
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al recuperar los complementos del proceso de asignación.`,
          error: error
        })
      })
    }
  }
}
</script>

<style scoped>

</style>