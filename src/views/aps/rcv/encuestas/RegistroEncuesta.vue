<template>
  <v-dialog
      v-model="dialog"
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <v-card>
      <v-chip
          :style="`right: ${$vuetify.breakpoint.xsOnly ? '64' : '84' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '12' : '18' }px !important; position: fixed !important; z-index: 2 !important;`"
          color="primary darken-3"
          label
      >
        <v-icon left>mdi-timer</v-icon>
        {{ time }}
      </v-chip>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-edit</v-icon>
        <v-toolbar-title id="inicio">{{ encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Nueva encuesta` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="6" offset-md="3" v-if="dialog">
            <ValidationObserver ref="formencuesta" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
              <v-row v-if="encuestaBase">
                <datos-afiliado :abierto="true" :afiliado="encuestaBase" :dense="true"></datos-afiliado>
              </v-row>
              <v-row>
                <v-col cols="12" class="mt-2">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                          v-model="encuesta.fallida"
                          label="¿Se localizó al paciente?"
                          :items="[{value: 0, text: 'SI'}, {value: 1, text: 'NO'}]"
                          item-text="text"
                          item-value="value"
                          :column="!$vuetify.breakpoint.smAndUp"
                      >
                      </c-radio>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12 pb-0" v-if="encuesta.fallida === 1">
                  <c-select-complete
                      v-model="encuesta.no_efectividad"
                      placeholder="Motivo de no localización"
                      rules="required"
                      name="motivo de no localización"
                      :items="tiposNoEfectiva || []"
                  >
                  </c-select-complete>
                </v-col>
              </v-row>
              <template v-if="encuesta.fallida === 0">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-alert
                        class="ma-0"
                        color="light-blue"
                        border="left"
                        elevation="2"
                        colored-border
                        icon="mdi-information"
                    >
                      Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012, manifiesto que he sido informado por la
                      EPS de lo siguiente:Que la finalidad de la recolección de mis datos personales, consiste en: Conocer
                      y hacer seguimiento a mi estado de salud.
                    </v-alert>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="encuesta.responde_paciente"
                            label="Quien responde la encuesta"
                            rules="required"
                            name="quien responde la encuesta"
                            :items="[{value: 1, text: 'Paciente'}, {value: 0, text: 'Acudiente'}]"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                        <template v-if="!encuesta.responde_paciente">
                          <span class="font-weight-bold orange--text caption">Registrar datos del acudiente</span>
                          <v-row>
                            <v-col class="pb-0" cols="12" sm="6" md="6">
                              <c-texto
                                  v-model="encuesta.acudiente.identificacion"
                                  label="Identificación"
                                  rules="required"
                                  name="identificación"
                              >
                              </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12" sm="6" md="6">
                              <c-select-complete
                                  v-model="encuesta.acudiente.tipo_identificacion"
                                  label="Tipo identificación"
                                  rules="required"
                                  name="tipo identificación"
                                  :items="tiposDocumentoIdentidad"
                                  item-text="descripcion"
                                  item-value="id"
                              >
                              </c-select-complete>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  v-model="encuesta.acudiente.nombre_completo"
                                  label="Nombre Completo"
                                  rules="required"
                                  name="nombre completo"
                                  upper-case
                              >
                              </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12" sm="12" md="6">
                              <c-texto
                                  v-model="encuesta.acudiente.celular"
                                  label="Celular Principal"
                                  rules="required|numeric|minlength:10"
                                  name="celular principal"
                              >
                              </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12" sm="12" md="6">
                              <c-texto
                                  v-model="encuesta.acudiente.email"
                                  label="Email"
                                  rules="email"
                                  name="email"
                                  lower-case
                              >
                              </c-texto>
                            </v-col>
                          </v-row>
                        </template>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="encuesta.consulta_por_urgencias"
                            label="¿Ha consultado por urgencias debido a su enfermedad?"
                            rules="required"
                            name="consulta por urgencias"
                            :items="[{value: 1, text: 'Si'}, {value: 0, text: 'No'}]"
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
                            v-model="encuesta.paciente_hospitalizado"
                            label="¿El paciente se encuentra hospitalizado?"
                            rules="required"
                            name="paciente hospitalizado"
                            :items="[{value: 1, text: 'Si'}, {value: 0, text: 'No'}]"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                        <div class="mt-4" v-if="encuesta.paciente_hospitalizado">
                          <buscador-ips
                              ref="buscadorips"
                              label="IPS de Hospitalización"
                              v-model="encuesta.codigo_ips_hospitalizacion"
                              name="ips de hospitalización"
                              rules="required"
                          ></buscador-ips>
                          <c-text-area
                              label="Motivo de la hospitalización"
                              rules="required"
                              v-model="encuesta.motivo_hospitalizacion"
                              name="motivo de hospitalización"
                          ></c-text-area>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="px-0">
                    <v-system-bar
                        dark
                        color="indigo"
                        :height="40"
                        :window="true"
                    >
                      <v-icon>fas fa-user</v-icon>
                      <span>DATOS GENERALES AFILIADO</span>
                    </v-system-bar>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <c-texto
                        v-model="encuesta.afiliado_actualizado.numero_celular"
                        label="Celular"
                        rules="required|numeric|minlength:10"
                        name="celular"
                    >
                    </c-texto>
                  </v-col>
                  <v-col cols="12" md="6" class="pt-0">
                    <c-texto
                        v-model="encuesta.afiliado_actualizado.telefono_opcional"
                        label="Teléfono Opcional"
                        rules="numeric|minlength:10"
                        name="teléfono opcional"
                    >
                    </c-texto>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <c-texto
                        v-model="encuesta.afiliado_actualizado.email"
                        label="Email"
                        rules="email"
                        name="email"
                        lower-case
                    >
                    </c-texto>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <c-texto
                        v-model="encuesta.afiliado_actualizado.direccion"
                        label="Dirección"
                        rules="required"
                        name="dirección"
                        upper-case
                    >
                    </c-texto>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="px-0 pb-0">
                    <v-system-bar
                        dark
                        color="indigo"
                        :height="40"
                        :window="true"
                    >
                      <v-icon>fas fa-bookmark</v-icon>
                      <span>AMBITO DE ATENCIÓN INMEDITA</span>
                    </v-system-bar>
                  </v-col>
                  <v-col cols="12" class="pt-0">
                    <form-sintomas
                        :array-sintomas="encuesta.sintomas"
                        @changeSintomas="val => encuesta.sintomas = val"
                        :sintomas="complementosRCV && complementosRCV.sintomas ? complementosRCV.sintomas : []"
                    ></form-sintomas>
                  </v-col>
                  <v-col cols="12" v-if="encuesta.sintomas.length > 1">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="encuesta.dispuesto"
                            label="¿El paciente acepta seguir con la realización de la encuesta?"
                            rules="required"
                            name="acepta seguir con la encuesta"
                            :items="[{value: 1, text: 'Si'}, {value: 0, text: 'No'}]"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <template v-if="encuesta.dispuesto">
                  <v-row>
                    <v-col cols="12" class="px-0 pb-0">
                      <v-system-bar
                          dark
                          color="indigo"
                          :height="40"
                          :window="true"
                      >
                        <v-icon>fas fa-bookmark</v-icon>
                        <span>AMBITO PREVENCIÓN DE LA ENFERMEDAD</span>
                      </v-system-bar>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.glucometro"
                              label="¿Cuenta con Glucómetro en casa?"
                              rules="required"
                              name="cuenta con glucómetro"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.tensiometro"
                              label="¿Cuenta con Tensiómetro en casa?"
                              rules="required"
                              name="cuenta con tensiómetro"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.conoce_pesotalla"
                              label="2. Conoce usted su peso y talla?"
                              rules="required"
                              name="conoce peso y talla"
                              :items="[{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                          <template v-if="encuesta.conoce_pesotalla === 'Si'">
                            <span class="font-weight-bold orange--text caption">Registrar e identificar IMC</span>
                            <v-row>
                              <v-col class="pb-0" cols="12" md="6">
                                <c-number
                                    v-model="encuesta.peso"
                                    label="Peso"
                                    rules="required|min:0"
                                    name="peso"
                                    min="0"
                                >
                                </c-number>
                              </v-col>
                              <v-col class="pb-0" cols="12" md="6">
                                <c-number
                                    v-model="encuesta.talla"
                                    label="Talla"
                                    rules="required|min:0"
                                    name="talla"
                                    min="0"
                                >
                                </c-number>
                              </v-col>
                              <v-col class="pb-0" cols="12">
                                <c-number
                                    v-model="encuesta.imc"
                                    label="IMC"
                                    rules="required|min:0"
                                    name="imc"
                                    min="0"
                                    :hint="hintIMC"
                                    readonly
                                    :clearable="false"
                                >
                                </c-number>
                              </v-col>
                            </v-row>
                          </template>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.conoce_datostension"
                              label="3. Se ha tomado la tensión arterial el día de hoy?"
                              rules="required"
                              name="conoce datos de la tensión"
                              :items="[{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                          <template v-if="encuesta.conoce_datostension === 'Si'">
                          <span
                              class="font-weight-bold orange--text caption">Registrar e identificar Tensión Arterial</span>
                            <v-row>
                              <v-col class="pb-0" cols="12" md="6">
                                <c-number
                                    v-model="encuesta.sistolica"
                                    label="Presión Sistólica"
                                    rules="required|min:0"
                                    name="presión sitólica"
                                    min="0"
                                >
                                </c-number>
                              </v-col>
                              <v-col class="pb-0" cols="12" md="6">
                                <c-number
                                    v-model="encuesta.diastolica"
                                    label="Presión Diastólica"
                                    rules="required|min:0"
                                    name="presión diastólica"
                                    min="0"
                                >
                                </c-number>
                              </v-col>
                              <v-col class="pb-0" cols="12">
                                <c-texto
                                    :value="encuesta.sistolica && encuesta.diastolica ? `${encuesta.sistolica}/${encuesta.diastolica}` : ''"
                                    label="Tensión Arterial"
                                    rules="required"
                                    name="tensión arterial"
                                    :hint="hintTension"
                                    readonly
                                    :clearable="false"
                                >
                                </c-texto>
                              </v-col>
                            </v-row>
                          </template>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.actividad_fisica"
                              label="4. ¿Realiza diariamente al menos 30 minutos de actividad física, en el trabajo y/o en el tiempo libre?"
                              rules="required"
                              name="actividad física"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                              v-model="encuesta.frutas_verduras"
                              label="5. ¿Con qué frecuencia come verduras o frutas?"
                              rules="required"
                              name="ingesta de frutas y verduras"
                              :items="complementosRCV && complementosRCV.frutas_verduras ? encuesta.responde_paciente ? complementosRCV.frutas_verduras.filter(z => z !== 'No sabe').map(x => {return {value: x, text: x}}) : complementosRCV.frutas_verduras.map(x => {return {value: x, text: x}}) : []"
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
                              v-model="encuesta.medicacion_hta"
                              label="6. ¿Toma medicación para la hipertensión regularmente?"
                              rules="required"
                              name="medicación para la hipertensión"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                              v-model="encuesta.antecedente_glucosa"
                              label="7. ¿Le han encontrado alguna vez valores de azucar altos?"
                              rules="required"
                              name="azucar alta"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                              v-model="encuesta.familiares_diabetes"
                              label="8. ¿Se le ha diagnosticado diabetes (tipo 1 o tipo 2) a alguno de sus familiares allegados u otros parientes?"
                              rules="required"
                              name="familiares con diabetes"
                              :items="complementosRCV && complementosRCV.familiares_diabetes ? complementosRCV.familiares_diabetes.map(x => {return {value: x, text: x}}) : []"
                              item-text="text"
                              item-value="value"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.diabetes"
                              label="9. Es usted diabetico?"
                              rules="required"
                              name="diabetico"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-expand-x-transition>
                      <v-col cols="12" v-if="encuesta.diabetes === 'Si'">
                        <v-card outlined tile>
                          <v-card-text>
                            <c-radio
                                v-model="encuesta.tipo_diabetes"
                                label="10. Tipo de diabetes"
                                rules="required"
                                name="tipo de diabetes"
                                :items="complementosRCV && complementosRCV.tipo_diabetes ? complementosRCV.tipo_diabetes.map(x => {return {value: x, text: x}}) : []"
                                item-text="text"
                                item-value="value"
                            >
                            </c-radio>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-expand-x-transition>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.fumador"
                              label="11. Fuma?"
                              rules="required"
                              name="fuma"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                              :column="!$vuetify.breakpoint.smAndUp"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.diagnosticado_rcv"
                              label="12. Tiene diagnosticado ya una enfermedad cardiovascular (HTA-IAM-ACV-RENAL)"
                              rules="required"
                              name="diagnosticado RCV"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-expand-transition>
                      <v-col cols="12" v-if="encuesta.diagnosticado_rcv === 'Si'">
                        <form-enfermedades-c-v
                            ref="formEnfermedadesCv"
                            :array-enfermedades="encuesta.enfermedad_cv"
                            :otra-enfermedad="encuesta.otra_enfermedad_cv"
                            @changueEnfermedades="val => encuesta.enfermedad_cv = val"
                            @changeOtraEnfermedad="val => encuesta.otra_enfermedad_cv = val"
                            :enfermedades="complementosRCV && complementosRCV.enfermedad_cv ? complementosRCV.enfermedad_cv : []"
                        ></form-enfermedades-c-v>
                      </v-col>
                    </v-expand-transition>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="px-0 pb-0">
                      <v-system-bar
                          dark
                          color="indigo"
                          :height="40"
                          :window="true"
                      >
                        <v-icon>fas fa-bookmark</v-icon>
                        <span>AMBITO DE ATECIÓN AMBULATORIA</span>
                      </v-system-bar>
                    </v-col>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.consulta_medicina_g"
                              label="13. Señor usuario cuando fue su ultima consulta por medicina general?  (Registrar e identificar riesgo)"
                              rules="required"
                              name="consulta por medicina general"
                              :items="complementosRCV && complementosRCV.consulta_medicina_g ? encuesta.responde_paciente ? complementosRCV.consulta_medicina_g.filter(z => z !== 'No sabe').map(x => {return {value: x, text: x}}) : complementosRCV.consulta_medicina_g.map(x => {return {value: x, text: x}}) : []"
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
                              v-model="encuesta.consulta_medicina_i"
                              label="14. Señor usuario cuando fue su última consulta por medicina especializada?"
                              rules="required"
                              name="consulta por medicina especializada"
                              :items="complementosRCV && complementosRCV.consulta_medicina_i ? encuesta.responde_paciente ? complementosRCV.consulta_medicina_i.filter(z => z !== 'No sabe').map(x => {return {value: x, text: x}}) : complementosRCV.consulta_medicina_i.map(x => {return {value: x, text: x}}) : []"
                              item-text="text"
                              item-value="value"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-expand-transition>
                      <v-col cols="12" v-if="encuesta.consulta_medicina_i && (encuesta.consulta_medicina_i !== 'No sabe' && encuesta.consulta_medicina_i !== 'Nunca')">
                        <form-especialidades
                            ref="formEspecialidades"
                            :array-especialidades="encuesta.especialidad"
                            :otra-especialidad="encuesta.otra_especialidad"
                            @changeEspecialidades="val => encuesta.especialidad = val"
                            @changeOtraEspecialidad="val => encuesta.otra_especialidad = val"
                            :especialidades="complementosRCV && complementosRCV.especialidad ? complementosRCV.especialidad.filter(x => x !== 'No sabe o no recuerda') : []"
                        ></form-especialidades>
                      </v-col>
                    </v-expand-transition>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.laboratorios"
                              label="16. Señor usuario cuando fue la ultima vez que le tomaron laboratorios clinicos?"
                              rules="required"
                              name="toma de laboratorios"
                              :items="complementosRCV && complementosRCV.laboratorios ? encuesta.responde_paciente ? complementosRCV.laboratorios.filter(z => z !== 'No sabe').map(x => {return {value: x, text: x}}) : complementosRCV.laboratorios.map(x => {return {value: x, text: x}}) : []"
                              item-text="text"
                              item-value="value"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-expand-transition>
                      <v-col cols="12" v-if="encuesta.laboratorios && encuesta.laboratorios !== 'No sabe'">
                        <form-examenes
                            :array-examenes="encuesta.laboratorio"
                            :otro-examen="encuesta.otro_examen"
                            @changeExamenes="val => encuesta.laboratorio = val"
                            @changeOtroExamen="val => encuesta.otro_examen = val"
                            :examenes="complementosRCV && complementosRCV.laboratorio ? complementosRCV.laboratorio.filter(x => x !== 'No sabe o no recuerda') : []"
                            ref="formExamenes"
                        ></form-examenes>
                      </v-col>
                    </v-expand-transition>
                    <v-col cols="12">
                      <v-card outlined tile>
                        <v-card-text>
                          <c-radio
                              v-model="encuesta.formula_hta_dm"
                              label="18. Señor usuario actualmente su medico tratante le ha formulado medicamentos para la HTA y/o DM?"
                              rules="required"
                              name="formulación de medicamentos"
                              :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                              item-text="text"
                              item-value="value"
                          >
                          </c-radio>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-expand-transition>
                      <v-col cols="12" v-if="encuesta.formula_hta_dm === 'Si'">
                        <form-medicamentos
                            :array-medicamentos="encuesta.medicamentos"
                            :medicamentos="complementosRCV && complementosRCV.medicamentos ? complementosRCV.medicamentos : []"
                            :otrosmedicamentos="encuesta.otros_medicamentos"
                            ref="formMedicamentos"
                            @changeMedicamentos="val => encuesta.medicamentos = val"
                            @changeOtros="val => encuesta.otros_medicamentos = val"
                        ></form-medicamentos>
                      </v-col>
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-col v-if="encuesta.formula_hta_dm === 'Si'" cols="12">
                        <v-card outlined tile>
                          <v-card-text>
                            <c-radio
                                v-model="encuesta.tiene_medicamentos"
                                label="20. Cuenta con medicamentos actualmente?"
                                rules="required"
                                name="tiene medicamentos"
                                :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                                item-text="text"
                                item-value="value"
                            >
                            </c-radio>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-col v-if="encuesta.formula_hta_dm === 'Si'" cols="12">
                        <v-card outlined tile>
                          <v-card-text>
                            <v-label>21. ¿Me puede indicar cuando fue la ultima entrega de medicamentos?</v-label>
                            <c-date
                                v-model="encuesta.entrega_medicamentos"
                                placeholder="Última entrega de medicamentos"
                                :max="moment().format('YYYY-MM-DD')"
                            >
                            </c-date>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-expand-transition>
                    <v-expand-transition>
                      <v-col v-if="encuesta.formula_hta_dm === 'Si'" cols="12">
                        <v-card outlined tile>
                          <v-card-text>
                            <v-label>22. ¿Me puede indicar para cuando tiene programada la próxima entrega de
                              medicamentos?
                            </v-label>
                            <c-date
                                v-model="encuesta.proxima_entrega_medicamentos"
                                placeholder="Próxima entrega de medicamentos"
                                :min="moment().format('YYYY-MM-DD')"
                            >
                            </c-date>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-expand-transition>
                  </v-row>
                  <v-expand-transition>
                    <v-row v-if="encuesta.formula_hta_dm === 'Si'">
                      <v-col cols="12" class="px-0 pb-0">
                        <v-system-bar
                            dark
                            color="indigo"
                            :height="40"
                            :window="true"
                        >
                          <v-icon>fas fa-bookmark</v-icon>
                          <span>EVALUACIÓN ADHERENCIA AL TRATAMIENTO (Test Morisky Green)</span>
                        </v-system-bar>
                      </v-col>
                      <v-col cols="12">
                        <v-card outlined tile>
                          <v-card-text>
                            <c-radio
                                v-model="encuesta.interrumpe_tto"
                                label="23. ¿Deja de tomar alguna vez los medicamentos para tratar su enfermedad?"
                                rules="required"
                                name="interrumpe toma de medicamentos"
                                :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                                v-model="encuesta.a_tiempo_tto"
                                label="24. Toma los medicamentos a las horas indicadas?"
                                rules="required"
                                name="toma medicamentos a la hora indicada"
                                :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                                v-model="encuesta.suspende_mejora_tto"
                                label="25. Cuando se encuentra bien, ¿deja de tomar la medicación? "
                                rules="required"
                                name="suspende medicamentos al encontrarse bien"
                                :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                                v-model="encuesta.suspende_adverso_tto"
                                label="26. Si le cae mal un medicamento, ¿deja usted de tomarlo?"
                                rules="required"
                                name="suspende medicamento cuando este le cae mal"
                                :items="encuesta.responde_paciente ? [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}] : [{value: 'Si', text: 'Si'}, {value: 'No', text: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
                                item-text="text"
                                item-value="value"
                            >
                            </c-radio>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </template>
              </template>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                    large
                    @click.stop="close"
                >
                  <v-icon>mdi-close</v-icon>
                  Cerrar
                </v-btn>
                <v-spacer></v-spacer>
                <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                <v-btn
                    large
                    color="primary"
                    @click.stop="guardarencuesta"
                >
                  <v-icon left>fas fa-save</v-icon>
                  Guardar encuesta
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
            <v-menu
                v-model="menuObservaciones"
                :close-on-content-click="false"
                :close-on-click="false"
                min-width="350"
                max-width="600"
                offset-y
                nudge-left="290"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="indigo"
                    class="mr-3 mt-70"
                    fab
                    dark
                    top
                    right
                    fixed
                >
                  <v-icon>mdi-comment-text</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <c-text-area
                      v-model="encuesta.observaciones"
                      label="Observaciones Generales"
                      rows="12"
                      :clearable="false"
                      :auto-grow="false"
                      :hide-details="true"
                  >
                  </c-text-area>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>

</template>

<script>
import {mapGetters} from 'vuex'
import FormSintomas from 'Views/aps/rcv/encuestas/components/FormSIntomas'

const FormExamenes = () => import('Views/aps/rcv/encuestas/components/FormExamenes')
const FormEspecialidades = () => import('Views/aps/rcv/encuestas/components/FormEspecialidades')
const FormMedicamentos = () => import('Views/aps/rcv/encuestas/components/FormMedicamentos')
const FormEnfermedadesCV = () => import('Views/aps/rcv/encuestas/components/FormEnfermedadesCV.vue')
import DatosAfiliado from 'Views/aps/rcv/encuestas/components/DatosAfiliado'

var intervalo
export default {
  name: 'RegistroEncuesta',
  components: {
    FormSintomas,
    FormEspecialidades,
    FormExamenes,
    FormMedicamentos,
    DatosAfiliado,
    FormEnfermedadesCV
  },
  data: () => ({
    loading: false,
    dialog: false,
    menuObservaciones: false,
    encuesta: null,
    encuestaBase: null,
    hintIMC: '',
    hintTension: ''
  }),
  computed: {
    ...mapGetters([
      'complementosRCV',
      'modelEncuestaRCV',
      'tiposDocumentoIdentidad',
      'tiposNoEfectiva'
    ]),
    time() {
      let h = 0
      let m = 0
      let s = 0
      if (this && this.encuesta) {
        let initime = this.clone(this.encuesta.duracion)
        h = Math.trunc(initime / 3600)
        initime = initime - (h * 3600)
        m = Math.trunc(initime / 60)
        initime = initime - (m * 60)
        s = initime
      }
      return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
    }
  },
  watch: {
    'encuesta.fallida': {
      handler(val) {
        if (val) {
          this.encuesta.paciente_hospitalizado = null
        }
      },
      immediate: false
    },
    'encuesta.paciente_hospitalizado': {
      handler(val) {
        if (!val) {
          this.encuesta.codigo_ips_hospitalizacion = null
          this.encuesta.motivo_hospitalizacion = null
        }
      },
      immediate: false
    },
    'encuesta.responde_paciente': {
      handler(val) {
        if (val) {
          this.encuesta.acudiente.identificacion = null
          this.encuesta.acudiente.tipo_identificacion = null
          this.encuesta.acudiente.nombre_completo = null
          this.encuesta.acudiente.celular = null
          this.encuesta.acudiente.email = null
        }
      },
      immediate: false
    },
    'encuesta.conoce_pesotalla': {
      handler(val) {
        if (!val || val === 'No') {
          this.encuesta.peso = null
          this.encuesta.talla = null
        }
      },
      immediate: false
    },
    'encuesta.peso': {
      handler() {
        this.getIMC()
      },
      immediate: false
    },
    'encuesta.talla': {
      handler() {
        this.getIMC()
      },
      immediate: false
    },
    'encuesta.conoce_datostension': {
      handler(val) {
        if (!val || val === 'No') {
          this.encuesta.diastolica = null
          this.encuesta.sistolica = null
        }
      },
      immediate: false
    },
    'encuesta.diastolica': {
      handler() {
        this.getTension()
      },
      immediate: false
    },
    'encuesta.sistolica': {
      handler() {
        this.getTension()
      },
      immediate: false
    },
    'encuesta.consulta_medicina_i': {
      handler(val) {
        if (!val || val === 'No sabe' || val === 'Nunca') {
          this.encuesta.especialidad = []
        }
      },
      immediate: false
    },
    'encuesta.laboratorios': {
      handler(val) {
        if (!val || val === 'No sabe') {
          this.encuesta.laboratorio = []
        }
      },
      immediate: false
    },
    'encuesta.formula_hta_dm': {
      handler(val) {
        if (!val || val === 'No') {
          this.encuesta.tiene_medicamentos = null
          this.encuesta.medicamentos = []
          this.encuesta.entrega_medicamentos = null
          this.encuesta.proxima_entrega_medicamentos = null
          this.encuesta.interrumpe_tto = null
          this.encuesta.a_tiempo_tto = null
          this.encuesta.suspende_mejora_tto = null
          this.encuesta.suspende_adverso_tto = null
        }
      },
      immediate: false
    },
    'encuesta.diabetes': {
      handler(val) {
        if (!val || val === 'No' || val === 'No Sabe') {
          this.encuesta.tipo_diabetes = null
        }
      },
      immediate: false
    }
  },
  created() {
    this.encuesta = this.clone(this.modelEncuestaRCV)
  },
  methods: {
    guardarencuesta() {
      this.$refs.formencuesta.validate().then(result => {
        if (result) {
          let encuestaData = {}
          if (this.encuesta.fallida) {
            encuestaData = {
              id: this.encuesta.id,
              afiliado_id: this.encuesta.afiliado_id,
              id_afiliado: this.encuesta.id_afiliado,
              duracion: this.encuesta.duracion,
              observaciones: this.encuesta.observaciones,
              fallida: this.encuesta.fallida,
              no_efectividad: this.encuesta.no_efectividad
            }
          } else if(this.encuesta.dispuesto) {
            encuestaData = this.clone(this.encuesta)
            encuestaData.no_efectividad = null

            if(encuestaData.especialidad.find(x => x === 'No sabe o no recuerda') && encuestaData.especialidad.length > 1){
              encuestaData.especialidad = encuestaData.especialidad.filter(x => x !== 'No sabe o no recuerda')
            }
            if(!encuestaData.especialidad.find(x => x === 'Otra especialidad')){
              encuestaData.otra_especialidad = null
            }
            encuestaData.especialidad = encuestaData.especialidad && encuestaData.especialidad.length ? encuestaData.especialidad.join(',') : null

            if(encuestaData.laboratorio.find(x => x === 'No sabe o no recuerda') && encuestaData.laboratorio.length > 1){
              encuestaData.laboratorio = encuestaData.laboratorio.filter(x => x !== 'No sabe o no recuerda')
            }
            if(!encuestaData.laboratorio.find(x => x === 'Otro')){
              encuestaData.otro_examen = null
            }
            encuestaData.laboratorio = encuestaData.laboratorio && encuestaData.laboratorio.length ? encuestaData.laboratorio.join(',') : null

            if(!encuestaData.enfermedad_cv.find(x => x === 'Otro')){
              encuestaData.otra_enfermedad_cv = null
            }
            encuestaData.enfermedad_cv = encuestaData.enfermedad_cv && encuestaData.enfermedad_cv.length ? encuestaData.enfermedad_cv.join(',') : null
          } else {
            encuestaData = {
              id: this.encuesta.id,
              afiliado_id: this.encuesta.afiliado_id,
              id_afiliado: this.encuesta.id_afiliado,
              responde_paciente: this.encuesta.responde_paciente,
              acudiente: this.encuesta.acudiente,
              afiliado_actualizado: this.encuesta.afiliado_actualizado,
              duracion: this.encuesta.duracion,
              sintomas: this.encuesta.sintomas,
              consulta_por_urgencias: this.encuesta.consulta_por_urgencias,
              paciente_hospitalizado: this.encuesta.paciente_hospitalizado,
              codigo_ips_hospitalizacion: this.encuesta.codigo_ips_hospitalizacion,
              motivo_hospitalizacion: this.encuesta.motivo_hospitalizacion,
              dispuesto: this.encuesta.dispuesto,
              observaciones: this.encuesta.observaciones,
              fallida: this.encuesta.fallida,
              no_efectividad: null
            }
          }

          if (encuestaData.responde_paciente) {
            encuestaData.acudiente = null
          }
          this.loading = true
          let request = encuestaData.id ? this.axios.put(`rcvs/${encuestaData.id}`, encuestaData) : this.axios.post(`rcvs`, encuestaData)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `La encuesta se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la encuesta.`, error: error})
              })
        }
      })
    },
    open(encuesta = null) {
      this.encuestaBase = encuesta
      this.dialog = true
      if (this.encuestaBase && this.encuestaBase.id) {
        this.getencuesta(this.encuestaBase.id)
      } else {
        this.encuesta.afiliado_id = this.encuestaBase.id_afiliado
        this.encuesta.id_afiliado = this.encuestaBase.id_afiliado
        this.encuesta.afiliado_actualizado.id = this.encuestaBase.id_afiliado
        this.encuesta.afiliado_actualizado.direccion = this.encuestaBase.direccion
        this.encuesta.afiliado_actualizado.numero_celular = this.encuestaBase.numero_celular
        this.encuesta.afiliado_actualizado.email = this.encuestaBase.email
        intervalo = setInterval(() => {
          this.encuesta.duracion++
        }, 1000)
      }
    },
    close() {
      this.$refs.formencuesta.reset()
      this.dialog = false
      this.loading = false
      clearInterval(intervalo)
      this.$emit('close')
      this.menuObservaciones = false
      this.encuesta = this.clone(this.modelEncuestaRCV)
      this.encuestaBase = null
      this.hintIMC = ''
      this.hintTension = ''
    },
    getencuesta(idencuesta) {
      this.loading = true
      this.axios.get(`rcvs/${idencuesta}`)
          .then(response => {
            if (response.data.afiliado) {
              response.data.afiliado_actualizado = {
                id: response.data.afiliado.id,
                direccion: response.data.afiliado.direccion,
                numero_celular: response.data.afiliado.numero_celular,
                telefono_opcional: null,
                email: response.data.afiliado.email
              }
            } else {
              response.data.afiliado_actualizado = {
                id: null,
                direccion: null,
                numero_celular: null,
                telefono_opcional: null,
                email: null
              }
            }
            if (!response.data.acudiente) {
              response.data.acudiente = {
                identificacion: null,
                tipo_identificacion: null,
                nombre_completo: null,
                celular: null,
                email: null
              }
            }

            response.data.responde_paciente = response.data.acudiente.id ? 0 : 1
            response.data.conoce_pesotalla = (response.data.peso && response.data.talla) ? 'Si' : 'No'
            response.data.conoce_datostension = (response.data.diastolica && response.data.sistolica) ? 'Si' : 'No'
            response.data.ips_hospitalizacion = response.data.prestador || null
            response.data.sintomas = response.data.sintomas.map(x => x.id)
            response.data.medicamentos = response.data.medicamentos.map(x => x.id)
            setTimeout(() => {
              if (this.$refs.buscadorips) this.$refs.buscadorips.assign(response.data.ips_hospitalizacion)
            }, 400)
            this.encuesta = response.data
            setTimeout(() => {
              if (!response.data.medicamentos.length && !response.data.otros_medicamentos && this.$refs.formMedicamentos) this.$refs.formMedicamentos.noSaber()
              if ((!response.data.laboratorio.length || response.data.laboratorio.find(x => x === 'No sabe o no recuerda')) && this.$refs.formExamenes) this.$refs.formExamenes.noSaber()
              if ((!response.data.especialidad.length || response.data.especialidad.find(x => x === 'No sabe o no recuerda')) && this.$refs.formEspecialidades) this.$refs.formEspecialidades.noSaber()
            }, 1000)
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
          })
    },
    getIMC() {
      if (Number(this.encuesta.peso) && Number(this.encuesta.talla)) {
        let resultado = Number((this.encuesta.peso / Math.pow(this.encuesta.talla, 2)).toFixed(2))
        if (resultado < 18.5) this.hintIMC = 'Peso inferior al normal'
        if (resultado >= 18.5 && resultado < 25) this.hintIMC = 'Normal'
        if (resultado >= 25 && resultado < 30) this.hintIMC = 'Peso superior al normal'
        if (resultado >= 30 && resultado < 35) this.hintIMC = 'Obesidad'
        if (resultado >= 35) this.hintIMC = 'Obesidad Morbida'
        this.encuesta.imc = resultado
      } else {
        this.encuesta.imc = null
      }
    },
    getTension() {
      if (Number(this.encuesta.sistolica) && Number(this.encuesta.diastolica)) {
        if (this.encuesta.sistolica >= 140 || this.encuesta.diastolica >= 90) {
          this.hintTension = 'Con hipertensión'
        } else {
          this.hintTension = 'Tensión Controlada'
        }
      } else {
        this.hintTension = ''
      }
    }
  }
}
</script>

<style scoped>

</style>