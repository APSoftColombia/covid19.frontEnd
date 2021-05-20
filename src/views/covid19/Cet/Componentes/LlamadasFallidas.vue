<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-card-title>
        Llamadas Fallidas
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid class="m-5" v-if="llamadasFallidas && llamadasFallidas.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Razón no localizacón</th>
                <th>Usuario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="(item, indexItem) in llamadasFallidas"
                  :key="indexItem"
              >
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-2">{{ item.descripcion }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td class="text-center">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-2">{{ item.user.name }}</v-list-item-title>
                      <v-list-item-title class="body-2">
                          {{ tiposDocumentoIdentidad && tiposDocumentoIdentidad.length && item.user.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.user.tipo_documento_identidad_id).tipo : ''}}
                          {{ item.user.numero_documento_identidad }}
                      </v-list-item-title>
                      <v-list-item-title class="body-2">{{ item.user.email }}</v-list-item-title>
                    </v-list-item-content>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ moment(item.created_at).format('DD-MM-YYYY') }} a las {{ moment(item.created_at).format('hh:mm') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";
  export default {
    name: "LlamadasFallidas",
    data: () => ({
      llamadasFallidas: null,
      dialog: false
    }),
    computed: {
      ...mapGetters([
        'tiposDocumentoIdentidad',
      ]),
    },
    methods: {
      open(fallidas) {
        this.llamadasFallidas = this.clone(fallidas)
        this.dialog = true
      },
      close() {
        this.dialog = false
      },
      fecha(fecha){
        if(fecha){
          return this.moment(fecha).format('DD/MM/YYYY')
        }
        return ''
      }
    }
  }
</script>

<style scoped>

</style>
