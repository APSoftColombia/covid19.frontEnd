<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-card-title>
        Tomas Fallidas
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid class="m-5" v-if="muestrasfallidas && muestrasfallidas.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Fecha Toma</th>
                <th>Fecha Reprogramacion</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="(item, indexItem) in muestrasfallidas"
                  :key="indexItem"
              >
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.fecha_toma_prueba ? 'No Tomada: ' + (item.fecha_toma_prueba) : '' }}</v-list-item-title>
                      <v-list-item-title class="body-2">{{ item.user.name }}</v-list-item-title>
                      <v-list-item-title class="body-2">{{ item.razon_no_toma }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ fecha(item.fecha_reprogramacion) }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.observaciones }}</v-list-item-title>
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
    name: "MuestrasFallidas",
    data: () => ({
      muestrasfallidas: null,
      dialog: false
    }),
    methods: {
      open(muestra) {
        this.muestrasfallidas = this.clone(muestra)
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