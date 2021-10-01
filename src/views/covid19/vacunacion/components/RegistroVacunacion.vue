<template>
  <v-dialog v-model="dialog" persistent max-width="680">
    <v-card>
      <v-card-title>
        {{ vacunacion && vacunacion.id ? 'Edición' : 'Nuevo' }} Registro de Vacunación
        <v-spacer/>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container fluid>
        <ValidationObserver
            v-if="vacunacion"
            ref="formVacunacion"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
        <v-alert
          type="warning"
          v-if="identificacionVerificada && positivo_covid && fecha_diagnostico"
        >
          Esta persona ha sido diagnosticada como <b> Positivo Covid</b>, hace {{verbalTimeAgoDiagnostico}} (Fecha diagnostico: {{fecha_diagnostico}})
        </v-alert>
          <v-row>
            <v-col class="pb-0" cols="12" sm="6" md="6">
              <c-identificacion
                  ref="cIdentificacion"
                  v-model="vacunacion.identificacion"
                  label="Identificación"
                  rules="required|numeric"
                  name="identificación"
                  @responsepersona="val => resultAfiliado(val)"
                  @keyup="identificacionVerificada = 0"
              >
              </c-identificacion>
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
            <v-col class="pb-0" cols="12" sm="6" md="12">
              <c-date
                  v-model="vacunacion.fecha_expedicion"
                  label="Expedición Documento"
                  :max="moment().format('YYYY-MM-DD')"
                  name="expedición documento"
                  :disabled="identificacionVerificada < 1"
              />
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
            <v-col class="pb-0" cols="12" sm="12" md="6">
              <c-texto
                  v-model="vacunacion.telefono"
                  label="Celular"
                  rules="required|numeric|minlength:10|maxlength:10"
                  name="celular"
                  :disabled="identificacionVerificada < 1"
              >
              </c-texto>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="6">
              <c-texto
                  v-model="vacunacion.telefono2"
                  label="Teléfono alterno"
                  rules="numeric|maxlength:10"
                  name="t{elefono alterno"
                  :disabled="identificacionVerificada < 1"
              />
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
<!--            <v-col class="pb-0" cols="12" sm="12" md="12" v-if="vacunacion.edad < 18">-->
<!--              <c-texto-->
<!--                  v-model="vacunacion.acudiente"-->
<!--                  label="Acudiente"-->
<!--                  :rules="vacunacion.edad < 18 ? 'required' : ''"-->
<!--                  name="acudiente"-->
<!--                  upper-case-->
<!--                  :disabled="identificacionVerificada < 1"-->
<!--              >-->
<!--              </c-texto>-->
<!--            </v-col>-->
            <v-col class="pb-0" cols="12" sm="12" md="6">
              <c-select-complete
                  v-model="vacunacion.departamento_id"
                  label="Departamento de residencia"
                  name="departamento_residencia"
                  rules="required"
                  :items="departamentos"
                  item-text="nombre"
                  item-value="id"
                  :disabled="identificacionVerificada < 1"
                  @change="val => vacunacion.municipio_id = departamentos.find(x => x.id === val).municipios.find(z => z.id === vacunacion.municipio_id) ? vacunacion.municipio_id : null"
              >
              </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12" sm="12" md="6">
              <c-select-complete
                  :disabled="!vacunacion.departamento_id || identificacionVerificada < 1"
                  v-model="vacunacion.municipio_id"
                  label="Municipio de residencia"
                  name="municipio_residencia"
                  rules="required"
                  :items="departamentos.length && vacunacion.departamento_id && departamentos.find(x => x.id === vacunacion.departamento_id) ? departamentos.find(x => x.id === vacunacion.departamento_id).municipios : []"
                  item-text="nombre"
                  item-value="id"
                  @input="vacunacion.barrio_id = null"
              >
              </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-select-complete
                  :disabled="!vacunacion.municipio_id || identificacionVerificada < 1"
                  v-model="vacunacion.barrio_id"
                  :loading="loadingBarrios"
                  label="Barrio de residencia"
                  :items="barrios"
                  item-text="nombre"
                  item-value="id"
                  name="barrio_residencia"
              >
              </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12">
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
            <v-col class="pb-0" cols="12" v-if="esMovil">
              <c-location
                  v-model="vacunacion.coordenadas"
                  label="Coordenadas"
                  :readonly="true"
                  :disabled="identificacionVerificada < 1"
              />
            </v-col>
            <template>
              <v-col class="pb-0" cols="12" sm="12" md="12">
                <c-select-complete
                    v-model="vacunacion.eps_id"
                    label="¿A que EPS está afiliado?"
                    rules="required"
                    name="EPS de afiliación"
                    :items="epss"
                    item-value="id"
                    item-text="nombre"
                    :disabled="identificacionVerificada < 1"
                />
              </v-col>
              <v-col cols="12" v-if="mujerGestante">
                <v-card outlined tile>
                  <v-card-text>
                    <c-radio
                        v-model="vacunacion.estado_gestacion"
                        label="¿Se encuentra en estado de gestación o lactancia?"
                        rules="required"
                        name="estado de gestación o lactancia"
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
                        v-model="vacunacion.discapacidad"
                        :items="[{text: 'Si', value: 'Si'}, {text: 'No', value: 'No'}]"
                        itemValue="value"
                        itemText="text"
                        rules="required"
                        name="Discapacidad"
                        label="Discapacidad"
                        :column="!$vuetify.breakpoint.smAndUp"
                        @input="vacunacion.cual_discapacidad = null"
                        :disabled="identificacionVerificada < 1"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                  v-if="vacunacion.discapacidad === 'Si'"
                  class="pb-0"
                  cols="12"
              >
                <c-texto
                    v-model="vacunacion.cual_discapacidad"
                    label="Describir la discapacidad"
                    rules="required"
                    name="describir la discapacidad"
                    :disabled="identificacionVerificada < 1"
                />
              </v-col>
              <v-col cols="12">
                <v-card outlined tile>
                  <v-card-text>
                    <c-radio
                        v-model="vacunacion.puede_desplazarse"
                        :items="[{text: 'Si', value: 'Si'}, {text: 'No', value: 'No'}]"
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
                        v-model="vacunacion.intencion_vacuna"
                        :items="[{text: 'Si', value: 'Si'}, {text: 'No', value: 'No'}, {value: 'No sabe', text: 'No sabe'}]"
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
                </v-card>
              </v-col>
              <v-col
                  v-if="vacunacion.intencion_vacuna === 'No'"
                  cols="12"
                  class="pb-0"
              >
                <c-text-area
                    label="Motivo por el cual no se vacunará"
                    rules="required"
                    v-model="vacunacion.porque_no_vacuna"
                    name="motivo de no vacunación"
                    :disabled="identificacionVerificada < 1"
                />
              </v-col>
              <v-col cols="12">
                <v-card outlined tile>
                  <v-card-text>
                    <c-radio
                        v-model="vacunacion.presenta_covid"
                        label="¿Tiene COVID o esta presentando sintomatologia?"
                        rules="required"
                        name="presenta_covid"
                        :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                        item-text="text"
                        item-value="value"
                        :disabled="identificacionVerificada < 1"
                    >
                    </c-radio>
                  </v-card-text>
                </v-card>
              </v-col>
              <comorbilidades-vacunacion
                    :array-comorbilidades="vacunacion.comorbilidades_vacunacion"
                    @changeComorbilidades="val => vacunacion.comorbilidades_vacunacion = val"
                    :disabled="identificacionVerificada < 1"
              ></comorbilidades-vacunacion>
