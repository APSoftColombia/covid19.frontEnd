<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
  >
    <v-card>
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
      <v-container v-if="item">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-card>
              <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Paciente</v-list-item-subtitle>
              <v-list-item class="py-0">
                <v-list-item-content class="pb-0">
                  <v-list-item-title class="font-weight-bold grey--text">
                    {{ [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ') }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ [item.tipo_id ? item.tipo_id.tipo : '', item.identificacion].filter(x => x).join(' ') }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.fecha_nacimiento">
                    {{ calculaEdad(item.fecha_nacimiento).stringDate }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30 mt-3" v-if="item.celular">
                <v-icon small class="mr-1">mdi-cellphone</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ item.celular }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30" v-if="item.email">
                <v-icon small class="mr-1">mdi-email</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ item.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30">
                <v-icon small class="mr-1">fas fa-map-signs</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ [item.direccion, item.municipio ? item.municipio.nombre : null, item.municipio && item.municipio.departamento ? item.municipio.departamento.nombre : null].filter(x => x).join(', ') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30 mt-2" v-if="item.eps">
                <v-icon small class="mr-1">fas fa-clinic-medical</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ item.eps.nombre }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.regimen_id" class="body-2">
                    {{ textRegimen }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Remite</v-list-item-subtitle>
              <v-list-item class="py-0" v-if="item.prestador_origen">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold grey--text">
                    {{ item.prestador_origen.nombre }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30" v-if="item.prestador_origen.telefono">
                <v-icon small class="mr-1">mdi-cellphone</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ item.prestador_origen.telefono }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30" v-if="item.prestador_origen.direccion">
                <v-icon small class="mr-1">fas fa-map-signs</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ [item.prestador_origen.direccion, item.prestador_origen.nompio, item.prestador_origen.nomdepto].filter(x => x).join(', ') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0 mh-30" v-if="item.prestador_origen.email">
                <v-icon small class="mr-1">mdi-email</v-icon>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="body-2">
                    {{ item.prestador_origen.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">Datos de la Remisión</v-list-item-subtitle>
              <v-list-item class="py-0">
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2">
                    Fecha Orden Médica
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ item.fecha_orden + ' a las ' + item.hora_orden }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0">
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2">
                    Recepción de la Solicitud
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    {{ item.fecha_solicitud + ' a las ' + item.hora_solicitud }}
                  </v-list-item-title>
                  <v-list-item-title v-if="item.medio_solicitud">
                    Por: {{ item.medio_solicitud }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0">
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2">
                    Diagnóstico
                  </v-list-item-subtitle>
                  <v-list-item-title v-if="item.cie10_ingreso">
                    <span class="font-weight-bold grey--text">{{ item.cie10_ingreso.codigo }}</span> - <span class="body-2">{{ item.cie10_ingreso.descrip }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0">
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2">
                    Especialidad
                  </v-list-item-subtitle>
                  <v-list-item-title v-if="item.especialidad">
                    <span class="font-weight-bold grey--text">{{ item.especialidad.serv_codigo }}</span> - <span class="body-2">{{ item.especialidad.serv_nombre }} | {{ item.especialidad.tipo_servicio }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="py-0">
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle-2">
                    Procedimiento
                  </v-list-item-subtitle>
                  <v-list-item-title v-if="item.cup">
                    <span class="font-weight-bold grey--text">{{ item.cup.codigo }}</span> - <span class="body-2">{{ item.cup.descrip }}</span>
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
              <v-divider/>
              <v-list-item-subtitle class="caption font-weight-bold grey--text mx-4 pt-2 text-right">
                Archivos
              </v-list-item-subtitle>
              <v-list dense class="notification-wrap">
                <c-input-file
                    detail
                    :show-icon="false"
                    label="Historia Clínica"
                    v-model="item.historia_clinica"
                />
                <c-input-file
                    detail
                    :show-icon="false"
                    label="Orden Médica"
                    v-model="item.orden_medica"
                />
                <c-input-file
                    detail
                    :show-icon="false"
                    label="Evolución Diaria"
                    v-model="item.evolucion_diaria"
                />
                <c-input-file
                    detail
                    :show-icon="false"
                    label="Documentos Paciente"
                    v-model="item.documentos_paciente"
                />
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <evolucion
                :referencia="item"
                @guardado="val => actualizarItem(val)"
            />
          </v-col>
        </v-row>
      </v-container>
      <app-section-loader :status="loading"/>
    </v-card>
  </v-dialog>
</template>

<script>
import models from '../../../models'
import Evolucion from 'Views/centroRegulador/components/referencias/evolucion/Evolucion'
import {mapGetters} from "vuex";
export default {
  name: 'DetalleReferencia',
  components: {
    Evolucion
  },
  data: () => ({
    loading: false,
    dialog: false,
    item: null
  }),
  computed: {
    ...mapGetters([
      'ref_regimenes',
    ]),
    textRegimen() {
      return (this.ref_regimenes?.length && this.item?.regimen_id && this.ref_regimenes.find(x => x.id === this.item.regimen_id)?.descripcion) || ''
    },
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
    }
  }
}
</script>

<style>
.mh-30{
  min-height: 30px !important;
}
</style>