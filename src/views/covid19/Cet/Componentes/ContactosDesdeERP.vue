<template>
    <v-dialog v-model="dialogContactosTamizajes" max-width="550px">
      <v-card>
        <v-card-title>
          Creacion de contactos desde ERP
        </v-card-title>
        <v-card-text class="font-weight-medium">
          ¿Desea crear los contactos vinculados al ERP de este confirmado?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialogContactosTamizajes = false" :loading="loadingBtn" :disabled="loadingBtn">
            <v-icon>mdi-close</v-icon>
            <span>Cerrar</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="crearContactos" :loading="loadingBtn" :disabled="loadingBtn" class="white--text" color="teal">
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
      dialogContactosTamizajes: false,
      loadingBtn: false,
      contactosIDS: []
    }),
    methods: {
      open(contactosIDS, confirmadoCompletado, confirmadoID) {
        this.contactosIDS = this.clone(contactosIDS)
        this.confirmadoCompletado = confirmadoCompletado
        this.dialogContactosTamizajes = true
        this.confirmadoID = confirmadoID
      },
      close() {
        this.dialogContactosTamizajes = false
      },
      crearContactos(){
        this.loadingBtn = true
        if(this.confirmadoCompletado !== null){
          this.axios.post(`crear-contactos-from-tamizajes/${this.confirmadoID}`, this.contactosIDS.ids).then(response => {
            this.$store.commit('snackbar', {
              color: 'success',
              message: response.data.message,
            })
            this.loadingBtn = false
            this.$emit('reload', this.confirmadoID)
            this.$emit('reloadTieneTamizajeConContactos', this.confirmadoID)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: ` al crear contactos desde ERP`, error: error})
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
