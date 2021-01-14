<template>
  <v-dialog
      v-model="dialog"
      max-width="720"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-file-prescription</v-icon>
        <v-list-item-content class="pa-0">
          <v-list-item-title class="mb-0"><h6 class="mb-0 title">{{reporteComunitario && reporteComunitario.id ? `${sonNexos || sonNexos === null ? 'Nexo' : 'Contacto'} No. ${reporteComunitario.id}` : ''}}</h6></v-list-item-title>
          <v-list-item-subtitle class="grey--text fs-12 fw-normal">
            {{reporteComunitario.created_at ? moment(reporteComunitario.created_at).format('DD/MM/YYYY HH:mm') : ''}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-list two-line class="notification-wrap">
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="error">fas fa-user-secret</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Quien Reporta</v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0">{{reporteComunitario.nombre_reportante}}</h6></v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <v-icon small>mdi-phone</v-icon>
                    {{reporteComunitario.celular_reportante}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="pa-0 ma-0"></v-divider>
              <v-subheader>Posible Caso</v-subheader>
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="teal" large>{{reporteComunitario.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face'}}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-title><h6 class="mb-0">{{reporteComunitario.nombres}}</h6></v-list-item-title>
                  <v-list-item-title v-if="reporteComunitario.tipo_identificacion && reporteComunitario.identificacion">
                    <h6 class="mb-0">
                      {{ tiposDocumentoIdentidad && reporteComunitario.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === reporteComunitario.tipo_identificacion).tipo : '' }}  {{ reporteComunitario.identificacion ? reporteComunitario.identificacion : '' }}
                    </h6>
                  </v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    {{[reporteComunitario.edad ? `${reporteComunitario.edad} Años` : null, reporteComunitario.celular ? `Celular: ${reporteComunitario.celular}` : null].filter(x => x).join(', ')}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="green">fas fa-user-friends</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Parentesco</v-list-item-subtitle>
                  <v-list-item-title>
                    <h6 class="mb-0">
                      {{ reporteComunitario.parentesco_id && parentescos && parentescos.find(x => x.id === reporteComunitario.parentesco_id)
                        ? parentescos.find(x => x.id === reporteComunitario.parentesco_id).descripcion : '' }}
                    </h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="purple">fas fa-map-signs</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Ubicación</v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0">{{ reporteComunitario.direccion }}</h6></v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    {{ reporteComunitario.municipio_id && divipol && divipol.find(x => x.id === reporteComunitario.municipio_id) ? divipol.find(x => x.id === reporteComunitario.municipio_id).nombre : '' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="orange">fas fa-file-invoice-dollar</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Presupuesto Comun</v-list-item-subtitle>
                  <v-list-item-title>
                    <h6 class="mb-0">
                      {{ reporteComunitario.PresupuestoComun ? reporteComunitario.PresupuestoComun === 1 ? 'Si' : 'No' : '' }}
                    </h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="indigo">fas fa-hospital</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">EPS</v-list-item-subtitle>
                  <v-list-item-title>
                    <h6 class="mb-0">
                      {{ epss && epss.length && reporteComunitario.eps_id
                         && epss.find(x => x.id === reporteComunitario.eps_id)
                         ? epss.find(x => x.id === reporteComunitario.eps_id).nombre : ''
                      }}
                    </h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" style="border-bottom: none !important;" v-if="reporteComunitario.observaciones">
                <v-list-item-content>
                  <h6 class="mb-0 info--text text--darken-3">Observaciones</h6>
                  <p class="fs-12 mb-0 fw-normal">{{ reporteComunitario.observaciones }}</p>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null" v-if="reporteComunitario.user" style="border-bottom: none !important;">
                <v-list-item-avatar class="my-1 align-self-center">
                  <v-icon color="primary">fas fa-user</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">Usuario que Registra</v-list-item-subtitle>
                  <v-list-item-title><h6 class="mb-0">{{ reporteComunitario.user.name }}</h6></v-list-item-title>
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <v-icon small>mdi-phone</v-icon>
                    {{ reporteComunitario.user.telefono }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'DetalleNexo',
    props: {
      sonNexos: {
        type: Boolean,
        default: null
      }
    },
    data: () => ({
      dialog: false,
      loading: false,
      click: null,
      reporteComunitario: null
    }),
    computed: {
      ...mapGetters([
        'modelReporteComunitario',
        'divipol',
        'tiposDocumentoIdentidad',
        'epss',
        "parentescos"
      ])
    },
    created() {
      this.reporteComunitario = this.clone(this.modelReporteComunitario)
    },
    methods: {
      open(item = null, fromNexosView = false) {
        if (item !== null && fromNexosView){
          this.reporteComunitario = item
          this.reporteComunitario.nombre_reportante = item.nombre_origen
          this.reporteComunitario.celular_reportante = item.celular_origen
        }else{
          this.reporteComunitario = item
        }
        this.dialog = true
      },
      close() {
        this.dialog = false
        this.reporteComunitario = this.clone(this.modelReporteComunitario)
      }
    }
  }
</script>

<style scoped>

</style>