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
              @click="panel= !panel"
          >
            <v-icon>mdi-chevron-{{panel ? 'up' : 'down'}}</v-icon>
          </v-btn>
        </v-list-item-action-text>
      </v-list-item>
    </v-list>
    <v-expand-transition>
      <div v-if="panel">
        <v-card-text>
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
                      <v-list-item-title v-if="item.label === 'Email' || item.label === 'Celular'">
                        <template v-if="item.label === 'Email' && item.body">
                          <a
                              :href="`mailto:${item.body}`"
                          >
                            <h6 class="mb-0">{{ item.body }}</h6>
                          </a>
                        </template>
                        <template v-if="item.label === 'Celular'">
                          <template v-for="(telefono, indexTelefono) in item.body.split('*||*')">
                            <c-tooltip
                                v-if="telefono"
                                :key="`tel${indexTelefono}`"
                                top
                                :tooltip="telefono.split('*-*')[1]"
                            >
                              <a
                                  :href="`tel:${telefono.split('*-*')[0]}`"
                              >
                                <h6 class="mb-0">{{ telefono.split('*-*')[0] }}</h6>
                              </a>
                            </c-tooltip>
                            <template v-if="telefono && (item.body.split('*||*')[indexTelefono + 1])"> | </template>
                          </template>
                        </template>
                      </v-list-item-title>
                      <v-list-item-title v-else><h6 class="mb-0">{{ item.body }}</h6></v-list-item-title>
                      <v-list-item-subtitle
                          v-if="item.subtitle"
                          class="fs-12 fw-normal"
                          :class="item.clasSubtitle"
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
        </v-card-text>
      </div>
    </v-expand-transition>
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
    },
    view: {
      type: String,
      default: null
    }
  },
  components: {
    ModalPaciente
  },
  data: () => ({
    datos: [],
    panel: false,
    typePhone: ['Principal', 'Opcional', 'Tel. SIVIGILA', 'Tel. Maestro Afiliado']
  }),
  watch: {
    abierto: {
      handler(val) {
        if (this) {
          this.panel = val
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
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
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
            body:
                [
                  this.tamizaje.celular ? `${this.tamizaje.celular}*-*Principal` : null,
                  this.tamizaje.celular2 ? `${this.tamizaje.celular2}*-*Opcional` : null,
                  this.tamizaje.telefono_sivigila ? `${this.tamizaje.telefono_sivigila}*-*Tel. SIVIGILA` : null,
                  this.tamizaje.telefono_ma ? `${this.tamizaje.telefono_ma }*-*Tel. Maestro Afiliado` : null
                ].filter(x => x).join('*||*'),
            subtitle: this.tamizaje.cambio_telefono ? `Actualizados el ${this.moment(this.tamizaje.cambio_telefono).format('dddd, DD [de] MMMM [de] YYYY')}` : null,
            clasSubtitle: 'green--text',
            icon: 'mdi-cellphone-iphone',
            iconColor: 'info',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'Email',
            body: this.tamizaje.email,
            icon: 'mdi-email',
            iconColor: 'error',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'Acudiente',
            body: this.tamizaje.acudiente,
            icon: 'mdi-account-child',
            iconColor: 'green',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'Dirección',
            body: `${this.tamizaje.direccion}${this.tamizaje.barrio_id && this.tamizaje.barrio ? ` - ${this.tamizaje.barrio.tipo === 'Barrio' ? 'Barrio' : 'Vereda'} ` + this.tamizaje.barrio.nombre : ''}`,
            icon: 'fas fa-map-signs',
            iconColor: 'purple',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'Municipio',
            body: this.tamizaje.municipio ? `${this.tamizaje.municipio.nombre}, ${this.tamizaje.municipio.departamento.nombre}` : '',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'EPS',
            body: this.tamizaje.eps ? this.tamizaje.eps.nombre : '',
            icon: 'fas fa-hospital',
            iconColor: 'pink',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          },
          {
            label: 'Régimen',
            body: [this.tamizaje.tipo_afiliacion, this.tamizaje.regimen_especial].filter(x => x).join(' - '),
            icon: 'mdi-medical-bag',
            iconColor: 'indigo',
            colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
            collg: this.view === 'RegistroEvolucion' ? '6' : '4'
          }
    )
      if(this.tamizaje.ips_medicamentos) {
        this.datos.push(
            {
              label: 'IPS Primarua Medicamentos',
              body: this.tamizaje.ips_medicamentos.nombre,
              subtitle: `Tel. ${this.tamizaje.ips_medicamentos.telefono}, ${[this.tamizaje.ips_medicamentos.direccion, this.tamizaje.ips_medicamentos.nompio, this.tamizaje.ips_medicamentos.nomdepto].filter(x => x).join(', ')}`,
              icon: 'fas fa-clinic-medical',
              iconColor: '',
              colmd: this.view === 'RegistroEvolucion' ? '12' : '6',
              collg: this.view === 'RegistroEvolucion' ? '6' : '4'
            }
        )
      }
      // this.$refs.modalPaciente && this.$refs.modalPaciente.assign(this.tamizaje)
    }
  }
}
</script>

<style scoped>

</style>