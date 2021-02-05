<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-card-title>
        Toma de muestra
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid v-if="muestra">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th>Persona</th>
              <th>Contacto</th>
              <th>Ubicación</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(item, indexItem) in [muestra]"
                :key="indexItem"
            >
              <td>
                <v-list-item class="pa-0">
                  <v-icon color="primary" large class="mr-2">
                    {{ item.sexo === null ? 'mdi mdi-emoticon-happy' : item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman' }}
                  </v-icon>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title class="body-2 text-truncate">
                      {{ [item.nombre].filter(x => x).join(' ') }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2 text-truncate">{{
                        [tiposDocumentoIdentidad && item.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : null, item.identificacion].filter(x => x).join(' ')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <v-list-item class="pa-0">
                  <v-list-item-content class="pa-0">
                    <v-list-item-title class="body-2 text-truncate">Celular: {{
                        item.celular || ''
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2 text-truncate">Email: {{
                        item.email || ''
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <v-list-item class="pa-0">
                  <v-list-item-content class="pa-0">
                    <v-list-item-title class="body-2 text-truncate">{{
                        [municipiosTotal && item.municipio_id ? municipiosTotal.find(x => x.id === item.municipio_id).nombre : null, departamentos && item.departamento_id ? departamentos.find(x => x.id === item.departamento_id).nombre : null].filter(x => x).join(', ')
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2 text-truncate">{{
                        item.direccion || ''
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <ValidationObserver ref="formToma" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
          <v-row class="mt-3">
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
            <template v-if="toma_prueba">
              <v-col cols="12" md="6" class="pb-0">
                <c-date
                    v-model="fecha_toma_prueba"
                    rules="required"
                    label="Fecha de toma"
                    name="fecha de toma"
                    :max="moment().format('YYYY-MM-DD')"
                />
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
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
            </template>
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
            </template>
            <v-col cols="12" class="pb-0">
              <c-text-area
                  v-model="observaciones"
                  rules="required"
                  name="Observaciones"
                  label="Observaciones"
              ></c-text-area>
            </v-col>
          </v-row>
        </ValidationObserver>
        <v-card-actions>
          <v-btn @click.stop="close">
            <v-icon>mdi-close</v-icon>
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="asignar">
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
  name: 'TomarMuestra',
  data: () => ({
    menuHora: false,
    dialog: false,
    loading: false,
    muestra: null,
    id: null,
    hora: null,
    fecha_toma_prueba: null,
    toma_prueba: null,
    razon_no_toma: null,
    observaciones: null,
    razones_no_toma_muestra: null
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal'
    ])
  },
  watch: {
    'toma_prueba': {
      handler(val){
        if(!val){
          this.razon_no_toma = null
        }
      }
    }
  },
  methods: {
    open(muestra) {
      this.muestra = this.clone(muestra)
      this.id = muestra && muestra.prueba_id ? muestra.prueba_id : null
      this.fecha_toma_prueba = muestra && muestra.fecha_toma_prueba ? this.moment(muestra.fecha_toma_prueba).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD')
      this.hora = muestra && muestra.fecha_toma_prueba ? this.moment(muestra.fecha_toma_prueba).format('HH:mm') : this.moment().format('HH:mm')
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.muestra = null
        this.id = null
        this.hora = null
        this.fecha_toma_prueba = null
        this.toma_prueba = null
        this.razon_no_toma = null
        this.observaciones = null
        this.$refs.formToma.reset()
      }, 400)
    },
    asignar() {
      this.$refs.formToma.validate().then(result => {
        if (result) {
          this.loading = true
          this.axios.put(`actualizar-pruebas/${this.id}`, {
            id: this.id,
            fecha_toma_prueba: this.toma_prueba ? this.fecha_toma_prueba + ' ' + this.hora : null,
            toma_prueba: this.toma_prueba,
            razon_no_toma: this.razon_no_toma,
            observaciones: this.observaciones
          })
              .then(() => {
                this.$emit('guardado')
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Fecha de toma registrada correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al registrar la fecha de toma de la muestra.`,
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