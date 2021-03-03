<template>
  <v-dialog v-model="dialog" persistent max-width="620">
    <v-card>
      <v-card-title>
        Aplicación de vacuna
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid v-if="vacuna">
        <ValidationObserver ref="formVacuna" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row class="mt-3">
            <v-col cols="12" md="6" class="pb-0">
              <c-date
                  v-model="vacuna.fecha"
                  label="Fecha"
                  rules="required"
                  name="fecha"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-menu
                  ref="menu"
                  v-model="menuHora"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="vacuna.hora"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="vacuna.hora"
                      label="Hora"
                      prepend-inner-icon="mdi-clock-time-four-outline"
                      readonly
                      outlined
                      dense
                      v-bind="attrs"
                      v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                    scrollable
                    v-if="menuHora"
                    v-model="vacuna.hora"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menu.save(vacuna.hora)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <c-radio
                  v-model="vacuna.aplica_vacuna"
                  :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                  itemValue="value"
                  itemText="text"
                  dense
                  rules="required"
                  name="aplica la vacuna"
                  label="¿Aplica la vacuna?"
              ></c-radio>
            </v-col>
            <template v-if="vacuna.aplica_vacuna">
              <v-col cols="12" class="pb-0">
                <c-select-complete
                    v-model="vacuna.vacuna_id"
                    :items="complementos.vacunas || []"
                    rules="required"
                    name="Tipo de Vacuna"
                    dense
                    label="Tipo de Vacuna"
                    item-text="nombre"
                    item-value="id"
                    :hint="(vacuna.vacuna_id && complementos.vacunas && complementos.vacunas.length && complementos.vacunas.find(x => x.id === vacuna.vacuna_id)) ? complementos.vacunas.find(x => x.id === vacuna.vacuna_id).laboratorio : ''"
                />
              </v-col>
              <v-col cols="12" class="pb-0">
                <c-select-complete
                    v-model="vacuna.codhabilitacion_ips"
                    :items="complementos.prestadores_vacunas || []"
                    rules="required"
                    name="IPS que Aplica"
                    dense
                    label="IPS que Aplica"
                    item-text="nombre"
                    item-value="codigohabilitacion"
                    :hint="(vacuna.codhabilitacion_ips && complementos.prestadores_vacunas && complementos.prestadores_vacunas.length && complementos.prestadores_vacunas.find(x => x.codigohabilitacion === vacuna.codhabilitacion_ips)) ? `Cod: ${complementos.prestadores_vacunas.find(x => x.codigohabilitacion === vacuna.codhabilitacion_ips).codigohabilitacion}` : ''"
                />
              </v-col>
              <v-col class="pb-0" cols="12">
                <c-texto
                    v-model="vacuna.vacunador"
                    label="Vacunador"
                    rules="required"
                    name="Vacunador"
                    upper-case
                >
                </c-texto>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12" class="pb-0">
                <c-select-complete
                    v-model="vacuna.causa_id"
                    :items="complementos.causas_no_vacunacion || []"
                    rules="required"
                    name="Razon de la no aplicación de la vacuna"
                    dense
                    label="Razon de la no aplicación de la vacuna"
                    item-text="descripcion"
                    item-value="id"
                ></c-select-complete>
              </v-col>
            </template>
            <v-col cols="12" class="pb-0">
              <c-text-area
                  v-model="vacuna.observaciones"
                  label="Observaciones"
                  name="Observaciones"
                  :rules="!vacuna.aplica_vacuna ? 'required' : ''"
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
import models from 'Views/covid19/vacunacion/models'
import {mapGetters} from 'vuex'

export default {
  name: 'RegistroVacuna',
  props: {
    vacunacion: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    menuHora: false,
    dialog: false,
    loading: false,
    vacuna: null,
    complementos: {
      causas_no_vacunacion: [],
      priorizaciones: [],
      vacunas: [],
      prestadores_vacunas: []
    }
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal'
    ])
  },
  watch: {
    'vacuna.aplica_vacuna': {
      handler(val){
        if(val){
          this.vacuna.causa_id = null
        } else {
          this.vacuna.codhabilitacion_ips = null
          this.vacuna.vacuna_id = null
          this.vacuna.vacunador = null
        }
      },
      immediate: false
    }
  },
  methods: {
    open(vacuna) {
      this.getComplementos()
      if(vacuna) {
        this.vacuna = this.clone(vacuna)
      } else {
        this.vacuna = this.clone(models.vacuna)
      }
      this.vacuna.vacunacion_id = this.vacunacion.id
      this.vacuna.fecha = vacuna && vacuna.fecha ? this.moment(vacuna.fecha).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD')
      this.vacuna.hora = vacuna && vacuna.hora ? this.moment(vacuna.hora).format('HH:mm') : this.moment().format('HH:mm')
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.vacuna = null
        this.$refs.formVacuna.reset()
      }, 400)
    },
    guardar() {
      this.$refs.formVacuna.validate().then(result => {
        if (result) {
          this.loading = true
          let copiaData = this.clone(this.vacuna)
          let request = copiaData.id
              ? this.axios.put(copiaData.aplica_vacuna ? `dosis/${copiaData.id}` : `novacunaciones/${copiaData.id}`, copiaData)
              : this.axios.post(copiaData.aplica_vacuna ? 'dosis' : 'novacunaciones', copiaData)
          request
              .then(() => {
                this.$emit('guardado')
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Vacuna registrada correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al registrar la vacuna.`,
                  error: error
                })
              })
        }
      })
    },
    getComplementos(){
      this.axios.get('complementos-vacunas').then(response => {
        this.complementos.causas_no_vacunacion = response.data.causas_no_vacunacion
        this.complementos.priorizaciones = response.data.priorizaciones
        this.complementos.vacunas = response.data.vacunas
        this.complementos.prestadores_vacunas = response.data.prestadores_vacunas
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al recuperar los complementos del proceso de vacunación.`,
          error: error
        })
      })
    }
  }
}
</script>

<style scoped>

</style>