<!--              <v-col cols="12">-->
<!--                <v-card outlined tile>-->
<!--                  <v-card-text>-->
<!--                    <c-radio-->
<!--                        v-model="vacunacion.mivacuna"-->
<!--                        :items="[{text: 'Si', value: 'Si'}, {text: 'No', value: 'No'}, {value: 'No sabe', text: 'No sabe'}]"-->
<!--                        itemValue="value"-->
<!--                        itemText="text"-->
<!--                        rules="required"-->
<!--                        name="registrado en MiVacuna"-->
<!--                        label="¿Está Registrado en MiVacuna?"-->
<!--                        :column="!$vuetify.breakpoint.smAndUp"-->
<!--                        :disabled="identificacionVerificada < 1"-->
<!--                    />-->
<!--                  </v-card-text>-->
<!--                </v-card>-->
<!--              </v-col>-->
            </template>
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
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>

      <!-- DIALOG TO PERSONA YA CARACTERIZADA -->
      <v-dialog
        v-model="modalPersonaCaracterizada"
        max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5 warning">
            Advertencia
          </v-card-title>

          <v-card-text class="pb-0">
            <v-container>
              <v-row>
                <h4>{{ `El ciudadano identificado con cedula de ciudadania No. ${caracterizacion ? caracterizacion.identificacion : ''} ya cuenta con una Caracterizacion de vacunacion.` }}</h4>
              </v-row>
              <v-row justify="center" class="mt-3">
                <v-btn
                    color="primary"
                    dark
                    @click.stop="redirectDetalleCaracterizacion"
                    >
                    Ver detalle
                </v-btn>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="modalPersonaCaracterizada = false"
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
import models from 'Views/covid19/vacunacion/models'
import {mapGetters} from 'vuex'
import ComorbilidadesVacunacion from './ComorbilidadesVacunacion'

