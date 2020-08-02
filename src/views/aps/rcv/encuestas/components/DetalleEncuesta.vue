<template>
    <v-dialog
            v-model="dialog"
            max-width="920"
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
                <v-row>
                  <definicion1></definicion1>
                    <v-col cols="12">
                      {{encuesta}}
<!--                        <v-list two-line class="notification-wrap">-->
<!--                            <v-list-item @click="click = null" style="border-bottom: none !important;">-->
<!--                                <v-list-item-avatar class="my-1 align-self-center">-->
<!--                                    <v-icon color="error">fas fa-user-secret</v-icon>-->
<!--                                </v-list-item-avatar>-->
<!--                                <v-list-item-content class="pa-0">-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">Quien Reporta</v-list-item-subtitle>-->
<!--                                    <v-list-item-title><h6 class="mb-0">{{encuesta.nombre_reportante}}</h6></v-list-item-title>-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">-->
<!--                                        <v-icon small>mdi-phone</v-icon>-->
<!--                                        {{encuesta.celular_reportante}}-->
<!--                                    </v-list-item-subtitle>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                            <v-list-item @click="click = null" style="border-bottom: none !important;">-->
<!--                                <v-list-item-avatar class="my-1 align-self-center">-->
<!--                                    <v-icon color="teal" large>{{encuesta.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face'}}</v-icon>-->
<!--                                </v-list-item-avatar>-->
<!--                                <v-list-item-content class="pa-0">-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">Posible Caso</v-list-item-subtitle>-->
<!--                                    <v-list-item-title><h6 class="mb-0">{{encuesta.nombres}}</h6></v-list-item-title>-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">-->
<!--                                        {{[encuesta.edad ? `${encuesta.edad} Años` : null, encuesta.celular ? `Celular: ${encuesta.celular}` : null].filter(x => x).join(', ')}}-->
<!--                                    </v-list-item-subtitle>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                            <v-list-item @click="click = null" style="border-bottom: none !important;">-->
<!--                                <v-list-item-avatar class="my-1 align-self-center">-->
<!--                                    <v-icon color="purple">fas fa-map-signs</v-icon>-->
<!--                                </v-list-item-avatar>-->
<!--                                <v-list-item-content class="pa-0">-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">Ubicación Posible Caso</v-list-item-subtitle>-->
<!--                                    <v-list-item-title><h6 class="mb-0">{{encuesta.direccion}}</h6></v-list-item-title>-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">-->
<!--                                        {{encuesta.municipio_id && divipol ? divipol.find(x => x.id === encuesta.municipio_id).nombre : ''}}-->
<!--                                    </v-list-item-subtitle>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                            <v-list-item @click="click = null" style="border-bottom: none !important;" v-if="encuesta.observaciones">-->
<!--                                <v-list-item-content>-->
<!--                                    <h6 class="mb-0 info&#45;&#45;text text&#45;&#45;darken-3">Observaciones</h6>-->
<!--                                    <p class="fs-12 mb-0 fw-normal">{{encuesta.observaciones}}</p>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                            <v-list-item @click="click = null" v-if="encuesta.user" style="border-bottom: none !important;">-->
<!--                                <v-list-item-avatar class="my-1 align-self-center">-->
<!--                                    <v-icon color="primary">fas fa-user</v-icon>-->
<!--                                </v-list-item-avatar>-->
<!--                                <v-list-item-content class="pa-0">-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">Usuario que Registra</v-list-item-subtitle>-->
<!--                                    <v-list-item-title><h6 class="mb-0">{{encuesta.user.name}}</h6></v-list-item-title>-->
<!--                                    <v-list-item-subtitle class="grey&#45;&#45;text fs-12 fw-normal">-->
<!--                                        <v-icon small>mdi-phone</v-icon>-->
<!--                                        {{encuesta.user.telefono}}-->
<!--                                    </v-list-item-subtitle>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                        </v-list>-->
                    </v-col>
                </v-row>
            </v-container>
          <v-divider class="pa-0 ma-0"></v-divider>
          <v-card-actions class="justify-center">
            <v-btn block text @click="close">Cerrar</v-btn>
          </v-card-actions>
          <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Definicion1 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion1'
    export default {
        name: 'DetalleEncuesta',
      components: {
        Definicion1
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