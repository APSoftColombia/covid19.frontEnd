<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-chart-line</v-icon>
        <v-toolbar-title v-if="evolucion">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ evolucion.id ? `Seguimiento No. ${evolucion.id}` : 'Nuevo Seguimiento' }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="evolucion.lugar_atencion">
                {{
                  evolucion.lugar_atencion === 3 ? 'Atención en ' : ''
                }}{{ ordenesMedicas.find(x => x.id === evolucion.lugar_atencion).orden }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
<!--      <div-->
<!--          :style="`right: ${$vuetify.breakpoint.xsOnly ? '84' : '104' }px !important; top: ${$vuetify.breakpoint.smAndDown ? '4' : '14' }px !important; position: fixed !important; z-index: 2 !important;`">-->
<!--        <v-chip-->
<!--            color="darken-2 primary"-->
<!--            label-->
<!--        >-->
<!--          <v-icon left>mdi-timer</v-icon>-->
<!--          {{ time }}-->
<!--        </v-chip>-->
<!--      </div>-->
      <v-container fluid>
        <v-row no-gutters>
          <jitsi-meet ref="jitsimeet" v-if="enlinea && videollamar" :enlinea="enlinea"
                      @cargado="val => showbuttonmeet = !val"
                      @cerrar="enlinea = null, showbuttonmeet = true"></jitsi-meet>
          <v-col cols="12" md="6" v-if="enlinea"></v-col>
          <v-col md="6" :offset-md="enlinea ? '0' : '3'">
            <jitsi-meet-button v-if="videollamar" :show="showbuttonmeet" block :tamizaje="tamizaje"
                               @enlinea="val => enlinea = val"></jitsi-meet-button>
            <datos-personales :abierto="false" :tamizaje="tamizaje" @actualizarTamizaje="val => $emit('actualizarTamizaje', val)"></datos-personales>
            <ValidationObserver ref="formEvolucion" v-slot="{ invalid, validated, passes, validate }"
                                autocomplete="off">
              <v-row>
                <v-col cols="12" class="pb-0" v-if="[2, 3].find(x => x === tamizaje.orden_medica_id)">
                  <v-switch
                      v-model="evolucion.seguimiento_telefonico"
                      label="Seguimiento Telefónico"
                      color="primary"
                      :true-value="1"
                      :false-value="0"
                  ></v-switch>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-col class="pb-0" cols="12">
                    <c-date
                        v-model="evolucion.fecha_seguimiento"
                        rules="required"
                        label="Fecha del Seguimiento"
                        name="fecha del seguimiento"
                        :max="moment().format('YYYY-MM-DD')"
                    >
                    </c-date>
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                          v-model="evolucion.fallida"
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
                <template v-if="evolucion.fallida === 1">
                  <v-col cols="12 pb-0">
                    <c-select-complete
                        v-model="evolucion.no_efectividad"
                        placeholder="Motivo de no localización"
                        rules="required"
                        name="motivo de no localización"
                        :items="tiposNoEfectiva || []"
                    >
                    </c-select-complete>
                  </v-col>
                </template>
              </v-row>
              <template v-if="!evolucion.fallida">
                <v-row justify="center">
                  <v-btn color="primary" v-if="ultimoSeguimientoOK && !solicitaUltimo"
                         @click="copiarUltimoSeguimiento">
                    Obtener Copia de último seguimiento
                  </v-btn>
                  <v-col cols="12">
                    <sintomas-fecha
                        v-if="dialog"
                        ref="sintomasFecha"
                        :evolucion="evolucion"
                    ></sintomas-fecha>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-check
                            v-model="evolucion.signos_alarma"
                            label="Signos de Alarma"
                            :items="signosAlarma ? signosAlarma.filter(x => x.aplica_covid) : []"
                            item-text="descripcion"
                            item-value="id"
                        >
                        </c-check>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <template>
                  <v-row>
                    <v-col class="pb-0" cols="12">
                      <v-checkbox
                          class="shrink mt-0 mb-1"
                          v-model="activaPR"
                          :label="activaPR ? 'Frecuencia de Pulso (PR)' : 'Toma de Frecuencia de Pulso (PR)'"
                          :ripple="!activaPR"
                          hide-details
                          @change="!activaPR ? evolucion.frecuencia_pulso = null : ''"
                      ></v-checkbox>
                      <c-number
                          v-if="activaPR"
                          placeholder="Frecuencia de Pulso"
                          v-model="evolucion.frecuencia_pulso"
                          name="frecuencia de pulso"
                          rules="required|min:0"
                          min="0"
                          step="1"
                      >
                      </c-number>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pb-0" cols="12">
                      <v-checkbox
                          class="shrink mt-0 mb-1"
                          v-model="activaSPO2"
                          :label="activaSPO2 ? 'Saturación de Oxígeno (SPO2)' : 'Toma de Saturación de Oxígeno (SPO2)'"
                          :ripple="!activaSPO2"
                          hide-details
                          @change="!activaSPO2 ? evolucion.saturacion_oxigeno = null : ''"
                      ></v-checkbox>
                      <c-number
                          v-if="activaSPO2"
                          placeholder="Saturación de Oxígeno"
                          v-model="evolucion.saturacion_oxigeno"
                          name="saturación de oxígeno"
                          rules="required|min:0"
                          min="0"
                      >
                      </c-number>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-checkbox
                          class="shrink mt-0 mb-1"
                          v-model="activaTemperatura"
                          :label="activaTemperatura ? 'Temperatura' : 'Toma de Temperatura'"
                          :ripple="!activaTemperatura"
                          hide-details
                          @change="!activaTemperatura ? evolucion.temperatura = null : ''"
                      ></v-checkbox>
                      <c-number
                          v-if="activaTemperatura"
                          placeholder="Temperatura"
                          v-model="evolucion.temperatura"
                          name="temperatura"
                          suffix="°C"
                          rules="required|min:0"
                          min="0"
                      >
                      </c-number>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" class="pb-0">
                      <ValidationProvider name="linfocitos" rules="min:0|max:5" v-slot="{ errors }">
                        <v-text-field
                            class="labelforce"
                            v-model.number="evolucion.linfocitos"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            outlined
                            dense
                            :error-messages="errors"
                            clearable
                        >
                          <template slot="label">
                            Linfocitos (*10<sup style="top: -0.5em; !important;">9</sup>/L)
                          </template>
                        </v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <c-number
                          label="LDH (U/L)"
                          v-model="evolucion.ldh"
                          name="LDH"
                          rules="min:0|max:1000"
                          min="0"
                          max="1000"
                          step="1"
                      >
                      </c-number>
                    </v-col>
                  </v-row>
                </template>
                <v-row>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="evolucion.antinflamatorios"
                            label="¿Consume medicamentos antiinflamatorios o acetaminofén?"
                            rules="required"
                            name="consumo de antiinflamatorios"
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
                            v-model="evolucion.ibuprofeno"
                            label="¿Consume o ha consumido Ibuprofeno?"
                            rules="required"
                            name="consumo de ibuprofeno"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <form-comorbilidades
                    v-if="tamizaje && tamizaje.evoluciones && ((!tamizaje.evoluciones.length || (tamizaje.evoluciones.length && !tamizaje.evoluciones.find(x => !x.fallida))) || (evolucion.id && tamizaje.evoluciones.filter(x => !x.fallida).length === 1))"
                    :array-comorbilidades="evolucion.comorbilidades"
                    @changeComorbilidades="val => evolucion.comorbilidades = val"
                ></form-comorbilidades>
                <v-row v-else>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text class="pb-0">
                        <v-label>Comorbilidades</v-label>
                        <p v-if="comorbilidades && !comorbilidades.length">No registra comorbilidades.</p>
                      </v-card-text>
                      <v-card-text v-if="comorbilidades && comorbilidades.length">
                        <template v-for="(chip, indexChip) in comorbilidades">
                          <v-chip label class="mr-2 mb-2 white--text" color="indigo lighten-1"
                                  :key="`chipx${indexChip}`">{{ chip.descrip }}
                          </v-chip>
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
                            v-model="evolucion.hospitalizado"
                            label="¿Está actualmente hospitalizado por IRA IRAG o IRAGI?"
                            rules="required"
                            name="actualmente hospitalizado"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <template v-if="evolucion.hospitalizado">
                    <v-col class="pb-0" cols="12">
                      <c-texto
                          v-model="evolucion.lugar_hospitalizacion"
                          label="Lugar Hospitalización"
                          rules="required"
                          name="lugar hospitalización"
                          upper-case
                      >
                      </c-texto>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12">
                      <c-select-complete
                          v-model="evolucion.causa_hospitalizacion"
                          label="Causa Hospitalización"
                          rules="required"
                          name="causa hospitalización"
                          :items="causasHospitalizacion"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12">
                      <c-date
                          v-model="evolucion.fecha_ingreso"
                          rules="required"
                          label="Fecha Ingreso Hospitalización"
                          name="fecha ingreso hospitalización"
                          :max="moment().format('YYYY-MM-DD')"
                      >
                      </c-date>
                    </v-col>
                  </template>
                </v-row>
              </template>
              <v-row>
                <v-col class="pb-0" cols="12">
                  <v-label>Observaciones
                    {{ evolucion.fallida ? '' : '- Describa la ruta de tratamiento a seguir del paciente' }}
                  </v-label>
                  <c-text-area
                      v-model="evolucion.observaciones"
                      placeholder="Observaciones"
                      rules="required"
                      name="observaciones"
                  >
                  </c-text-area>
                </v-col>
              </v-row>
              <template v-if="!evolucion.fallida">
                <v-row>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                            v-model="evolucion.clasificacion"
                            label="Clasificación del Paciente de acuerdo con LINEAMIENTOS PARA LA DETECCIÓN Y MANEJO DE CASOS DE COVID-19 POR LOS PRESTADORES DE SERVICIOS DE SALUD EN COLOMBIA."
                            rules="required"
                            name="clasificación COVID-19"
                            :items="clasificacionesCovidSeleccionables"
                            item-text="nombre"
                            item-value="id"
                            classitempb="pb-2"
                            @click:help="item => verAyuda(item)"
                        >
                        </c-radio>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <template v-if="tamizaje.diagnosticado_covid">
                    <v-col cols="12" class="pb-0">
                      <c-select-complete
                          v-model="evolucion.sivigila"
                          label="Reportado a SIVIGILA"
                          :items="[{value: null, text: 'NO APLICA'}, {value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                          item-value="value"
                          item-text="text"
                          :clearable="false"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" v-if="evolucion.sivigila === 1">
                      <c-texto
                          v-model="evolucion.entidad_reporta_sivigila"
                          label="Entidad que reporta a SIVIGILA"
                          rules="required"
                          name="entidad que reporta a SIVIGILA"
                          upper-case
                      >
                      </c-texto>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-select-complete
                          v-model="evolucion.ssc"
                          label="Reportado a SSC"
                          :items="[{value: null, text: 'NO APLICA'}, {value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                          item-value="value"
                          item-text="text"
                          :clearable="false"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-select-complete
                          v-model="evolucion.crue"
                          label="Llamada al CRUE"
                          :items="[{value: null, text: 'NO APLICA'}, {value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                          item-value="value"
                          item-text="text"
                          :clearable="false"
                      >
                      </c-select-complete>
                    </v-col>
                  </template>
                  <v-col cols="12" class="pb-0" v-if="evolucion.clasificacion === '6'">
                    <v-label>Justificación clínica de no clasificado</v-label>
                    <c-text-area
                        v-model="evolucion.justificacion_no_clasificado"
                        placeholder="Justificación clínica de no clasificado"
                        rules="required"
                        name="justificación clínica de no clasificado"
                    >
                    </c-text-area>
                  </v-col>
                  <template v-if="evolucion.lugar_atencion === 2 && !evolucion.seguimiento_telefonico">
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-toolbar dense color="teal">
                          <v-toolbar-title class="white--text">
                            <v-icon left>fas fa-{{ evolucion.lugar_atencion === 2 ? 'clinic-medical' : 'hospital' }}
                            </v-icon>
                            Resumen de Historia Clínica
                          </v-toolbar-title>
                        </v-toolbar>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-text-area
                          v-model="evolucion.motivo_consulta"
                          label="Motivo de Consulta"
                          rules="required"
                          name="motivo de consulta"
                      ></c-text-area>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-text-area
                          v-model="evolucion.anamnesis"
                          label="Enfermedad Actual"
                          rules="required"
                          name="enfermedad actual"
                      ></c-text-area>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-text-area
                          v-model="evolucion.examen_fisico"
                          label="Examen Físico"
                          rules="required"
                          name="examen físico"
                      ></c-text-area>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <postulador
                          no-data-text="Búsqueda por código o descripción."
                          item-text="descrip"
                          label="Diagnóstico"
                          route="cie10"
                          filter="codigo,descrip"
                          v-model="evolucion.cie10"
                          name="diagnóstico"
                          rules="required"
                          :hint="evolucion.cie10 ? evolucion.cie10.id : ''"
                          @input="val => evolucion.cie10_id = val ? val.codigo : null"
                      >
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title>{{ item.descrip }}</v-list-item-title>
                            <v-list-item-subtitle>Código: {{ item.codigo }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                        <template v-slot:selection="{ attr, on, item, selected }">
                          <v-list-item class="pa-0" style="width: 100% !important;">
                            <v-list-item-content>
                              <v-list-item-title>{{ item.descrip }}</v-list-item-title>
                              <v-list-item-subtitle>Código: {{ item.codigo }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </postulador>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <c-text-area
                          v-model="evolucion.tratamiento"
                          label="Tratamiento"
                          rules="required"
                          name="tratamiento"
                      ></c-text-area>
                    </v-col>
                  </template>
                  <v-col cols="12" class="pb-0"
                         v-if="evolucion.lugar_atencion === 3 && !evolucion.seguimiento_telefonico">
                    <c-text-area
                        v-model="evolucion.evolucion_diaria_hospitalaria"
                        label="Evolución diaria"
                        rules="required"
                        name="evolución diaria"
                    ></c-text-area>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <c-select-complete
                        v-model="evolucion.orden_medica_id"
                        label="Orden Médica"
                        rules="required"
                        name="orden médica"
                        :items="ordenesMedicas"
                        item-text="orden"
                        item-value="id"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <c-select-complete
                        v-model="evolucion.estado_afectacion"
                        label="Estado de Afectación"
                        rules="required"
                        name="estado de afectación"
                        :items="estadosAfectacionFiltrados"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col cols="12" v-if="evolucion.clasificacion !== '6'">
                    <v-switch
                        label="Solicitar Toma de Muestra"
                        v-model="evolucion.solicitud_prueba"
                        :false-value="0"
                        :true-value="1"
                        class="mt-0"
                        color="primary"
                        hide-details
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" v-if="verFormAislamiento || evolucion.obligaAislamiento">
                    <v-switch
                        label="Crear Orden de Aislamiento"
                        :readonly="evolucion.obligaAislamiento"
                        v-model="verFormularioAislamiento"
                        :false-value="0"
                        :true-value="1"
                        class="mt-0"
                        color="primary"
                        hide-details
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-expand-transition mode="group">
                  <div v-if="verFormularioAislamiento && verFormAislamiento && evolucion.aislamiento">
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-card flat>
                          <v-toolbar dense color="deep-purple">
                            <v-toolbar-title class="white--text">
                              <v-icon left>mdi-door-closed-lock</v-icon>
                              Orden de Aislamiento
                            </v-toolbar-title>
                          </v-toolbar>
                        </v-card>
                      </v-col>
                    </v-row>
                    <form-aislamiento
                        :tamizaje="tamizaje"
                        :aislamiento="evolucion.aislamiento"
                        :seguimiento_aislamiento="evolucion.seguimiento_aislamiento"
                    ></form-aislamiento>
                  </div>
                </v-expand-transition>
                <template v-if="verFormSeguimientoAislamiento && evolucion.seguimiento_aislamiento">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-toolbar dense color="deep-purple">
                          <v-toolbar-title class="white--text">
                            <v-icon left>mdi-door-closed-lock</v-icon>
                            Seguimiento de Aislamiento
                          </v-toolbar-title>
                        </v-toolbar>
                      </v-card>
                    </v-col>
                  </v-row>
                  <form-seguimiento-aislamiento
                      :aislamiento="aislamientoFinal"
                      :seguimiento_aislamiento="evolucion.seguimiento_aislamiento"
                  >
                  </form-seguimiento-aislamiento>
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
                    @click.stop="guardarSeguimiento"
                >
                  <v-icon left>fas fa-save</v-icon>
                  Guardar Seguimiento
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-container>
      <help-modal ref="helpModal"></help-modal>
      <v-dialog
          v-model="dialogConfirmFormPaciente"
          persistent
          max-width="520"
      >
        <v-card>
          <v-toolbar color="warning" dark>
            <v-toolbar-title>
              <v-icon large color="white">mdi-alert</v-icon>
              Información del paciente
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-3 body-1 text-center">El correcto diligenciamiento de la información de los pacientes, garantiza la eficiencia en los procesos de seguimiento de la pandemia y reportes de datos ante las entidades pertinentes.</v-card-text>
          <v-card-actions>
            <v-btn
                color="warning darken-1"
                text
                @click="dialogConfirmFormPaciente = false"
            >
              Omitir
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                v-if="permisos.datosPacienteEditar"
                color="warning darken-1"
                @click="() => {
                  $refs.modalPaciente.open(tamizaje)
                  dialogConfirmFormPaciente = false
                }"
            >
              Verificar Datos
            </v-btn>
            <v-chip v-else label color="grey" dark>
              Sin permisos para verificar
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <modal-paciente v-if="permisos.datosPacienteEditar" ref="modalPaciente" @actualizado="val => $emit('actualizarTamizaje', val)"></modal-paciente>
      <app-section-loader :status="loading"></app-section-loader>
      <modal-cierre ref="modalCierre" @guardado="val => enviarSeguimiento(val)"/>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'

import SintomasFecha from 'Views/covid19/tamizaje/evolucion/components/SintomasFecha'
import FormComorbilidades from 'Views/covid19/tamizaje/FormComorbilidades'
import HelpModal from '../../../components/HelpModal/HelpModal'
import DatosPersonales from 'Views/covid19/tamizaje/DatosPersonales'
import FormAislamiento from 'Views/covid19/tamizaje/aislamiento/FormAislamiento'
import FormSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/FormSeguimientoAislamiento'
import ModalPaciente from 'Views/covid19/tamizaje/paciente/ModalPaciente'
import ModalCierre from "Views/covid19/tamizaje/evolucion/components/ModalCierre"

var intervalo
export default {
  name: 'RegistroEvolucion',
  components: {
    ModalCierre,
    DatosPersonales,
    FormComorbilidades,
    HelpModal,
    FormAislamiento,
    FormSeguimientoAislamiento,
    SintomasFecha,
    ModalPaciente
  },
  props: {
    tamizaje: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    enEdicion: false,
    permiteWatch: true,
    solicitaUltimo: false,
    enlinea: null,
    showbuttonmeet: true,
    verFormularioAislamiento: 0,
    loading: false,
    dialog: false,
    activaPR: true,
    activaSPO2: true,
    activaTemperatura: true,
    evolucion: null,
    comorbilidades: [],
    dialogConfirmFormPaciente: false
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    time() {
      let h = 0
      let m = 0
      let s = 0
      if (this && this.evolucion) {
        let initime = this.clone(this.evolucion.duracion)
        h = Math.trunc(initime / 3600)
        initime = initime - (h * 3600)
        m = Math.trunc(initime / 60)
        initime = initime - (m * 60)
        s = initime
      }
      return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
    },
    videollamar() {
      return this.$store.getters.getPermission('videollamadas')
    },
    ...mapGetters([
      'modelEvolucion',
      'causasHospitalizacion',
      'clasificacionesCovid',
      'ordenesMedicas',
      'tiposEvolucion',
      'modelAislamiento',
      'modelSeguimientoAislamiento',
      'estadosAfectacion',
      'signosAlarma',
      'tiposNoEfectiva',
        //// sicología
        'respuestasPsicologicas',
        'protocolosBioseguridad',
        'alteracionesEmocionales'
    ]),
    clasificacionesCovidSeleccionables() {
      if (this && this.evolucion && this.tamizaje && this.clasificacionesCovid) {
        let previstos = []
        previstos = this.tamizaje.positivo_covid
            ? this.clasificacionesCovid.filter(x => (x.selectable && x.text.includes('CC')))
            : this.clasificacionesCovid.filter(x => (x.selectable && x.text.includes('CP')) || x.text === 'NC')
        return previstos
      }
      return []
    },
    estadosAfectacionFiltrados() {
      let listado = []
      if (this) {
        if (this.estadosAfectacion) {
          listado = this.estadosAfectacion
          if(!this.enEdicion) {
            if (this.evolucion) {
              if (this.evolucion.clasificacion === '4') listado = this.estadosAfectacion.filter(x => x === 'Fallecido')
              else if (this.evolucion.clasificacion === '6') listado = this.estadosAfectacion.filter(x => x === 'Ninguno')
              else {
                if(this.tamizaje.positivo_covid) {
                  listado = this.estadosAfectacion.filter(x => x !== 'Fallecido' && x !== 'Ninguno')
                } else {
                  listado = this.estadosAfectacion.filter(x => x !== 'Fallecido' && x !== 'Ninguno' && x !== 'Reinfectado' && x !== 'Recuperado')
                }
              }
            }
          }
        }
      }
      return listado
    },
    aislamientoFinal() {
      return this && this.tamizaje && this.tamizaje.aislamientos && this.tamizaje.aislamientos.length ? this.tamizaje.aislamientos[0] : null
    },
    verFormAislamiento() {
      return (!this.aislamientoFinal || this.aislamientoFinal.fecha_egreso) && this.evolucion && (this.evolucion.estado_afectacion !== 'Recuperado' && this.evolucion.estado_afectacion !== 'Fallecido')
    },
    verFormSeguimientoAislamiento() {
      return !this.verFormAislamiento && this.aislamientoFinal && !this.aislamientoFinal.fecha_egreso
    },
    ultimoSeguimientoOK() {
      return this && !this.solicitaUltimo && this.tamizaje && !this.tamizaje.positivo_covid && this.tamizaje.evoluciones && this.tamizaje.evoluciones.length && this.tamizaje.evoluciones.find(x => !x.fallida)
    }
  },
  watch: {
    'evolucion.tiene_alteracion_emocional': {
      handler(val) {
        if (val !== 'Si') {
          this.evolucion.alteraciones_emocionales = []
        }
      },
      immediate: false
    },
    'evolucion.sivigila': {
      handler(val) {
        if (val !== 1) {
          this.evolucion.entidad_reporta_sivigila = null
        }
      },
      immediate: false
    },
    'evolucion.seguimiento_telefonico': {
      handler(val) {
        if (val) {
          this.evolucion.evolucion_diaria_hospitalaria = null
          this.evolucion.motivo_consulta = null
          this.evolucion.anamnesis = null
          this.evolucion.examen_fisico = null
          this.evolucion.cie10 = null
          this.evolucion.tratamiento = null
        }
      },
      immediate: false
    },
    'verFormularioAislamiento': {
      handler(val) {
        if (val) {
          this.evolucion.aislamiento = this.clone(this.modelAislamiento)
          this.evolucion.aislamiento.tamizaje_id = this.evolucion.tamizaje_id
          ///////
          this.evolucion.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
          this.evolucion.seguimiento_aislamiento.aislamiento_id = this.aislamientoFinal ? this.aislamientoFinal.id : null
          this.evolucion.seguimiento_aislamiento.evolucion_id = this.evolucion.id
          this.evolucion.seguimiento_aislamiento.fecha = this.moment().format('YYYY-MM-DD')
        } else {
          this.evolucion.aislamiento = null
          this.evolucion.seguimiento_aislamiento = null
        }
      },
      immediate: false
    },
    'verFormSeguimientoAislamiento': {
      handler(val) {
        if (val) {
          this.evolucion.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
          this.evolucion.seguimiento_aislamiento.aislamiento_id = this.aislamientoFinal ? this.aislamientoFinal.id : null
          this.evolucion.seguimiento_aislamiento.evolucion_id = this.evolucion.id
          this.evolucion.seguimiento_aislamiento.fecha = this.moment().format('YYYY-MM-DD')
        } else {
          this.evolucion.seguimiento_aislamiento = null
        }
      },
      immediate: false
    },
    'evolucion.clasificacion': {
      handler(val) {
        if(this.permiteWatch) {
          this.evolucion.estado_afectacion = null
          this.evolucion.solicitud_prueba = 0
          if (val !== '6') {
            this.evolucion.justificacion_no_clasificado = null
          }
          if (val === '4') {
            this.evolucion.estado_afectacion = 'Fallecido'
          }
          if (val === '6') {
            this.evolucion.estado_afectacion = 'Ninguno'
          }
        }
      },
      immediate: false
    },
    'evolucion.hospitalizado': {
      handler(val) {
        if (!val) {
          this.evolucion.lugar_hospitalizacion = null
          this.evolucion.causa_hospitalizacion = null
          this.evolucion.fecha_ingreso = null
        }
      },
      immediate: false
    }
  },
  created() {
    this.enEdicion = false
    this.evolucion = this.clone(this.modelEvolucion)
    this.evolucion.fecha_seguimiento = this.moment().format('YYYY-MM-DD')
  },
  methods: {
    async guardarSeguimiento() {
      let validateSintomas = null
      if (this.$refs && this.$refs.sintomasFecha) {
        validateSintomas = await this.$refs.sintomasFecha.validate()
      }
      let validateForm = await this.$refs.formEvolucion.validate()
      if (validateSintomas === null && validateForm) {
        this.loading = true
        if (this.evolucion.fallida) {
          let copia = this.clone(this.evolucion)
          this.evolucion = this.clone(this.modelEvolucion)
          this.evolucion.id = copia.id
          this.evolucion.user_id = copia.user_id
          this.evolucion.tamizaje_id = copia.tamizaje_id
          this.evolucion.fecha_seguimiento = copia.fecha_seguimiento
          this.evolucion.lugar_atencion = copia.lugar_atencion
          this.evolucion.seguimiento_telefonico = copia.seguimiento_telefonico
          this.evolucion.orden_medica_id = copia.orden_medica_id
          this.evolucion.fallida = copia.fallida
          this.evolucion.no_efectividad = copia.no_efectividad
          this.evolucion.observaciones = copia.observaciones
          this.evolucion.tipo = copia.tipo
          this.evolucion.duracion = copia.duracion
        } else {
          this.evolucion.no_efectividad = null
        }
        let sintomasx = this.evolucion.sintomas && this.evolucion.sintomas.length ? this.evolucion.sintomas.filter(x => x.id).map(x => {
          return {id: x.id, fecha_inicio: x.fecha_inicio}
        }) : []
        let signos = this.evolucion.signos_alarma && this.evolucion.signos_alarma.length ? this.evolucion.signos_alarma.map(x => {
          return {id: x, fecha_inicio: null}
        }) : []

        let sintomasEnviar = sintomasx.concat(signos)
        let coso = sintomasEnviar.length ? sintomasEnviar.reduce((acc, cur) => {
          acc[cur.id] = {fecha_inicio: cur.fecha_inicio}
          return acc
        }, {}) : null

        let protocolos = this.evolucion.cumplimiento_protocolos_bioseguridad && this.evolucion.cumplimiento_protocolos_bioseguridad.length ? this.evolucion.cumplimiento_protocolos_bioseguridad.join(',') : null
        let alteraciones = this.evolucion.alteraciones_emocionales && this.evolucion.alteraciones_emocionales.length ? this.evolucion.alteraciones_emocionales.join(',') : null
        let evolution = this.clone(this.evolucion)
        evolution.sintomas = coso
        evolution.cumplimiento_protocolos_bioseguridad = protocolos
        evolution.alteraciones_emocionales = alteraciones
        console.log('llega', this.aplicaCierre(evolution))
        await this.aplicaCierre(evolution) ? this.lanzarModalCierre(evolution) : this.enviarSeguimiento(evolution)
      }
    },
    aplicaCierre (evolution) {
      console.log('evolution', evolution)
      return false
      // return evolution
    },
    lanzarModalCierre (evolution) {
      this.loading = false
      this.$refs.modalCierre.open( { tamizaje: this.tamizaje, evolucion: evolution })
    },
    enviarSeguimiento (evolution) {
      this.loading = true
      let request = evolution.id
          ? this.axios.put(`evoluciones/${evolution.id}`, evolution)
          : this.axios.post(`tamizajes/${evolution.tamizaje_id}/evoluciones`, evolution)
      request
          .then(response => {
            this.$emit('guardado', response.data)
            this.$store.commit('snackbar', {color: 'success', message: `La evolución se guardo correctamente.`})
            this.close()
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al guardar la evolución.`, error: error})
          })
    },
    open(idEvolucion = null) {
      if (idEvolucion) this.getEvolucion(idEvolucion)
      else if (this.tamizaje) {
        this.activaPR = true
        this.activaSPO2 = true
        this.activaTemperatura = true
        // this.tamizaje = tamizaje
        this.evolucion.tamizaje_id = this.tamizaje.id
        this.evolucion.lugar_atencion = this.tamizaje.orden_medica_id
        this.evolucion.orden_medica_id = this.tamizaje.orden_medica_id
        this.evolucion.seguimiento_telefonico = this.evolucion.lugar_atencion === 1 ? 1 : 0
        if (this.tamizaje.evoluciones && ((this.tamizaje.evoluciones.length === 0) || (this.tamizaje.evoluciones.filter(x => !x.fallida).length === 0))) {
          this.evolucion.comorbilidades = (this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length) ? this.tamizaje.comorbilidades.map(x => x.codigo) : []
        }
        this.comorbilidades = this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length ? this.tamizaje.comorbilidades : []
        this.evolucion.tipo = 'Seguimiento Médico'
        this.evolucion.obligaAislamiento = !(this.tamizaje && this.tamizaje.aislamientos && this.tamizaje.aislamientos.length)
        if(this.evolucion.obligaAislamiento) this.verFormularioAislamiento = 1
        this.verificaInfoPaciente()
      }
      this.dialog = true
      intervalo = setInterval(() => {
        this.evolucion.duracion++
      }, 1000)
    },
    verificaInfoPaciente() {
      if(
          !this.tamizaje.tipo_identificacion
          || !this.tamizaje.identificacion
          || !this.tamizaje.nombre1
          || !this.tamizaje.apellido1
          || !this.tamizaje.sexo
          || !this.tamizaje.fecha_nacimiento || (this.tamizaje.fecha_nacimiento && !this.moment(this.tamizaje.fecha_nacimiento, 'YYYY-MM-DD').isValid())
          || (!this.tamizaje.celular || (this.tamizaje.celular.length && (String(parseInt(this.tamizaje.celular)).length > 10 || String(parseInt(this.tamizaje.celular)).length < 10)))
          || this.tamizaje.celular2 && this.tamizaje.celular2.length && (String(parseInt(this.tamizaje.celular2)).length > 10 || String(parseInt(this.tamizaje.celular2)).length < 10)
          || !this.tamizaje.departamento_id
          || !this.tamizaje.municipio_id
          || (!this.tamizaje.direccion || this.tamizaje.direccion.trim().length < 6 || (!isNaN(this.tamizaje.direccion) && this.tamizaje.direccion <= 0))
      ) {
        setTimeout(() => {
          this.dialogConfirmFormPaciente = true
        }, 500)
      }
    },
    close() {
      this.$refs.formEvolucion.reset()
      if (this.$refs && this.$refs.jitsimeet) this.$refs.jitsimeet.cerrarVideo()
      this.dialog = false
      this.loading = false
      clearInterval(intervalo)
      this.$emit('close')
      this.evolucion = this.clone(this.modelEvolucion)
      this.evolucion.fecha_seguimiento = this.moment().format('YYYY-MM-DD')
      this.comorbilidades = []
      this.verFormularioAislamiento = 0
      this.solicitaUltimo = false
    },
    verAyuda(item) {
      this.$refs.helpModal.open(item)
    },
    getEvolucion(idEvolucion) {
      this.loading = true
      this.axios.get(`evoluciones/${idEvolucion}`)
          .then(response => {
            console.log('response get evolucion', response)
            if (response.data && response.data.sintomas && response.data.sintomas.length) {
              response.data.sintomas = response.data.sintomas.map(x => x.id)
            }
            this.activaPR = response.data.frecuencia_pulso !== null
            this.activaSPO2 = response.data.saturacion_oxigeno !== null
            this.activaTemperatura = response.data.temperatura !== null
            this.evolucion = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar la evolución.`, error: error})
          })
    },
    copiarUltimoSeguimiento() {
      this.loading = true
      let evolucionActual = this.clone(this.evolucion)
      let evolucionCopiada = this.clone(this.ultimoSeguimientoOK)
      /// Asignación
      this.activaPR = true
      this.activaSPO2 = true
      this.activaTemperatura = true
      let newEvolution = this.clone(this.modelEvolucion)
      newEvolution.tamizaje_id = this.tamizaje.id
      newEvolution.fecha_seguimiento = this.evolucion.fecha_seguimiento
      newEvolution.lugar_atencion = this.tamizaje.orden_medica_id
      newEvolution.orden_medica_id = this.tamizaje.orden_medica_id
      newEvolution.seguimiento_telefonico = this.evolucion.lugar_atencion === 1 ? 1 : 0
      newEvolution.frecuencia_pulso = evolucionCopiada.frecuencia_pulso
      newEvolution.saturacion_oxigeno = evolucionCopiada.saturacion_oxigeno
      newEvolution.temperatura = evolucionCopiada.temperatura
      newEvolution.antinflamatorios = evolucionCopiada.antinflamatorios
      newEvolution.ibuprofeno = evolucionCopiada.ibuprofeno
      newEvolution.hospitalizado = evolucionCopiada.hospitalizado
      newEvolution.lugar_hospitalizacion = evolucionCopiada.lugar_hospitalizacion
      newEvolution.causa_hospitalizacion = evolucionCopiada.causa_hospitalizacion
      newEvolution.fecha_ingreso = evolucionCopiada.fecha_ingreso
      newEvolution.observaciones = evolucionCopiada.observaciones
      newEvolution.sivigila = evolucionCopiada.sivigila
      newEvolution.entidad_reporta_sivigila = evolucionCopiada.entidad_reporta_sivigila
      newEvolution.ssc = evolucionCopiada.ssc
      newEvolution.crue = evolucionCopiada.crue
      newEvolution.motivo_consulta = evolucionCopiada.motivo_consulta
      newEvolution.anamnesis = evolucionCopiada.anamnesis
      newEvolution.examen_fisico = evolucionCopiada.examen_fisico
      newEvolution.cie10 = evolucionCopiada.cie10
      newEvolution.tratamiento = evolucionCopiada.tratamiento
      newEvolution.evolucion_diaria_hospitalaria = evolucionCopiada.evolucion_diaria_hospitalaria
      newEvolution.orden_medica_id = evolucionCopiada.orden_medica_id
      newEvolution.linfocitos = evolucionCopiada.linfocitos
      newEvolution.ldh = evolucionCopiada.ldh
      // newEvolution.clasificacion = evolucionCopiada.clasificacion
      // newEvolution.estado_afectacion = evolucionCopiada.estado_afectacion
      newEvolution.duracion = evolucionActual.duracion
      newEvolution.tipo = 'Seguimiento Médico'
      this.evolucion = newEvolution
      this.comorbilidades = this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length ? this.tamizaje.comorbilidades : []
      newEvolution.signos_alarma = this.clone(evolucionCopiada.sintomas.filter(z => !z.solicita_fecha)).map(x => x.id)
      let sintomasAsignar = this.clone(evolucionCopiada.sintomas.filter(z => z.solicita_fecha)).map(x => {
        return {
          id: x.id,
          valueid: x.id,
          descripcion: x.descripcion,
          fecha_inicio: x.pivot.fecha_inicio
        }
      })
      setTimeout(() => {
        this.$refs.sintomasFecha.assign(sintomasAsignar)
        this.verFormularioAislamiento = 0
        this.loading = false
      }, 500)
      this.solicitaUltimo = true
    },
    editar(evolucion) {
      this.enEdicion = true
      this.permiteWatch = false
      this.loading = true
      let evolucionCopiada = this.clone(evolucion)
      /// Asignación
      this.activaPR = evolucionCopiada.frecuencia_pulso !== null
      this.activaSPO2 = evolucionCopiada.saturacion_oxigeno !== null
      this.activaTemperatura = evolucionCopiada.temperatura !== null
      if (this.tamizaje.evoluciones && ((this.tamizaje.evoluciones.length === 1) || (this.tamizaje.evoluciones.filter(x => !x.fallida).length <= 1))) {
        evolucionCopiada.comorbilidades = (this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length) ? this.tamizaje.comorbilidades.map(x => x.codigo) : []
      } else {
        this.comorbilidades = this.tamizaje.comorbilidades && this.tamizaje.comorbilidades.length ? this.tamizaje.comorbilidades : []
      }
      // if (evolucionCopiada.comorbilidades.length) {
      //   evolucionCopiada.comorbilidades = evolucionCopiada.comorbilidades.map(x => x.codigo)
      // }
      evolucionCopiada.signos_alarma = this.clone(evolucionCopiada.sintomas.filter(z => !z.solicita_fecha)).map(x => x.id)
      if(!evolucionCopiada.aislamiento) evolucionCopiada.aislamiento = null
      this.evolucion = evolucionCopiada
      let sintomasAsignar = this.clone(evolucionCopiada.sintomas.filter(z => z.solicita_fecha)).map(x => {
        return {
          id: x.id,
          valueid: x.id,
          descripcion: x.descripcion,
          fecha_inicio: x.pivot.fecha_inicio
        }
      })
      setTimeout(() => {
        this.$refs && this.$refs.sintomasFecha && this.$refs.sintomasFecha.assign(sintomasAsignar)
        // this.verFormularioAislamiento = 0
        this.permiteWatch = true
        this.loading = false
      }, 1000)
      this.solicitaUltimo = true
      this.dialog = true
    }
  }
}
</script>

<style>
.labelforce div div div label{
  padding-top: 6px !important;
  height: 26px !important;
  top: 5px !important;
}
</style>