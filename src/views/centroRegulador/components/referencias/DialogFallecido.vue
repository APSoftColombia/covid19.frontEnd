<template>
  <v-dialog v-model="dialog" persistent max-width="1020">
    <v-card class="pt-3">
      <template v-if="value">
        <v-card-text class="text-center"
                     :class="value.mensaje && value.mensaje.id === 3 ? 'red--text' : 'orange--text'">
          <p class="headline mb-0">{{ value.mensaje ? value.mensaje.mensaje : '' }}</p>
        </v-card-text>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nombre</th>
                <th class="text-left">Estado</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  {{ value.afiliado.id }}
                </td>
                <td>
                    <v-list two-line class="notification-wrap">
                      <v-list-item
                          style="border-bottom: none !important;"
                      >
                        <v-list-item-avatar class="my-1">
                          <v-icon large color="primary">
                            {{ value.afiliado.sexo === 'M' ? 'mdi mdi-face' : value.afiliado.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi-account' }}
                          </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>
                            <h6 class="mb-0 text-justify">
                              {{
                                [value.afiliado.nombre1, value.afiliado.nombre2, value.afiliado.apellido1, value.afiliado.apellido2].filter(x => x).join(' ')
                              }}
                            </h6>
                          </v-list-item-title>
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                            {{
                              tiposDocumentoIdentidad && value.afiliado.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === value.afiliado.tipo_documento_identidad_id).tipo : ''
                            }}
                            {{
                              value.afiliado.numero_documento_identidad
                            }}
                            {{ value.afiliado.celular ? ', Cel. ' + value.afiliado.celular : '' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                </td>
                <td>
                  {{ value.afiliado.evolucion }}
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </template>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'DialogFallecido',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    esTamizaje() {
      return this.tipo === 'tamizaje'
    },
    ...mapGetters([
      'tiposDocumentoIdentidad'
    ])
  },
  methods: {
    open() {
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
