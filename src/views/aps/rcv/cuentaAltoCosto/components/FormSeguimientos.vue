<template>
  <v-dialog v-model="dialog" persistent
  fullscreen
  hide-overlay
  transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-edit</v-icon>
        <v-toolbar-title id="inicio">{{ seguimiento && seguimiento.id ? `Seguimiento No. ${seguimiento.id}` : `Nuevo Seguimiento` }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <ValidationObserver ref="formSeguimiento" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col md="6" offset-md="3" class="mx-auto" v-if="dialog">
                <v-row>
                  <v-col cols="12" class="px-0">
                    <v-system-bar class="font-weight-bold" dark color="indigo" :height="40" :window="true">
                      <!--<v-icon>fas fa-user</v-icon>-->
                      <span>VARIABLES CLÍNICAS Y PARACLÍNICAS DE LAS ENFERMEDADES PRECURSORAS</span>
                    </v-system-bar>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <buscador-ips
                          ref="buscadorips"
                          label="IPS del seguimiento"
                          name="IPS del seguimiento"
                          rules="required"
                          v-model="seguimiento.codigo_prestador"
                        ></buscador-ips>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-date
                            v-model="seguimiento.ingreso_nefroproteccion"
                            label="Fecha de ingreso al programa de nefroprotección"
                            name="Fecha de ingreso al programa de nefroprotección"
                            rules="required"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="12" md="12" lg="12">
                            <c-radio
                                v-model="seguimiento.hta"
                                label="¿Diagnóstico confirmado de Hipertensión Arterial?"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                                rules="required"
                                name="Diagnóstico confirmado de Hipertensión Arterial"
                            ></c-radio>
                          </v-col>
                          <template v-if="seguimiento.hta">
                            <v-col cols="12" sm="12" md="6" lg="6">
                              <c-date
                                  v-model="seguimiento.fecha_dx_hta"
                                  label="Fecha de diagnostico de la Hipertension Arterial"
                                  name="Fecha de diagnostico de la Hipertension Arterial"
                                  rules="required"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="6">
                              <c-number
                                  label="Costo HTA durante el período de reporte"
                                  name="Costo HTA durante el período de reporte"
                                  rules="required|min:0"
                                  v-model="seguimiento.costo_hta"
                              ></c-number>
                            </v-col>
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="12" md="12" lg="12">
                            <c-radio
                                v-model="seguimiento.diabetes"
                                label="¿Tiene Diagnóstico confirmado de Diabetes Mellitus - DM?"
                                name="Diagnóstico confirmado de Diabetes Mellitus"
                                :items="diabetesOptions && diabetesOptions.length ? diabetesOptions : []"
                                item-value="codigo"
                                item-text="opcion"
                                rules="required"
                            >
                            </c-radio>
                          </v-col>
                          <template v-if="seguimiento.diabetes === 1 || seguimiento.diabetes === 3 || seguimiento.diabetes === 4">
                            <v-col cols="12" sm="12" md="6" lg="6">
                              <c-date
                                  v-model="seguimiento.fecha_dx_dm"
                                  label="Fecha de diagnostico de la Diabetes Mellitus"
                                  name="Fecha de diagnostico de la Diabetes Mellitus"
                                  rules="required"
                              />
                            </v-col>
                            <v-col cols="12" sm="12" md="6" lg="6">
                              <c-number
                                  label="Costo DM durante el período de reporte"
                                  name="Costo DM durante el período de reporte"
                                  rules="required|min:0"
                                  v-model="seguimiento.costo_dm"
                              ></c-number>
                            </v-col>
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="seguimiento.insulinorequiriente"
                            label="Insulinorequiriente"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Insulinorequiriente"
                            :column="!$vuetify.breakpoint.smAndUp"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-select-complete
                            v-model="seguimiento.etiologia_erc"
                            label="Etiología de la ERC"
                            name="Etiología de la ERC"
                            :items="etiologiasOptions && etiologiasOptions.length ? etiologiasOptions : []"
                            item-value="codigo"
                            item-text="opcion"
                            rules="required"
                        ></c-select-complete>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile>
                      <v-card-text>
                        <span class="font-weight-bold orange--text caption">Registro e identificación de IMC</span>
                        <v-row>
                          <v-col class="pb-0" cols="12" md="6">
                            <c-number
                                v-model="seguimiento.peso"
                                label="Peso"
                                rules="required|min:0"
                                name="peso"
                                min="0"
                            ></c-number>
                          </v-col>
                          <v-col class="pb-0" cols="12" md="6">
                            <c-number
                                v-model="seguimiento.talla"
                                label="Talla"
                                rules="required|min:0"
                                name="talla"
                                min="0"
                            ></c-number>
                          </v-col>
                          <v-col class="pb-0" cols="12">
                            <c-number
                                v-model="seguimiento.imc"
                                label="IMC"
                                rules="required|min:0"
                                name="imc"
                                min="0"
                                :hint="hintIMC"
                                readonly
                                :clearable="false"
                            ></c-number>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-number
                            v-model="seguimiento.circunferencia_abdominal"
                            label="Circunferencia Abdominal (CMTS)"
                            rules="required|min:0"
                            name="Circunferencia Abdominal"
                            min="0"
                        ></c-number>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="seguimiento.alcohol"
                            label="Alcoholismo"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Alcoholismo"
                            :column="!$vuetify.breakpoint.smAndUp"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="seguimiento.tabaquismo"
                            label="Tabaquismo"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Tabaquismo"
                            :column="!$vuetify.breakpoint.smAndUp"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="seguimiento.sedentarismo"
                            label="Sedentarismo"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Sedentarismo"
                            :column="!$vuetify.breakpoint.smAndUp"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="seguimiento.adherencia"
                            label="Adherencia al tratamiento"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Adherencia al tratamiento"
                            :column="!$vuetify.breakpoint.smAndUp"
                        ></c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile>
                      <v-card-text>
                        <span
                            class="font-weight-bold orange--text caption">Registro e identificación de Tensión Arterial</span>
                          <v-row>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="seguimiento.tension_arterial_sistolica"
                                  label="Presión Sistólica"
                                  rules="required|min:0"
                                  name="presión sitólica"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6">
                              <c-number
                                  v-model="seguimiento.tension_arterial_diastolica"
                                  label="Presión Diastólica"
                                  rules="required|min:0"
                                  name="presión diastólica"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  :value="hintTension"
                                  label="Estadio HTA"
                                  rules="required"
                                  name="Estadio HTA"
                                  readonly
                                  :clearable="false"
                              >
                              </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  v-model="seguimiento.clasificacion_rcv"
                                  label="Clasificación del riesgo cardiovascular y metabolico"
                                  name="Clasificación del riesgo RCV"
                              >
                              </c-texto>
                            </v-col>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile>
                      <v-card-text>
                          <v-row>
                            <v-col class="pb-0" cols="12" md="6" lg="6">
                              <c-number
                                  v-model="seguimiento.clasificacion_estadio_erc_kcg"
                                  label="Clasificación estadio ERC KCG"
                                  rules="required|min:0"
                                  name="Clasificación estadio ERC KCG"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="6" lg="6">
                              <c-number
                                  v-model="seguimiento.tfg_anterior"
                                  label="Tasa de Filtración Glomerular (TFGE) KCG (REPORTE ANTERIOR)"
                                  rules="required|min:0"
                                  name="Tasa de Filtración Glomerular anterior"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12" md="12" lg="12">
                              <c-number
                                  v-model="seguimiento.perdida_funcional_renal"
                                  label="Perdida de la funcion renal"
                                  rules="required|min:0"
                                  name="Perdida de la funcion renal"
                                  min="0"
                              >
                              </c-number>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  v-model="seguimiento.clasificacion_findrisc"
                                  label="Clasificación riesgo FINDRISK"
                                  name="Clasificación riesgo FINDRISK"
                              >
                              </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                              <c-texto
                                  v-model="seguimiento.resultado_riesgo_framingham"
                                  label="Resultado Clasificación del Riego Framingham"
                                  name="Resultado Clasificación del Riego Framingham"
                              >
                              </c-texto>
                            </v-col>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-select-complete
                            v-model="seguimiento.antihipertensivos_ieca"
                            label="Antihipertensivos IECA"
                            :items="antihipertensivosIECA"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="Antihipertensivos IECA"
                        ></c-select-complete>
                        <c-select-complete
                            v-model="seguimiento.antihipertensivos_ara_2"
                            label="Antihipertensivos ARA II"
                            :items="antihipertensivosARA2"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="Antihipertensivos ARA II"
                        ></c-select-complete>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" class="px-0">
                    <v-system-bar class="font-weight-bold" dark color="indigo" :height="50" :window="true">
                      <!--<v-icon>fas fa-user</v-icon>-->
                      <span>INFORMACIÓN RELACIONADA CON DIAGNÓSTICO Y TRATAMIENTO DE LA ENFERMEDAD RENAL CRÓNICA</span>
                    </v-system-bar>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-select-complete
                            v-model="seguimiento.diagnostico_enfermedad_renal"
                            label="¿El usuario tiene diagnóstico de enfermedad renal crónica en cualquiera de sus estadios?"
                            :items="diagnosticosERC"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="estadio ERC"
                        ></c-select-complete>
                        <c-select-complete
                            v-model="seguimiento.estadio_erc"
                            label=" Estadio de ERC (Enfermedad Renal Crónica)"
                            :items="estadiosERC"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="Estadio de ERC "
                        ></c-select-complete>
                        <template v-if="seguimiento.estadio_erc === 5">
                          <c-date
                              v-model="seguimiento.fecha_erc_estadio_5"
                              label="Fecha de diagnóstico de ERC estadio 5"
                              name="Fecha de diagnóstico de ERC estadio 5"
                              rules="required"
                          />
                        </template>
                        <template v-if="seguimiento.diagnostico_enfermedad_renal === 1">
                          <c-select-complete
                              v-model="seguimiento.programa_atencion_erc"
                              label="¿Se encuentra en un programa de atención de ERC?"
                              :items="programasERC"
                              item-text="opcion"
                              item-value="codigo"
                              rules="required"
                              name="programa de atención de ERC"
                          ></c-select-complete>
                        </template>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-select-complete
                            v-model="seguimiento.novedad"
                            label="Novedad"
                            :items="novedades"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="novedad"
                        ></c-select-complete>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-select-complete
                            v-model="seguimiento.causa_de_muerte"
                            label="Causa de muerte"
                            :items="causasMuerte"
                            item-text="opcion"
                            item-value="codigo"
                            rules="required"
                            name="causa de muerte"
                        ></c-select-complete>
                        <template v-if="seguimiento.causa_de_muerte && seguimiento.causa_de_muerte !== 98">
                          <c-date
                              v-model="seguimiento.fecha_muerte"
                              label="Fecha de muerte"
                              name="Fecha de muerte"
                              rules="required"
                          />
                        </template>
                        <template v-if="seguimiento.causa_de_muerte === 6">
                          <c-texto
                              label="¿Cual causa de muerte externa?"
                              name="causa de muerte externa"
                              rules="required"
                              v-model="seguimiento.causa_muerte_externa"
                          ></c-texto>
                        </template>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="usuario_hospitalizado"
                            label="¿Usuario hospitalizado en los ultimos 6 meses?"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            rules="required"
                            name="Sedentarismo"
                        ></c-radio>
                        <template v-if="usuario_hospitalizado">
                          <c-texto
                              label="Escriba la institucion"
                              name="institucion"
                              rules="required"
                              v-model="seguimiento.hospitalizado_reciente"
                          ></c-texto>
                        </template>
                        <template v-if="seguimiento.hospitalizado_reciente">
                          <c-date
                              v-model="seguimiento.fecha_hospitalizacion_reciente"
                              label="Fecha de la hospitalizacion"
                              name="Fecha de la hospitalizacion"
                              rules="required"
                          />
                        </template>
                        <c-text-area
                            label="Observaciones"
                            name="observaciones"
                            rules="required"
                            v-model="seguimiento.observaciones"
                        ></c-text-area>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" lg="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <buscador-ips
                          ref="buscadorips2"
                          label="IPS de asistencia"
                          name="IPS de asistencia"
                          rules="required"
                          v-model="seguimiento.ips_asistencia"
                        ></buscador-ips>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile>
                      <v-card-text>
                        <span class="font-weight-bold black--text caption">Fechas de valoración</span>
                        <v-row>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_nutricion"
                                label="Nutricion"
                                name="Nutricion"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_internista"
                                label="Internista"
                                name="Internista"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_nefrologia"
                                label="Nefrologia"
                                name="Nefrologia"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_endocrinologia"
                                label="Endocrinologia"
                                name="Endocrinologia"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_psicologia"
                                label="Psicologia"
                                name="Psicologia"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.fecha_valoracion_oftamologia"
                                label="Oftamologia"
                                name="Oftamologia"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.control_grupal"
                                label="Control grupal"
                                name="Control grupal"
                                rules="required"
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="6" lg="6">
                            <c-date
                                v-model="seguimiento.control_enfermeria"
                                label="Control de enfermeria"
                                name="Control de enfermeria"
                                rules="required"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn large @click.stop="close">
                    <v-icon>mdi-close</v-icon>
                    Cerrar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                  <v-btn large color="primary" @click.stop="crearSeguimiento">
                    <v-icon left>fas fa-save</v-icon>
                    Guardar encuesta
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </ValidationObserver>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormSeguimientos",
  data: () => ({
    seguimiento: {},
    dialog: false,
    loadingB: false,
    loading: false,
    diabetesOptions: [],
    etiologiasOptions: [],
    hintIMC: null,
    antihipertensivosIECA: [],
    antihipertensivosARA2: [],
    diagnosticosERC: [],
    estadiosERC: [],
    programasERC: [],
    novedades: [],
    causasMuerte: [],
    hintTension: null,
    usuario_hospitalizado: null
  }),
  props: {
    afiliado: {
      type: [Object, Array],
      default: null
    }
  },
  watch: {
    'seguimiento.peso': {
      handler() {
        this.getIMC()
      },
      immediate: false
    },
    'seguimiento.talla': {
      handler() {
        this.getIMC()
      },
      immediate: false
    },
    'seguimiento.tension_arterial_sistolica': {
      handler() {
        this.getTension()
      },
      immediate: false
    },
    'seguimiento.tension_arterial_diastolica': {
      handler() {
        this.getTension()
      },
      immediate: false
    },
    'seguimiento.estadio_erc': {
      handler() {
        if(this.seguimiento.estadio_erc === 98){
          this.seguimiento.diagnostico_enfermedad_renal = 0
        }
        if(this.seguimiento.estadio_erc !== 5){
          this.seguimiento.fecha_erc_estadio_5 = null
        }
      },
      immediate: false
    },
    'seguimiento.diagnostico_enfermedad_renal': {
      handler() {
        if(this.seguimiento.diagnostico_enfermedad_renal !== 1){
          this.seguimiento.programa_atencion_erc = null
        }
      },
      immediate: false
    },
    'seguimiento.causa_de_muerte': {
      handler() {
        if(this.seguimiento.causa_de_muerte && this.seguimiento.causa_de_muerte === 98){
          this.seguimiento.fecha_muerte = null
        }
        if(this.seguimiento.causa_de_muerte !== 6){
          this.seguimiento.causa_muerte_externa = null
        }
      },
      immediate: false
    },
    'hintTension': {
      handler() {
        if(this.hintTension){
          this.seguimiento.estadio_hta = this.hintTension
        }
      },
      immediate: false
    },
    'usuario_hospitalizado': {
      handler() {
        if(!this.usuario_hospitalizado){
          this.seguimiento.hospitalizado_reciente = null
        }
      },
      immediate: false
    },
    'seguimiento.hospitalizado_reciente': {
      handler() {
        if(this.seguimiento.hospitalizado_reciente === null){
          this.seguimiento.fecha_hospitalizacion_reciente = null
        }
      },
      immediate: false
    },
    'seguimiento.tfg': {
      handler() {
        if(this.seguimiento.tfg === 999){
          this.seguimiento.estadio_erc = 99
        }
        if(this.seguimiento.tfg !== 999 && this.seguimiento.estadio_erc === 99){
          this.seguimiento.estadio_erc = null
        }
      },
      immediate: false
    },
  },
  methods: {
    open(seguimiento = null, afiliado_id = null){
      if(seguimiento){
        this.seguimiento = this.clone(seguimiento)
        if(this.seguimiento.hospitalizado_reciente !== null){
          this.usuario_hospitalizado = 1
        }else{
          this.usuario_hospitalizado = 0
        }
      }
      this.seguimiento.afiliado_id = afiliado_id
      this.dialog = true
      setTimeout(() => {
        if (this.seguimiento.ips_seguimiento) this.$refs.buscadorips.assign(this.seguimiento.ips_seguimiento)
        if (this.seguimiento.ips_asistencia_object) this.$refs.buscadorips2.assign(this.seguimiento.ips_asistencia_object)
      }, 600)
      this.getComplementos()
    },
    getComplementos(){
      this.loading = true
      this.axios.get('complementos-alto-costo').then(response => {
        this.diabetesOptions = response.data.seguimientos_opciones.filter(x => x.campo === 'diabetes')
        this.etiologiasOptions = response.data.seguimientos_opciones.filter(x => x.campo === 'etiologia_erc')
        this.antihipertensivosIECA = response.data.seguimientos_opciones.filter(x => x.campo === 'antihipertensivos_ieca')
        this.antihipertensivosARA2 = response.data.seguimientos_opciones.filter(x => x.campo === 'antihipertensivos_ara_2')
        this.diagnosticosERC = response.data.seguimientos_opciones.filter(x => x.campo === 'diagnostico_enfermedad_renal')
        this.estadiosERC = response.data.seguimientos_opciones.filter(x => x.campo === 'estadio_erc')
        this.programasERC = response.data.seguimientos_opciones.filter(x => x.campo === 'programa_atencion_erc')
        this.novedades = response.data.seguimientos_opciones.filter(x => x.campo === 'novedades')
        this.causasMuerte = response.data.seguimientos_opciones.filter(x => x.campo === 'causa_de_muerte')
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$store.commit('snackbar', {color: 'error', message: ' al conseguir complementos', error: error})
      })
    },
    close(){
      this.seguimiento = {}
      this.dialog = false
    },
    crearSeguimiento(){
      this.$refs.formSeguimiento.validate().then(result => {
        if(result){
          this.loading = true
          let request = this.seguimiento && this.seguimiento.id ? this.axios.put(`seguimientos/${this.seguimiento.id}`, this.seguimiento)
          : this.axios.post(`seguimientos`, this.seguimiento)
          request.then(response => {
            this.$store.commit('snackbar', {color: 'success', message: `seguimiento ${this.seguimiento && this.seguimiento.id ? 'editado' : 'creado'} con exito`})
            this.loading = false
            this.$emit('refresh', response.data.afiliado_id)
            this.close()
          }).catch(error => {
            this.$store.commit('snackbar', {color: 'error', message: `al ${this.seguimiento && this.seguimiento.id ? 'editar' : 'crear'} seguimiento`, error: error})
            this.loading = false
          })
        }
      })
    },
    getIMC() {
      if (Number(this.seguimiento.peso) && Number(this.seguimiento.talla)) {
        let resultado = Number((this.seguimiento.peso / Math.pow(this.seguimiento.talla, 2)).toFixed(2))
        if (resultado < 18.5) this.hintIMC = 'Bajo peso'
        if (resultado >= 18.5 && resultado < 25) this.hintIMC = 'Peso normal'
        if (resultado >= 25 && resultado < 30) this.hintIMC = 'Sobrepeso'
        if (resultado >= 30 && resultado < 35) this.hintIMC = 'Obesidad (grado 1)'
        if (resultado >= 35 && resultado < 40) this.hintIMC = 'Obesidad (grado 2)'
        if (resultado >= 40) this.hintIMC = 'Obesidad (grado 3)'
        this.seguimiento.imc = resultado
        this.seguimiento.clasificacion_imc = this.hintIMC
      } else {
        this.seguimiento.imc = null
        this.seguimiento.clasificacion_imc = null
      }
    },
    getTension() {
      if (Number(this.seguimiento.tension_arterial_sistolica) && Number(this.seguimiento.tension_arterial_diastolica)) {
        if ((this.seguimiento.tension_arterial_sistolica >= 140 && this.seguimiento.tension_arterial_sistolica <= 159) && (this.seguimiento.tension_arterial_diastolica >= 90 && this.seguimiento.tension_arterial_diastolica <= 99)) {
          this.hintTension = 'Grado 1 (Leve)'
        }else if ((this.seguimiento.tension_arterial_sistolica >= 160 && this.seguimiento.tension_arterial_sistolica <= 179) && (this.seguimiento.tension_arterial_diastolica >= 100 && this.seguimiento.tension_arterial_diastolica <= 109)) {
          this.hintTension = 'Grado 2 (Moderada)'
        } else if (this.seguimiento.tension_arterial_sistolica >= 180 && this.seguimiento.tension_arterial_diastolica >= 110) {
          this.hintTension = 'Grado 3 (Severa)'
        } else if (this.seguimiento.tension_arterial_sistolica >= 140 && this.seguimiento.tension_arterial_diastolica < 90) {
          this.hintTension = 'HTA Sistolica aislada'
        }
      } else {
        this.hintTension = ''
      }
    }
  },

}
</script>

<style scoped>

</style>
