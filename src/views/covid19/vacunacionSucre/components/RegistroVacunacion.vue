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
        <v-toolbar-title>{{ vacunacion && vacunacion.id ? `Edicion Registro No. ${vacunacion.id}` : "Nuevo Registro de Vacunacion" }}</v-toolbar-title>
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
                    item-value="id"
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
                  <c-select-complete
                    v-model="vacunacion.sexo"
                    label="Sexo"
                    rules="required"
                    name="sexo"
                    :items="sexosCovid"
                    item-text="text"
                    item-value="value"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.medio_contacto"
                    label="Medio de contacto"
                    rules="required"
                    name="medio_contacto"
                    :items="dosisVacunas.medioContactos"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-texto
                    v-model="vacunacion.telefono_contacto"
                    label="Celular"
                    rules="required|numeric|minlength:10|maxlength:10"
                    name="celular"
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
                    label="Departamento"
                    name="departamento"
                    rules="required"
                    :items="departamentos"
                    item-text="nombre"
                    item-value="id"
                    :disabled="identificacionVerificada < 1"
                    @change="
                      (val) =>
                        (vacunacion.cod_mpio = departamentos
                          .find((x) => x.id === val)
                          .municipios.find((z) => z.id === vacunacion.cod_mpio)
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
                    label="Municipio"
                    name="municipio"
                    rules="required"
                    :items="
                      departamentos.length &&
                      vacunacion.cod_dpto &&
                      departamentos.find((x) => x.id === vacunacion.cod_dpto)
                        ? departamentos.find(
                            (x) => x.id === vacunacion.cod_dpto
                          ).municipios
                        : []
                    "
                    item-text="nombre"
                    item-value="id"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.zona"
                    label="Zona"
                    rules="required"
                    name="zona"
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
                            vacunacion.necesita_acudiente == null ||
                            vacunacion.necesita_acudiente == 'NO'
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
                            :disabled="identificacionVerificada < 1"
                          />
                        </v-col>
                      </v-row>
                      <template v-if="vacunacion.necesita_acudiente == 'SI'">
                        <v-row>
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
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="vacunacion.condicion"
                    label="Condicion"
                    rules="required"
                    name="condicion"
                    :items="dosisVacunas.condiciones"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <template v-if="vacunacion.condicion == 'GESTANTE'">
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-date
                      v-model="vacunacion.fecha_prob_parto"
                      label="Fecha probable parto"
                      rules="required"
                      name="fecha probable parto"
                      :disabled="identificacionVerificada < 1"
                      :max="moment().format('YYYY-MM-DD')"
                    >
                    </c-date>
                  </v-col>
                  <v-col cols="12" class="pb-0" sm="6" md="6">
                    <c-texto
                      label="Semanas de Embarazo"
                      rules="required"
                      v-model="vacunacion.semanas_embarazo"
                      name="motivo de no vacunación"
                      :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                </template>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="vacunacion.etnia"
                    label="Etnia o Poblacion especial"
                    rules="required"
                    name="etnia"
                    :items="dosisVacunas.Etnias"
                    item-text="nombre"
                    item-value="codigo"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <template>
                  <v-col class="pb-0" cols="12" sm="12" md="12">
                    <c-select-complete
                      v-model="vacunacion.codigo_ips"
                      label="¿A que EPS está afiliado?"
                      rules="required"
                      name="EPS de afiliación"
                      :items="epss"
                      item-value="id"
                      item-text="nombre"
                      :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
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
                        v-if="vacunacion.acepta_vacuna == 0"
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
                </template>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.estado_adres"
                    label="Estado ADRES"
                    rules="required"
                    name="estado_adres"
                    :items="dosisVacunas.estadoAdres"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="vacunacion.regimen"
                    label="Regimen"
                    rules="required"
                    name="sexo"
                    :items="dosisVacunas.Regimenes_dosis_vacunas"
                    item-text="nombre"
                    item-value="codigo"
                    :disabled="identificacionVerificada < 1"
                  >
                  </c-select-complete>
                </v-col>
                <template v-if="vacunacion.acepta_vacuna">
                  <v-col class="pb-0" cols="12" sm="12" md="12">
                    <c-date
                      v-model="vacunacion.fecha_aplicacion"
                      label="Fecha de aplicacion biologico"
                      rules="required"
                      name="fecha aplicacion biologico"
                      :disabled="identificacionVerificada < 1"
                      :max="moment().format('YYYY-MM-DD')"
                    >
                    </c-date>
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-select-complete
                      v-model="vacunacion.biologico"
                      label="Biologico"
                      rules="required"
                      name="biologico"
                      :items="dosisVacunas.Tipo_biologico"
                      item-text="nombre"
                      item-value="codigo"
                      :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col cols="12" class="pb-0" sm="6" md="6">
                    <c-texto
                      label="Lote"
                      rules="required"
                      v-model="vacunacion.lote_biologico"
                      name="lote"
                      :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-select-complete
                      v-model="vacunacion.tipo_dosis"
                      label="Tipo de dosis"
                      rules="required"
                      name="tipo_dosis"
                      :items="dosisVacunas.Tipo_dosis"
                      item-text="nombre"
                      item-value="codigo"
                      :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-select-complete
                      v-model="vacunacion.estrategia_vacunacion"
                      label="Estrategia de vacunacion"
                      rules="required"
                      name="estrategia_vacunacion"
                      :items="dosisVacunas.estrategiasVacunacion"
                      :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="12" md="12">
                    <c-select-complete
                      v-model="vacunacion.tipo_poblacion"
                      label="Tipo de poblacion"
                      rules="required"
                      name="tipo_poblacion"
                      :items="dosisVacunas.priorizaciones.filter(x => x.codigo)"
                      item-text="descripcion"
                      :disabled="identificacionVerificada < 1"
                    >
                    </c-select-complete>
                  </v-col>
                  <v-col class="pb-0" cols="12" sm="6" md="6">
                    <c-texto
                      :value="
                        vacunacion.tipo_poblacion
                          ? vacunacion.tipo_poblacion.etapa
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
                    <ValidationProvider name="vacunador" rules="required" v-slot="{ errors, valid }">
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
                          <div class="pa-0 text-truncate" style="width: 100% !important;">
                            {{ `${item.apellido1} ${item.apellido2} ${item.nombre1} ${item.nombre2}` }}
                          </div>
                        </template>
                        <template v-slot:item="{ item, index }">
                          <template>
                            <v-list-item-content class="pa-0">
                              <v-list-item-title>{{ `${item.apellido1} ${item.apellido2} ${item.nombre1} ${item.nombre2}` }}</v-list-item-title>
                              <v-list-item-subtitle>{{ tiposDocumentoIdentidad.find(x => x.id == item.tipo_identificacion).tipo + ' ' + item.identificacion }}</v-list-item-subtitle>
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
                      name="eventos_atribuidos"
                      upper-case
                    >
                    </c-text-area>
                  </v-col>
                </template>
                <v-col class="pb-0" cols="12" sm="6" md="6">
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
                </v-col>
                <v-col cols="12" class="pb-0">
                  <c-text-area
                    label="Observaciones"
                    v-model="vacunacion.observacion"
                    name="observaciones"
                  />
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-col>
        </v-row>
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
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>
/* 
  ToDO: crear una nueva propiedad en el state general para el id_vacunador
  ToDO: que almacene el ultimo vacunador que se registro en el formulario de creacion (POST)

  ToDO: filtro por pendiente de segunda dosis, filtro por tipo de dosis,
  ToDO: filtro por biologico, filtro por rango de fechas de fecha aplicacion

  ToDO: CRUD para vacunadores en la seccion de Parametros
 */
<script>
import SearchIdentidadVacunado from './SearchIdentidadVacunado'
import models from "Views/covid19/vacunacionSucre/models";
import { mapGetters } from "vuex";

export default {
  name: "RegistroVacunacion",
  components: {
    SearchIdentidadVacunado
  },
  data: () => ({
    menuHora: false,
    identificacionVerificada: 0,
    dialog: false,
    loading: false,
    vacunacion: null,
    edad: null,
    vacunadores: []
  }),
  computed: {
    ...mapGetters([
      "sexosCovid",
      "tiposDocumentoIdentidad",
      "departamentos",
      "municipiosTotal",
      "epss",
      "dosisVacunas",
      "ultimoVacunadorId"
    ]),
    calc_segunda_dosis() {
      let days = 0;
      let fecha = null;

      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "1" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis == "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "1"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD").add(
          days,
          "days"
        ).format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "2" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis == "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "2"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD").add(
          days,
          "days"
        ).format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "3" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis == "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "3"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD").add(
          days,
          "days"
        ).format("YYYY-MM-DD");
      }
      if (
        this.vacunacion.biologico &&
        this.vacunacion.biologico === "5" &&
        this.vacunacion.tipo_dosis &&
        this.vacunacion.tipo_dosis == "1" &&
        this.vacunacion.fecha_aplicacion
      ) {
        days = this.dosisVacunas.Tipo_biologico.find(
          (x) => x.codigo === "5"
        ).valor;
        fecha = this.moment(this.vacunacion.fecha_aplicacion, "YYYY-MM-DD").add(
          days,
          "days"
        ).format("YYYY-MM-DD");
      }
      return fecha;
    },
  },
  watch: {
    "vacunacion.acepta_vacuna": {
      handler(value) {
        if (value) {
          this.vacunacion.motivo_disistimiento = null;
          this.vacunacion.vacunador_id = this.ultimoVacunadorId;
        } else {
          this.vacunacion.fecha_aplicacion = null;
          this.vacunacion.biologico = null;
          this.vacunacion.lote_biologico = null;
          this.vacunacion.tipo_dosis = null;
          this.vacunacion.tipo_poblacion = null;
          this.vacunacion.estrategia_vacunacion = null;
          this.vacunacion.eventos_atribuidos = null;
          this.vacunacion.vacunador_id = null;
        }
      },
    },
    "vacunacion.necesita_acudiente": {
      handler(value) {
        if (value && value == "NO") {
          this.vacunacion.tipo_ident_acud = null;
          this.vacunacion.identificacion_acud = null;
          this.vacunacion.apellido1_acud = null;
          this.vacunacion.apellido2_acud = null;
          this.vacunacion.nombre1_acud = null;
          this.vacunacion.nombre2_acud = null;
        }
      },
    },
    "vacunacion.condicion": {
      handler(value) {
        if (value && (value == "NO APLICA" || value == "NO GESTANTE")) {
          this.vacunacion.fecha_prob_parto = null;
          this.vacunacion.semanas_embarazo = null;
        }
      },
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
  },
  methods: {
    guardar() {
      this.$refs.formVacunacion.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.vacunacion);
          delete copiaData.afiliado_id;
          copiaData.fecha_prog_2da_dosis = this.calc_segunda_dosis;
          copiaData.etapa = copiaData.tipo_poblacion ? copiaData.tipo_poblacion.etapa : null;
          copiaData.tipo_poblacion = copiaData.tipo_poblacion ? copiaData.tipo_poblacion.codigo : null;
          let request = copiaData.id
            ? this.axios.put(`dosis-aplicadas/${copiaData.id}`, copiaData)
            : this.axios.post(`dosis-aplicadas`, copiaData);
          request
            .then((response) => {
              if (response.status === 200) {
                this.$store.dispatch('setUltimoVacunadorId', {ultimoVacunadorId: response.data.vacunador_id})
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
      this.loading = true;
      this.axios
        .get(`dosis-aplicadas/${id}`)
        .then((response) => {
          this.vacunacion = response.data;
          this.vacunacion.cod_mpio = parseInt(this.vacunacion.cod_mpio);
          this.vacunacion.cod_dpto = parseInt(this.vacunacion.cod_dpto);
          this.vacunacion.tipo_identificacion = parseInt(this.vacunacion.tipo_identificacion);
          this.vacunacion.tipo_ident_acud = parseInt(this.vacunacion.tipo_ident_acud);
          this.vacunacion.codigo_ips = parseInt(this.vacunacion.codigo_ips);
          this.vacunacion.tipo_poblacion = response.data.poblacion;
          this.identificacionVerificada = 1;
          this.loading = false;
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar el registro de vacunación`,
            error: error,
          });
          this.close();
        });
    },
    open(id = null) {
      this.getVacunadores();
      this.idVerificada = 0;
      if (id) {
        this.getVacunacion(id)
      }
      this.vacunacion = this.clone(models.vacunacionSucre);
      this.vacunacion.vacunador_id = this.ultimoVacunadorId;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.identificacionVerificada = 0;
      setTimeout(() => {
        this.loading = false;
        this.vacunacion = this.clone(models.vacunacionSucre);
        this.$refs.formVacunacion.reset();
      }, 400);
    },
    resultAfiliado(response) {
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
      if (this.identificacionVerificada === 1 && response.length) {
        this.vacunacion.tipo_identificacion =
          response[0].tipo_identificacion;
        this.vacunacion.identificacion =
          response[0].identificacion;
        this.vacunacion.nombre1 = response[0].nombre1;
        this.vacunacion.nombre2 = response[0].nombre2;
        this.vacunacion.apellido1 = response[0].apellido1;
        this.vacunacion.apellido2 = response[0].apellido2;
        this.vacunacion.fecha_nacimiento = response[0].fecha_nacimiento;
        this.vacunacion.sexo = response[0].sexo;
        this.vacunacion.telefono_contacto = response[0].telefono_contacto;
        this.vacunacion.email = response[0].email;
        this.vacunacion.direccion = response[0].direccion;
        this.vacunacion.cod_dpto = parseInt(response[0].cod_dpto);
        this.vacunacion.cod_mpio = parseInt(response[0].cod_mpio);
        this.vacunacion.codigo_ips = response[0].codigo_ips;
        this.vacunacion.medio_contacto = response[0].medio_contacto;
        this.vacunacion.zona = response[0].zona;
        this.vacunacion.etnia = response[0].etnia;
        this.vacunacion.condicion = response[0].condicion;
      }
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

<style scoped>
</style>