export default {
  components: {
    ComorbilidadesVacunacion,
  },
  data: () => ({
    identificacionVerificada: 0,
    loadingBarrios: false,
    barrios: [],
    menuHora: false,
    dialog: false,
    loading: false,
    vacunacion: null,
    edad: null,
    mujerGestante: 0,
    positivo_covid: null,
    fecha_diagnostico: null,
    caracterizacion: null,
    modalPersonaCaracterizada: false,
  }),
  computed: {
    ...mapGetters([
      'sexosCovid',
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'epss'
    ]),
    verbalTimeAgoDiagnostico() {
      let stringDate = ``
      if (this.positivo_covid && this.fecha_diagnostico) {
        let a = this.moment()
				let b = this.moment(this.fecha_diagnostico)
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
    }
  },
  watch: {
    'vacunacion.fecha_nacimiento': {
      handler(val) {
        if (this && this.vacunacion) {
          let laEdad = this.calculaEdad(val)
          this.vacunacion.edad = laEdad.years
          this.edad = laEdad.stringDate
          this.verificaGestante()
        }
      },
      immediate: true
    },
    'vacunacion.municipio_id': {
      handler(val) {
        if (this && this.vacunacion) {
          this.barrios = []
          if (val) {
            this.getBarrios(val)
          }
        }
      },
      immediate: false
    },
    'vacunacion.sexo': {
      handler() {
        this.verificaGestante()
      },
      immediate: true
    },
  },
  methods: {
    redirectDetalleCaracterizacion() {
      this.$emit("detalle", this.clone(this.caracterizacion))
      this.modalPersonaCaracterizada = false
      this.close();
    },
    verificaGestante() {
      if (this && this.vacunacion) {
        setTimeout(() => {
          this.mujerGestante = (this.vacunacion.sexo === 'F' && this.vacunacion.edad > 12) ? 1 : 0
          if (!this.mujerGestante) this.vacunacion.estado_gestacion = null
        }, 1000)
      }
    },
    guardar() {
      this.$refs.formVacunacion.validate().then(result => {
        if (result) {
          this.loading = true
          let copiaData = this.clone(this.vacunacion)
          let request = copiaData.id
              ? this.axios.put(`vacunaciones/${copiaData.id}`, copiaData)
              : this.axios.post(`vacunaciones`, copiaData)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {
                  color: 'success',
                  message: `Registro guardado correctamente.`
                })
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {
                  color: 'error',
                  message: `al guardar el registro.`,
                  error: error
                })
              })
        }
      })
    },
    getVacunacion(id) {
      this.loading = true
      this.axios.get(`vacunaciones/${id}`).then(response => {
        if (response.data && response.data.comorbilidades && response.data.comorbilidades.length) {
          response.data.comorbilidades_vacunacion = response.data.comorbilidades.map(x => x.codigo.toString())
        }
        this.vacunacion = response.data
        this.identificacionVerificada = 1
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al recuperar el registro de vacunación`,
          error: error
        })
        this.close()
      })
    },
    open(vacunacion = null) {
      this.identificacionVerificada = 0
      if(vacunacion) {
        this.vacunacion = this.getVacunacion(vacunacion.id)
      } else {
        this.vacunacion = this.clone(models.vacunacion)
      }
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.mujerGestante = 0
        this.positivo_covid = null
        this.fecha_diagnostico = null
        this.vacunacion = null
        this.$refs.formVacunacion.reset()
      }, 400)
    },
    resultAfiliado(response) {
      this.identificacionVerificada = 1
      this.$emit('verificado', this.identificacionVerificada)
      if (response.afiliado !== null) {
        this.vacunacion.tipo_identificacion = null
        this.vacunacion.nombre1 = null
        this.vacunacion.nombre2 = null
        this.vacunacion.apellido1 = null
        this.vacunacion.apellido2 = null
        this.vacunacion.fecha_nacimiento = null
        this.vacunacion.sexo = null
        this.vacunacion.telefono = null
        this.vacunacion.email = null
        this.vacunacion.direccion = null
        this.vacunacion.departamento_id = null
        this.vacunacion.municipio_id = null
        this.vacunacion.eps_id = null
        this.vacunacion.afiliado_id = null
      }
      if (response.caracterizacion) {
        this.caracterizacion = response.caracterizacion;
        this.modalPersonaCaracterizada = true;
      } else {
        if (response.afiliado) {
          this.vacunacion.afiliado_id = response.afiliado.id
          this.vacunacion.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
          this.vacunacion.identificacion = response.afiliado.numero_documento_identidad
          this.vacunacion.nombre1 = response.afiliado.nombre1
          this.vacunacion.nombre2 = response.afiliado.nombre2
          this.vacunacion.apellido1 = response.afiliado.apellido1
          this.vacunacion.apellido2 = response.afiliado.apellido2
          this.vacunacion.fecha_nacimiento = response.afiliado.fecha_nacimiento
          this.vacunacion.sexo = response.afiliado.sexo
          this.vacunacion.telefono = response.afiliado.numero_celular
          this.vacunacion.email = response.afiliado.email
          this.vacunacion.direccion = response.afiliado.direccion
          this.vacunacion.departamento_id = response.afiliado.departamento_id
          this.vacunacion.municipio_id = response.afiliado.centro_poblado_id
          this.vacunacion.eps_id = response.afiliado.eps_id
          
        } else if(response.tamizaje && response.tamizaje.length && response.tamizaje[0].afiliado_id) {
          this.vacunacion.afiliado_id = response.tamizaje[0].afiliado_id
          this.vacunacion.tipo_identificacion = response.tamizaje[0].tipo_identificacion
          this.vacunacion.identificacion = response.tamizaje[0].identificacion
          this.vacunacion.nombre1 = response.tamizaje[0].nombre1
          this.vacunacion.nombre2 = response.tamizaje[0].nombre2
          this.vacunacion.apellido1 = response.tamizaje[0].apellido1
          this.vacunacion.apellido2 = response.tamizaje[0].apellido2
          this.vacunacion.fecha_nacimiento = response.tamizaje[0].fecha_nacimiento
          this.vacunacion.sexo = response.tamizaje[0].sexo
          this.vacunacion.telefono = response.tamizaje[0].celular
          this.vacunacion.email = response.tamizaje[0].email
          this.vacunacion.direccion = response.tamizaje[0].direccion
          this.vacunacion.departamento_id = response.tamizaje[0].departamento_id
          this.vacunacion.municipio_id = response.tamizaje[0].municipio_id
          this.vacunacion.eps_id = response.tamizaje[0].eps_id
          this.vacunacion.barrio_id = response.tamizaje[0].barrio_id
        }

        if(response.tamizaje && response.tamizaje.length && response.tamizaje[0].afiliado_id) {
          this.positivo_covid = response.tamizaje[0].positivo_covid
          this.fecha_diagnostico = response.tamizaje[0].fecha_diagnostico
        }
      }

    },
    getBarrios(municipio_id) {
      this.loadingBarrios = true
      this.axios.get(`barrios?municipio_id=${municipio_id}`)
          .then(response => {
            this.barrios = response.data
            this.loadingBarrios = false
          })
          .catch(error => {
            this.loadingBarrios = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los barrios.`, error: error})
          })
    },
  }
}
</script>

<style scoped>

</style>