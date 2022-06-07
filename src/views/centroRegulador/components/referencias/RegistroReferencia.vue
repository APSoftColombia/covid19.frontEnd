<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
  >
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title>
            {{ item && item.id ? `Referencia No. ${item.id}` : 'Nueva Referencia' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row no-gutters>
            <v-col md="6" offset-md="3">
              <ValidationObserver
                  ref="formItem"
                  v-slot="{ invalid, validated, passes, validate }"
                  autocomplete="off"
              >
                <template v-if="item">
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <c-date-manual
                          v-model="item.fecha_solicitud"
                          label="Fecha Solicitud"
                          name="Fecha Solicitud"
                          rules="required"
                          :max="moment().format('YYYY-MM-DD')"
                          :clearable="false"
                          disabled
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-time
                          v-model="item.hora_solicitud"
                          label="Hora Solicitud"
                          name="Hora Solicitud"
                          rules="required"
                          :clearable="false"
                          disabled
                      />
                    </v-col>
                    <v-col cols="12" v-if="!getUser.cod_ips">
                      <c-select-complete
                          v-model="item.medio_solicitud"
                          label="Medio de Solicitud"
                          name="Medio de solicitud"
                          :items="ref_medios || []"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-date-manual
                          v-model="item.fecha_orden"
                          label="Fecha Orden"
                          name="Fecha Orden"
                          rules="required"
                          :max="moment().format('YYYY-MM-DD')"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <c-time
                          v-model="item.hora_orden"
                          label="Hora Orden"
                          name="Hora Orden"
                          rules="required"
                      />
                    </v-col>
                  </v-row>
                  <form-persona
                      :value="item"
                      @verificado="val => verificar(val)"
                      @responseReferencia="val => respuestaPersona = val"
                      @responseFallecido="val => respuestaFallecido = val"
                  />
                  <v-row dense>
                    <v-col cols="12">
                      <ValidationProvider name="Modalidad del Servicio" rules="required" v-slot="{ errors }">
                        <v-select
                            v-model="item.modservicio_id"
                            label="Modalidad del Servicio"
                            :items="ref_modalidadesServicio || []"
                            item-value="id"
                            outlined
                            dense
                            :disabled="!verificado"
                            :readonly="item.modservicio_id === 2"
                            :error-messages="errors"
                            :clearable="false"
                            persistent-hint
                            :hint="item.modservicio_id && ref_modalidadesServicio && ref_modalidadesServicio.length && ref_modalidadesServicio.find(x => x.id === item.modservicio_id) ? ref_modalidadesServicio.find(x => x.id === item.modservicio_id).modalidad : ''"
                        >
                          <template v-slot:selection="{ item, index }">
                            {{ item.codigo }} - {{ item.tipo }}
                          </template>
                          <template v-slot:item="data">
                            <div style="width: 100% !important;">
                              <v-list-item class="pa-0">
                                <v-list-item-content class="text-truncate pa-0">
                                  <v-list-item-title class="body-2">
                                    {{ data.item.codigo }} - {{ data.item.tipo }}
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ data.item.modalidad }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>
                              </v-list-item>
                              <v-divider class="ma-0"/>
                            </div>
                          </template>
                        </v-select>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <c-select-complete
                          v-model="item.tipo_origen"
                          label="Tipo de Atención"
                          name="tipo de atención"
                          :items="tiposOrigen"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <c-select-complete
                          v-model="item.departamento_prestador_origen"
                          label="Departamento Origen"
                          name="Departamento Origen"
                          rules="required"
                          :items="departamentos"
                          item-text="nombre"
                          item-value="id"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <c-select-complete
                          :disabled="!item.departamento_prestador_origen"
                          v-model="item.municipio_prestador_origen"
                          label="Municipio Origen"
                          name="Municipio Origen"
                          rules="required"
                          :items="municipiosOrigen"
                          item-text="nombre"
                          item-value="id"
                      />
                    </v-col>
                    <v-col cols="12">
                      <buscador-ips
                          label="IPS de Origen"
                          name="IPS de Origen"
                          v-model="item.codigo_prestador_origen"
                          rules="required"
                          :disabled="!item.municipio_prestador_origen"
                          :municipio="municipioOrigen"
                          :departamento="departamentoOrigen"
                      />
                    </v-col>
                    <v-col cols="12">
                      <buscador-cies
                          label="Diagnóstico"
                          name="Diagnóstico"
                          v-model="item.codigo_cie10_ingreso"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12">
                      <c-select-complete
                          v-model="item.codigo_especialidad"
                          label="Especialidad"
                          name="Especialidad"
                          rules="required"
                          :items="ref_especialidades || []"
                          item-text="serv_nombre"
                          item-value="serv_codigo"
                      >
                        <template
                            v-slot:item="{ item }"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ item.serv_nombre }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.tipo_servicio }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </c-select-complete>
                    </v-col>
                    <v-col cols="12">
                      <buscador-cups
                          label="Procedimiento"
                          name="Procedimiento"
                          v-model="item.codigo_cup"
                          rules="required"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                      <c-input-file
                          label="Historia Clínica"
                          name="Historia Clínica"
                          rules="required"
                          directory="referencias"
                          v-model="item.historia_clinica"
                          @uuid="val => item.historia_clinica_uuid = val"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                      <c-input-file
                          label="Orden Médica"
                          directory="referencias"
                          v-model="item.orden_medica"
                          @uuid="val => item.orden_medica_uuid = val"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                      <c-input-file
                          label="Documentos Paciente"
                          directory="referencias"
                          v-model="item.documentos_paciente"
                          @uuid="val => item.documentos_paciente_uuid = val"
                      />
                    </v-col>
                    <v-col cols="12">
                      <c-text-area
                          label="Observaciones"
                          v-model="item.observaciones"
                      />
                    </v-col>
                  </v-row>
                </template>
                <v-divider class="mt-0"/>
                <p class="body-2 error--text mb-0 text-center" v-if="invalid && validated">Hay errores en el
                  formulario</p>
                <v-card-actions>
                  <v-btn
                      large
                      @click.stop="close"
                  >
                    <v-icon>mdi-close</v-icon>
                    Cancelar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      large
                      color="primary"
                      @click.stop="guardarItem"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <dialog-referencias-afiliado
          ref="dialogReferenciaAfiliado"
          :value="respuestaPersona"
      />
      <dialog-fallecido
          ref="dialogFallecido"
          :value="respuestaFallecido"
      />
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../models'
import FormPersona from 'Views/centroRegulador/components/referencias/FormPersona'
import DialogReferenciasAfiliado from 'Views/centroRegulador/components/referencias/DialogReferenciasAfiliado'
import DialogFallecido from 'Views/centroRegulador/components/referencias/DialogFallecido'
import BuscadorCies from 'Views/centroRegulador/components/referencias/BuscadorCies'
import BuscadorCups from 'Views/centroRegulador/components/referencias/BuscadorCups'
import BuscadorIps from 'Views/centroRegulador/components/referencias/BuscadorIps'
import {mapGetters} from 'vuex'

