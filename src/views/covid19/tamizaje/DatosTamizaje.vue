<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-0 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="blue" large>{{ tamizaje.infoviajero ? 'mdi-bus-marker' : 'fas fa-file-medical' }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0" v-if="$vuetify.breakpoint.smAndDown">
                <template v-if="tamizaje.id">
                  <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                      <span v-on="on" class="border-bottom-1">ERP</span>
                    </template>
                    <span>Encuesta de Riesgo Poblacional</span>
                  </v-tooltip>
                  No. {{ tamizaje.id }}
                </template>
              </h4>
              <h4 class="ma-0" v-else>ERP - Encuesta de Riesgo Poblacional
                {{ tamizaje.id ? ` No. ${tamizaje.id}` : '' }}</h4>
            </v-list-item-title>
            <v-list-item-title v-if="tamizaje.tamizador">
              <h6 v-if="tamizaje.tipo_tamizaje === 'telefónico'" class="mb-0">
                {{ `${tamizaje.llamada_entrante ? 'Llamada recibida en: ' : 'Llamada realizada desde: '}${tamizaje.tamizador.nombre}` }}
              </h6>
              <h6 v-else class="mb-0">Realizado en: {{ tamizaje.tamizador.nombre }}</h6>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-divider class="ma-0"></v-divider>
        <v-row no-gutters>
          <v-col cols="12" v-if="tamizaje.tamizador_id === 897">
            <v-list two-line class="notification-wrap">
              <v-list-item
                  style="border-bottom: none !important;"
                  @click="click = null"
              >
                <v-list-item-avatar class="my-1">
                  <v-icon color="indigo">fas fa-clinic-medical</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">IPS Busqueda Activa Institucional
                  </v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0 text-justify">
                    {{ tamizaje.codIpsBai ? this.tamizaje.ips_bai.nombre : '' }}</h6></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" v-if="tamizaje.tamizador_id === 890 && tamizaje.entidad_reporta_sivigila">
            <v-list two-line class="notification-wrap">
              <v-list-item
                  style="border-bottom: none !important;"
                  @click="click = null"
              >
                <v-list-item-avatar class="my-1">
                  <v-icon color="blue">fas fa-building</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Entidad que reporta a SIVIGILA
                  </v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0 text-justify">{{ tamizaje.entidad_reporta_sivigila }}</h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <template v-if="tamizaje.localiza_persona">
            <template v-if="tamizaje.contesta_encuesta">
              <v-col cols="12" v-if="tamizaje.infoviajero">
                <v-list two-line class="notification-wrap">
                  <v-list-item @click="click = null" style="border-bottom: none !important;">
                    <v-list-item-avatar class="my-1 align-self-center">
                      <v-icon color="pink">mdi-map-marker-radius</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">Lugar Encuesta</v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0">{{ tamizaje.infoviajero.lugar }}</h6></v-list-item-title>
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        {{ tamizaje.infoviajero.municipio_de_control ? `${tamizaje.infoviajero.municipio_de_control.nombre}, ${tamizaje.infoviajero.municipio_de_control.departamento.nombre}` : '' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" v-if="tamizaje.grupo_atencion_especial">
                <v-list two-line class="notification-wrap">
                  <v-list-item
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1">
                      <v-icon :color="tamizaje.grupo_atencion_especial_id === 1 ? 'cyan darken-2' : 'orange darken-1'">
                        {{ tamizaje.grupo_atencion_especial_id === 1 ? 'mdi-account-switch' : 'mdi-alert' }}
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">Grupo de atención especial
                      </v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0 text-justify">{{ tamizaje.grupo_atencion_especial.nombre }}</h6>
                      </v-list-item-title>
                      <v-list-item-subtitle class="orange--text fs-12 fw-normal"
                                            v-if="tamizaje.grupo_atencion_especial_id !== 1">Según el instructivo del
                        Instituto Nacional de Salud, se recomienda tener especial atención con esta persona.
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12">
                <v-list two-line class="notification-wrap">
                  <template v-for="(item, indexItem) in datos">
                    <v-list-item
                        v-if="item.visible"
                        :key="`col${indexItem}`"
                        style="border-bottom: none !important;"
                        @click="click = null"
                    >
                      <v-list-item-avatar class="my-1">
                        <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-title><h6 class="mb-0 text-justify">{{ item.body }}</h6></v-list-item-title>
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{ item.label }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-col>
              <template v-if="tamizaje.sintomas">
                <v-col cols="12">
                  <v-card flat>
                    <v-card-title>
                      <span class="title">Síntomas</span>
                    </v-card-title>
                    <v-card-text class="text-center" v-if="!tamizaje.sintomas.filter(x => x.aplica_covid && x.solicita_fecha).length">
                      No registra síntomas
                    </v-card-text>
                    <v-card-text v-else>
                      <template v-for="(chip, indexChip) in tamizaje.sintomas.filter(x => x.aplica_covid && x.solicita_fecha)">
                        <v-chip label class="mr-2 mb-2 white--text" color="indigo" :key="`chip${indexChip}`">
                          {{ chip.descripcion }}
                        </v-chip>
                      </template>
                      <v-chip label class="mb-2 white--text" color="orange" v-if="tamizaje.fecha_sintomas">
                        <v-icon small left>mdi-calendar-month</v-icon>
                        {{ tamizaje.fecha_sintomas ? moment(tamizaje.fecha_sintomas).format('DD/MM/YYYY') : '' }}
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" v-if="tamizaje.sintomas.filter(x => x.aplica_covid && !x.solicita_fecha).length">
                  <v-card flat>
                    <v-card-title>
                      <span class="title">Signos de Alarma</span>
                    </v-card-title>
                    <v-card-text class="text-center" v-if="!tamizaje.sintomas.length">
                      No registra signos de alarma
                    </v-card-text>
                    <v-card-text v-else>
                      <template v-for="(chip, indexChip) in tamizaje.sintomas.filter(x => x.aplica_covid && !x.solicita_fecha)">
                        <v-chip label class="mr-2 mb-2 white--text" color="cyan darken-4" :key="`chipSigno${indexChip}`">
                          {{ chip.descripcion }}
                        </v-chip>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
              <v-col cols="12">
                <v-card flat>
                  <v-card-title>
                    <span class="title">Comorbilidades</span>
                  </v-card-title>
                  <v-card-text class="text-center" v-if="!comorbilidades.length">
                    No registra comorbilidades
                  </v-card-text>
                  <v-card-text v-else>
                    <template v-for="(chip, indexChip) in comorbilidades">
                      <v-chip label class="mr-2 mb-2 white--text" color="indigo lighten-1" :key="`chipx${indexChip}`">
                        {{ chip.descrip }}
                      </v-chip>
                    </template>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;"
                                   v-if="tamizaje.temperatura !== null || (tamizaje.infoviajero && tamizaje.infoviajero.temperatura !== null)">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="deep-orange">fas fa-thermometer-three-quarters</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Temperatura</v-list-item-subtitle>
                          <v-list-item-title>
                            <h4 class="mb-0">
                              {{ tamizaje.temperatura || (tamizaje.infoviajero && tamizaje.infoviajero.temperatura) }}
                              <v-icon>mdi-temperature-celsius</v-icon>
                            </h4>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="tamizaje.saturacion_oxigeno !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="purple">fas fa-tachometer-alt</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Saturación de Oxígeno
                          </v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{ tamizaje.saturacion_oxigeno }}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-list two-line class="notification-wrap">
                      <v-list-item style="border-bottom: none !important;" v-if="tamizaje.frecuencia_pulso !== null">
                        <v-list-item-avatar class="my-1 align-self-center">
                          <v-icon color="red">mdi-heart-pulse</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="grey--text fs-12 fw-normal">Frecuencia de Pulso
                          </v-list-item-subtitle>
                          <v-list-item-title><h4 class="mb-0">
                            {{ tamizaje.frecuencia_pulso }}
                          </h4></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-col>
              <app-card
                  v-if="tamizaje.infoviajero"
                  colClasses="col-12"
                  customClasses="social-share-wrap"
              >
                <div class="google justify-center" v-if="tamizaje.infoviajero.aislamiento">
                  <v-list>
                    <v-list-item>
                                        <span
                                            class="social-icon border d-custom-flex align-items-center rounded-circle">
                                            <v-icon medium>fas fa-stamp</v-icon>
                                        </span>
                      <v-list-item-content class="ml-2">
                        <v-list-item-title><h4>Reseñado para Aislamiento</h4></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>
                <div class="google" :style="`display: ${$vuetify.breakpoint.smAndUp ? 'flex' : ''} !important;`">
                  <v-row>
                    <v-col class="text-center" cols="12" sm="6">
                      <span class="d-block">Procedencia</span>
                      <span class="d-block fw-bold">
                                        <v-tooltip v-if="iconosMedios && tamizaje.infoviajero.transporte_llegada" top>
                                            <template v-slot:activator="{on}">
                                                <v-icon color="primary" v-on="on">
                                                    {{ iconosMedios.find(x => x.key === tamizaje.infoviajero.transporte_llegada).icon }}
                                                </v-icon>
                                            </template>
                                            <span>{{ tamizaje.infoviajero.transporte_llegada }}</span>
                                        </v-tooltip>
                                        {{
                          [
                            tamizaje.infoviajero.municipio_de_procedencia
                                ? `${tamizaje.infoviajero.municipio_de_procedencia.nombre}, ${tamizaje.infoviajero.municipio_de_procedencia.departamento.nombre}`
                                : null,
                            tamizaje.infoviajero.pais_de_procedencia && tamizaje.infoviajero.pais_de_procedencia.id !== 44
                                ? tamizaje.infoviajero.pais_de_procedencia.nombre
                                : null].filter(x => x).join(', ')
                        }}
                                    </span>
                      <span class="d-block">
                                        {{ [(tamizaje.infoviajero.transporte_llegada === 'Aereo' ? tamizaje.infoviajero.numero_vuelo ? `Número vuelo: ${tamizaje.infoviajero.numero_vuelo}` : null : null), tamizaje.infoviajero.placa ? `Placa: ${tamizaje.infoviajero.placa}` : null, tamizaje.infoviajero.empresa ? `Empresa: ${tamizaje.infoviajero.empresa}` : null].filter(x => x).join(', ') }}
                                    </span>
                    </v-col>
                    <v-col class="text-center" cols="12" sm="6">
                      <span class="d-block">Destino</span>
                      <span class="d-block fw-bold">
                                        <v-tooltip v-if="iconosMedios && tamizaje.infoviajero.transporte_destino" top>
                                            <template v-slot:activator="{on}">
                                                <v-icon color="primary" v-on="on">
                                                    {{ iconosMedios.find(x => x.key === tamizaje.infoviajero.transporte_destino).icon }}
                                                </v-icon>
                                            </template>
                                            <span>{{ tamizaje.infoviajero.transporte_destino }}</span>
                                        </v-tooltip>
                                        {{
                          tamizaje.infoviajero.municipio_de_destino
                              ? `${tamizaje.infoviajero.municipio_de_destino.nombre}, ${tamizaje.infoviajero.municipio_de_destino.departamento.nombre}`
                              : null
                        }}
                                    </span>
                      <span class="d-block">
                                        Dirección permanencia: {{ tamizaje.infoviajero.direccion_permanencia }}
                                    </span>
                    </v-col>
                  </v-row>
                </div>
              </app-card>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-list class="notification-wrap">
                  <v-list-item @click="click = null">
                    <v-list-item-avatar class="my-1">
                      <v-icon color="red">mdi-file-cancel</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-title><h6 class="mb-0">El paciente no diligencia la Encuesta de Riesgo Poblacional</h6></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </template>
          </template>
          <template v-else>
            <v-col cols="12">
              <v-list two-line class="notification-wrap">
                <v-list-item @click="click = null">
                  <v-list-item-avatar class="my-1">
                    <v-icon color="red">fas fa-user-tag</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title><h6 class="mb-0">No Se Localiza Paciente</h6></v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      Motivo: {{ tamizaje.no_efectividad }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </template>
          <v-col cols="12" v-if="tamizaje.observaciones">
            <v-list two-line class="list-aqua-ripple">
              <v-list-item>
                <v-list-item-content>
                  <h6 class="mb-0 info--text text--darken-3">Observaciones</h6>
                  <p class="fs-12 mb-0 fw-normal">{{ tamizaje.observaciones }}</p>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" v-if="tamizaje.user">
            <v-list two-line class="notification-wrap">
              <v-list-item @click="click = null">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="primary">fas fa-user</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Usuario que Registra</v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0">{{ tamizaje.user.name }}</h6></v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <v-icon small>mdi-phone</v-icon>
                    {{ tamizaje.user.telefono }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" v-if="tamizaje.medico">
            <v-list two-line class="notification-wrap">
              <v-list-item @click="click = null">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="pink">fas fa-user-md</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Médico Asignado</v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0">{{ tamizaje.medico.name }}</h6></v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <v-icon small>mdi-phone</v-icon>
                    {{ tamizaje.medico.telefono }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'DatosTamizaje',
  props: {
    tamizaje: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    click: null,
    datos: [],
    comorbilidades: [],
    panel: []
  }),
  watch: {
    tamizaje: {
      handler(val) {
        val && this.assign()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'tamizadores',
      'mediosTransporte'
    ]),
    iconosMedios() {
      let array = []
      if (this.mediosTransporte && this.mediosTransporte.length) {
        array.push(
            {key: 'Aereo', icon: 'fas fa-plane'},
            {key: 'Terrestre Público', icon: 'fas fa-bus-alt'},
            {key: 'Terrestre Particular', icon: 'fas fa-car'},
            {key: 'Terrestre de Carga', icon: 'fas fa-truck-moving'},
            {key: 'Motocicleta', icon: 'fas fa-motorcycle'},
            {key: 'Fluvial', icon: 'fas fa-ship'}
        )
      }
      return array
    }
  },
  methods: {
    assign() {
      this.panel = (!this.tamizaje.medico_id || (this.tamizaje.medico_id && this.tamizaje.evoluciones && this.tamizaje.evoluciones.length === 0)) ? [0] : []
      // this.comorbilidades = this.tamizaje.evoluciones.find(x => x.comorbilidades.length) ? this.tamizaje.evoluciones.find(x => x.comorbilidades.length).comorbilidades : []
      this.comorbilidades = this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length ? this.tamizaje.comorbilidades : []
      this.datos = []
      this.datos.push(
          {
            label: null,
            body: 'Antecedentes de Viaje: ¿Ud realizó algún viaje desde o hacia las zonas donde se presenta el virus o ha tenido cercanía con personas contagiadas en los últimos 14 días?',
            icon: this.tamizaje.riesgo_procedencia ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline',
            iconColor: this.tamizaje.riesgo_procedencia ? 'success' : 'grey',
            colmd: '12',
            collg: '12',
            visible: this.tamizaje.riesgo_procedencia
          },
          {
            label: null,
            body: '¿Es Trabajador de la salud u otro personal del ámbito hospitalario que haya tenido contacto estrecho* con caso confirmado para enfermedad por nuevo coronavirus (COVID-19)?',
            icon: this.tamizaje.riesgo_ocupacional ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline',
            iconColor: this.tamizaje.riesgo_ocupacional ? 'success' : 'grey',
            colmd: '12',
            collg: '12',
            visible: this.tamizaje.riesgo_ocupacional
          },
          {
            label: null,
            body: '¿Ha tenido contacto estrecho* en los últimos 14 días con un caso confirmado con infección respiratoria aguda grave asociada al nuevo coronavirus 2019 (COVID-19)?',
            icon: this.tamizaje.riesgo_contacto ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline',
            iconColor: this.tamizaje.riesgo_contacto ? 'success' : 'grey',
            colmd: '12',
            collg: '12',
            visible: this.tamizaje.riesgo_contacto
          },
          {
            label: null,
            body: '¿Ha estado hospitalizado?',
            icon: this.tamizaje.hospitalizado ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline',
            iconColor: this.tamizaje.riesgo_contacto ? 'success' : 'grey',
            colmd: '12',
            collg: '12',
            visible: this.tamizaje.hospitalizado
          },
          {
            label: this.tamizaje.fecha_diagnostico ? 'Fecha diagnóstico: ' + this.moment(this.tamizaje.fecha_diagnostico).format('DD/MM/YYYY') : null,
            body: '¿Ha sido diagnósticado con covid-19?',
            icon: this.tamizaje.diagnosticado_covid ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline',
            iconColor: this.tamizaje.diagnosticado_covid ? 'success' : 'grey',
            colmd: '12',
            collg: '12',
            visible: this.tamizaje.diagnosticado_covid
          }
      )
    }
  }
}
</script>

<style scoped>

</style>