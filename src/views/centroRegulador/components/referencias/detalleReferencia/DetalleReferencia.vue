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
          <v-toolbar-title v-if="item">
            {{ item.id ? `Referencia No. ${item.id}` : 'Nueva Referencia' }}
            <v-list-item-subtitle>
              {{ item.estado }}
            </v-list-item-subtitle>
          </v-toolbar-title>
          <v-spacer/>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row v-if="item" no-gutters>
              <v-col cols="10" class="mx-auto">
                  <v-row dense>
                      <v-col cols="12" md="4">
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle class="caption font-weight-bold grey--text">
                                Estado
                              </v-list-item-subtitle>
                              <v-list-item-title class="grey--text body-3 font-weight-bold ml-4">
                                {{ item.estado }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        <v-card>
                          <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Paciente</v-list-item-subtitle>
                          <v-list-item class="py-0">
                            <v-list-item-content class="pb-0">
                              <v-list-item-title class="font-weight-bold grey--text">
                                {{ [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ') }}
                              </v-list-item-title>
                              <v-list-item-title class="grey--text body-3">
                                {{ [item.tipo_id ? item.tipo_id.tipo : '', item.identificacion].filter(x => x).join(' ') }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item class="py-0">
                            <v-list-item-content class="pt-0">
                              <v-list-item-subtitle class="body-2" v-if="item.celular || item.email">
                                <template v-if="item.celular">
                                  <v-icon small>mdi-cellphone</v-icon>
                                  {{ item.celular }}
                                </template>
                                <template v-if="item.email">
                                  <v-icon small>mdi-email</v-icon>
                                  {{ item.email }}
                                </template>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="body-2">
                                {{ [item.direccion, item.municipio ? item.municipio.nombre : null, item.municipio && item.municipio.departamento ? item.municipio.departamento.nombre : null].filter(x => x).join(', ') }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="item.eps" class="grey--text subtitle-2 mt-3">
                                {{ item.eps.nombre }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="item.tipo_afiliacion" class="grey--text subtitle-2 mb-2">
                                {{ item.tipo_afiliacion }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Ingreso</v-list-item-subtitle>
                          <v-list-item class="py-0" v-if="item.prestador_origen">
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-bold grey--text">
                                {{ item.prestador_origen.nombre }}
                              </v-list-item-title>
                              <v-list-item-subtitle class="body-2">
                                  <template v-if="item.prestador_origen.telefono">
                                    <v-icon small>mdi-cellphone</v-icon>
                                    {{ item.prestador_origen.telefono }}
                                  </template>
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="body-2">
                                {{ [item.prestador_origen.direccion, item.prestador_origen.nompio, item.prestador_origen.nomdepto].filter(x => x).join(', ') }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="body-2">
                                <template v-if="item.prestador_origen.email">
                                  <v-icon small>mdi-email</v-icon>
                                  {{ item.prestador_origen.email }}
                                </template>
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Datos de la Remisión</v-list-item-subtitle>
                          <v-list-item class="py-0" v-if="item.cie10_ingreso">
                            <v-list-item-content>
                              <v-list-item-subtitle class="subtitle-2">
                                Fecha Orden Médica
                              </v-list-item-subtitle>
                              <v-list-item-title>
                                {{ item.fecha_orden ? moment(item.fecha_orden).format('DD/MM/YYYY') + ' a las ' + moment(item.fecha_orden).format('HH:mm') : '' }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item class="py-0" v-if="item.cie10_ingreso">
                            <v-list-item-content>
                              <v-list-item-subtitle class="subtitle-2">
                                Fecha Recepción de la Solicitud
                              </v-list-item-subtitle>
                              <v-list-item-title>
                                {{ item.fecha_solicitud ? moment(item.fecha_solicitud).format('DD/MM/YYYY') + ' a las ' + moment(item.fecha_orden).format('HH:mm') : '' }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item class="py-0" v-if="item.cie10_ingreso">
                            <v-list-item-content>
                              <v-list-item-subtitle class="subtitle-2">
                                Diagnóstico
                              </v-list-item-subtitle>
                              <v-list-item-title>
                                <span class="font-weight-bold grey--text">{{ item.cie10_ingreso.codigo }}</span> - <span class="body-2">{{ item.cie10_ingreso.descrip }}</span>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item class="py-0">
                            <v-list-item-content>
                              <v-list-item-subtitle class="subtitle-2">
                                Observaciones
                              </v-list-item-subtitle>
                              <v-list-item-title class="body-2">
                                {{ item.observaciones }}
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <div v-if="item.orden_medica && item.orden_medica.id">
                              <v-btn :disabled="loadingButton" :loading="loadingButton" text class="grey--text" @click="descargarArchivo(item.orden_medica.id, 1)">
                                  <v-icon left small>mdi-paperclip</v-icon>
                                  Orden Médica
                              </v-btn>
                          </div>
                          <v-btn :disabled="loadingButton1" :loading="loadingButton1" text class="grey--text mb-4" @click="descargarArchivo(item.historia_clinica.id, 2)" v-if="item.historia_clinica && item.historia_clinica.id">
                              <v-icon left small>mdi-paperclip</v-icon>
                              Evolución Médica
                          </v-btn>
                        </v-card>
                      </v-col>
                      <v-col cols="12" md="8">
                        <evolucion
                            :referencia="item"
                            @guardado="val => actualizarItem(val)"
                        />
                      </v-col>
                  </v-row>
              </v-col>
          </v-row>
        </v-container>
      </template>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../../models'
import Evolucion from 'Views/centroRegulador/components/referencias/evolucion/Evolucion'
export default {
  name: 'DetalleReferencia',
  components: {
    Evolucion
  },
  data: () => ({
    loading: false,
    dialog: false,
    item: null,
    loadingButton: false,
    loadingButton1: false
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('centroRegulador')
    }
  },
  methods: {
    open(item = null) {
      this.dialog = true
      if (item) {
        this.getItem(item.id)
      } else {
        this.item = this.clone(models.referencia)
      }
    },
    close() {
      this.dialog = false
      this.loading = false
      this.$emit('close')
      this.item = null
    },
    actualizarItem(id) {
      this.getItem(id)
      this.$store.commit('reloadTable', 'tablaReferencias')
    },
    getItem(id) {
      this.loading = true
      this.axios.get(`referencias/${id}`)
          .then(response => {
            const fechaSolicitud = this.clone(response.data.fecha_solicitud)
            response.data.fecha_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('YYYY-MM-DD') : null
            response.data.hora_solicitud = fechaSolicitud ? this.moment(fechaSolicitud).format('HH:mm') : null

            const fechaOrden = this.clone(response.data.fecha_orden)
            response.data.fecha_orden = fechaOrden ? this.moment(fechaOrden).format('YYYY-MM-DD') : null
            response.data.hora_orden = fechaOrden ? this.moment(fechaOrden).format('HH:mm') : null
            this.item = response.data
            this.loading = false
          })
          .catch(error => {
            this.loading = false
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar el registro de la referencia.`, error: error})
          })
    },
    descargarArchivo(id, button){
        const apiAxios = this.axios.create()
        apiAxios.defaults.baseURL = `http://apsoft-backend.test/api`
        apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
        if(button === 1){
            this.loadingButton = true
        }else{
            this.loadingButton1 = true
        }
          this.axios({
            url: `download-archivo/${id}`,
            method: 'GET',
            responseType: 'blob'
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
            window.open(url, '_blank')
            this.loadingButton = false
            this.loadingButton1 = false
          })
          .catch((error) => {
            this.loadingButton = false
            this.loadingButton1 = false
            this.$store.commit('snackbar', {color: 'error', message: `al descargar el archivo.`, error: error})
          })
    }
  }
}
</script>
