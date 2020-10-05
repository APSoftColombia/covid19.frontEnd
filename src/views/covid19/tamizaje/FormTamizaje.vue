<template>
  <div>
    <v-row>
      <v-col class="pb-0" cols="12" v-if="esTamizaje">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
                v-model="tamizaje.tipo_tamizaje"
                label="Tipo de Encuesta de Riesgo Poblacional: "
                rules="required"
                name="tipo de encuesta de riesgo poblacional"
                :items="tiposTamizaje"
                item-text="nombre"
                item-value="id"
                :column="!$vuetify.breakpoint.smAndUp"
                :readonly="!!llamada"
            >
            </c-radio>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="pb-0" cols="12" v-if="esTamizaje && tamizaje.tipo_tamizaje === 'telefónico'">
        <v-card outlined tile>
          <v-card-text>
            <c-radio
                v-model="tamizaje.llamada_entrante"
                label="Tipo de llamada: "
                rules="required"
                name="tipo de llamada"
                :items="[{value: 1, text: 'Entrante'}, {value: 0, text: 'Saliente'}]"
                item-text="text"
                item-value="value"
                :column="!$vuetify.breakpoint.smAndUp"
                :readonly="!!llamada"
            >
            </c-radio>
          </v-card-text>
        </v-card>
      </v-col>
      <template v-if="esTamizaje">
        <v-col class="pb-0" cols="12">
          <v-label>¿Dónde se Diligencia la Encuesta de Riesgo Poblacional?</v-label>
          <c-select-complete
              v-model="tamizaje.tamizador_id"
              placeholder="Punto contacto"
              rules="required"
              name="punto contacto"
              :items="tamizadores ? tamizadores.filter(x => x.id !== 891) : []"
              item-text="nombre"
              item-value="id"
          >
          </c-select-complete>
        </v-col>
        <v-col class="pb-0" cols="12" v-if="tamizaje.tamizador_id === 890">
          <c-texto
              v-model="tamizaje.entidad_reporta_sivigila"
              label="Entidad que reporta a SIVIGILA"
              rules="required"
              name="entidad que reporta a SIVIGILA"
              upper-case
          >
          </c-texto>
        </v-col>
      </template>
    </v-row>
    <form-persona v-model="tamizaje" @verificado="val => verificar(val)"
                  @responsetamizaje="val => respuestaPersona = val" :tipo="tipo"></form-persona>
    <v-row>
      <template v-if="verificado === 1">
        <v-col cols="12" v-if="esTamizaje">
          <v-card outlined tile>
            <v-card-text>
              <c-radio
                  v-model="tamizaje.localiza_persona"
                  label="¿Se localiza al paciente?"
                  rules="required"
                  name="localiza al paciente"
                  :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                  item-text="text"
                  item-value="value"
                  :column="!$vuetify.breakpoint.smAndUp"
              >
              </c-radio>
            </v-card-text>
          </v-card>
        </v-col>
        <template v-if="tamizaje.localiza_persona">
          <v-col cols="12">
            <v-card outlined tile>
              <v-card-text>
                <c-radio
                    v-model="tamizaje.contesta_encuesta"
                    label="Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012, manifiesto que he sido informado por la EPS de lo siguiente:  Que la finalidad de la recolección de mis datos personales, consiste en: Conocer mi estado de salud, así como mi situación actual con respecto a la pandemia de Covid-19.  ¿Autoriza la realización de la Encuesta?"
                    rules="required"
                    name="autorización de la encuesta"
                    :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                    item-text="text"
                    item-value="value"
                >
                </c-radio>
              </v-card-text>
            </v-card>
          </v-col>
          <template v-if="tamizaje.contesta_encuesta">
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <label class="orange--text">
                    <v-icon color="orange">mdi-alert</v-icon>
                    Según el instructivo del Instituto Nacional de Salud, se recomienda tener especial atención con
                    personas que esten incluidas en alguno de estos grupos.
                  </label>
                  <c-radio
                      v-model="tamizaje.grupo_atencion_especial_id"
                      label="Grupo de atención especial"
                      rules="required"
                      name="grupo de atención especial"
                      :items="gruposAtencionEspecial"
                      item-text="nombre"
                      item-value="id"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_procedencia"
                      label="Antecedentes de Viaje: ¿Ud realizó algún viaje desde o hacia las zonas donde se presenta el virus o ha tenido cercanía con personas contagiadas en los últimos 14 días?"
                      rules="required"
                      name="riesgo de procedencia"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_ocupacional"
                      label="¿Es Trabajador de la salud u otro personal del ámbito hospitalario que haya tenido contacto estrecho* con caso confirmado para enfermedad por nuevo coronavirus (COVID-19)?"
                      rules="required"
                      name="riesgo trabajador de la salud"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.riesgo_contacto"
                      label="¿Ha tenido contacto estrecho* en los últimos 14 días con un caso confirmado con infección respiratoria aguda grave asociada al nuevo coronavirus 2019 (COVID-19)?"
                      rules="required"
                      name="riesgo de contacto"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" v-if="tamizaje.tamizador_id === 890">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.hospitalizado"
                      label="¿Ha estado hospitalizado?"
                      rules="required"
                      name="hospitalizado"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.prueba_rapida"
                      :label="`¿Le han realizado prueba rápida para Covid-19?`"
                      rules="required"
                      name="le tomaron prueba rápida"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
                <v-card-text v-if="tamizaje.prueba_rapida === 1">
                  <c-radio
                      v-model="tamizaje.resultado_prueba_rapida"
                      :label="`Resultado de la prueba rápida`"
                      rules="required"
                      name="resultado de la prueba rápida"
                      :items="resultadosPCR.map(x => {return {text: x, value: x}})"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card outlined tile>
                <v-card-text>
                  <c-radio
                      v-model="tamizaje.diagnosticado_covid"
                      label="¿Ha sido diagnósticado con covid-19?"
                      rules="required"
                      name="diagnósticado"
                      :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                      item-text="text"
                      item-value="value"
                  >
                  </c-radio>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="tamizaje.diagnosticado_covid">
              <c-date
                  v-model="tamizaje.fecha_diagnostico"
                  rules="required"
                  label="Fecha del diagnóstico"
                  name="fecha del diagnóstico"
                  :max="moment().format('YYYY-MM-DD')"
              >
              </c-date>
            </v-col>
          </template>
        </template>
        <template v-if="tamizaje.localiza_persona === 0">
          <v-col cols="12 pb-0">
            <c-select-complete
                v-model="tamizaje.no_efectividad"
                label="Motivo de no localización"
                rules="required"
                name="motivo de no localización"
                :items="tiposNoEfectiva || []"
            >
            </c-select-complete>
          </v-col>
        </template>
      </template>
      <seguimiento
          ref="seguimiento"
      ></seguimiento>
      <v-dialog v-model="dialog" persistent max-width="1020">
        <v-card class="pt-3">
          <template v-if="respuestaPersona">
            <v-card-text class="text-center"
                         :class="respuestaPersona.mensaje && respuestaPersona.mensaje.id === 1 ? 'green--text' : 'orange--text'">
              <p class="headline mb-0">{{ respuestaPersona.mensaje ? respuestaPersona.mensaje.mensaje : '' }}</p>
            </v-card-text>
            <v-card-text>
              <v-list two-line class="notification-wrap">
                <v-list-item
                    style="border-bottom: none !important;"
                >
                  <v-list-item-avatar class="my-1">
                    <v-icon large color="primary">
                      {{ respuestaPersona.tamizajes[0].sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman' }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title>
                      <h6 class="mb-0 text-justify">
                        {{ [respuestaPersona.tamizajes[0].nombre1, respuestaPersona.tamizajes[0].nombre2, respuestaPersona.tamizajes[0].apellido1, respuestaPersona.tamizajes[0].apellido2].filter(x => x).join(' ') }}
                      </h6>
                    </v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      {{ tiposDocumentoIdentidad && respuestaPersona.tamizajes[0].tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === respuestaPersona.tamizajes[0].tipo_identificacion).tipo : '' }}{{ respuestaPersona.tamizajes[0].identificacion }}{{ respuestaPersona.tamizajes[0].celular ? ', Cel. ' + respuestaPersona.tamizajes[0].celular : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Riesgos</th>
                    <th class="text-left">
                      <v-tooltip top>
                        <template v-slot:activator="{on}">
                          <a v-on="on" class="brown--text font-weight-bold">Seg</a>
                        </template>
                        <span>Seguimientos</span>
                      </v-tooltip>
                    </th>
                    <th class="text-left">
                      <v-tooltip top>
                        <template v-slot:activator="{on}">
                          <a v-on="on" class="brown--text font-weight-bold">Estado A.</a>
                        </template>
                        <span>Estado Afectación</span>
                      </v-tooltip>
                    </th>
                    <th class="text-left">Estado Proceso</th>
                    <th class="text-left">Estado Encuesta</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, indexItem) in respuestaPersona.tamizajes" :key="indexItem">
                    <td>
                      <span v-if="isCaller">{{ item.id }}</span>
                      <v-tooltip v-else top>
                        <template v-slot:activator="{on}">
                          <v-btn v-on="on" color="primary" @click="verSeguimiento(item.id)">{{ item.id }}</v-btn>
                        </template>
                        <span>Ver detalle</span>
                      </v-tooltip>
                    </td>
                    <td>{{ moment(item.created_at).format('DD/MM/YYYY') }}</td>
                    <td>
                      <c-chip
                          clase="mr-1"
                          :text="item.cantidad_sintomas || 0"
                          color="indigo"
                          tooltip="Sintomas"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_procedencia"
                          clase="mr-1"
                          text="V"
                          color="green"
                          tooltip="Antecedentes de viaje"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_ocupacional"
                          clase="mr-1"
                          text="O"
                          color="blue"
                          tooltip="Es trabajador de la Salud"
                          text-color="white"
                          label
                      ></c-chip>
                      <c-chip
                          v-if="item.riesgo_contacto"
                          clase="mr-1"
                          text="C"
                          color="purple"
                          tooltip="Ha tenido contacto estrecho"
                          text-color="white"
                          label
                      ></c-chip>
                    </td>
                    <td>
                      <c-chip
                          :text="item.seguimientos || 0"
                          color="deep-purple"
                          :tooltip="`Seguimiento${item.seguimientos === 1 ? '' : 's'}`"
                          text-color="white"
                          label
                      ></c-chip>
                    </td>
                    <td>
                      <v-list-item class="pa-0">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>{{ item.estado_afectacion }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.ultimo_seguimiento ? moment(item.ultimo_seguimiento).format('DD/MM/YYYY') : '' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item class="pa-0" v-if="respuestaPersona.mensaje && (respuestaPersona.mensaje.id === 2 || respuestaPersona.mensaje.id === 3)">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>Activo</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ respuestaPersona.mensaje.id === 2 ? 'Pendiente por Asignar' : 'En Caso de Estudio' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                    <td>
                      <v-list-item class="pa-0">
                        <v-list-item-content class="pa-0">
                          <v-list-item-title>
                            {{ item.localiza_persona === 1 && item.contesta_encuesta === 1 ? 'Encuesta Realizada' : item.localiza_persona === 0 ? 'Fallida - Persona No Localizado' : item.contesta_encuesta === 0 ? 'Fallida - Persona Indispuesta para Contestar' : '' }}
                          </v-list-item-title>
                          <v-list-item-subtitle v-if="item.no_efectividad">
                            {{ item.no_efectividad }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </template>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FormPersona from 'Views/covid19/tamizaje/FormPersona'

const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
export default {
  name: 'FormTamizaje',
  components: {
    Seguimiento,
    FormPersona
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    llamada: {
      type: Object,
      default: null
    },
    tipo: {
      type: String,
      default: 'tamizaje'
    }
  },
  data: () => ({
    verificado: 0,
    loadingidentidad: false,
    dialog: false,
    respuestaPersona: null
  }),
  computed: {
    esTamizaje() {
      return this.tipo === 'tamizaje'
    },
    ...mapGetters([
      'sexosCovid',
      'tiposDocumentoIdentidad',
      'departamentos',
      'tiposAfiliacion',
      'epss',
      'regimenesEspeciales',
      'tamizadores',
      'tiposTamizaje',
      'resultadosPCR',
      'gruposAtencionEspecial',
      'tiposNoEfectiva'
    ])
  },
  watch: {
    'tamizaje.localiza_persona': {
      handler(val) {
        if (!val) {
          this.tamizaje.contesta_encuesta = null
        }
      },
      immediate: false
    },
    'tamizaje.tamizador_id': {
      handler(val) {
        if (val !== 890) {
          this.tamizaje.entidad_reporta_sivigila = null
          this.tamizaje.hospitalizado = null
        }
      },
      immediate: false
    },
    'tamizaje.prueba_rapida': {
      handler(val) {
        if (!val) {
          this.tamizaje.resultado_prueba_rapida = null
        }
      },
      immediate: false
    },
    'tamizaje.departamento_id': {
      handler(val) {
        if (!val) {
          this.tamizaje.municipio_id = null
        }
      },
      immediate: false
    },
    'tamizaje.tipo_tamizaje': {
      handler(val) {
        val && val === 'presencial' && (this.tamizaje.llamada_entrante = null)
      },
      immediate: false
    },
    'tamizaje.diagnosticado_covid': {
      handler(val) {
        !val && (this.tamizaje.fecha_diagnostico = null)
      },
      immediate: false
    },
    'tamizaje.si_eps': {
      handler(val) {
        !val && (this.tamizaje.eps_id = null)
      },
      immediate: false
    },
    'tamizaje.eps_id': {
      handler(val) {
        !val && (this.tamizaje.tipo_afiliacion = null)
      },
      immediate: false
    },
    'tamizaje.tipo_afiliacion': {
      handler(val) {
        if (!val || val !== 'Régimen Especial') {
          this.tamizaje.regimen_especial = null
        }
      },
      immediate: false
    }
  },
  methods: {
    verSeguimiento(id) {
      this.$refs.seguimiento.open(id)
      // this.dialog = false
    },
    verificar(val) {
      this.verificado = val
      this.$emit('verificado', val)
      if ((val === -1) || (val === 1 && this.respuestaPersona && this.respuestaPersona.mensaje && this.respuestaPersona.mensaje.id === 1)) this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>