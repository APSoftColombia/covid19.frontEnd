<template>
    <v-card :color="evolucion.fallida ? 'error' : 'primary'">
        <v-toolbar dark :color="evolucion.fallida ? 'error' : 'primary'">
            <v-list-item class="pa-0">
                <v-list-item-avatar color="white">
                    <v-icon :color="evolucion.fallida ? 'error' : 'primary'">fas fa-user-md</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="title">{{evolucion.user ? evolucion.user.name : 'No registra médico'}}</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-chip label small :color="`darken-2 ${evolucion.fallida ? 'error' : 'primary'}`" text-color="white" v-if="evolucion.numero" class="mb-1 elevation-4 mr-2">
                            No. {{evolucion.numero}}
                        </v-chip>
                        {{moment(evolucion.created_at).format('DD/MM/YYYY HH:mm')}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
          <template v-if="index === 0 && permisos.seguimientoPsicologicoEditar">
            <v-spacer/>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn fab color="orange" small dark v-on="on"
                       @click="$emit('editarEvolucion', evolucion.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar Seguimiento</span>
            </v-tooltip>
          </template>
        </v-toolbar>
        <v-row no-gutters class="py-3 px-4 white">
            <v-col cols="12">
                <v-list two-line flat class="notification-wrap">
                    <v-list-item
                            flat
                            style="border-bottom: none !important;"
                            @click="click = null"
                            v-if="evolucion.lugar_evolucion"
                    >
                        <v-list-item-avatar class="my-1">
                            <v-icon color="deep-purple">
                                fas fa-{{evolucion.lugar_evolucion.id === 3 ? 'hospital' : evolucion.lugar_evolucion.id === 2 ? 'clinic-medical' : 'phone-alt'}}
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                            <v-list-item-subtitle class="grey--text fs-12 fw-normal">Tipo de Atención</v-list-item-subtitle>
                            <v-list-item-title><h6 class="mb-0 text-justify">{{evolucion.lugar_evolucion.id === 3 ? 'Atención en ' : ''}}{{evolucion.lugar_evolucion.orden}}</h6></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                  <v-list-item flat style="border-bottom: none !important;" @click="click = null">
                    <v-list-item-avatar class="my-1">
                      <v-icon color="indigo">mdi-calendar-month</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">Fecha del Seguimiento</v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0 text-justify">{{ evolucion.fecha_seguimiento }}</h6></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item flat style="border-bottom: none !important;" @click="click = null">
                    <v-list-item-avatar class="my-1">
                      <v-icon color="red">fas fa-user-tag</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Se Localiza Paciente?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{ evolucion.fallida ? 'No' : 'Si' }}</v-list-item-title>
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal" v-if="evolucion.fallida">Motivo: {{ evolucion.no_efectividad }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
            </v-col>
            <template v-if="!evolucion.fallida">
              <v-col cols="12">
                <v-list two-line flat class="notification-wrap">
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>1</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿DE LAS SIGUIENTES RAZONES EN EL CUMPLIMIENTO DE LOS PROTOCOLOS DE BIOSEGURIDAD ESCOJA CON CUAL DE ESTAS SE IDENTIFICA USTED?</v-list-item-subtitle>
                      <v-list-item-subtitle>
                        <template v-if="evolucion.cumplimiento_protocolos_bioseguridad && evolucion.cumplimiento_protocolos_bioseguridad.length">
                          <v-chip
                              v-for="(chipa, indexChipa) in evolucion.cumplimiento_protocolos_bioseguridad.split(',')"
                              :key="`chipa${indexChipa}`"
                              label
                              small
                              class="white--text elevation-2 mb-1 mr-1"
                              color="indigo"
                          >
                            {{chipa}}
                          </v-chip>
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>2</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Siente que su Salud Mental se encuentra afectada a causa de la situación actual?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{evolucion.afectacion_mental}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>3</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿En estas últimas semanas ha tenido alguna alteración emocional?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold" v-if="evolucion.tiene_alteracion_emocional !== 'Si'">{{evolucion.tiene_alteracion_emocional}}</v-list-item-title>
                      <v-list-item-subtitle v-if="evolucion.tiene_alteracion_emocional === 'Si'">
                        <template v-if="evolucion.alteraciones_emocionales && evolucion.alteraciones_emocionales.length">
                          <v-chip
                              v-for="(chipb, indexChipb) in evolucion.alteraciones_emocionales.split(',')"
                              :key="`chipb${indexChipb}`"
                              label
                              small
                              class="white--text elevation-2 mb-1 mr-1"
                              color="teal darken-2"
                          >
                            {{chipb}}
                          </v-chip>
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>4</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Su grupo familiar se encuentra afectado emocionalmente?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{evolucion.afectacion_emocional_familiar}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>5</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Cuenta con una buena red de apoyo familiar?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{evolucion.red_apoyo_familiar}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>6</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Ha presentado pensamientos negativos?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{evolucion.pensamientos_negativos}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>7</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Siente que ha perdido interés por las actividades rutinarias que realiza?</v-list-item-subtitle>
                      <v-list-item-title class="font-weight-bold">{{evolucion.desinteres_actividades_rutinarias}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                      flat
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1"><strong>8</strong></v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Tiene Intención de Vacunarse?</v-list-item-subtitle>
                      <v-list-item-title v-if="evolucion.acepta_vacuna === 1" class="font-weight-bold">Si</v-list-item-title>
                      <p v-else class="mb-0 subtitle-1 font-weight-bold">{{evolucion.acepta_vacuna === 0 ? `No, ${evolucion.motivo_disistimiento}` : ''}}</p>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </template>
            <v-list two-line class="list-aqua-ripple">
                <v-list-item>
                    <v-list-item-content>
                        <h6 class="mb-0 info--text text--darken-3">Observaciones / Valoración</h6>
                        <p class="fs-12 mb-0 fw-normal">{{evolucion.observaciones}}</p>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-row>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'DatosEvolucion',
        props: {
            evolucion: {
              type: Object,
              default: null
          },
          index: {
              type: Number,
              default: null
          }
        },
        data: () => ({
            click: null
        }),
        computed: {
          permisos() {
            return this.$store.getters.getPermissionModule('covid')
          },
            ...mapGetters([
                'clasificacionesCovid'
            ])
        }
    }
</script>

<style scoped>

</style>