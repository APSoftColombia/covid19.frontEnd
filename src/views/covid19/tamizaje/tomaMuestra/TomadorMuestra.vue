<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-card-title>
        Toma de muestra
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid>
        <ValidationObserver ref="formToma" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row>
            <v-col cols="6" class="py-0">
              <c-date
                  v-model="fecha_toma_prueba"
                  rules="required"
                  label="Fecha de toma"
                  name="fecha de toma"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="6" class="py-0">
              <v-menu
                  ref="menu"
                  v-model="menuHora"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="hora"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                      v-model="hora"
                      label="Hora de toma"
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
                    v-model="hora"
                    full-width
                    format="24hr"
                    @click:minute="$refs.menu.save(hora)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <ValidationProvider name="laboratorio remite prueba es requerido" rules="required" v-slot="{ errors, valid }">
                <v-select
                    v-model="laboratorio_id_destino"
                    label="Laboratorio a donde envia la prueba"
                    :items="laboratorios"
                    item-text="laboratorio"
                    item-value="id"
                    outlined
                    :error-messages="errors"
                ></v-select>
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <c-radio
                  v-model="toma_prueba"
                  :items="[{text: 'Si', value: 1}, {text: 'No', value: 0}]"
                  itemValue="value"
                  itemText="text"
                  dense
                  rules="required"
                  name="toma la muestra"
                  label="¿Toma la muestra?"
              ></c-radio>
            </v-col>
            <template v-if="!toma_prueba && toma_prueba !== null">
              <v-col cols="12" class="pb-0">
                <c-select-complete
                    v-model="razon_no_toma"
                    :items="razones_no_toma_muestra || []"
                    rules="required"
                    name="Razon de la no toma de muestra"
                    dense
                    label="Razón por la cual no toma la muestra"
                ></c-select-complete>
              </v-col>
              <v-col cols="12" md="12" class="pb-0 mx-auto" v-if="razon_no_toma == 'Prueba Reprogramada por causa particular'">
                <c-date
                    v-model="fecha_reprogramacion"
                    rules="required"
                    label="Fecha de reprogramación"
                    name="fecha de reprogramación"
                    :min="moment().format('YYYY-MM-DD')"
                />
              </v-col>
            </template>
            <v-col cols="12" class="pb-0">
              <c-text-area
                  v-model="observaciones"
                  label="Observaciones"
                  name="Observaciones"
                  :rules="!toma_prueba ? 'required' : ''"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
        <v-card-actions>
          <v-btn block color="primary" @click.stop="asignar">
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
import {mapGetters} from 'vuex'

export default {
  name: 'TomadorMuestra',
  props: {
    tamizaje: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    menuHora: false,
    dialog: false,
    loading: false,
    id: null,
    hora: null,
    fecha_toma_prueba: null,
    toma_prueba: null,
    razon_no_toma: null,
    observaciones: null,
    razones_no_toma_muestra: null,
    fecha_reprogramacion: null,
    laboratorio_id_destino: null
  }),
  watch: {
    'toma_prueba': {
      handler(val){
        if(!val){
          this.razon_no_toma = null
        }
      }
    },
    'razon_no_toma': {
      handler(val){
        if(val !== 'Prueba Reprogramada por causa particular'){
          this.fecha_reprogramacion = null
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'laboratorios'
    ])
  },
  methods: {
    open(muestra) {
      this.id = muestra && muestra.id ? muestra.id : null
      this.fecha_toma_prueba = muestra && muestra.fecha_toma_prueba ? this.moment(muestra.fecha_toma_prueba).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD')
      this.hora = muestra && muestra.fecha_toma_prueba ? this.moment(muestra.fecha_toma_prueba).format('HH:mm') : this.moment().format('HH:mm')
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.menuHora = false
        this.id = null
        this.hora = null
        this.fecha_toma_prueba = null
        this.toma_prueba = null
        this.razon_no_toma = null
        this.observaciones = null
        this.fecha_reprogramacion = null
        this.laboratorio_id_destino = null
        this.$refs.formToma.reset()
      }, 400)
    },
    asignar() {
      this.$refs.formToma.validate().then(result => {
        if (result) {
          this.loading = true
          let request = null
          if (this.id) {
            request = this.axios.put(`actualizar-pruebas/${this.id}`, {
              id: this.id,
              fecha_toma_prueba: `${this.fecha_toma_prueba} ${this.hora}`,
              toma_prueba: this.toma_prueba,
              razon_no_toma: this.razon_no_toma,
              observaciones: this.observaciones,
              fecha_reprogramacion: this.fecha_reprogramacion,
              laboratorio_id_destino: this.laboratorio_id_destino
            })
          } else {
            request = this.axios.post(`toma-prueba`, {
              fecha_toma_prueba: `${this.fecha_toma_prueba} ${this.hora}`,
              tamizaje_id: this.tamizaje.id,
              toma_prueba: this.toma_prueba,
              razon_no_toma: this.razon_no_toma,
              observaciones: this.observaciones,
              fecha_reprogramacion: this.fecha_reprogramacion,
              laboratorio_id_destino: this.laboratorio_id_destino
            })
          }
          request
              .then(() => {
                this.$emit('guardado')
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Toma registrada correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al registrar la toma de la muestra.`,
                  error: error
                })
              })
        }
      })
    },
    getRazonesNoTomaMuestra(){
      this.axios.get('/ajustes-generales/iniciales').then(response => {
        this.razones_no_toma_muestra = response.data.parametros.razones_no_toma_muestra
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al conseguir parametros`,
          error: error
        })
      })
    },
  },
  created() {
    this.getRazonesNoTomaMuestra()
  }
}
</script>

<style scoped>

</style>