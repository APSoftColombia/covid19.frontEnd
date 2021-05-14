<template>
  <v-card>
    <v-list two-line class="notification-wrap">
      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="teal" large>{{ tamizaje.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face' }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <v-list-item-title v-if="tipo"><h6 class="mb-0">{{ tipo }}</h6></v-list-item-title>
          <v-list-item-title class="grey--text fs-12 fw-normal">
            <h4 class="ma-0">
              {{ [tamizaje.nombre1, tamizaje.nombre2, tamizaje.apellido1, tamizaje.apellido2].filter(x => x).join(' ') }}
            </h4>
          </v-list-item-title>
          <v-list-item-title>
            <h6 class="mb-0">
              {{ tiposDocumentoIdentidad && tamizaje.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === tamizaje.tipo_identificacion).tipo : '' }}
              {{ tamizaje.identificacion }}
            </h6>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{calculaEdad(tamizaje && tamizaje.fecha_nacimiento).stringDate}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action-text>
          <modal-paciente
              v-if="permisos.datosPacienteEditar"
              btn-visible
              ref="modalPaciente"
              :tamizaje-origen="tamizaje"
              @actualizado="val => $emit('actualizarTamizaje', val)"
          />
          <v-btn
              class="ml-2"
              icon
              @click="panel = panel.length ? [] : [0]"
          >
            <v-icon>mdi-chevron-{{panel.length ? 'up' : 'down'}}</v-icon>
          </v-btn>
        </v-list-item-action-text>
      </v-list-item>
    </v-list>
    <v-expansion-panels class="elevation-0" v-model="panel" multiple style="z-index: 0 !important;">
      <v-expansion-panel>
        <v-expansion-panel-content>
<!--          <v-divider class="ma-0"></v-divider>-->
          <v-row no-gutters>
            <template v-for="(item, indexItem) in datos">
              <v-col cols="12" :md="item.colmd" :lg="item.collg" :key="`col${indexItem}`">
                <v-list two-line class="notification-wrap">
                  <v-list-item>
                    <v-list-item-avatar class="my-1">
                      <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{ item.label }}</v-list-item-subtitle>
                      <v-list-item-title v-if="item.label === 'Celular'">
                        <template v-if="item.body.split('-')[0]">
                          <a
                              :href="`tel:${item.body.split('-')[0]}`"
                          >
                            <h6 class="mb-0">{{ item.body.split('-')[0] }}</h6>
                          </a>
                        </template>
                        <template v-if="item.body.split('-')[0] && item.body.split('-')[1]"> | </template>
                        <template v-if="item.body.split('-')[1]">
                          <a
                              :href="`tel:${item.body.split('-')[1]}`"
                          >
                            <h6 class="mb-0">{{ item.body.split('-')[1] }}</h6>
                          </a>
                        </template>
                      </v-list-item-title>
                      <v-list-item-title v-else><h6 class="mb-0">{{ item.body }}</h6></v-list-item-title>
                      <v-list-item-subtitle
                          v-if="item.subtitle"
                          class="fs-12 fw-normal green--text"
                      >
                        {{ item.subtitle }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action v-if="item.action">
                      <v-list-item-action-text>{{ item.action }}</v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </template>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import ModalPaciente from 'Views/covid19/tamizaje/paciente/ModalPaciente'
import {mapGetters} from 'vuex'
export default {
  name: 'DatosPersonales',
  props: {
    tamizaje: {
      type: Object,
      default: null
    },
    abierto: {
      type: Boolean,
      default: true
    },
    tipo: {
      type: String,
      default: null
    }
  },
  components: {
    ModalPaciente
  },
  data: () => ({
    datos: [],
    panel: [0]
  }),
  watch: {
    abierto: {
      handler(val) {
        if (this) {
          this.panel = val ? [0] : []
        }
      },
      immediate: true
    },
    tamizaje: {
      handler(val) {
        val && this.assign()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposDocumentoIdentidad',
    ])
  },
  methods: {
    assign() {
      this.datos = []
      this.datos.push(
          {
            label: 'Fecha Nacimiento',
            body: this.tamizaje.fecha_nacimiento,
            icon: 'mdi-calendar-month',
            iconColor: 'warning',
            colmd: '6',
            collg: '4'
          },
          // {
          //   label: 'Sexo',
          //   body: this.tamizaje.sexo ? this.tamizaje.sexo === 'M' ? 'Masculino' : 'Femenino' : '',
          //   icon: 'mdi-human-male-female',
          //   iconColor: 'primary',
          //   colmd: '6',
          //   collg: '4'
          // },
          {
            label: 'Celular',
            body: [this.tamizaje.celular, this.tamizaje.celular2].filter(x => x).join('-'),
            subtitle: this.tamizaje.cambio_telefono ? `Actualizados el ${this.moment(this.tamizaje.cambio_telefono).format('dddd, DD [de] MMMM [de] YYYY')}` : null,
            icon: 'mdi-cellphone-iphone',
            iconColor: 'info',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Email',
            body: this.tamizaje.email,
            icon: 'mdi-email',
            iconColor: 'error',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Acudiente',
            body: this.tamizaje.acudiente,
            icon: 'mdi-account-child',
            iconColor: 'green',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Dirección',
            body: `${this.tamizaje.direccion}${this.tamizaje.barrio_id && this.tamizaje.barrio ? ` - ${this.tamizaje.barrio.tipo === 'Barrio' ? 'Barrio' : 'Vereda'} ` + this.tamizaje.barrio.nombre : ''}`,
            icon: 'fas fa-map-signs',
            iconColor: 'purple',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Municipio',
            body: this.tamizaje.municipio ? `${this.tamizaje.municipio.nombre}, ${this.tamizaje.municipio.departamento.nombre}` : '',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'EPS',
            body: this.tamizaje.eps ? this.tamizaje.eps.nombre : '',
            icon: 'fas fa-hospital',
            iconColor: 'pink',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Régimen',
            body: [this.tamizaje.tipo_afiliacion, this.tamizaje.regimen_especial].filter(x => x).join(' - '),
            icon: 'mdi-medical-bag',
            iconColor: 'indigo',
            colmd: '6',
            collg: '4'
          }
      )
      // this.$refs.modalPaciente && this.$refs.modalPaciente.assign(this.tamizaje)
    }
  }
}
</script>

<style scoped>

</style>