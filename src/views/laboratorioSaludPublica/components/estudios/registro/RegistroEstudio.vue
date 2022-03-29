<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar
          dark
          color="primary"
      >
        <v-icon left>fas fa-microscope</v-icon>
        <v-toolbar-title>
          {{ estudio && estudio.id ? `Estudio No. ${estudio.id}` : 'Nuevo Estudio' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
            icon
            dark
            @click="close"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-row
            no-gutters
            dense
        >
          <v-col
              md="6"
              offset-md="3"
          >
            <ValidationObserver
                ref="formEstudio"
                v-slot="{ invalid, validated, passes, validate }"
            >
              <v-row v-if="estudio">
                <v-col
                    v-if="!estudio.afiliado_id && identificacionVerificada"
                    cols="12"
                    class="py-0"
                >
                  <v-alert
                      dense
                      border="left"
                      color="orange"
                      icon="mdi-alert-circle"
                  >
                    No se encuentra información para el documento número {{ estudio.identificacion }}
                  </v-alert>
                </v-col>
                <v-col cols="12">
                  <span class="subtitle-1 font-weight-bold">
                    <v-icon>fas fa-id-card</v-icon>
                    Información del paciente
                  </span>
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-identificacion-estudio
                      ref="cIdentificacionEstudio"
                      v-model="estudio.identificacion"
                      label="Identificación"
                      rules="required|numeric"
                      name="identificación"
                      @responsepersona="val => resultAfiliado(val)"
                      @keyup="identificacionVerificada = 0"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-select-complete
                      v-model="estudio.tipo_identificacion"
                      label="Tipo identificación"
                      rules="required"
                      name="tipo identificación"
                      :items="tiposDocumentoIdentidad"
                      item-text="descripcion"
                      item-value="id"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.nombre1"
                      label="Primer nombre"
                      rules="required"
                      name="primer nombre"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.nombre2"
                      label="Segundo nombre"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.apellido1"
                      label="Primer apellido"
                      rules="required"
                      name="primer apellido"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.apellido2"
                      label="Segundo apellido"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-date
                      v-model="estudio.fecha_nacimiento"
                      label="Fecha nacimiento"
                      rules="required"
                      name="fecha nacimiento"
                      :hint="edad"
                      :disabled="identificacionVerificada < 1"
                      :max="moment().format('YYYY-MM-DD')"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="6"
                    md="6"
                >
                  <c-select-complete
                      v-model="estudio.sexo"
                      label="Sexo"
                      rules="required"
                      name="sexo"
                      :items="sexosCovid"
                      item-text="text"
                      item-value="value"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.celular"
                      label="Celular Principal"
                      rules="required|numeric|minlength:10|maxlength:10"
                      name="celular principal"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="6"
                >
                  <c-texto
                      v-model="estudio.celular2"
                      label="Celular Opcional"
                      rules="numeric|minlength:10|maxlength:10"
                      name="celular opcional"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="12"
                >
                  <c-texto
                      v-model="estudio.email"
                      label="Email"
                      rules="email"
                      name="email"
                      lower-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="12"
                >
                  <c-texto
                      v-model="estudio.acudiente"
                      label="Acudiente"
                      :rules="estudio.edad < 18 ? 'required' : ''"
                      name="acudiente"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                >
                  <c-texto
                      v-model="estudio.direccion"
                      label="Dirección"
                      rules="required|minlength:6|direccion"
                      name="dirección"
                      upper-case
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="6"
                >
                  <c-select-complete
                      v-model="estudio.departamento_id"
                      label="Departamento"
                      name="departamento"
                      rules="required"
                      :items="departamentos"
                      item-text="nombre"
                      item-value="id"
                      :disabled="identificacionVerificada < 1"
                      @change="val => estudio.municipio_id = departamentos.find(x => x.id === val).municipios.find(z => z.id === estudio.municipio_id) ? estudio.municipio_id : null"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="6"
                >
                  <c-select-complete
                      :disabled="!estudio.departamento_id || identificacionVerificada < 1"
                      v-model="estudio.municipio_id"
                      label="Municipio"
                      name="municipio"
                      rules="required"
                      :items="departamentos.length && estudio.departamento_id && departamentos.find(x => x.id === estudio.departamento_id) ? departamentos.find(x => x.id === estudio.departamento_id).municipios : []"
                      item-text="nombre"
                      item-value="id"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                    sm="12"
                    md="6"
                >
                  <c-select-complete
                      :disabled="!estudio.municipio_id || identificacionVerificada < 1"
                      v-model="estudio.barrio_id"
                      :loading="loadingBarrios"
                      label="Barrio"
                      :items="barrios"
                      item-text="nombre"
                      item-value="id"
                  />
                </v-col>
                <v-col
                    class="pb-0"
                    cols="12"
                >
                  <c-select-complete
                      v-model="estudio.tipo_poblacion"
                      label="Tipo población"
                      rules="required"
                      name="Tipo población"
                      :items="tipoPoblaciones"
                      :disabled="identificacionVerificada < 1"
                  />
                </v-col>
                <template v-if="estudio.tipo_poblacion === 'Población Asegurada'">
                  <v-col
                      class="pb-0"
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <c-select-complete
                        v-model="estudio.eps_id"
                        label="¿A que EPS está afiliado?"
                        rules="required"
                        name="EPS de afiliación"
                        :items="epss"
                        item-value="id"
                        item-text="nombre"
                        :disabled="identificacionVerificada < 1"
                    />
                  </v-col>
                  <template v-if="estudio.eps_id">
                    <v-col
                        class="pb-0"
                        cols="12"
                        sm="12"
                        md="6"
                    >
                      <c-select-complete
                          v-model="estudio.tipo_afiliacion"
                          label="Régimen"
                          rules="required"
                          name="régimen"
                          :items="tiposAfiliacion"
                          :disabled="identificacionVerificada < 1"
                      />
                    </v-col>
                    <v-col
                        v-if="estudio.tipo_afiliacion === 'Régimen Especial'"
                        class="pb-0"
                        cols="12"
                        sm="12"
                        md="6"
                    >
                      <c-select-complete
                          v-model="estudio.regimen_especial"
                          label="Régimen especial"
                          rules="required"
                          name="régimen especial"
                          :items="regimenesEspeciales"
                          :disabled="identificacionVerificada < 1"
                      />
                    </v-col>
                  </template>
                </template>
                <template v-if="identificacionVerificada">
                  <v-col cols="12">
                  <span class="subtitle-1 font-weight-bold">
                    <v-icon>mdi-file-document</v-icon>
                    Datos del estudio
                  </span>
                  </v-col>
                  <v-col
                      class="pb-0"
                      cols="12"
                  >
                    <buscador-ips-origen
                        label="Institución que envía la muestra"
                        v-model="estudio.institucion_muestra"
                        rules="required"
                        name="institución que envía la muestra"
                    />
                  </v-col>
                  <v-col
                      class="pb-0"
                      cols="12"
                  >
                    <c-select-complete
                        v-model="estudio.justificacion"
                        label="Justificación del análisis"
                        rules="required"
                        name="justificación del análisis"
                        :items="labspJustificaciones"
                    />
                  </v-col>
                  <v-col
                      class="pb-0"
                      cols="12"
                  >
                    <c-select-complete
                        v-model="estudio.programa_id"
                        label="Programa"
                        rules="required"
                        name="programa"
                        item-value="id"
                        item-text="descripcion"
                        :items="labspProgramas"
                    />
                  </v-col>
                  <v-col
                      class="pb-0"
                      cols="12"
                  >
                    <c-select-complete
                        v-model="estudio.evento_id"
                        label="Evento"
                        rules="required"
                        name="evento"
                        item-value="codigo"
                        item-text="descripcion"
                        :items="labspEventos"
                    />
                  </v-col>
                  <v-col
                      class="pb-0"
                      cols="12"
                  >
                    <c-select-complete
                        v-model="estudio.destino"
                        label="Institución Destino"
                        rules="required"
                        name="institución destino"
                        :items="labspDestinos"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-card>
                      <v-card-title>
                        <v-icon class="mr-1">fas fa-vials</v-icon>
                        Muestas
                        <v-spacer/>
                        <c-tooltip
                            left
                            tooltip="Crear Muestra"
                        >
                          <v-btn
                              color="primary"
                              depressed
                              fab
                              @click="crearMuestra"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </c-tooltip>
                      </v-card-title>
                      <v-list v-if="estudio.muestras.length">
                        <template v-for="(muestra, muestraIndex) in estudio.muestras">
                          <v-list-item
                              :key="`muestra${muestraIndex}`"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{
                                  labspTiposMuestras && labspTiposMuestras.length && muestra.tipo_muestra_id && labspTiposMuestras.find(x => x.id === muestra.tipo_muestra_id) ? labspTiposMuestras.find(x => x.id === muestra.tipo_muestra_id).descripcion : ''
                                }}
                              </v-list-item-title>
                              <v-list-item-subtitle>Estado Ingreso: {{ muestra.estado_ingreso }}</v-list-item-subtitle>
                              <v-list-item-subtitle>
                                Temperatura: {{ muestra.temperatura }}
                                <v-icon small>mdi-temperature-celsius</v-icon>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="muestra.fecha_muestra">
                                Fecha: {{ moment(muestra.fecha_muestra).format('DD/MM/YYYY HH:mm') }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <c-tooltip
                                  left
                                  tooltip="Gestionar"
                              >
                                <v-btn
                                    color="teal"
                                    depressed
                                    fab
                                    small
                                    dark
                                    @click="editarMuestra(muestra)"
                                >
                                  <v-icon>fas fa-cog</v-icon>
                                </v-btn>
                              </c-tooltip>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider :key="`divideMuestra${muestraIndex}`"/>
                        </template>
                      </v-list>
                      <v-card-text v-else>
                        <div class="text-center text--disabled font-weight-bold title">No hay muestras registradas</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <c-text-area
                        label="Observaciones"
                        v-model="estudio.observaciones"
                    />
                  </v-col>
                </template>
              </v-row>
              <v-card-actions>
                <v-btn
                    large
                    @click.stop="close"
                >
                  <v-icon>mdi-close</v-icon>
                  Cerrar
                </v-btn>
                <v-spacer></v-spacer>
                <p
                    class="caption error--text mb-0 mx-2"
                    v-if="invalid && validated"
                >
                  Hay errores en el formulario
                </p>
                <p
                    v-if="identificacionVerificada === 0"
                    class="caption error--text mb-0 mx-2"
                >
                  No se ha verificado la identificación de la persona
                </p>
                <v-btn
                    v-if="identificacionVerificada === 1"
                    large
                    color="primary"
                    @click.stop="guardarEstudio"
                >
                  <v-icon left>fas fa-save</v-icon>
                  Guardar Estudio
                </v-btn>
              </v-card-actions>
            </ValidationObserver>
          </v-col>
        </v-row>
        <app-section-loader :status="loading"/>
      </v-container>
      <registro-muestra
          ref="registroMuestra"
          @guardado="val => muestraGuardada(val)"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import models from '../../../models'
import CIdentificacionEstudio from './CIdentificacionEsudio'
import BuscadorIpsOrigen from './BuscadorIpsOrigen'
import RegistroMuestra from 'Views/laboratorioSaludPublica/components/muestras/registro/RegistroMuestra'

export default {
  name: 'RegistroEstudio',
  props: {
    remplazarAfiliadoNull: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CIdentificacionEstudio,
    BuscadorIpsOrigen,
    RegistroMuestra
  },
  data: () => ({
    identificacionVerificada: 0,
    loadingidentidad: false,
    edad: null,
    estudio: null,
    barrios: [],
    loadingBarrios: false,
    dialog: false,
    loading: false,
    enEdicion: false
  }),
  computed: {
    ...mapGetters([
      'sexosCovid',
      'tiposDocumentoIdentidad',
      'departamentos',
      'municipiosTotal',
      'tiposAfiliacion',
      'epss',
      'regimenesEspeciales',
      'tipoPoblaciones',
      // del módulo
      'labspJustificaciones',
      'labspProgramas',
      'labspEventos',
      'labspDestinos',
      'labspTiposMuestras'
    ])
  },
  watch: {
    'estudio.tipo_poblacion': {
      handler(value) {
        if (this.estudio) {
          if (value !== 'Población Asegurada') {
            this.estudio.eps_id = null
          }
        }
      },
      immediate: false
    },
    'estudio.municipio_id': {
      handler(val) {
        if (this.estudio && !this.enEdicion) {
          this.estudio.barrio_id = null
          this.barrios = []
          if (val) {
            this.getBarrios(val)
          }
        }
      },
      immediate: false
    },
    'estudio.identificacion': {
      handler(val) {
        if (!val) {
          this.identificacionVerificada = 0
        }
      },
      immediate: false
    },
    'estudio.fecha_nacimiento': {
      handler(val) {
        if (this && this.estudio) {
          let laEdad = this.calculaEdad(val)
          this.estudio.edad = laEdad.years
          this.edad = laEdad.stringDate
        }
      },
      immediate: true
    },
    'estudio.eps_id': {
      handler(val) {
        if (this.estudio) {
          !val && (this.estudio.tipo_afiliacion = null)
        }
      },
      immediate: false
    },
    'estudio.tipo_afiliacion': {
      handler(val) {
        if (this.estudio) {
          if (!val || val !== 'Régimen Especial') {
            this.estudio.regimen_especial = null
          }
        }
      },
      immediate: false
    }
  },
  methods: {
    crearMuestra() {
      this.$refs.registroMuestra.open()
    },
    editarMuestra(muestra) {
      this.$refs.registroMuestra.open(muestra)
    },
    async muestraGuardada(muestra) {
      muestra.uuid = muestra.uuid ? muestra.uuid : this.$uuid.v1()
      muestra.estudio_id = this.estudio.id
      let muestraActual = this.estudio.muestras.findIndex(x => x.uuid === muestra.uuid)
      if (muestraActual > -1) await this.estudio.muestras.splice(muestraActual > -1 ? muestraActual : 0, muestraActual > -1 ? 1 : 0)
      this.estudio.muestras.push(muestra)
    },
    open(item = null) {
      this.dialog = true
      this.loading = true
      if (item?.id) {
        this.getEstudio(item.id)
      } else {
        this.estudio = this.clone(models.estudio)
        this.loading = false
      }
    },
    close() {
      this.dialog = false
      this.$refs.formEstudio.reset()
      this.estudio = null
      this.enEdicion = false
    },
    guardarEstudio() {
      this.$refs.formEstudio.validate().then(async result => {
        if (result) {
          this.loading = true
          let estudioCopia = await this.clone(this.estudio)
          let request = estudioCopia.id
              ? this.axios.put(`lab-estudios/${estudioCopia.id}`, estudioCopia)
              : this.axios.post(`lab-estudios`, estudioCopia)

          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `El estudio se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar el estudio.`, error: error})
              })
        }
      })
    },
    getEstudio(id) {
      this.loading = true
      this.enEdicion = true
      this.axios.get(`lab-estudios/${id}`)
          .then(response => {
            response.data.departamento_id = (this.departamentos && response.data.departamento_id && this.departamentos.find(x => x.id === response.data.departamento_id)) ? response.data.departamento_id : null
            response.data.municipio_id = (this.municipiosTotal && response.data.municipio_id && this.municipiosTotal.find(x => x.id === response.data.municipio_id)) ? response.data.municipio_id : null
            this.estudio = this.clone(response.data)
            if (this.estudio && this.estudio.municipio_id) this.getBarrios(this.estudio.municipio_id)
            this.identificacionVerificada = 1
            setTimeout(() => {
              this.enEdicion = false
            }, 300)
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar el estudio.`, error: error})
          })
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
    resultAfiliado(response) {
      this.identificacionVerificada = 1
      if ((this.remplazarAfiliadoNull && response.afiliado === null) || response.afiliado !== null) {
        this.estudio.afiliado_id = null
        this.estudio.tipo_identificacion = null
        this.estudio.nombre1 = null
        this.estudio.nombre2 = null
        this.estudio.apellido1 = null
        this.estudio.apellido2 = null
        this.estudio.fecha_nacimiento = null
        this.estudio.sexo = null
        this.estudio.celular = null
        this.estudio.celular2 = null
        this.estudio.email = null
        this.estudio.direccion = null
        this.estudio.departamento_id = null
        this.estudio.municipio_id = null
        this.estudio.barrio_id = null
        this.estudio.eps_id = null
        this.estudio.tipo_afiliacion = null
        this.estudio.estado_afiliado = null
      }
      if (this.identificacionVerificada === 1 && response.afiliado) {
        this.estudio.afiliado_id = response.afiliado.id
        this.estudio.tipo_identificacion = response.afiliado.tipo_documento_identidad_id
        this.estudio.identificacion = response.afiliado.numero_documento_identidad
        this.estudio.nombre1 = response.afiliado.nombre1
        this.estudio.nombre2 = response.afiliado.nombre2
        this.estudio.apellido1 = response.afiliado.apellido1
        this.estudio.apellido2 = response.afiliado.apellido2
        this.estudio.fecha_nacimiento = response.afiliado.fecha_nacimiento
        this.estudio.sexo = response.afiliado.sexo
        this.estudio.celular = response.afiliado.numero_celular
        this.estudio.celular2 = response.afiliado.telefono_opcional
        this.estudio.email = response.afiliado.email
        this.estudio.direccion = response.afiliado.direccion
        this.estudio.departamento_id = response.afiliado.departamento_id
        this.estudio.municipio_id = response.afiliado.centro_poblado_id
        this.estudio.barrio_id = response.afiliado.barrio_id || null
        this.estudio.eps_id = response.afiliado.eps_id
        this.estudio.tipo_afiliacion = response.afiliado.regimen
        this.estudio.estado_afiliado = response.afiliado.estado
      }
    }
  }
}
</script>