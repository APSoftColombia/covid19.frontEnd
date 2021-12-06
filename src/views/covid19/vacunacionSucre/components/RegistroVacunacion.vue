<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-shield-virus</v-icon>
        <v-toolbar-title>{{
          vacunacion && vacunacion.id
            ? `Edición Registro No. ${vacunacion.id}`
            : "Nuevo Registro de Vacunación"
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="6" offset-md="3">
            <ValidationObserver
              v-if="vacunacion"
              ref="formVacunacion"
              v-slot="{ invalid, validated, passes, validate }"
              autocomplete="off"
            >
              <!-- <v-alert
                type="warning"
                v-if="identificacionVerificada && tamizajePositivo"
              >
                Esta persona ha sido diagnosticada como <b> Positivo Covid</b>, hace {{ verbalTimeAgoDiagnostico }} (Fecha diagnostico: {{ tamizajePositivo.fecha_diagnostico }}) <br>
                Con Numero de ERP. {{ tamizajePositivo.id }}
              </v-alert>
              <v-alert
                type="warning"
                v-if="validationGestanteFail"
              >
                La mujer se encuentra en esatado de Gestacion temprana y no es posible la vacunacion.
              </v-alert> -->
              <v-alert
                type="warning"
                style="position: fixed; z-index: 9999; margin-right: 27%;"
                v-if="tamizajePositivo || validationGestanteFail || errorProgramatico || tieneRefuerzo || edadNoPermitidaVacuna || fechaAplicacionAnticipada"
              >
                <ul>
                  <li v-if="edadNoPermitidaVacuna">El ciudadano tiene {{ vacunacion && vacunacion.edad }} años de edad, y
                    no esta incluido en ninguno de los planes de vacunación.
                  </li>
                  <li v-if="fechaAplicacionAnticipada"><div>{{ msgFechaAplicacionAnticipada ? msgFechaAplicacionAnticipada : '' }}</div></li>
                  <li v-if="errorProgramatico"><div>Error programático: {{ errorProgramaticoMessage ? errorProgramaticoMessage : '' }}</div></li>
                  <li v-if="tieneRefuerzo"><div>Ciudadano ya cuenta con esquema completo de Vacunación y Refuerzo</div></li>
                  <li v-if="validationGestanteFail">La mujer se encuentra en estado de Gestación temprana
                    ({{ vacunacion.semanas_embarazo ? vacunacion.semanas_embarazo : '' }} semanas de embarazo) y no es posible aplicar el Biológico.</li>
                  <li v-if="tamizajePositivo">Esta persona ha sido diagnosticada como <b> Positivo Covid</b>, hace {{ verbalTimeAgoDiagnostico ? verbalTimeAgoDiagnostico : '' }} 
                    (Fecha diagnostico: {{ tamizajePositivo ? tamizajePositivo.fecha_diagnostico : '' }}) <br> Con Numero de ERP. {{ tamizajePositivo ? tamizajePositivo.id : '' }}
                  </li>
                </ul>
              </v-alert>
              <div v-if="edadNoPermitidaVacuna" style="height: 4rem; margin-bottom: 2rem;" />
              <div v-if="fechaAplicacionAnticipada" style="height: 4rem; margin-bottom: 2rem;" />
              <div v-if="errorProgramatico" style="height: 1rem; margin-bottom: 1rem;" />
              <div v-if="tieneRefuerzo" style="height: 3rem; margin-bottom: 2rem;" />
              <div v-if="validationGestanteFail" style="height: 3rem; margin-bottom: 2rem;" />
              <div v-if="tamizajePositivo" style="height: 5rem; margin-bottom: 2rem;" />
              <v-row>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <search-identidad-vacunado
                    ref="cIdentificacion"
                    v-model="vacunacion.identificacion"
                    label="Identificación"
                    rules="required|numeric"
                    name="identificación"
                    @responsepersona="(val) => resultAfiliado(val)"
                    @keyup="identificacionVerificada = 0"
                    :disabled="isEdit"
                  >
                  </search-identidad-vacunado>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.tipo_identificacion"
                    label="Tipo identificación"
                    rules="required"
                    name="tipo identificación"
                    :items="tiposDocumentoIdentidad"
                    item-text="descripcion"
                    item-value="tipo"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.nombre1"
                    label="Primer nombre"
                    rules="required"
                    name="primer nombre"
                    upper-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.nombre2"
                    label="Segundo nombre"
                    upper-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.apellido1"
                    label="Primer apellido"
                    rules="required"
                    name="primer apellido"
                    upper-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.apellido2"
                    label="Segundo apellido"
                    upper-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-date
                    v-model="vacunacion.fecha_nacimiento"
                    label="Fecha nacimiento"
                    rules="required"
                    name="fecha nacimiento"
                    :hint="edad"
                    :disabled="identificacionVerificada < 1"
                    :max="moment().format('YYYY-MM-DD')"
                  >
                  </c-date>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <!-- <c-select-complete
                    v-model="vacunacion.sexo"
                    label="Sexo"
                    rules="required"
                    name="sexo"
                    :items="sexosCovid"
                    item-text="text"
                    item-value="value"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete> -->
                  <c-radio
                    v-model="vacunacion.sexo"
                    :items="sexosCovid"
                    itemValue="value"
                    itemText="text"
                    rules="required"
                    name="sexo"
                    label="Sexo"
                    :column="!$vuetify.breakpoint.smAndUp"
                    :disabled="identificacionVerificada < 1 || !!sexoAutomatico"
                  />
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.medio_contacto"
                    label="Medio de contacto"
                    rules="required"
                    name="medio de contacto"
                    :items="dosisVacunas.medioContactos"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-texto
                    v-model="vacunacion.telefono_contacto"
                    label="Celular"
                    rules="required|numeric|minlength:10|maxlength:10|phoneNumber"
                    name="celular"
                    type="tel"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-texto
                    v-model="vacunacion.email"
                    label="Email"
                    rules="email"
                    name="email"
                    lower-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-select-complete
                    v-model="vacunacion.cod_dpto"
                    label="Departamento de residencia"
                    name="departamento de residencia"
                    rules="required"
                    :items="departamentos"
                    item-text="nombre"
                    item-value="codigo"
                    :disabled="identificacionVerificada < 1"
                    @change="
                      (val) =>
                        (vacunacion.cod_mpio = departamentos
                          .find((x) => x.codigo === val)
                          .municipios.find((z) => z.codigo === vacunacion.cod_mpio)
                          ? vacunacion.cod_mpio
                          : null)
                    "
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-select-complete
                    :disabled="
                      !vacunacion.cod_dpto || identificacionVerificada < 1
                    "
                    v-model="vacunacion.cod_mpio"
                    label="Municipio de residencia"
                    name="municipio de residencia"
                    rules="required"
                    :items="
                      departamentos.length &&
                      vacunacion.cod_dpto &&
                      departamentos.find((x) => x.codigo === vacunacion.cod_dpto)
                        ? departamentos.find(
                            (x) => x.codigo === vacunacion.cod_dpto
                          ).municipios
                        : []
                    "
                    item-text="nombre"
                    item-value="codigo"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.zona"
                    label="Zona de residencia"
                    rules="required"
                    name="zona de residencia"
                    :items="dosisVacunas.zonas"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.direccion"
                    label="Dirección"
                    rules="required|minlength:6|direccion"
                    name="dirección"
                    upper-case
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <v-row>
                        <v-col
                          :class="
                            vacunacion.necesita_acudiente === null ||
                            vacunacion.necesita_acudiente === 'NO'
                              ? 'py-0'
                              : 'pt-0'
                          "
                          cols="12"
                          sm="12"
                          md="12"
                        >
                          <c-radio
                            v-model="vacunacion.necesita_acudiente"
                            :items="[
                              { text: 'Si', value: 'SI' },
                              { text: 'No', value: 'NO' },
                            ]"
                            itemValue="value"
                            itemText="text"
                            rules="required"
                            name="acudiente"
                            label="¿Necesita acudiente?"
                            :column="!$vuetify.breakpoint.smAndUp"
                            :disabled="identificacionVerificada < 1 || !!acudienteObligatorioPorEdad"
                          />
                        </v-col>
                      </v-row>
                      <template v-if="vacunacion.necesita_acudiente === 'SI'">
                        <v-row>
                          <v-col class="pb-0" cols="12" sm="12" md="12">
                            <c-select-complete
                              v-model="vacunacion.parentesco_id"
                              label="Parentesco del acudiente"
                              rules="required"
                              name="parentesco acudiente"
                              :items="parentescos"
                              item-text="descripcion"
                              item-value="id"
                            >
                            </c-select-complete>
                          </v-col>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-texto
                              ref="idenfiticacion_acudiente"
                              v-model="vacunacion.identificacion_acud"
                              label="Identificación"
                              rules="required|numeric"
                              name="identificación"
                            >
                            </c-texto>
                          </v-col>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-select-complete
                              v-model="vacunacion.tipo_ident_acud"
                              label="Tipo identificación"
                              rules="required"
                              name="tipo identificación"
                              :items="tiposDocumentoIdentidad"
                              item-text="descripcion"
                              item-value="id"
                            >
                            </c-select-complete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-texto
                              v-model="vacunacion.nombre1_acud"
                              label="Primer nombre"
                              rules="required"
                              name="primer nombre"
                              upper-case
                            >
                            </c-texto>
                          </v-col>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-texto
                              v-model="vacunacion.nombre2_acud"
                              label="Segundo nombre"
                              upper-case
                            >
                            </c-texto>
                          </v-col>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-texto
                              v-model="vacunacion.apellido1_acud"
                              label="Primer apellido"
                              rules="required"
                              name="primer apellido"
                              upper-case
                            >
                            </c-texto>
                          </v-col>
                          <v-col class="pb-0" cols="12" sm="6" md="6">
                            <c-texto
                              v-model="vacunacion.apellido2_acud"
                              label="Segundo apellido"
                              upper-case
                            >
                            </c-texto>
                          </v-col>
                        </v-row>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
                <template v-if="vacunacion.sexo === 'F'">
                  <v-col cols="12" sm="12" md="12">
                    <!-- <c-select-complete
                      v-model="vacunacion.condicion"
                      label="Condicion"
                      rules="required"
                      name="condicion"
                      :items="dosisVacunas.condiciones"
                      :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete> -->
                    <c-radio
                      v-model="vacunacion.condicion"
                      :items="condionesGestante"
                      itemValue="value"
                      itemText="text"
                      rules="required"
                      name="gondición gestante"
                      label="Condición Gestante: "
                      :column="!$vuetify.breakpoint.smAndUp"
                      :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                  <template v-if="vacunacion.condicion === 'GESTANTE'">
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <c-date
                          v-model="vacunacion.fecha_ult_regla"
                          label="Fecha de última regla"
                          :max="moment().format('YYYY-MM-DD')"
                          rules="required"
                          name="fecha última regla"
                      >
                      </c-date>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-date
                        v-model="vacunacion.fecha_prob_parto"
                        label="Fecha probable parto"
                        rules="required"
                        name="fecha probable parto"
                        disabled
                      >
                      </c-date>
                    </v-col>
                    <v-col cols="12" class="pb-0" sm="6" md="6">
                      <c-texto
                        label="Semanas de Embarazo"
                        rules="required"
                        v-model="vacunacion.semanas_embarazo"
                        name="semanas de embarazo"
                        disabled
                      />
                    </v-col>
                  </template>
                
                  <template v-if="vacunacion.condicion !== 'GESTANTE'">
                    <v-col cols="12" sm="12" md="6">
                      <!-- <v-checkbox
                        v-model="vacunacion.posparto"
                        label="PosParto"
                        :true-value="true"
                        :false-value="false"
                      ></v-checkbox> -->
                      <c-radio
                        v-model="vacunacion.posparto"
                        :items="condicionesPosparto"
                        itemValue="value"
                        itemText="text"
                        rules="required"
                        name="posparto"
                        label="Condición de Posparto: "
                        :column="!$vuetify.breakpoint.smAndUp"
                        :disabled="identificacionVerificada < 1"
                      />
                    </v-col>
                    <template v-if="vacunacion.posparto">
                      <v-col class="pb-0" cols="12" sm="12" md="6">
                        <c-date
                          v-model="vacunacion.fecha_parto"
                          label="Fecha del parto"
                          rules="required"
                          name="fecha del parto"
                          :disabled="identificacionVerificada < 1"
                          :max="moment().format('YYYY-MM-DD')"
                          :min="moment().subtract(40, 'days').format('YYYY-MM-DD')"
                        >
                        </c-date>
                      </v-col>
                    </template>
                  </template>
                  <v-col class="pb-0" cols="12" sm="12" md="12">
                    <v-checkbox
                      v-model="vacunacion.lactancia"
                      label="Lactancia"
                      :true-value="true"
                      :false-value="false"
                    ></v-checkbox>
                  </v-col>
                </template>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="vacunacion.etnia"
                    label="Etnia o Población especial"
                    rules="required"
                    name="etnia"
                    :items="dosisVacunas.Etnias"
                    item-text="nombre"
                    item-value="codigo"
                    :disabled="(identificacionVerificada < 1) || !!(vacunacion.etnia && vacunacion.id)"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="12" v-if="vacunacion.etnia && vacunacion.etnia !== '6'">
                  <c-texto
                    v-model="vacunacion.nombre_etnia_poblacion"
                    label="Nombre de Etnia o Población especial"
                    name="nombre etnia"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-select-complete
                      v-model="vacunacion.tipo_poblacion"
                      label="Tipo población"
                      rules="required"
                      name="Tipo población"
                      :items="tipoPoblaciones"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <template v-if="vacunacion.tipo_poblacion === 'Población Asegurada'">
                  <v-col class="pb-0" cols="12" sm="12" md="12">
                    <c-select-complete
                        v-model="vacunacion.aseguradora"
                        label="¿A que EPS está afiliado?"
                        rules="required"
                        name="EPS de afiliación"
                        :items="epss"
                        item-value="codigo"
                        item-text="nombre"
                        :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-select-complete
                        v-model="vacunacion.regimen"
                        label="Regimen"
                        rules="required"
                        name="regimen"
                        :items="dosisVacunas.Regimenes_dosis_vacunas"
                        item-text="nombre"
                        item-value="codigo"
                        :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                </template>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                      v-model="vacunacion.estado_adres"
                      label="Estado ADRES"
                      rules="required"
                      name="estado ADRES"
                      :items="dosisVacunas.estadoAdres"
                      :disabled="identificacionVerificada < 1 || isEdit"
                  />
                </v-col>
                <comorbilidades-gestion-vacunacion
                    :array-comorbilidades="vacunacion.comorbilidades_vacunacion"
                    @changeComorbilidades="val => vacunacion.comorbilidades_vacunacion = val"
                    :disabled="identificacionVerificada < 1"
                />
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                        v-model="vacunacion.condicion_discapacidad"
                        :items="[
                          { text: 'Si', value: 'SI' },
                          { text: 'No', value: 'NO' },
                        ]"
                        itemValue="value"
                        itemText="text"
                        rules="required"
                        name="Discapacidad"
                        label="Discapacidad"
                        :column="!$vuetify.breakpoint.smAndUp"
                        :disabled="identificacionVerificada < 1"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" v-if="vacunacion.condicion_discapacidad === 'SI'">
                  <discapacidades-vacunacion
                    :array-opciones="vacunacion.discapacidades"
                    @changeOpciones="val => vacunacion.discapacidades = val"
                    :disabled="identificacionVerificada < 1"
                  ></discapacidades-vacunacion>
                </v-col>
                <v-col cols="12">
                  <v-card outlined tile>
                    <v-card-text>
                      <c-radio
                        v-model="vacunacion.condicion_desplazamiento"
                        :items="[
                          { text: 'Si', value: 'SI' },
                          { text: 'No', value: 'NO' },
                        ]"
                        itemValue="value"
                        itemText="text"
                        rules="required"
                        name="desplazamiento a la ESE/IPS"
                        label="¿Puede desplazarse a la ESE/IPS?"
                        :column="!$vuetify.breakpoint.smAndUp"
                        :disabled="identificacionVerificada < 1"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <template v-if="!isEdit && vacunacion.estado_adres !== 'FALLECIDO'">
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                          v-model="vacunacion.acepta_vacuna"
                          :items="[
                            { text: 'Si', value: 1 },
                            { text: 'No', value: 0 },
                          ]"
                          itemValue="value"
                          itemText="text"
                          rules="required"
                          name="intención de vacunarse"
                          label="¿Tiene Intención de Vacunarse?"
                          :column="!$vuetify.breakpoint.smAndUp"
                          @input="vacunacion.porque_no_vacuna = null"
                          :disabled="identificacionVerificada < 1"
                        />
                      </v-card-text>
                      <v-col
                        v-if="vacunacion.acepta_vacuna === 0"
                        cols="12"
                        class="pb-0"
                      >
                        <c-text-area
                          label="Motivo por el cual no se vacunará"
                          rules="required"
                          v-model="vacunacion.motivo_disistimiento"
                          name="motivo de no vacunación"
                          :disabled="identificacionVerificada < 1"
                        />
                      </v-col>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined tile>
                      <v-card-text>
                        <c-radio
                          v-model="vacunacion.puede_vacunarse"
                          :items="[
                            { text: 'Si', value: 1 },
                            { text: 'No', value: 0 },
                          ]"
                          itemValue="value"
                          itemText="text"
                          rules="required"
                          name="puede vacunarse"
                          label="¿Puede Vacunarse?"
                          :column="!$vuetify.breakpoint.smAndUp"
                          :disabled="identificacionVerificada < 1 || forzadoNoVacunacion"
                        />
                      </v-card-text>
                      <template v-if="vacunacion.puede_vacunarse === 0">
                        <no-puede-vacunarse-component
                          :array-opciones="vacunacion.motivos_no_puede_vacunarse"
                          @changeOpciones="val => vacunacion.motivos_no_puede_vacunarse = val"
                          :disabled="identificacionVerificada < 1"
                        ></no-puede-vacunarse-component>
                        <!-- <comorbilidades-gestion-vacunacion
                          :array-comorbilidades="vacunacion.motivos_no_puede_vacuna"
                          @changeComorbilidades="val => vacunacion.motivos_no_puede_vacuna = val"
                          :disabled="identificacionVerificada < 1"
                        ></comorbilidades-gestion-vacunacion> -->
                      </template>
                    </v-card>
                  </v-col>
                  <template v-if="vacunacion.acepta_vacuna && vacunacion.puede_vacunarse">
                    <v-col class="pb-0" cols="12" sm="12" md="12" v-if="dosisAplicadas && dosisAplicadas.length">
                      <v-card outlined tile>
                        <v-card-title>Registros de Vacunacion previa</v-card-title>
                        <v-card-text>
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">
                                    ID
                                  </th>
                                  <th class="text-left">
                                    Tipo
                                  </th>
                                  <th class="text-left">
                                    Fecha Aplicacion
                                  </th>
                                  <th class="text-left">
                                    Biológico
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="item in dosisAplicadas"
                                  :key="item.id"
                                >
                                  <td>{{ item.id ? item.id : '' }}</td>
                                  <td>{{ item.tipo_dosis ? item.tipo_dosis : '' }}</td>
                                  <td>{{ item.fecha_aplicacion ? moment(item.fecha_aplicacion).format('DD/MM/YYYY HH:mm') : '' }}</td>
                                  <td>{{ item.biologico ? item.biologico : '' }}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <c-date
                        v-model="vacunacion.fecha_aplicacion"
                        label="Fecha de aplicación biológico"
                        rules="required"
                        name="fecha aplicación biológico"
                        :disabled="identificacionVerificada < 1"
                        :min="condicionesAplicacion.minDate"
                        :max="moment().format('YYYY-MM-DD')"
                      >
                      </c-date>
                    </v-col>
                    <v-col cols="12">
                      <check-externa v-model="vacunacion.externa"/>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="6">
                      <c-select-complete
                        v-model="vacunacion.cod_dpto_aplicacion"
                        label="Departamento de aplicación"
                        name="departamento de aplicación"
                        rules="required"
                        :items="departamentos"
                        item-text="nombre"
                        item-value="codigo"
                        :disabled="identificacionVerificada < 1"
                        @change="
                          (val) =>
                            (vacunacion.cod_mpio_aplicacion = departamentos
                              .find((x) => x.codigo === val)
                              .municipios.find((z) => z.codigo === vacunacion.cod_mpio_aplicacion)
                              ? vacunacion.cod_mpio_aplicacion
                              : null)
                        "
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="6">
                      <c-select-complete
                        :disabled="
                          !vacunacion.cod_dpto_aplicacion || identificacionVerificada < 1
                        "
                        v-model="vacunacion.cod_mpio_aplicacion"
                        label="Municipio de aplicación"
                        name="municipio de aplicación"
                        rules="required"
                        :items="
                          departamentos.length &&
                          vacunacion.cod_dpto_aplicacion &&
                          departamentos.find((x) => x.codigo === vacunacion.cod_dpto_aplicacion)
                            ? departamentos.find(
                                (x) => x.codigo === vacunacion.cod_dpto_aplicacion
                              ).municipios
                            : []
                        "
                        item-text="nombre"
                        item-value="codigo"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <c-select-complete
                        v-model="vacunacion.bodega_id"
                        label="Bodega"
                        rules="required"
                        name="bodega"
                        :items="bodegasFiltradas"
                        item-text="nombre"
                        item-value="bodega_id"
                        :disabled="identificacionVerificada < 1"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-select-complete
                        v-model="vacunacion.biologico"
                        label="Biológico"
                        rules="required"
                        name="biológico"
                        :items="
                          vacunacion.bodega_id
                            ? bodegasFiltradas.find(
                                (x) => x.bodega_id === vacunacion.bodega_id
                              ).biologicos
                            : []
                        "
                        item-text="nombre"
                        item-value="codigo"
                        :disabled="
                          identificacionVerificada < 1 || !vacunacion.bodega_id
                        "
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col cols="12" class="pb-0" sm="6" md="6">
                      <c-select-complete
                        v-model="vacunacion.lote_biologico"
                        label="Lote"
                        rules="required"
                        name="lote"
                        :items="lotesBiologico"
                        :disabled="
                          identificacionVerificada < 1 || !vacunacion.biologico
                        "
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-select-complete
                        v-model="vacunacion.tipo_dosis"
                        label="Tipo de dosis"
                        rules="required"
                        name="tipo de dosis"
                        :items="filterTipoDosis"
                        item-text="nombre"
                        item-value="codigo"
                        :disabled="identificacionVerificada < 1"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-select-complete
                        v-model="vacunacion.estrategia_vacunacion"
                        label="Estrategia de vacunación"
                        rules="required"
                        name="estrategia de vacunación"
                        :items="dosisVacunas.estrategiasVacunacion"
                        :disabled="identificacionVerificada < 1"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <c-select-complete
                        v-model="vacunacion.priorizacion"
                        label="Priorización"
                        rules="required"
                        name="priorización"
                        :items="filterPriorizacion"
                        item-text="descripcion"
                        item-value="codigo"
                        :disabled="identificacionVerificada < 1"
                      >
                      </c-select-complete>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-texto
                        :value="
                          priorizacion_object
                            ? priorizacion_object.etapa
                            : '-'
                        "
                        label="Etapa"
                        name="etapa"
                        upper-case
                        disabled
                      >
                      </c-texto>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6" md="6">
                      <c-date
                        v-if="calc_segunda_dosis"
                        :value="calc_segunda_dosis"
                        label="Fecha 2da Dosis"
                        name="fecha segunda dosis"
                        upper-case
                        disabled
                      >
                      </c-date>
                      <c-texto
                        v-else
                        value="NO APLICA"
                        label="Fecha 2da Dosis"
                        upper-case
                        disabled
                      >
                      </c-texto>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <ValidationProvider
                        name="vacunador"
                        rules="required"
                        v-slot="{ errors, valid }"
                      >
                        <v-autocomplete
                          label="Vacunador"
                          name="vacunador"
                          v-model="vacunacion.vacunador_id"
                          :items="vacunadores"
                          outlined
                          dense
                          item-value="id"
                          clearable
                          :error-messages="errors"
                        >
                          <template v-slot:selection="{ item, index }">
                            <div
                              class="pa-0 text-truncate"
                              style="width: 100% !important"
                            >
                              {{
                                `${item.apellido1} ${item.apellido2} ${item.nombre1} ${item.nombre2}`
                              }}
                            </div>
                          </template>
                          <template v-slot:item="{ item, index }">
                            <template>
                              <v-list-item-content class="pa-0">
                                <v-list-item-title>{{
                                  `${item.apellido1} ${item.apellido2 ? item.apellido2 : ''} ${item.nombre1} ${item.nombre2 ? ${item.nombre2 : ''}`
                                }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  item.tipo_identificacion +
                                  " " +
                                  item.identificacion
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                          </template>
                        </v-autocomplete>
                      </ValidationProvider>
                      <!-- <c-texto
                        v-model="vacunacion.vacunador"
                        label="Vacunador"
                        name="vacunador"
                        upper-case
                      >
                      </c-texto> -->
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="12" md="12">
                      <c-text-area
                        v-model="vacunacion.eventos_atribuidos"
                        label="Eventos atribuidos"
                        name="eventos atribuidos"
                        rules="required"
                        upper-case
                      >
                      </c-text-area>
                    </v-col>
                  </template>
                </template>
                <!-- <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-texto
                    v-model="vacunacion.responsable_matriz"
                    label="Responsable de la matriz"
                    name="responsable_matriz"
                    upper-case
                    rules="required"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-texto
                    v-model="vacunacion.telefono_responsable"
                    label="Celular responsable"
                    rules="required|numeric|minlength:10|maxlength:10"
                    name="celular_responsable"
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <c-texto
                    v-model="vacunacion.email_responsable"
                    label="Email responsable"
                    rules="required|email"
                    name="email_responsable"
                    lower-case
                  >
                  </c-texto>
                </v-col> -->
                <v-col cols="12" class="pb-0">
                  <c-text-area
                    label="Observaciones"
                    v-model="vacunacion.observacion"
                    name="observaciones"
                  />
                </v-col>
              </v-row>
            </ValidationObserver>
            <v-card-actions>
              <v-btn @click.stop="close">
                <v-icon>mdi-close</v-icon>
                Cerrar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click.stop="guardar">
                <v-icon left>fas fa-save</v-icon>
                Guardar
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
      <!-- MODAL PARA CIUDADANOS FALLECIDOS -->
      <v-dialog
        v-model="modalPersonaFallecida"
        max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 warning">
            Advertencia
          </v-card-title>

          <v-card-text class="pb-0">
            <v-container fluid>
              <v-row>

                <v-card
                  class="mx-auto"
                  max-width="344"
                  outlined
                >
                  <v-list-item three-line>
                    <v-list-item-content v-if="afiliadoFallecido">
                      <div class="text-overline mb-4">
                        <b>Ciudadano Fallecido</b>
                      </div>
                      <v-list-item-title class="text-h5 mb-1">
                        {{ `${afiliadoFallecido.nombre1} ${afiliadoFallecido.nombre2} ${afiliadoFallecido.apellido1} ${afiliadoFallecido.apellido2}` }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{ `${tiposDocumentoIdentidad.find(x => x.id === afiliadoFallecido.tipo_documento_identidad_id).descripcion}. ${afiliadoFallecido.numero_documento_identidad}` }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                      tile
                      size="80"
                      color="grey"
                      round
                      style="border-radius: 10px"
                    >
                      <v-icon color="white">fas fa-address-card</v-icon>
                    </v-list-item-avatar>
                  </v-list-item>
                </v-card>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="modalPersonaFallecida = false"
            >
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>
<script>
import SearchIdentidadVacunado from './SearchIdentidadVacunado'
import models from 'Views/covid19/vacunacionSucre/models'
import ComorbilidadesGestionVacunacion from "./ComorbilidadesGestionVacunacion"
import NoPuedeVacunarseComponent from "./NoPuedeVacunarseComponent"
import DiscapacidadesVacunacion from './DiscapacidadesVacunacion'
import CheckExterna from './CheckExterna'
import {mapGetters} from "vuex";

export default {
  name: "RegistroVacunacion",
  components: {
    SearchIdentidadVacunado,
    ComorbilidadesGestionVacunacion,
    NoPuedeVacunarseComponent,
    DiscapacidadesVacunacion,
    CheckExterna
  },
  data: () => ({
    menuHora: false,
    identificacionVerificada: 0,
    dialog: false,
    loading: false,
    vacunacion: null,
    edad: null,
    vacunadores: [],
    bodegas: [],
    priorizacion_object: null,
    flagWaitGetVacunacion: true,
    isEdit: false,
    modalPersonaFallecida: false,
    tamizajePositivo: null,
    afiliadoFallecido: null,
    dosisAplicadas: [],
    bodegasFiltradas: [],
    condionesGestante: [
      {text: 'SI', value: 'GESTANTE'},
      {text: 'NO', value: 'NO GESTANTE'},
    ],
    condicionesPosparto: [
      {text: 'SI', value: 1},
      {text: 'NO', value: 0},
    ],
    validationGestanteFail: false,
    errorProgramatico: null,
    errorProgramaticoMessage: null,
    esquemaCompleto: null,
    tieneRefuerzo: null,
    fechaAplicacionAnticipada: false,
    msgFechaAplicacionAnticipada: null,
    edadNoPermitidaVacuna: false,
  }),
  computed: {
    sexoAutomatico () {
      if (!this.vacunacion || this.vacunacion.tipo_identificacion !== 'CC' || !this.vacunacion.identificacion || isNaN(Number(this.vacunacion.identificacion)) || (!isNaN(Number(this.vacunacion.identificacion)) && ((Number(this.vacunacion.identificacion) >= 1000000000) || (Number(this.vacunacion.identificacion) <= 0)))) {
        return null
      } else {
        const identificacion = Number(this.vacunacion.identificacion)
        return ((identificacion > 0 && identificacion <= 19999999) || (identificacion >= 70000000 && identificacion <= 99999999)) ? 'M' : 'F'
      }
    },
    ...mapGetters([
      "sexosCovid",
      "tiposDocumentoIdentidad",
      "departamentos",
      "municipiosTotal",
      "epss",
      "dosisVacunas",
      "ultimoVacunadorId",
      "lastDptoAplicacionVacuna",
      "lastMpioAplicacionVacuna",
      'parentescos',
      'tipoPoblaciones'
    ]),
    acudienteObligatorioPorEdad() {
      return this.vacunacion.edad && this.vacunacion.edad >= 3 && this.vacunacion.edad <= 11
    },
    // *Hacer computed de forzadoNoVacunacion para preguntar por cada una de las variables que bloquean (if || O)
    // *(edadNoPermiteVacuna, refuerzoAplicado, embarazoTemprano, tiempoEsperaFail)
    // *Crear campos de puede_vacunarse (radiobutton) debajo de acepta_vacuna, y luego un campo de motivos de no poder vacunarse (select multiple)
    /* 
    Listado de motivos no puede vacunarse
    -no cumple con la edad (menor de 12 años).
    -en embarazo (menor a 12 semanas).
    -error programatico.
    -ya cumple con el esquema completo y refuerzo.
    -no cumple el tiempo de espera para aplicación de la dosis.
    */
    // *SI acepta_vacuna Y puede_vacunarse, muestra todo el resto del formulario de vacunacion.
    // *Hacer watch de la computed anterior, y si es True, el valor de puede_vacunarse es false y deshabilito la pregunta de puede vacunarse.
    forzadoNoVacunacion() {
      return this.edadNoPermitidaVacuna || (this.tieneRefuerzo === 1) || this.validationGestanteFail || this.fechaAplicacionAnticipada
    },
    filterTipoDosis() {
      // *Si tiene esquema completo, solo dejar Refuerzo, quitar unica por biologico y unica por covid. Y el refuerso, si aplica para el
      let result = this.dosisVacunas.Tipo_dosis
      console.log('dosis aplicadas', this.dosisAplicadas.length)
      console.log('this.vacunacion.biologico', this.vacunacion.biologico)
      console.log('this.edad', this.vacunacion.edad)
      if (this.tieneRefuerzo) {
        result = []
      }
      else if (this.dosisAplicadas.length) {
        // let tipoDosisAplicadas = this.dosisAplicadas.map(x => x.tipo_dosis)
        let tipoBiologicosAplicadas = this.dosisAplicadas.map(x => x.biologico)
        // SI el biologico actual es JANSSEN O ya tiene dosis aplicadas de JANSSEN-> Solo habilita los tipos de dosis de REFUERZO
        // if ((this.vacunacion.biologico && this.vacunacion.biologico === '4') || tipoBiologicosAplicadas.includes("JANSSEN")) {
        //   console.log("2");
        //   result = this.dosisVacunas.Tipo_dosis.filter(x => !['PRIMERA', 'SEGUNDA', 'UNICA POR BIOLOGICO', 'UNICA POR COVID'].includes(x.nombre) ? x : null)
        // }
        // SI el biologico actual es diferente de JANSSEN O los tipos de biologicos aplicadas son diferentes de JANSSEN Y no tiene el esquema completo
        // -> Solo habilita los tipos de dosis diferentes de los que ya tiene (tipoDosisAplicadas)
        if (((this.vacunacion.biologico && this.vacunacion.biologico !== '4') || !tipoBiologicosAplicadas.includes("JANSSEN")) && !this.esquemaCompleto) {
          console.log("3");
          result = this.dosisVacunas.Tipo_dosis.filter(x => !['PRIMERA', 'UNICA POR BIOLOGICO', 'UNICA POR COVID', 'REFUERZO'].includes(x.nombre) ? x : null)
        }
        // SI el biologico actual es diferente de JANSSEN O los tipos de biologicos son diferentes de JANSSEN Y tiene el esquema completo
        // -> habilita solo el REFUERZO
        // if (((this.vacunacion.biologico && this.vacunacion.biologico !== '4') || !tipoBiologicosAplicadas.includes("JANSSEN")) && this.esquemaCompleto) {
        if (this.esquemaCompleto && (this.vacunacion.edad >= 18)) {
          console.log("4", this.dosisVacunas.Tipo_dosis);
          result = this.dosisVacunas.Tipo_dosis.filter(x => !['PRIMERA', 'SEGUNDA', 'UNICA POR BIOLOGICO', 'UNICA POR COVID'].includes(x.nombre) ? x : null)
        }

        // if (this.esquemaCompleto && (this.edad > 70 || this.vacunacion.comorbilidades_vacunacion.length)) {
        //   console.log("5");
        //   result = this.dosisVacunas.Tipo_dosis.filter(x => !['PRIMERA', 'SEGUNDA', 'UNICA POR BIOLOGICO', 'UNICA POR COVID'].includes(x.nombre) ? x : null)
        // }
      } else {
        // SI es primera dosis Y el biologico es JANSSEN -> Solo habilita los tipos de dosis de UNICA POR BIOLOGICO
        // SINO habilitar unicamente los tipos de dosis de PRIMERA, UNICA POR BIOLOGICO
        if (this.vacunacion.biologico === '4') {
          console.log("1");
          result = this.dosisVacunas.Tipo_dosis.filter(x => !['PRIMERA', 'SEGUNDA', 'UNICA POR COVID', 'REFUERZO'].includes(x.nombre) ? x : null)
        } else {
          if (this.tamizajePositivo) {
            result = this.dosisVacunas.Tipo_dosis.filter(x => !['SEGUNDA', 'REFUERZO'].includes(x.nombre) ? x : [])
          } else {
            result = this.dosisVacunas.Tipo_dosis.filter(x => !['SEGUNDA', 'UNICA POR BIOLOGICO', 'REFUERZO'].includes(x.nombre) ? x : null)
          }
        }
      }
      
      return result
    },
    filterPriorizacion() {
      let result = [];
      if (this && this.dosisVacunas && this.dosisVacunas.priorizaciones && this.vacunacion.edad) {
        result = this.dosisVacunas.priorizaciones.filter(x => {
          if (!x.edad_min && !x.edad_max) {
            return x;
          }
          if ((x.edad_min && this.vacunacion.edad >= x.edad_min) && (x.edad_max && this.vacunacion.edad < x.edad_max)) {
            return x;
          }
          if ((x.edad_min && this.vacunacion.edad >= x.edad_min) && !x.edad_max) {
            return x;
          }
          if ((x.edad_max && this.vacunacion.edad < x.edad_max) && !x.edad_min) {
            return x;
          }
        })
      }
      return result;
    },
    condicionesAplicacion() {
      const comorbilidades = this.vacunacion?.comorbilidades_vacunacion.length || 0
      const booster = this.vacunacion?.edad >= 18 ? comorbilidades ? 1 : this.vacunacion?.edad >= 50 ? 4 : 6 : -1
      let aplayCondition = { // Condiciones por fechas para aplicaciones de dosis segun biológico
        ASTRAZENECA: {
          firstDaysGrace: 0,
          second: {
            min: 84,
            max: 84
          },
          booster: booster
        },
        MODERNA: {
          firstDaysGrace: 0, // 4 para personas normales (de edad y sin comorbilidades)
          second: {
            min: 25,
            max: 84
          },
          booster: booster
        },
        PFIZER: {
          firstDaysGrace: 0, // 4 para personas normales (de edad y sin comorbilidades)
          second: {
            min: 21,
            max: 84
          },
          booster: booster
        },
        SINOVAC: {
          firstDaysGrace: 0,
          second: {
            min: 28,
            max: 28
          },
          booster: booster
        },
        JANSSEN: {
          booster: booster
        }
      }
      // SI no tiene dosis aplicadas -> la fecha minima es el 17/02/2021
      let result = {
        minDate: this.moment('17/02/2021', 'DD/MM/YYYY').format('YYYY-MM-DD'),
        maxDate: null,
        errorMessage: null
      }
      // SI tiene dosis aplicadas -> la fecha minima es la fecha_aplicacion del ultimo biologico aplicado
      if (this && this.dosisAplicadas && this.dosisAplicadas.length) {
        let ultimoBiologicoAplicado = this.dosisAplicadas[0].biologico
        if (this.dosisAplicadas.length <= 2) {
          if (this.dosisAplicadas.length === 1) {
            if (ultimoBiologicoAplicado !== 'JANSSEN') {
              result.minDate = this.moment(this.dosisAplicadas[0].fecha_aplicacion).add(aplayCondition[ultimoBiologicoAplicado].second.min - aplayCondition[ultimoBiologicoAplicado].firstDaysGrace,'days').format('YYYY-MM-DD')
              result.maxDate = this.moment(result.minDate).add(aplayCondition[ultimoBiologicoAplicado].second.max, 'days').format('YYYY-MM-DD')
            } else {
              if (aplayCondition.JANSSEN.booster === -1) {
                result.errorMessage = `NO es posible aplicar el refuerzo, la edad no está autorizada.`
              } else {
                result.minDate = this.moment(this.dosisAplicadas[0].fecha_aplicacion).add(aplayCondition.JANSSEN.booster,'months').format('YYYY-MM-DD')
              }
            }
          } else {
            if (ultimoBiologicoAplicado !== 'JANSSEN') {
              if (aplayCondition.JANSSEN.booster === -1) {
                result.errorMessage = `NO es posible aplicar el refuerzo, la edad no está autorizada.`
              } else {
                result.minDate = this.moment(this.dosisAplicadas[0].fecha_aplicacion).add(aplayCondition[ultimoBiologicoAplicado].booster,'months').format('YYYY-MM-DD')
              }
            } else {
              result.errorMessage = `NO es un número de dosis o refuerzo autorizado para ${ultimoBiologicoAplicado}`
            }
          }
        } else {
          result.errorMessage = `NO es un número de dosis o refuerzo autorizado para ${ultimoBiologicoAplicado}`
        }
      }
      return result
    },
    verbalTimeAgoDiagnostico() {
      let stringDate = ``
      if (this.tamizajePositivo && this.tamizajePositivo.positivo_covid && this.tamizajePositivo.fecha_diagnostico) {
        let a = this.moment()
				let b = this.moment(this.tamizajePositivo.fecha_diagnostico)
				let years = a.diff(b, 'year')
				b.add(years, 'years')

				let months = a.diff(b, 'months')
				b.add(months, 'months')

				let days = a.diff(b, 'days')
				b.add(days, 'days')

				let hours = a.diff(b, 'hours')
				b.add(hours, 'hours')
				stringDate = stringDate + (years ? `${years} año${years === 1 ? '' : 's'}` : '')
				stringDate = stringDate + (months ? ` ${months} mes${months === 1 ? ''  : 'es'}` : '')
				stringDate = stringDate + (years || months ? days ? ` ${days} d${days === 1 ? 'ía' : 'ias'}` : '' : `${days} d${days === 1 ? 'ía' : 'ias'}`)
      }
      return stringDate
    },
    lotesBiologico() {
      return this.vacunacion.bodega_id && this.vacunacion.biologico
        ? this.bodegasFiltradas.find((x) => x.bodega_id === this.vacunacion.bodega_id)?.biologicos.find((x) => x.codigo === this.vacunacion.biologico)?.lotes
        : [];
    },
    calc_segunda_dosis() {
      let days = 0;
      let fecha = null;

      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "1" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis === "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "1"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD")
          .add(days, "days")
          .format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "2" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis === "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "2"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD")
          .add(days, "days")
          .format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "3" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis === "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "3"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD")
          .add(days, "days")
          .format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "5" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis === "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "5"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD")
          .add(days, "days")
          .format("YYYY-MM-DD");
      }
      return fecha;
    },
  },
  watch: {
    'vacunacion.tipo_poblacion': {
      handler(val) {
        if (val !== 'Población Asegurada') {
          this.vacunacion.aseguradora = null
          this.vacunacion.regimen = null
        }
      },
      immediate: false
    },
    'vacunacion.aseguradora': {
      handler(val) {
        if (val) {
          this.vacunacion.tipo_poblacion = 'Población Asegurada'
        }
      },
      immediate: false
    },
    sexoAutomatico: {
      handler(val) {
        if (typeof val !== 'undefined' && this.vacunacion) this.vacunacion.sexo = val
      },
      immediate: true
    },
    "vacunacion.condicion_discapacidad": {
      handler(val) {
        if (val && val === 'NO') this.vacunacion.discapacidades = [];
      },
      immediate: false
    },
    "vacunacion.puede_vacunarse": {
      handler(val) {
        if (val) {
          this.vacunacion.motivos_no_puede_vacunarse = []
        }
      },
      immediate: false
    },
    "forzadoNoVacunacion": {
      handler(val) {
        if (val) {
          this.vacunacion.puede_vacunarse = 0;
        } else {
          this.vacunacion.puede_vacunarse = null
        }
      },
      immediate: false
    },
    'condicionesAplicacion': {
      handler(val) {
        if (val) {
          this.vacunacion.fecha_aplicacion = null
          if (this.tieneRefuerzo) {
            this.fechaAplicacionAnticipada = false
            this.msgFechaAplicacionAnticipada = null
          } else {
            if (val.errorMessage) {
              this.fechaAplicacionAnticipada = true
              this.msgFechaAplicacionAnticipada = val.errorMessage
            } else {
              let diasTemprano = this.moment(val.minDate, 'YYYY-MM-DD').diff(this.moment(), 'days')
              console.log('diasTemprano', diasTemprano)
              if (diasTemprano > 0 && this.dosisAplicadas && (this.dosisAplicadas.length === 1 || this.dosisAplicadas.length === 2)) {
                this.fechaAplicacionAnticipada = true
                this.msgFechaAplicacionAnticipada = `Faltan ${diasTemprano} dia${diasTemprano !== 1 ? 's' : ''} para aplicación de la siguiente dosis.`
              } else {
                this.fechaAplicacionAnticipada = false
                this.msgFechaAplicacionAnticipada = null
              }
            }
          }
        }
      },
      immediate: false
    },
    "vacunacion.fecha_ult_regla": {
      handler(val) {
        if (val) {
          this.vacunacion.fecha_prob_parto = this.calcFechaProbableParto(val)
          this.vacunacion.semanas_embarazo = this.calcSemanasEmbarazo(val)
        }
      },
      immediate: false
    },
    "vacunacion.etnia": {
      handler(val) {
        if (val === null || val === '6') this.vacunacion.nombre_etnia_poblacion = null
      },
      immediate: false
    },
    "vacunacion.priorizacion": {
      handler(value) {
        if (value) {
          this.priorizacion_object = this.dosisVacunas.priorizaciones.find(
            (x) => x.codigo === value
          );
        }
      },
    },
    "vacunacion.biologico": {
      handler() {
        if (this.flagWaitGetVacunacion) {
          this.vacunacion.lote_biologico = null;
        }
      },
      immediate: false,
      /* handler(oldValue, newValue) {
        if (oldValue === null && oldValue != newValue) {
          this.vacunacion.lote_biologico = null
        }
      } */
    },
    "vacunacion.bodega_id": {
      handler() {
        if (this.flagWaitGetVacunacion) {
          this.vacunacion.biologico = null;
          this.vacunacion.lote_biologico = null;
        }
      },
      immediate: false,
      /* handler(oldValue, newValue) {
        if (oldValue === null && oldValue != newValue) {
          this.vacunacion.biologico = null;
          this.vacunacion.lote_biologico = null;
        }
      } */
    },
    "vacunacion.estado_adres": {
      handler(val) {
        if (val && val === 'FALLECIDO' && !this.isEdit) {
          console.log("entre");
          this.vacunacion.fecha_aplicacion = null;
          this.vacunacion.bodega_id = null;
          this.vacunacion.biologico = null;
          this.vacunacion.lote_biologico = null;
          this.vacunacion.tipo_dosis = null;
          this.vacunacion.priorizacion = null;
          this.vacunacion.estrategia_vacunacion = null;
          this.vacunacion.eventos_atribuidos = null;
          this.vacunacion.vacunador_id = null;
          this.vacunacion.cod_dpto_aplicacion = null;
          this.vacunacion.cod_mpio_aplicacion = null;
          this.vacunacion.puede_vacunarse = null;
          this.vacunacion.acepta_vacuna = null;
          this.vacunacion.motivos_no_puede_vacunarse = [];
          this.vacunacion.motivo_disistimiento = null;
        }
      },
      immediate: false
    },
    "vacunacion.acepta_vacuna": {
      handler(value) {
        console.log("vacunacion.acepta_vacuna out", value);
        if (!this.isEdit) {
          if (value) {
            this.vacunacion.motivo_disistimiento = null;
            this.vacunacion.vacunador_id = this.ultimoVacunadorId;
            this.vacunacion.cod_dpto_aplicacion = this.lastDptoAplicacionVacuna;
            this.vacunacion.cod_mpio_aplicacion = this.lastMpioAplicacionVacuna;
          } else {
            console.log("vacunacion.acepta_vacuna else");
            this.vacunacion.fecha_aplicacion = null;
            this.vacunacion.bodega_id = null;
            this.vacunacion.biologico = null;
            this.vacunacion.lote_biologico = null;
            this.vacunacion.tipo_dosis = null;
            this.vacunacion.priorizacion = null;
            this.vacunacion.estrategia_vacunacion = null;
            this.vacunacion.eventos_atribuidos = null;
            this.vacunacion.vacunador_id = null;
            this.vacunacion.cod_dpto_aplicacion = null;
            this.vacunacion.cod_mpio_aplicacion = null;
          }
        }
      },
      immediate: false
    },
    "vacunacion.necesita_acudiente": {
      handler(value) {
        if (value && value === "NO") {
          this.vacunacion.parentesco_id = null;
          this.vacunacion.tipo_ident_acud = null;
          this.vacunacion.identificacion_acud = null;
          this.vacunacion.apellido1_acud = null;
          this.vacunacion.apellido2_acud = null;
          this.vacunacion.nombre1_acud = null;
          this.vacunacion.nombre2_acud = null;
        }
      },
      immediate: false,
      deep: false
    },
    "vacunacion.sexo": {
      handler(val) {
        if (val && val === 'M') {
          this.vacunacion.condicion = null
          this.vacunacion.fecha_prob_parto = null;
          this.vacunacion.semanas_embarazo = null;
          this.vacunacion.lactancia = null;
          this.vacunacion.posparto = null;
        }
      },
      immediate: true,
    },
    "vacunacion.condicion": {
      handler(value) {
        if (value && (value === "NO APLICA" || value === "NO GESTANTE")) {
          this.vacunacion.fecha_prob_parto = null;
          this.vacunacion.semanas_embarazo = null;
          this.vacunacion.fecha_ult_regla = null;
        }
        if(value && (value === 'GESTANTE')) this.vacunacion.posparto = null
      },
      immediate: false
    },
    "vacunacion.posparto": {
      handler(val) {
        if (val) {
          this.vacunacion.condicion = 'NO GESTANTE'
        } else {
          this.vacunacion.fecha_parto = null
        }
      },
      immediate: false
    },
    "vacunacion.fecha_nacimiento": {
      handler(val) {
        if (this && this.vacunacion) {
          let laEdad = this.calculaEdad(val);
          this.vacunacion.edad = laEdad.years;
          this.edad = laEdad.stringDate;
        }
      },
      immediate: true,
    },
    "vacunacion.edad": {
      handler(val) {
        if (val && (val >= 12 && val < 18 && this.dosisAplicadas && !this.dosisAplicadas.length)) {
          this.bodegasFiltradas = this.filterBodegasToPrimeraAplicacion(['PFIZER', 'MODERNA'])
        } else if (val && (val >= 3 && val <= 11 && this.dosisAplicadas && !this.dosisAplicadas.length)){
          this.bodegasFiltradas = this.filterBodegasToPrimeraAplicacion(['SINOVAC'])
          this.vacunacion.necesita_acudiente = 'SI';
        } else {
          this.bodegasFiltradas = this.filterBodegas()
        }
        this.edadNoPermitidaVacuna = (val !== null && val < 3)
      },
      immediate: false
    },
    "vacunacion.semanas_embarazo": {
      handler(val) {
        this.validationGestanteFail = !!(val && val < 12);
        if (val && val >= 12 && val <= 40 && this.vacunacion.condicion === 'GESTANTE') {
          this.bodegasFiltradas = this.filterBodegasToPrimeraAplicacion(['PFIZER'])
        } else {
          this.bodegasFiltradas = this.filterBodegas()
        }
      },
      immediate: false
    },
  },
  methods: {
    filterBodegasToPrimeraAplicacion(arrayBiologicos) {
      let result = []
      if (this.bodegas && this.bodegas.length) {
        for (let bodega of this.bodegas) {
          let bodegaClone = this.clone(bodega)
          delete bodegaClone.biologicos
          for (let biologico of bodega.biologicos) {
            // biologico.nombre === this.dosisAplicadas[0].biologico
            if (arrayBiologicos.includes(biologico.nombre)) {
              bodegaClone.biologicos = [biologico]
            }
          }
          if (bodegaClone.hasOwnProperty("biologicos")) result.push(bodegaClone)
        }
      }
      return result
    },
    calcFechaProbableParto(fechaUltimaRegla) {
      // días que dura la gestación 7 días * 40 semanas + 10 días
      let diasGestacion = (7 * 40) + 10
      return this.moment(fechaUltimaRegla, 'YYYY-MM-DD').add(diasGestacion, 'days').format('YYYY[-]MM[-]DD')
    },
    calcSemanasEmbarazo(fechaUltimaRegla) {
      let fecha1 = this.moment(fechaUltimaRegla, 'YYYY-MM-DD').add(10, 'days')
      let fecha2 = this.moment()
      return fecha2.diff(fecha1, 'weeks')
    },
    getInventarioResponsable() {
      this.axios
        .get(`dosis-resources-bodegas`)
        .then((response) => {
          // console.log(response.data);
          this.bodegas = response.data;
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar la info de las bodegas del responsable`,
            error: error,
          });
          this.close();
        });
    },
    guardar() {
      this.$refs.formVacunacion.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.vacunacion);
          delete copiaData.afiliado_id;
          copiaData.fecha_prog_2da_dosis = this.calc_segunda_dosis;
          copiaData.etapa = this.priorizacion_object
            ? this.priorizacion_object.etapa
            : null;
          copiaData.lactancia = copiaData.sexo === 'F' && copiaData.lactancia === null ? false : null;
          copiaData.posparto = copiaData.sexo === 'F' && copiaData.posparto === null ? false : null;
          let request = copiaData.id
            ? this.axios.put(`dosis-aplicadas/${copiaData.id}`, copiaData)
            : this.axios.post(`dosis-aplicadas`, copiaData);
          request
            .then((response) => {
              if (response.status === 201) {
                this.$store.dispatch("setUltimoVacunadorId", {
                  ultimoVacunadorId: response.data.vacunador_id,
                });
                this.$store.dispatch("setLastDptoAplicacionVacuna", {
                  cod_dpto_aplicacion: response.data.cod_dpto_aplicacion,
                });
                this.$store.dispatch("setLastMpioAplicacionVacuna", {
                  cod_mpio_aplicacion: response.data.cod_mpio_aplicacion,
                });
              }
              this.$emit("guardado", response.data);
              this.$store.commit("snackbar", {
                color: "success",
                message: `Registro guardado correctamente.`,
              });
              this.close();
            })
            .catch((error) => {
              this.loading = false;
              this.$store.commit("snackbar", {
                color: "error",
                message: `al guardar el registro.`,
                error: error,
              });
            });
        }
      });
    },
    getVacunacion(id) {
      this.flagWaitGetVacunacion = false;
      this.loading = true;
      this.axios
        .get(`dosis-aplicadas/${id}`)
        .then((response) => {
          this.vacunacion = response.data;
          this.vacunacion.discapacidades = this.vacunacion.discapacidades.map(x => x.id)
          this.identificacionVerificada = 1;
          this.loading = false;
          setTimeout(() => {
            this.flagWaitGetVacunacion = true;
          }, 500);
          console.log("GET_VACUNACION");
        })
        .catch((error) => {
          this.flagWaitGetVacunacion = true;
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar el registro de vacunación`,
            error: error,
          });
          this.close();
        });
    },
    open(id = null) {
      this.flagWaitGetVacunacion = true;
      this.priorizacion_object = null;
      this.getInventarioResponsable();
      this.getVacunadores();
      this.identificacionVerificada = 0;
      if (id) {
        // this.vacunacion = this.clone(models.vacunacionSucre);
        this.isEdit = true
        this.getVacunacion(id);
      } else {
        this.vacunacion = this.clone(models.vacunacionSucre);
        this.vacunacion.vacunador_id = this.ultimoVacunadorId;
        this.vacunacion.cod_dpto_aplicacion = this.ultimoVacunadorId;
        this.vacunacion.cod_mpio_aplicacion = this.ultimoVacunadorId;
      }
      // this.vacunacion.vacunador_id = this.ultimoVacunadorId;
      this.dialog = true;
    },
    resetVariablesAlert() {
      this.tamizajePositivo = null
      this.validationGestanteFail = false
      this.errorProgramatico = null
      this.errorProgramaticoMessage= null
      this.esquemaCompleto = null
      this.edadNoPermitidaVacuna = false
      this.fechaAplicacionAnticipada = false
      this.msgFechaAplicacionAnticipada = null
      this.tieneRefuerzo = null
      this.dosisAplicadas = []
      this.afiliadoFallecido = null
    },
    close() {
      this.dialog = false;
      this.identificacionVerificada = 0;
      this.resetVariablesAlert();
      setTimeout(() => {
        this.loading = false;
        this.vacunacion = this.clone(models.vacunacionSucre);
        this.$refs.formVacunacion.reset();
        this.isEdit = false;
      }, 400);
    },
    resultAfiliado(response) {
      this.resetVariablesAlert();
      this.identificacionVerificada = 1;
      if (response.afiliado !== null) {
        this.vacunacion.tipo_identificacion = null;
        this.vacunacion.nombre1 = null;
        this.vacunacion.nombre2 = null;
        this.vacunacion.apellido1 = null;
        this.vacunacion.apellido2 = null;
        this.vacunacion.fecha_nacimiento = null;
        this.vacunacion.sexo = null;
        this.vacunacion.telefono_contacto = null;
        this.vacunacion.email = null;
        this.vacunacion.direccion = null;
        this.vacunacion.cod_dpto = null;
        this.vacunacion.cod_mpio = null;
        this.vacunacion.codigo_ips = null;
      }
      if (response.afiliado && response.afiliado.estado === 'AF') {
        this.identificacionVerificada = 0;
        this.modalPersonaFallecida = true;
        this.afiliadoFallecido = response.afiliado;

      } else {
          if (response.dosis && response.dosis.length) {
            this.errorProgramatico = response.dosis[0].error_programatico
            this.errorProgramaticoMessage = response.dosis[0].error_programatico_descrp
            this.esquemaCompleto = response.dosis[0].esquema_completo
            this.tieneRefuerzo = response.dosis[0].refuerzo
            this.vacunacion.tipo_identificacion = response.dosis[0].tipo_identificacion
            this.vacunacion.identificacion = response.dosis[0].identificacion;
            this.vacunacion.nombre1 = response.dosis[0].nombre1;
            this.vacunacion.nombre2 = response.dosis[0].nombre2;
            this.vacunacion.apellido1 = response.dosis[0].apellido1;
            this.vacunacion.apellido2 = response.dosis[0].apellido2;
            this.vacunacion.fecha_nacimiento = response.dosis[0].fecha_nacimiento;
            this.vacunacion.sexo = response.dosis[0].sexo;
            this.vacunacion.telefono_contacto = response.dosis[0].telefono_contacto;
            this.vacunacion.email = response.dosis[0].email;
            this.vacunacion.direccion = response.dosis[0].direccion;
            this.vacunacion.cod_dpto = response.dosis[0].cod_dpto;
            this.vacunacion.cod_mpio = response.dosis[0].cod_mpio;
            this.vacunacion.aseguradora = response.dosis[0].aseguradora;
            this.vacunacion.medio_contacto = response.dosis[0].medio_contacto;
            this.vacunacion.zona = response.dosis[0].zona;
            this.vacunacion.etnia = response.dosis[0].etnia;
            this.vacunacion.condicion = response.dosis[0].condicion;
            // Para embarazadas
            this.vacunacion.fecha_ult_regla = response.dosis[0].fecha_ult_regla;


          } else if (response.tamizaje) {
            this.vacunacion.tipo_identificacion = this.tiposDocumentoIdentidad.find(x => x.id === response.tamizaje.tipo_identificacion).tipo
            this.vacunacion.identificacion = response.tamizaje.identificacion
            this.vacunacion.nombre1 = response.tamizaje.nombre1
            this.vacunacion.nombre2 = response.tamizaje.nombre2
            this.vacunacion.apellido1 = response.tamizaje.apellido1
            this.vacunacion.apellido2 = response.tamizaje.apellido2
            this.vacunacion.fecha_nacimiento = response.tamizaje.fecha_nacimiento
            this.vacunacion.sexo = response.tamizaje.sexo
            this.vacunacion.telefono_contacto = response.tamizaje.celular
            this.vacunacion.email = response.tamizaje.email
            this.vacunacion.direccion = response.tamizaje.direccion
            this.vacunacion.cod_dpto = this.departamentos.find(x => x.id === response.tamizaje.departamento_id).codigo
            this.vacunacion.cod_mpio = this.municipiosTotal.find(x => x.id === response.tamizaje.municipio_id).codigo
            this.vacunacion.aseguradora = response.tamizaje.eps_id

          } else if (response.afiliado) {
            this.vacunacion.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
            this.vacunacion.identificacion = response.afiliado.numero_documento_identidad;
            this.vacunacion.nombre1 = response.afiliado.nombre1;
            this.vacunacion.nombre2 = response.afiliado.nombre2;
            this.vacunacion.apellido1 = response.afiliado.apellido1;
            this.vacunacion.apellido2 = response.afiliado.apellido2;
            this.vacunacion.fecha_nacimiento = response.afiliado.fecha_nacimiento;
            this.vacunacion.sexo = response.afiliado.sexo;
            this.vacunacion.telefono_contacto = response.afiliado.numero_celular;
            this.vacunacion.email = response.afiliado.email;
            this.vacunacion.direccion = response.afiliado.direccion;
            this.vacunacion.aseguradora = response.afiliado.eps_id;
          } 

          if(response.tamizaje && response.tamizaje.positivo_covid) {
            this.tamizajePositivo = response.tamizaje
          }

          if(response.dosisAplicadas && response.dosisAplicadas.length) {
            this.dosisAplicadas = response.dosisAplicadas
            this.bodegasFiltradas = this.filterBodegas()
          } else {
            this.bodegasFiltradas = this.bodegas
            this.dosisAplicadas = []
          }
      }
    },
    /* 
      Fuction: FilterBodegas
      Args: none
      Description: This function is to filter and choose only the Bodegas who has
      the same biologic that the most recent biologic applied.
      Return: Array's bodegas
    */
    filterBodegas() {
      let result = []
      if (this.dosisAplicadas && this.dosisAplicadas.length && this.bodegas && this.bodegas.length) {
        for (let bodega of this.bodegas) {
          let bodegaClone = this.clone(bodega)
          delete bodegaClone.biologicos
          for (let biologico of bodega.biologicos) {
            if (biologico.nombre === this.dosisAplicadas[0].biologico) {
              bodegaClone.biologicos = [biologico]
            }
          }
          if (bodegaClone.hasOwnProperty("biologicos")) result.push(bodegaClone)
        }
      } else {
        result = this.bodegas
      }
      return result
    },
    getVacunadores() {
      this.axios
        .get(`vacunadores`)
        .then((response) => {
          this.vacunadores = response.data;
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar los vacunadores`,
            error: error,
          });
          this.close();
        });
    },
  },
};
</script>