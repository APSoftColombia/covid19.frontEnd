<template>
  <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-clipboard-list</v-icon>
        <v-toolbar-title id="inicio">{{`Caso No. ${ this.data && this.data.confirmado ? data.confirmado.numero_caso : '' }`}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <!--
          <datos-afiliado
              :afiliado="data.confirmado"
              :abierto="true"
          ></datos-afiliado>
          -->
          <contactos-tables
              :abierto="true"
              :afiliado="data"
              @refreshAfiliado="getInfoAfiliado"
          ></contactos-tables>
        </v-row>
      </v-container>
      <!--<v-divider class="pa-0 ma-0"></v-divider>
      <v-card-actions class="justify-center">
        <v-btn block text @click="close">Cerrar</v-btn>
      </v-card-actions>-->
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
  //const DatosAfiliado = () => import('./Componentes/DatosAfiliado')
  const ContactosTables = () => import('./Componentes/ContactosTables')
  export default {
    name: "AñadirContactos",
    components: {
      //DatosAfiliado,
      ContactosTables
    },
    data: () => ({
      dialog: false,
      data: [],
      loading: false
    }),
    methods: {
      open(id = null){
        if(id){
          this.dialog = true
          this.getInfoAfiliado(id)
        }
      },
      close(){
        this.dialog = false
      },
      getInfoAfiliado(id){
        this.loading = true
        this.axios.get(`infocets/${id}`).then(response => {
          this.data = response.data
          this.$emit('reloadTable')
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'error', message: ` al mostrar informacion del afiliado`, error: error})
        })
      }
    }
  }
</script>

<style scoped>

</style>