<template>
  <v-dialog v-model="dialog" persistent max-width="1020">
    <v-card class="pt-3">
      <template v-if="value">
        <v-card-text class="text-center"
                     :class="value.mensaje && value.mensaje.id === 1 ? 'green--text' : 'orange--text'">
          <p class="headline mb-0">{{ value.mensaje ? value.mensaje.mensaje : '' }}</p>
        </v-card-text>
        <v-card-text>
          <v-list two-line class="notification-wrap">
            <v-list-item
                style="border-bottom: none !important;"
            >
              <v-list-item-avatar class="my-1">
                <v-icon large color="primary">
                  {{ value.referencias[0].sexo === 'M' ? 'mdi mdi-face' : value.referencias[0].sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi-account' }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content class="pa-0">
                <v-list-item-title>
                  <h6 class="mb-0 text-justify">
                    {{
                      [value.referencias[0].nombre1, value.referencias[0].nombre2, value.referencias[0].apellido1, value.referencias[0].apellido2].filter(x => x).join(' ')
                    }}
                  </h6>
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                  {{
                    tiposDocumentoIdentidad && value.referencias[0].tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === value.referencias[0].tipo_identificacion).tipo : ''
                  }}
                  {{
                    value.referencias[0].identificacion
                  }}
                  {{ value.referencias[0].celular ? ', Cel. ' + value.referencias[0].celular : '' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Fecha</th>
                <th class="text-left">Estado</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, indexItem) in value.referencias" :key="indexItem">
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{on}">
                      <v-btn v-on="on" color="primary" @click="$emit('verReferencia', item)">{{ item.id }}</v-btn>
                    </template>
                    <span>Ver detalle</span>
                  </v-tooltip>
                </td>
                <td>
                  {{ moment(item.created_at).format('DD/MM/YYYY') }}
                </td>
                <td>
                  {{ item.estado }}
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
  name: 'DialogReferenciasAfiliado',
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