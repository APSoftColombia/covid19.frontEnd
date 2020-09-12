<template>
  <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        persistent
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-clipboard-list</v-icon>
                <v-list-item-content class="pa-0">
                    <v-list-item-title class="mb-0"><h6 class="mb-0 title">{{encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Encuesta`}}</h6></v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        {{encuesta.created_at ? moment(encuesta.created_at).format('DD/MM/YYYY HH:mm') : ''}}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
              <datos-afiliado :afiliado="encuesta.afiliado" :abierto="abierto"></datos-afiliado>
              <respuestas-encuesta class="mt-3" :encuesta="encuesta" :abierto="abierto"></respuestas-encuesta>
              <resultados-encuesta class="mt-3" :encuesta="encuesta" :abierto="resultadosOpen"></resultados-encuesta>
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
    import {mapGetters} from 'vuex'
    const ResultadosEncuesta = () => import('Views/aps/rcv/encuestas/components/ResultadosEncuesta')
    const DatosAfiliado = () => import('Views/aps/rcv/encuestas/components/DatosAfiliado')
    const RespuestasEncuesta = () => import('Views/aps/rcv/encuestas/components/RespuestasEncuesta')
    export default {
        name: 'DetalleEncuesta',
      props: {
        resultadosOpen: {
          type: Boolean,
          default: false
        },
        abierto: {
          type: Boolean,
          default: true
        },
      },
      components: {
        ResultadosEncuesta,
        DatosAfiliado,
        RespuestasEncuesta
      },
        data: () => ({
            dialog: false,
            loading: false,
            click: null,
            encuesta: null
        }),
        computed: {
            ...mapGetters([
                'modelEncuestaRCV'
            ])
        },
        created() {
            this.encuesta = this.clone(this.modelEncuestaRCV)
        },
        methods: {
            open(item = null) {
                if (item && item.id) this.getencuesta(item.id)
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.encuesta = this.clone(this.modelEncuestaRCV)
            },
          getencuesta (idencuesta) {
            this.loading = true
            this.axios.get(`rcvs/${idencuesta}`)
                .then(response => {
                  console.log('response get encuesta', response)
                  this.encuesta = response.data
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                })
          },
        }
    }
</script>

<style scoped>

</style>