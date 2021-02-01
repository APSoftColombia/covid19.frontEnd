<template>
  <v-dialog v-model="dialog" persistent max-width="420">
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
            <v-col cols="12" class="py-0">
              <c-date
                  v-model="fecha_toma_prueba"
                  rules="required"
                  label="Fecha de toma"
                  name="fecha de toma"
                  :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" class="pb-0">
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
    fecha_toma_prueba: null
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal'
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
              fecha_toma_prueba: `${this.fecha_toma_prueba} ${this.hora}`
            })
          } else {
            request = this.axios.post(`toma-prueba`, {
              fecha_toma_prueba: `${this.fecha_toma_prueba} ${this.hora}`,
              tamizaje_id: this.tamizaje.id
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
    }
  }
}
</script>

<style scoped>

</style>