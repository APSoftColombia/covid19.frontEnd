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
        <v-col cols="12" class="pt-0" v-if="$vuetify.breakpoint.smAndUp">
          <v-timeline dense>
            <v-timeline-item
                v-for="(muestra, muestraIndex) in tamizaje.muestras"
                :key="`muestra${muestraIndex}`"
                color="deep-orange"
            >
              <template v-slot:icon>
                            <span class="white--text">
                                {{ tamizaje.muestras.length - muestraIndex }}
                            </span>
              </template>
              <div class="pb-4">
                <v-alert
                    v-if="datosPendientes && (muestraIndex === 0)"
                    dense
                    outlined
                    color="orange"
                    type="error"
                    class="mb-0"
                >
                  Hay datos por diligenciar en la muestra
                </v-alert>
                <v-toolbar flat class="toolbar-muestra pr-4">
                  <v-toolbar-title>
                    <v-list-item class="pa-0">
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle>Toma de la Muestra</v-list-item-subtitle>
                        <v-list-item-title class="primary--text font-lg">{{ muestra.lugar_toma }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-toolbar-title>
                  <template v-if="permisos.muestraCrear && (muestraIndex === 0)">
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-btn small icon color="orange" v-on="on" @click.stop="editarMuestra(muestra)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                  </template>
                </v-toolbar>
                <span
                    class="subtitle-2"
                    v-text="moment(muestra.fecha_toma).format('DD/MM/YYYY')"
                ></span>
                <div>
                  <div class="mb-2 subtitle-1 primary--text">
                    <v-icon>fas fa-vial</v-icon>
                    {{ muestra.tipo }}
                  </div>
                  <div class="mb-2 subtitle-1 pink--text">
                    <v-icon>fas fa-hospital</v-icon>
                    {{ tomadores && muestra.tomador_muestra_id ? tomadores.find(x => x.id === muestra.tomador_muestra_id).institucion : muestra.tomado_por }}
                  </div>
                  <div class="mb-2 subtitle-1 pink--text" v-if="muestra.nombre_tomador">
                    <v-icon>fas fa-user-md</v-icon>
                    {{ muestra.nombre_tomador }}
                  </div>
                  <v-list-item class="pb-0 px-0">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle>Resultado</v-list-item-subtitle>
                      <v-list-item-action-text>
                        <v-tooltip top :disabled="muestra.resultado === null">
                          <template v-slot:activator="{on}">
                            <v-btn
                                large
                                class="mb-1"
                                v-on="on"
                                :dark="muestra.resultado !== null"
                                :color="muestra.resultado === null ? '' : tiposResultadosCovid.find(x => x.value === muestra.resultado).color"
                                @click="descargarResultado(muestra, (tamizaje.muestras.length - muestraIndex))"
                            >
                              {{
                                muestra.resultado === null ? 'Pendiente' : tiposResultadosCovid.find(x => x.value === muestra.resultado).text
                              }}
                              <v-icon large v-if="muestra.path_resultado" right>mdi-file-download</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ permisos.muestraDescargar ? muestra.path_resultado ? 'Descargar Archivo' : 'No hay archivo para descargar' : 'No tiene permisos para descargar resultados' }}</span>
                        </v-tooltip>
                      </v-list-item-action-text>
                    </v-list-item-content>
                  </v-list-item>
                  <template v-if="muestra.resultado !== null">
                    <div>
                                            <span
                                                class="subtitle-2 my-2"
                                                v-text="muestra.fecha_resultado ? moment(muestra.fecha_resultado).format('DD/MM/YYYY') : ''"
                                            ></span>
                    </div>
                    <div>
                                            <span
                                                class="subtitle-2 my-2"
                                                v-text="muestra.laboratorio_id && laboratorios ? laboratorios.find(x => x.id === muestra.laboratorio_id).laboratorio : muestra.laboratorio"
                                            ></span>
                    </div>
                  </template>
                </div>
              </div>
              <v-divider></v-divider>
            </v-timeline-item>
          </v-timeline>
        </v-col>
        <template v-for="(muestra, muestraIndex) in tamizaje.muestras" v-else>
          <v-col cols="12" md="6" lg="4" class="mx-auto" :key="`muestra${muestraIndex}`">
            <v-card>
              <v-toolbar dense color="deep-orange" flat>
                <v-toolbar-title class="white--text">Muestra {{ tamizaje.muestras.length - muestraIndex }}
                </v-toolbar-title>
                <template v-if="permisos.muestraCrear && (muestraIndex === 0)">
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{on}">
                      <v-btn small icon color="white" v-on="on" @click.stop="editarMuestra(muestra)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                </template>
              </v-toolbar>
              <v-card-text class="pb-0" v-if="datosPendientes && (muestraIndex === 0)">
                <v-alert
                    dense
                    outlined
                    color="orange"
                    type="error"
                    class="mb-0"
                >
                  Hay datos por diligenciar en la muestra
                </v-alert>
              </v-card-text>
              <v-card-title class="pb-0">Toma de la Muestra</v-card-title>
              <v-card-text>
                <div class="title primary--text">
                  {{ muestra.lugar_toma }}
                </div>
                <span
                    class="subtitle-2"
                    v-text="moment(muestra.fecha_toma).format('DD/MM/YYYY')"
                ></span>
                <div class="mb-2 subtitle-1 primary--text">
                  <v-icon>fas fa-vial</v-icon>
                  {{ muestra.tipo }}
                </div>
                <div class="mb-2 subtitle-1 pink--text">
                  <v-icon>fas fa-hospital</v-icon>
                  {{ tomadores && muestra.tomador_muestra_id ? tomadores.find(x => x.id === muestra.tomador_muestra_id).institucion : muestra.tomado_por }}
                </div>
                <div class="mb-2 subtitle-1 pink--text" v-if="muestra.nombre_tomador">
                  <v-icon>fas fa-user-md</v-icon>
                  {{ muestra.nombre_tomador }}
                </div>
              </v-card-text>
              <v-divider class="mx-4 my-0"></v-divider>
              <v-card-title>Resultado</v-card-title>
              <v-card-text class="text-center">
                <v-tooltip top :disabled="muestra.resultado === null">
                  <template v-slot:activator="{on}">
                    <v-btn
                        large
                        class="mb-1"
                        v-on="on"
                        :dark="muestra.resultado !== null"
                        :color="muestra.resultado === null ? '' : tiposResultadosCovid.find(x => x.value === muestra.resultado).color"
                        @click="descargarResultado(muestra, (tamizaje.muestras.length - muestraIndex))"
                    >
                      {{ muestra.resultado === null ? 'Pendiente' : tiposResultadosCovid.find(x => x.value === muestra.resultado).text }}
                      <v-icon large v-if="muestra.path_resultado" right>mdi-file-download</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ permisos.muestraDescargar ? muestra.path_resultado ? 'Descargar Archivo' : 'No hay archivo para descargar' : 'No tiene permisos para descargar resultados' }}</span>
                </v-tooltip>
                <template v-if="muestra.resultado !== null">
                  <div class="my-2 subtitle-1">
                    {{ muestra.fecha_resultado ? moment(muestra.fecha_resultado).format('DD/MM/YYYY') : '' }}
                  </div>
                  <div class="my-2 subtitle-1">
                    {{ muestra.laboratorio_id && laboratorios ? laboratorios.find(x => x.id === muestra.laboratorio_id).laboratorio : muestra.laboratorio }}
                  </div>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
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