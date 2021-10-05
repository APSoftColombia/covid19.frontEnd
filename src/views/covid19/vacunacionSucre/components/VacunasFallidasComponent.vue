<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-card-title>
        Dosis Fallidas
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid class="m-5" v-if="vacunasFallidas && vacunasFallidas.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Causa</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="(item, indexItem) in vacunasFallidas"
                  :key="indexItem"
              >
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.id ? item.id : '' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.created_at ? moment(item.created_at).format('DD/MM/YYYY HH:mm') : '' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.motivo_disistimiento ? item.motivo_disistimiento : '' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.observaciones ? item.observaciones : 'Sin observaciones' }}</v-list-item-title>
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
  export default {
    name: "VacunasFallidasComponent",
    data: () => ({
      vacunasFallidas: null,
      dialog: false
    }),
    methods: {
      open(muestra) {
        this.vacunasFallidas = this.clone(muestra)
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