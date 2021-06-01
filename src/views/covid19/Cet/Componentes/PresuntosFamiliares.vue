<template>
  <v-dialog v-model="dialog" persistent max-width="900">
    <v-card>
      <v-card-title>
        Grupo Familiar ADRES
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid class="m-5" v-if="contactos && contactos.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>ID</th>
                <th>Telefono</th>
                <th>Persona</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr
                  v-for="(item, indexItem) in contactos"
                  :key="indexItem"
              >
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-2">{{ item.id }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-2">{{ item.celular }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-2">{{ [item.apellido1, item.apellido2, item.nombre1, item.nombre2].filter(x => x).join(' ') }}</v-list-item-title>
                      <v-list-item-title class="body-2">
                          {{ item.tipoid }} {{ item.identificacion }}
                      </v-list-item-title>
                    </v-list-item-content>
                </td>
                <td>
                  <v-list-item class="pa-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-title class="body-1">{{ item.covid_contacto === 1 ? 'Confirmado' : 'Contacto' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
      <v-card-actions>
          <v-btn @click="dialog = false" :loading="loadingBtn" :disabled="loadingBtn">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="crearContactos" :loading="loadingBtn" :disabled="loadingBtn" class="white--text" color="indigo">
            <v-icon left>fas fa-save</v-icon>
            <span>Aceptar</span>
          </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "PresuntosFamiliares",
    data: () => ({
      contactos: null,
      dialog: false,
      confirmadoCompletado: null,
      loadingBtn: false,
      confirmadoID: null
    }),
    methods: {
      open(contactos, confirmadoCompletado, confirmadoID) {
        this.contactos = this.clone(contactos)
        this.confirmadoCompletado = confirmadoCompletado
        this.dialog = true
        this.confirmadoID = confirmadoID
      },
      close() {
        this.dialog = false
      },
      crearContactos(){
        this.loadingBtn = true
        if(this.confirmadoCompletado !== null){
          this.axios.put(`crear-posibles-contactos/${this.confirmadoID}`, {contactos: this.contactos}).then(response => {
            this.$store.commit('snackbar', {
              color: 'success',
              message: response.data.message,
            })
            this.loadingBtn = false
            this.dialogContactosTamizajes = false
            this.$emit('reload', this.confirmadoID)
            this.$emit('reloadPresuntosContactos', this.confirmadoID)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: ` al crear contactos`, error: error})
            this.loadingBtn = false
          })
        }else{
          this.$store.commit('snackbar', {
            color: 'info',
            message: ` por favor, diligencie la información del confirmado antes de ejecutar esta acción`
          })
          this.loadingBtn = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
