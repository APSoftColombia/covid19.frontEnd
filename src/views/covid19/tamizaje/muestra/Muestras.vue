<template>
  <v-card flat>
    <v-toolbar dark color="error" dense>
      <v-icon left>fas fa-vials</v-icon>
      <v-toolbar-title>Muestras</v-toolbar-title>
      <template
          v-if="permisos.muestraCrear && editable && (!tamizaje.muestras.length || (tamizaje.muestras.length && this.tamizaje.muestras[0].resultado !== null))">
        <v-spacer></v-spacer>
        <v-btn dark @click="agregarMuestra" color="error darken-3">
          <v-icon left>mdi-plus</v-icon>
          Agregar muestra
        </v-btn>
      </template>
    </v-toolbar>
    <v-card-text class="text-center font-lg" v-if="!tamizaje.muestras.length">
      No registra muestras
    </v-card-text>
    <v-container fluid v-else class="py-0">
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12" class="mx-auto">
          <v-card
              v-for="(muestra, muestraIndex) in tamizaje.muestras"
              :key="`muestra${muestraIndex}`"
              class="mb-4"
          >
            <v-toolbar dense elevation="0" color="blue-grey lighten-5">
              <v-toolbar-title>
                <v-list-item class="pa-0" v-if="muestra.deleted_at">
                  <v-list-item-content class="pa-0">
                    <v-list-item-title class="font-weight-bold">Muestra No. {{ tamizaje.muestras.length - muestraIndex }}</v-list-item-title>
                    <v-list-item-subtitle class="red--text">El registro ya no se encuentra en sismuestras a partir del {{ moment(muestra.deleted_at).format('DD/MM/YYYY') }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <template v-else>
                  Muestra No. {{ tamizaje.muestras.length - muestraIndex }}
                </template>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <template v-if="permisos.muestraCrear && (muestraIndex === 0)">
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="orange" v-on="on" @click.stop="editarMuestra(muestra)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </template>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <div class="pb-4">
                    <v-alert v-if="datosPendientes && (muestraIndex === 0)" dense outlined color="orange" type="error" class="mb-0">
                      Hay datos por diligenciar en la muestra
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list three-line-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="cyan darken-4">fas fa-vial</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Toma de la muestra</v-list-item-subtitle>
                        <p class="mb-0">Lugar: <strong>{{ [muestra.lugar_toma, muestra.lugar_toma_muestra].filter(x => x).join(' - ') }}</strong></p>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Fecha: {{ muestra.fecha_toma ? moment(muestra.fecha_toma).format('DD/MM/YYYY') : '-'}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Tipo: {{ muestra.tipo }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list two-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="error">fas fa-hospital</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Tomador</v-list-item-subtitle>
                        <v-list-item-title>
                          <h6 class="mb-0">{{ tomadores && muestra.tomador_muestra_id ? tomadores.find(x => x.id === muestra.tomador_muestra_id).institucion : muestra.tomado_por }}</h6>
                        </v-list-item-title>
                        <p v-if="muestra.ambito" class="mb-0">Ámbito: <strong>{{ muestra.ambito }}</strong></p>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Medico: {{ muestra.nombre_tomador }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list two-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="success">fas fa-building</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Laboratorio</v-list-item-subtitle>
                        <v-list-item-title>
                          <h6 class="mb-0">{{ muestra.laboratorio_id && laboratorios ? laboratorios.find(x => x.id === muestra.laboratorio_id).laboratorio : muestra.laboratorio }}</h6>
                        </v-list-item-title>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Fecha procesamiento: {{ muestra.fecha_procesamiento ? moment(muestra.fecha_procesamiento).format('DD/MM/YYYY') : '-'}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Fecha de recepción: {{ muestra.fecha_recepcion_procesamiento ? moment(muestra.fecha_recepcion_procesamiento).format('DD/MM/YYYY') : '-'}}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list two-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="indigo">fas fa-poll-h</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Resultado</v-list-item-subtitle>
                        <template v-if="muestra.resultado !== null">
<!--                          <v-list-item-title>-->
<!--                            <h6 class="mb-0">{{ muestra.resultado === null ? 'Pendiente' : tiposResultadosCovid.find(x => x.value === muestra.resultado).text }}</h6>-->
<!--                          </v-list-item-title>-->
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                            Fecha: {{ muestra.fecha_resultado ? moment(muestra.fecha_resultado).format('DD/MM/YYYY') : '-' }}
                          </v-list-item-subtitle>
                        </template>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          <v-tooltip top :disabled="muestra.resultado === null">
                            <template v-slot:activator="{on}">
                              <v-btn class="caption font-weight-medium" small v-on="on" :dark="muestra.resultado !== null"
                                  :color="muestra.resultado === null ? '' : tiposResultadosCovid.find(x => x.value === muestra.resultado).color"
                                  @click="descargarResultado(muestra, (tamizaje.muestras.length - muestraIndex))">
                                {{ muestra.resultado === null ? 'Pendiente' : tiposResultadosCovid.find(x => x.value === muestra.resultado).text }}
                                <v-icon v-if="muestra.path_resultado" right>mdi-file-download</v-icon>
                              </v-btn>
                            </template>
                            <span>{{ permisos.muestraDescargar ? muestra.path_resultado ? 'Descargar Archivo' : 'No hay archivo para descargar' : 'No tiene permisos para descargar resultados' }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list two-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="teal">far fa-calendar-alt</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Notificación de resultados</v-list-item-subtitle>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          <span>a EPS:</span> {{ muestra.fecha_notificacion_eps ? moment(muestra.fecha_notificacion_eps).format('DD/MM/YYYY') : '-'}}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          <span>a afiliado:</span> {{ muestra.fecha_notificacion_afiliado ? moment(muestra.fecha_notificacion_afiliado).format('DD/MM/YYYY') : '-'}}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-list two-line class="notification-wrap">
                    <v-list-item @click="click = null" style="border-bottom: none !important;">
                      <v-list-item-avatar class="my-1 align-self-center">
                        <v-icon color="light-blue">fas fa-user</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">Usuario que registra</v-list-item-subtitle>
                        <template v-if="muestra.usuario">
                          <v-list-item-title>
                            <h6 class="mb-0">{{ muestra.usuario.name }}</h6>
                          </v-list-item-title>
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                            {{ muestra.usuario.email }} {{ muestra.usuario.telefono }}
                          </v-list-item-subtitle>
                        </template>
                        <span v-else>-</span>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <registro-muestra
        v-if="permisos.muestraCrear"
        ref="registroMuestra"
        @guardado="item => muestraGuardada(item)"
    >
    </registro-muestra>
    <app-section-loader :status="loading"></app-section-loader>
  </v-card>
</template>

<script>
  import {mapGetters} from "vuex";

  const RegistroMuestra = () => import('Views/covid19/tamizaje/muestra/RegistroMuestra')
  export default {
    name: 'Muestras',
    components: {
      RegistroMuestra
    },
    props: {
      tamizaje: {
        type: Object,
        default: null
      },
      editable: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      loading: false
    }),
    computed: {
      ...mapGetters([
        'tomadores',
        'laboratorios',
        'tiposResultadosCovid'
      ]),
      permisos() {
        return this.$store.getters.getPermissionModule('covid')
      },
      datosPendientes() {
        if(this && this.tamizaje && this.tamizaje.muestras && this.tamizaje.muestras.length) {
          let muestraCero = this.clone(this.tamizaje.muestras[0])
          delete muestraCero.laboratorio
          delete muestraCero.tomado_por
          delete muestraCero.lugar_toma
          return Object.values(muestraCero).filter(x => x === null).length > 0
        } else {
          return false
        }
      }
    },
    methods: {
      agregarMuestra() {
        this.$refs.registroMuestra.open(null, this.tamizaje)
      },
      editarMuestra(muestra) {
        this.$refs.registroMuestra.open(this.clone(muestra), this.tamizaje)
      },
      muestraGuardada(item) {
        this.$emit('change', item)
      },
      descargarResultado(muestra, numero) {
        if (this.permisos.muestraDescargar && muestra.path_resultado) {
          this.loading = true
          this.axios({
            url: `muestras/${muestra.id}/resultado`,
            method: 'GET',
            responseType: 'blob'
          })
              .then((response) => {
                console.log('numero', numero)
                const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
                window.open(url, '_blank')
                this.loading = false
              })
              .catch((error) => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al descargar el archivo.`, error: error})
              })
        }
      }
    }
  }
</script>

<style>
  .toolbar-muestra {
    height: 48px !important;
  }

  .toolbar-muestra > .v-toolbar__content {
    padding: 0 !important;
  }
</style>