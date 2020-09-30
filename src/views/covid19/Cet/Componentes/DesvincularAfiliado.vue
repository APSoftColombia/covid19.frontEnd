<template>
  <v-dialog v-model="dialog" persistent max-width="720">
    <template v-slot:activator="{on}">
      <v-btn
          color="red"
          icon
          v-on="on"
          @click.stop="dialog = true"
      >
        <v-icon>far fa-window-close</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Desvinculación de Contacto
      </v-card-title>
      <v-card-text>
        ¿Esta seguro de desvincular al contacto del afiliado?
      </v-card-text>
      <v-card-actions>
        <v-btn @click="dialog = false" :loading="loading" :disabled="loading">
          <v-icon>mdi-close</v-icon>
          <span>Cerrar</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="desvincular" :loading="loading" :disabled="loading" class="white--text" color="indigo">
          <v-icon left>fas fa-save</v-icon>
          <span>Aceptar</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "DesvincularAsociado",
    data: () => ({
      dialog: false,
      loading: false
    }),
    props: {
      contactoID: {
        type: Number,
        default: null
      },
      afiliadoID: {
        type: Number,
        default: null
      }
    },
    methods: {
      desvincular(){
        this.loading = true
        this.axios.put(`vincular-contacto/${this.contactoID}/persona/${this.afiliadoID}`).then(response => {
          response
          this.loading = false
          this.$store.commit('snackbar', {color: 'success', message: `contacto desvinculado con exito`})
          this.dialog = false
          this.$emit('desvinculado')
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'success', message: ` al desvincular contacto`, error:error})
        })
      }
    }
  }
</script>

<style scoped>

</style>