export default {
  name: 'RegistroReferencia',
  components: {
    BuscadorIps,
    BuscadorCups,
    BuscadorCies,
    FormPersona,
    DialogReferenciasAfiliado,
    DialogFallecido
  },
  data: () => ({
    ejecutaWatch: true,
    loading: false,
    dialog: false,
    verificado: 0,
    respuestaPersona: null,
    respuestaFallecido: null,
    item: null,
    tiposOrigen: [
      'Ambulatorio',
      'Hospitalario',
      'Urgencias'
    ]
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    },
    municipiosOrigen() {
      return this.departamentos.length && this.item.departamento_prestador_origen && this.departamentos.find(x => x.id === this.item.departamento_prestador_origen) ? this.departamentos.find(x => x.id === this.item.departamento_prestador_origen).municipios : []
    },
    municipioOrigen() {
      return this.municipiosOrigen.find(x => x.id === this.item.municipio_prestador_origen) || null
    },
    departamentoOrigen() {
      return this.departamentos.find(x => x.id === this.item.departamento_prestador_origen) || null
    },
    ...mapGetters([
      'ref_modalidadesServicio',
      'ref_medios',
      'ref_especialidades',
      'departamentos',
      'getUser'
    ])
  },
  watch: {
    'item.departamento_prestador_origen': {
      handler() {
        if (this.item && this.ejecutaWatch) {
          this.item.municipio_prestador_origen = null
        }
      },
      immediate: false
    },
    'item.municipio_prestador_origen': {
      handler() {
        if (this.item && this.ejecutaWatch) {
          this.item.codigo_prestador_origen = null
        }
      },
      immediate: false
    }
  },
  methods: {
    guardarItem() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true
          let itemCopia = await this.clone(this.item)
          itemCopia.fecha_solicitud = `${itemCopia.fecha_solicitud} ${itemCopia.hora_solicitud}`
          itemCopia.fecha_orden = `${itemCopia.fecha_orden} ${itemCopia.hora_orden}`
          let request = itemCopia.id
              ? this.axios.put(`referencias/${itemCopia.id}`, itemCopia)
              : this.axios.post(`referencias`, itemCopia)
          request
              .then(response => {
                this.$emit('guardado', response.data)
                this.$store.commit('snackbar', {color: 'success', message: `La referencia se guardo correctamente.`})
                this.close()
              })
              .catch(error => {
                this.loading = false
                this.$store.commit('snackbar', {color: 'error', message: `al guardar la referencia.`, error: error})
              })
        }
      })
    },
    async open(item = null) {
      this.dialog = true
      if (item) {
        this.getItem(item.id)
      } else {
        this.ejecutaWatch = false
        const ips = this.getUser?.cod_ips ? await this.assignIPS(this.getUser.cod_ips) : null
        const temporalItem = this.clone(models.referencia)
        if(ips) {
          const departamento = (ips.iddepto && this.departamentos?.find(x => x.codigo === ips.iddepto)) || null
          const municipio = ips.idmpio && departamento?.municipios?.find(x => x.codigo === ips.idmpio) || null
          temporalItem.municipio_prestador_origen = municipio.id
          temporalItem.departamento_prestador_origen = departamento.id
          temporalItem.codigo_prestador_origen = ips.codigohabilitacion
        }
        this.item = temporalItem
        this.item.fecha_solicitud = this.moment().format('YYYY-MM-DD')
        this.item.hora_solicitud = this.moment().format('HH:mm')
        this.item.fecha_orden = this.moment().format('YYYY-MM-DD')
        this.item.hora_orden = this.moment().format('HH:mm')
        setTimeout(() => {
          this.ejecutaWatch = true
        }, 400)
      }
    },
    async assignIPS(codigo){
      return await new Promise(resolve => {
        this.axios.get(`prestadores?filter[search]=${codigo}`)
            .then(response => resolve(response.data?.length ? response.data[0] : null))
      })
    },
    close() {
      this.$refs.formItem.reset()
      this.dialog = false
      this.loading = false
      this.$emit('close')
      this.item = null
    },
    getItem(id) {
      this.loading = true
      this.ejecutaWatch = false
      this.axios.get(`referencias/${id}`)
          .then(response => {
            const fechaSolicitud = this.clone(response.data.fecha_solicitud)
            response.data.fecha_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('YYYY-MM-DD') : null
            response.data.hora_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('HH:mm') : null

            const fechaOrden = this.clone(response.data.fecha_orden)
            response.data.fecha_orden = fechaOrden ? this.moment(fechaOrden).format('YYYY-MM-DD') : null
            response.data.hora_orden = fechaOrden ? this.moment(fechaOrden).format('HH:mm') : null
            response.data.tipo_poblacion = response.data.tipo_poblacion || (response.data.eps_id ? 'Población Asegurada' : null)
            this.item = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar el registro de la referencia.`,
              error: error
            })
          })
          .finally(() => {
            setTimeout(() => {
              this.ejecutaWatch = true
            }, 400)
          })
    },
    verificar(val) {
      this.verificado = val
      this.$emit('verificado', val)
      if (val === -2 && this.respuestaFallecido) this.$refs.dialogFallecido.open()
      if (((val === -1) || (val === 1)) && this.respuestaPersona) this.$refs.dialogReferenciaAfiliado.open()
    }
  }
}
</script>
