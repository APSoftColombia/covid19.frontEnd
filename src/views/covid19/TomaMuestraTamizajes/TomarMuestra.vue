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
                      {{ [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ') }}
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
            <v-col cols="12" class="pb-0">
              <c-date
                  v-model="fecha_toma_prueba"
                  rules="required"
                  label="Fecha de toma"
                  name="fecha de toma"
                  :max="moment().format('YYYY-MM-DD')"
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
    dialog: false,
    loading: false,
    muestra: null,
    id: null,
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
      this.muestra = this.clone(muestra)
      this.id = muestra.prueba_id
      this.fecha_toma_prueba = muestra.fecha_toma_prueba
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.muestra = null
        this.id = null
        this.fecha_toma_prueba = null
        this.$refs.formToma.reset()
      }, 400)
    },
    asignar() {
      this.$refs.formToma.validate().then(result => {
        if (result) {
          this.loading = true
          this.axios.put(`actualizar-pruebas/${this.id}`, {
            id: this.id,
            fecha_toma_prueba: this.fecha_toma_prueba
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
    }
  }
}
</script>

<style scoped>

</style>