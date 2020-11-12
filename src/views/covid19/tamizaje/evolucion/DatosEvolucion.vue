<template>
    <v-card :color="evolucion.fallida ? 'error' : 'primary'">
        <v-toolbar dark :color="evolucion.fallida ? 'error' : 'primary'">
            <v-list-item class="pa-0">
                <v-list-item-avatar color="white">
                    <v-icon :color="evolucion.fallida ? 'error' : 'primary'">fas fa-user-md</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="title">{{evolucion.medico ? evolucion.medico.name : 'No registra médico'}}</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-chip label small :color="`darken-2 ${evolucion.fallida ? 'error' : 'primary'}`" text-color="white" v-if="evolucion.numero" class="mb-1 elevation-4 mr-2">
                            No. {{evolucion.numero}}
                        </v-chip>
                        {{moment(evolucion.created_at).format('DD/MM/YYYY HH:mm')}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
          <template v-if="index === 0 && permisos.seguimientoEditar">
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
                      <v-list-item-title><h6 class="mb-0 text-justify">{{ evolucion.fallida ? 'No' : 'Si' }}</h6></v-list-item-title>
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal" v-if="evolucion.fallida">Motivo: {{ evolucion.no_efectividad }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              <list-item-clasificacion
                  v-if="evolucion.clasificacion"
                  :clasificacion="evolucion.clasificacion"
                  :version="evolucion.version_lineamientos"
                  :confirmado="evolucion.positivo_covid"
                  @click="val => verAyuda(val)"
              ></list-item-clasificacion>
            </v-col>
            <template v-if="!evolucion.fallida">
                <v-col cols="12">
                    <v-card flat>
                        <v-card-title>
                            <span class="title">Síntomas</span>
                        </v-card-title>
                        <v-card-text class="text-center" v-if="!evolucion.sintomas.length">
                            No registra síntomas
                        </v-card-text>
                        <v-card-text v-else-if="evolucion.fecha_sintomas">
                            <template v-for="(chip, indexChip) in evolucion.sintomas">
                                <v-chip label class="mr-2 mb-2 white--text" color="indigo  lighten-1" :key="`chip${indexChip}`">{{chip.descripcion}}</v-chip>
                            </template>
                        </v-card-text>
                        <v-card-text v-else>
                            <v-row no-gutters>
                                <v-col
                                        cols="12"
                                        sm="6"
                                        md="3"
                                        lg="2"
                                        v-for="(sin, indexSin) in evolucion.sintomas.filter(x => x.solicita_fecha)"
                                       :key="`sinto${indexSin}`"
                                >
                                    <v-card
                                            class="px-2 ma-1"
                                            outlined
                                            tile
                                    >
                                        <v-list-item class="pa-0">
                                            <v-list-item-content class="pa-0">
                                                <v-list-item-title>{{sin.descripcion}}</v-list-item-title>
                                                <v-list-item-subtitle>{{sin.pivot && sin.pivot.fecha_inicio ? moment(sin.pivot.fecha_inicio).format('DD/MM/YYYY') : ''}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="!evolucion.fecha_sintomas">
                    <v-card flat>
                        <v-card-title>
                            <span class="title">Signos de Alarma</span>
                        </v-card-title>
                        <v-card-text class="text-center" v-if="!evolucion.sintomas.find(x => !x.solicita_fecha)">
                            No registra signos de alarma
                        </v-card-text>
                        <v-card-text v-else>
                            <template v-for="(alarma, indexAlarma) in evolucion.sintomas.filter(x => !x.solicita_fecha)">
                                <v-chip label class="mr-2 mb-2 white--text" color="cyan darken-4" :key="`alarma${indexAlarma}`">{{alarma.descripcion}}</v-chip>
                            </template>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-list two-line class="notification-wrap">
                        <v-list-item
                                flat
                                style="border-bottom: none !important;"
                                @click="click = null"
                                v-if="evolucion.fecha_sintomas"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon color="warning">mdi-calendar-month</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Fecha Síntomas</v-list-item-subtitle>
                                <v-list-item-title><h6 class="mb-0 text-justify">{{moment(evolucion.fecha_sintomas).format('DD/MM/YYYY')}}</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                                style="border-bottom: none !important;"
                                @click="click = null"
                                v-if="evolucion.antinflamatorios"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon :color="evolucion.antinflamatorios ? 'success' : 'grey'">{{evolucion.antinflamatorios ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'}}</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-title><h6 class="mb-0 text-justify">¿Consume medicamentos antiinflamatorios o acetaminofén?</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                                style="border-bottom: none !important;"
                                @click="click = null"
                                v-if="evolucion.ibuprofeno"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon :color="evolucion.ibuprofeno ? 'success' : 'grey'">{{evolucion.ibuprofeno ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'}}</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-title><h6 class="mb-0 text-justify">¿Consume o ha consumido Ibuprofeno?</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="evolucion.temperatura !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="deep-orange">fas fa-thermometer-three-quarters</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Temperatura</v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{evolucion.temperatura}}
                            <v-icon>mdi-temperature-celsius</v-icon>
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="evolucion.saturacion_oxigeno !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="purple">fas fa-tachometer-alt</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Saturación de Oxígeno</v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{evolucion.saturacion_oxigeno}}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="evolucion.frecuencia_pulso !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="red">mdi-heart-pulse</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Frecuencia de Pulso</v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{evolucion.frecuencia_pulso}}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="evolucion.linfocitos !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="indigo">fab fa-galactic-republic</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Linfocitos</v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{ evolucion.linfocitos }}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="evolucion.ldh !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="orange">mdi-blood-bag</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">LDH</v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{ evolucion.ldh }}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-col>
                <v-col cols="12" v-if="evolucion.comorbilidades && evolucion.comorbilidades.length">
                    <v-card flat>
                        <v-card-title>
                            <span class="title">Comorbilidades</span>
                        </v-card-title>
                        <v-card-text>
                            <template v-for="(chip, indexChip) in evolucion.comorbilidades">
                                <v-chip label class="mr-2 mb-2 white--text" color="indigo  lighten-1" :key="`chip${indexChip}`">{{chip.descrip}}</v-chip>
                            </template>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="evolucion.hospitalizado || evolucion.evolucion || evolucion.estado_afectacion">
                    <v-list two-line flat class="notification-wrap">
                        <v-list-item
                                flat
                                style="border-bottom: none !important;"
                                @click="click = null"
                                v-if="evolucion.hospitalizado"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon color="error">fas fa-procedures</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Hospitalizado por {{evolucion.causa_hospitalizacion}}</v-list-item-subtitle>
                                <v-list-item-title><h6 class="mb-0 text-justify">{{evolucion.lugar_hospitalizacion}}</h6></v-list-item-title>
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Fecha Ingreso: {{moment(evolucion.fecha_ingreso).format('DD/MM/YYYY')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                                flat
                                style="border-bottom: none !important;"
                                @click="click = null"
                                v-if="evolucion.evolucion || evolucion.estado_afectacion"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon color="blue">mdi-chart-line</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Estado de Afectación</v-list-item-subtitle>
                                <v-list-item-title><h6 class="mb-0 text-justify">{{[evolucion.estado_afectacion, evolucion.evolucion].filter(x => x).join(' - ')}}</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" v-if="evolucion.orden_medica">
                    <v-list two-line flat class="notification-wrap">
                        <v-list-item
                                flat
                                style="border-bottom: none !important;"
                                @click="click = null"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon color="teal">
                                    fas fa-{{evolucion.orden_medica.id === 3 ? 'hospital' : evolucion.orden_medica.id === 2 ? 'clinic-medical' : 'phone-alt'}}
                                </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Orden Médica</v-list-item-subtitle>
                                <v-list-item-title><h6 class="mb-0 text-justify">{{evolucion.orden_medica.id === 3 ? 'Atención en ' : ''}}{{evolucion.orden_medica.orden}}</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                                flat
                                style="border-bottom: none !important;"
                                @click="click = null"
                        >
                            <v-list-item-avatar class="my-1">
                                <v-icon color="deep-purple">fas fa-vial</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="pa-0">
                                <v-list-item-subtitle class="grey--text fs-12 fw-normal">Solicita Toma de Muestra</v-list-item-subtitle>
                                <v-list-item-title><h6 class="mb-0 text-justify">{{evolucion.solicitud_prueba ? 'SI' : 'NO'}}</h6></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" v-if="evolucion.lugar_evolucion">
                    <v-card flat>
                        <v-card-title class="pb-1">
                            <span class="title">Resumen Clínico</span>
                        </v-card-title>
                        <v-list two-line class="list-aqua-ripple">
                            <v-list-item v-if="evolucion.clasificacion === 6 && evolucion.justificacion_no_clasificado">
                                <v-list-item-content>
                                    <h6 class="mb-0 info--text text--darken-3">Justificación Clínica de no Clasificado</h6>
                                    <p class="fs-12 mb-0 fw-normal">{{evolucion.justificacion_no_clasificado}}</p>
                                </v-list-item-content>
                            </v-list-item>
                            <template v-if="evolucion.lugar_evolucion.id === 2">
                                <v-list-item>
                                    <v-list-item-content>
                                        <h6 class="mb-0 info--text text--darken-3">Motivo de la consulta</h6>
                                        <p class="fs-12 mb-0 fw-normal">{{evolucion.motivo_consulta}}</p>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <h6 class="mb-0 info--text text--darken-3">Enfermedad actual</h6>
                                        <p class="fs-12 mb-0 fw-normal">{{evolucion.anamnesis}}</p>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <h6 class="mb-0 info--text text--darken-3">Examen físico</h6>
                                        <p class="fs-12 mb-0 fw-normal">{{evolucion.examen_fisico}}</p>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <h6 class="mb-0 info--text text--darken-3">Diagnóstico</h6>
                                        <p class="fs-12 mb-0 fw-normal">{{evolucion.cie10 ? (`${evolucion.cie10.codigo} - ${evolucion.cie10.descrip}`) : ''}}</p>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        <h6 class="mb-0 info--text text--darken-3">Tratamiento</h6>
                                        <p class="fs-12 mb-0 fw-normal">{{evolucion.tratamiento}}</p>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                            <v-list-item v-if="evolucion.lugar_evolucion.id === 3">
                                <v-list-item-content>
                                    <h6 class="mb-0 info--text text--darken-3">Evolución Diaria Hospitalaria</h6>
                                    <p class="fs-12 mb-0 fw-normal">{{evolucion.evolucion_diaria_hospitalaria}}</p>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <h6 class="mb-0 info--text text--darken-3">Observaciones - Ruta de tratamiento a seguir del paciente</h6>
                                    <p class="fs-12 mb-0 fw-normal">{{evolucion.observaciones}}</p>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
                <v-col cols="12" v-if="evolucion.sivigila !== null || evolucion.ssc !== null || evolucion.crue !== null">
                    <v-card flat>
                        <v-card-title>
                            <span class="title">Reportes</span>
                        </v-card-title>
                        <v-card-text>
                            <v-tooltip top v-if="evolucion.sivigila !== null">
                                <template v-slot:activator="{on}">
                                    <v-chip label class="white--text elevation-2 mb-1 mr-1" :color="evolucion.sivigila ? 'success' : 'error'" v-on="on">
                                        <span>{{['SIVIGILA', evolucion.entidad_reporta_sivigila].filter(x => x).join(' reportado por: ')}}</span>
                                    </v-chip>
                                </template>
                                <span>{{['Reportado a SIVIGILA', evolucion.entidad_reporta_sivigila].filter(x => x).join(' por: ')}}</span>
                            </v-tooltip>
                            <v-tooltip top v-if="evolucion.ssc !== null">
                                <template v-slot:activator="{on}">
                                    <v-chip label class="white--text elevation-2 mb-1 mr-1" :color="evolucion.ssc ? 'success' : 'error'" v-on="on">
                                        <span>SSC</span>
                                    </v-chip>
                                </template>
                                <span>Reportado a Secretaría de Salud de Casanare</span>
                            </v-tooltip>
                            <v-tooltip top v-if="evolucion.crue !== null">
                                <template v-slot:activator="{on}">
                                    <v-chip label class="white--text elevation-2 mb-1 mr-1" :color="evolucion.crue ? 'success' : 'error'" v-on="on">
                                        <span>CRUE</span>
                                    </v-chip>
                                </template>
                                <span>Llamada a CRUE</span>
                            </v-tooltip>
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
            <v-list two-line class="list-aqua-ripple" v-else>
                <v-list-item>
                    <v-list-item-content>
                        <h6 class="mb-0 info--text text--darken-3">Observaciones</h6>
                        <p class="fs-12 mb-0 fw-normal">{{evolucion.observaciones}}</p>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-row>
        <help-modal ref="helpModal"></help-modal>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex'
    import ListItemClasificacion from './components/ListItemClasificacion'
    const HelpModal = () => import('../../../../components/HelpModal/HelpModal')
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
        components: {
            ListItemClasificacion,
            HelpModal
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
        },
        methods: {
            verAyuda (item) {
                this.$refs.helpModal.open(item)
            }
        }
    }
</script>

<style scoped>

</style>