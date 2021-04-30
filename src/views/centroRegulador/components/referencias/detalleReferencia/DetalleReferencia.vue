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
          <v-row v-if="item">
            <v-col cols="12" md="6">
              <v-card>
                <v-list-item-subtitle class="body-2 font-weight-bold text--primary mx-4 pt-2">Paciente</v-list-item-subtitle>
                <v-list-item class="py-0">
                  <v-list-item-avatar color="primary" size="44" class="my-0 mr-1">
                    <v-icon large class="white--text">
                      {{ item.sexo === 'M' ? 'mdi mdi-face' : item.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi-account' }}
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pb-0">
                    <v-list-item-title>
                      {{ [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ') }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2">
                      {{ [item.tipo_id ? item.tipo_id.tipo : '', item.identificacion].filter(x => x).join(' ') }}
                    </v-list-item-subtitle>
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
                    <v-list-item-subtitle v-if="item.eps || item.tipo_afiliacion" class="body-2">
                      {{ [item.eps ? item.eps.nombre : null, item.tipo_afiliacion || null].filter(x => x).join(', ') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
              <v-card class="mt-5">
                <v-list-item-subtitle class="body-2 font-weight-bold text--primary mx-4 pt-2">Ingreso</v-list-item-subtitle>
                <v-list-item class="py-0">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="caption">
                      Solicitud
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <v-icon small>mdi-calendar-month</v-icon>
                      {{ item.fecha_solicitud ? moment(item.fecha_solicitud).format('DD/MM/YYYY HH:mm') : '' }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="caption">
                      Orden
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <v-icon small>mdi-calendar-month</v-icon>
                      {{ item.fecha_orden ? moment(item.fecha_orden).format('DD/MM/YYYY HH:mm') : '' }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="py-0" v-if="item.prestador_origen">
                  <v-list-item-content>
                    <v-list-item-subtitle class="caption">
                      IPS Origen
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.prestador_origen.nombre }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2">
                      {{ [item.prestador_origen.direccion, item.prestador_origen.nompio, item.prestador_origen.nomdepto].filter(x => x).join(', ') }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      <template v-if="item.prestador_origen.telefono">
                        <v-icon small>mdi-phone</v-icon>
                        {{ item.prestador_origen.telefono }}
                      </template>

                      <template v-if="item.prestador_origen.email">
                        <v-icon small>mdi-email</v-icon>
                        {{ item.prestador_origen.email }}
                      </template>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="py-0" v-if="item.mod_servicio">
                  <v-list-item-content>
                    <v-list-item-subtitle class="caption">
                      Modalidad del servicio
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.mod_servicio.modalidad }} - {{ item.mod_servicio.tipo }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="py-0" v-if="item.cie10_ingreso">
                  <v-list-item-content>
                    <v-list-item-subtitle class="caption">
                      Diagnóstico
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.cie10_ingreso.codigo }} - {{ item.cie10_ingreso.descrip }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="py-0" v-if="item.cup">
                  <v-list-item-content>
                    <v-list-item-subtitle class="caption">
                      Procedimiento
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.cup.codigo }} - {{ item.cup.descrip }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <evolucion
                  :referencia="item"
                  @guardado="val => actualizarItem(val)"
              />
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
    item: null
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
    }
  }
}
</script>