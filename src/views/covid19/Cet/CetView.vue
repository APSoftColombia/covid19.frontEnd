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
        <v-row>
          <v-spacer></v-spacer>
          <v-tooltip top v-if="hasContactosERPC">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon text @click="dialogContactosTamizajes = true">
                <v-icon color="warning">fas fa-exclamation-circle</v-icon>
              </v-btn>
            </template>
            <span>Este confirmado tiene tamizaje con contactos vinculados</span>
          </v-tooltip>
          <v-tooltip top v-if="presuntosContactos && presuntosContactos.length">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon text @click="openPresuntosFamiliares">
                <v-icon color="info">fas fa-exclamation-circle</v-icon>
              </v-btn>
            </template>
            <span>Se ha encontrado un grupo familiar para este confirmado</span>
          </v-tooltip>
          <v-tooltip top v-if="hasContactosERPC && contactosIDS.tamizaje_id">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon text @click="goToTamizaje()">
                <v-icon color="info">fas fa-file-medical-alt</v-icon>
              </v-btn>
            </template>
            <span>Ir a ERP</span>
          </v-tooltip>
        </v-row>
        <v-row no-gutters>
          <contactos-tables
              :abierto="true"
              :afiliado="data"
              @refreshAfiliado="getInfoAfiliado"
          ></contactos-tables>
          <seguimiento
              ref="seguimiento"
          ></seguimiento>
        </v-row>
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
              <v-btn @click="crearContactos" :loading="loadingBtn" :disabled="loadingBtn" class="white--text" color="indigo">
                <v-icon left>fas fa-save</v-icon>
                <span>Aceptar</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <!--<v-divider class="pa-0 ma-0"></v-divider>
      <v-card-actions class="justify-center">
        <v-btn block text @click="close">Cerrar</v-btn>
      </v-card-actions>-->
      <app-section-loader :status="loading"></app-section-loader>
      <presuntos-familiares
        ref="presuntosFamiliares"
        @reload="getInfoAfiliado"
        @reloadPresuntosContactos="getTienePosiblesContactos"
      />
    </v-card>
  </v-dialog>
</template>

<script>
  const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
  const ContactosTables = () => import('./Componentes/ContactosTables')
  const PresuntosFamiliares = () => import('./Componentes/PresuntosFamiliares')
  export default {
    name: "AñadirContactos",
    components: {
      ContactosTables,
      Seguimiento,
      PresuntosFamiliares
    },
    data: () => ({
      dialog: false,
      dialogContactosTamizajes: false,
      data: [],
      loading: false,
      loadingBtn: false,
      hasContactosERP: false,
      contactosIDS: null,
      presuntosContactos: []
    }),
    computed: {
      hasContactosERPC(){
        return this.hasContactosERP
      }
    },
    methods: {
      open(id = null){
        if(id){
          this.getTieneTamizajeConContactos(id)
          this.dialog = true
          this.getInfoAfiliado(id)
          this.getTienePosiblesContactos(id)
        }
      },
      goToTamizaje(){
        this.$refs.seguimiento.open(this.contactosIDS.tamizaje_id)
      },
      close(){
        this.$emit('reloadTable')
        this.dialog = false
        this.contactosIDS = null
        this.hasContactosERP = false
      },
      openPresuntosFamiliares(){
          this.$refs.presuntosFamiliares.open(this.presuntosContactos, this.data.confirmado.producto_financiero, this.data.confirmado.id)
      },
      getInfoAfiliado(id){
        this.loading = true
        this.axios.get(`infocets/${id}`).then(response => {
          this.data = response.data
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$store.commit('snackbar', {color: 'error', message: ` al mostrar informacion del afiliado`, error: error})
        })
      },
      getTieneTamizajeConContactos(id){
        this.axios.get(`tiene-tamizaje-con-contactos/${id}`).then(response => {
          this.contactosIDS = response.data
          if(this.contactosIDS && this.contactosIDS.ids && this.contactosIDS.ids.length){
            this.hasContactosERP = true
          }else{
            this.hasContactosERP = false
          }
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: ` al conseguir contactos de ERP`, error: error})
        })
      },
      getTienePosiblesContactos(id){
        this.axios.get(`posibles-contactos/${id}`).then(response => {
          this.presuntosContactos = response.data
        }).catch(error => {
          this.$store.commit('snackbar', {color: 'error', message: ` al conseguir presuntos contactos`, error: error})
        })
      },
      crearContactos(){
        this.loadingBtn = true
        if(this.data.confirmado.producto_financiero !== null){
          this.axios.post(`crear-contactos-from-tamizajes/${this.data.confirmado.id}`, this.contactosIDS.ids).then(response => {
            this.$store.commit('snackbar', {
              color: 'success',
              message: response.data.message,
            })
            this.loadingBtn = false
            this.dialogContactosTamizajes = false
            this.getTieneTamizajeConContactos(this.data.confirmado.id)
            this.getInfoAfiliado(this.data.confirmado.id)
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
