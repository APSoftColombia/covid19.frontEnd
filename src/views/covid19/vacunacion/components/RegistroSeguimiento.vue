<template>
  <v-dialog v-model="dialog" persistent max-width="620">
    <v-card>
      <v-card-title>
        Seguimiento de Vacunacion
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container v-if="seguimiento">
        <ValidationObserver ref="formSeguimiento" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="12">
              <c-radio
                  v-model="seguimiento.fue_vacunado"
                  :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                  itemValue="value"
                  itemText="text"
                  dense
                  rules="required"
                  name="aplica la vacuna"
                  label="¿Fue Vacunado?"
              ></c-radio>
            </v-col>
            <v-col cols="12">
              <c-radio
                  v-model="seguimiento.presento_sintomas"
                  :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                  itemValue="value"
                  itemText="text"
                  dense
                  rules="required"
                  name="presento sintomas vacuna"
                  label="¿Presento sintomas adversos a la Vacuna?"
              ></c-radio>
            </v-col>
            <template v-if="seguimiento.presento_sintomas">
              <v-col cols="12" class="pb-0">
                <c-select-complete
                    v-model="seguimiento.sintoma"
                    :items="sintomas"
                    rules="required"
                    name="Sintomas"
                    dense
                    label="Seleccione un sintoma"
                    item-text="nombre"
                    item-value="id"
                />
              </v-col>
              <v-col cols="12" class="pb-0" v-if="seguimiento.sintoma == 'Otro'">
                <c-text-area
                    v-model="seguimiento.otro_sintoma"
                    label="¿Que otro sintoma?"
                    name="otro sintoma"
                    rules="required"
                />
              </v-col>
            </template>
            <v-col cols="6">
              <c-radio
                  v-model="seguimiento.agen_2da_dosis"
                  :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                  itemValue="value"
                  itemText="text"
                  dense
                  rules="required"
                  name="agendo 2da dosis"
                  label="¿Se agenda segunda dosis?"
              ></c-radio>
            </v-col>
            <v-col cols="12" md="12" class="pb-0" v-if="seguimiento.agen_2da_dosis">
              <c-date
                  v-model="seguimiento.fecha_2da_dosis"
                  label="Fecha de Segunda Dosis"
                  rules="required"
                  name="fecha"
              />
            </v-col>
            <v-col cols="12" class="pb-0">
              <c-select-complete
                  v-model="seguimiento.percepcion"
                  :items="percepcion"
                  rules="required"
                  name="percepcion"
                  dense
                  label="Seleccione una opcion de satisfaccion con el proceso de Vacunacion"
                  item-text="nombre"
                  item-value="id"
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

export default {
  name: 'RegistroSeguimiento',
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
    seguimiento: null,
    sintomas: [
      {id: "Fiebre", nombre: "Fiebre"},
      {id: "Escalofrios", nombre: "Escalofrios"},
      {id: "Cansancio", nombre: "Cansancio"},
      {id: "Dolor de cabeza", nombre: "Dolor de cabeza"},
      {id: "Dolor en el sitio de la aplicación", nombre: "Dolor en el sitio de la aplicación"},
      {id: "Otro", nombre: "Otro"},
    ],
    percepcion: [
      {id: "Excelente", nombre: "Excelente"},
      {id: "Bueno", nombre: "Bueno"},
      {id: "Regular", nombre: "Regular"},
      {id: "Malo", nombre: "Malo"},
    ]
  }),
  watch: {
    'seguimiento.agen_2da_dosis': {
      handler(val){
        if(!val){
          this.seguimiento.fecha_2da_dosis = null
        }
      },
      immediate: false
    },
    'seguimiento.presento_sintomas': {
      handler(val){
        if(!val){
          this.seguimiento.sintoma = null
        }
      },
      immediate: false
    },
    'seguimiento.sintoma': {
      handler(val){
        if(val != 'Otro'){
          this.seguimiento.otro_sintoma = null
        }
      },
      immediate: false
    }
  },
  methods: {
    open(seguimiento) {
      if(seguimiento) {
        this.seguimiento = this.clone(seguimiento)
      } else {
        this.seguimiento = this.clone(models.seguimiento)
      }
      this.seguimiento.vacunacion_id = this.vacunacion.id
      this.seguimiento.fecha_2da_dosis = seguimiento && seguimiento.fecha_2da_dosis ? this.moment(seguimiento.fecha_2da_dosis).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD')
      
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.seguimiento = this.clone(models.seguimiento)
        this.$refs.formSeguimiento.reset()
      }, 400)
    },
    guardar() {
      this.$refs.formSeguimiento.validate().then(result => {
        if (result) {
          this.loading = true
          let copiaData = this.clone(this.seguimiento)
          let request = copiaData.id
              ? this.axios.put(`seguimientosVacunas/${copiaData.id}`, copiaData)
              : this.axios.post('seguimientosVacunas', copiaData)
          request
              .then(() => {
                this.$emit('guardadoSeguimiento')
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Seguimiento registrado correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al registrar el Seguimiento.`,
                  error: error
                })
              })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>