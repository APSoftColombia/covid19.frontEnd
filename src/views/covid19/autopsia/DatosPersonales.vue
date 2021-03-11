<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="teal" large>{{ persona.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face' }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title v-if="tipo"><h6 class="mb-0">{{ tipo }}</h6></v-list-item-title>
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                {{ [persona.nombre1, persona.nombre2, persona.apellido1, persona.apellido2].filter(x => x).join(' ') }}
              </h4>
            </v-list-item-title>
            <v-list-item-title>
              <h6 class="mb-0">
              {{ tiposDocumentoIdentidad && persona.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === persona.tipo_identificacion).tipo : '' }}
              {{ persona.identificacion }}
              </h6>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{calculaEdad(persona && persona.fecha_nacimiento).stringDate}}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <modal-paciente
                v-if="permisos.datosPacienteEditar"
                btn-visible
                ref="modalPaciente"
                :persona-origen="persona"
                :autopsia="autopsia"
                @actualizado="val => $emit('actualizado', val)"
                :tipo="tipo === 'Informante' ? 'encuestado' : 'fallecido'"
            />
          </v-list-item-action>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-divider class="ma-0"></v-divider>
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
                    <v-list-item-title><h6 class="mb-0">{{ item.body }}</h6></v-list-item-title>
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
</template>

<script>
import ModalPaciente from 'Views/covid19/autopsia/paciente/ModalPaciente'
import {mapGetters} from 'vuex'
export default {
  name: 'DatosPersonales',
  props: {
    persona: {
      type: Object,
      default: null
    },
    autopsia: {
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
    persona: {
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
            body: this.persona.fecha_nacimiento,
            icon: 'mdi-calendar-month',
            iconColor: 'warning',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Sexo',
            body: this.persona.sexo ? this.persona.sexo === 'M' ? 'Masculino' : 'Femenino' : '',
            icon: 'mdi-human-male-female',
            iconColor: 'primary',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Celular',
            body: [this.persona.celular, this.persona.celular2].filter(x => x).join(' - '),
            icon: 'mdi-cellphone-iphone',
            iconColor: 'info',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Email',
            body: this.persona.email,
            icon: 'mdi-email',
            iconColor: 'error',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Acudiente',
            body: this.persona.acudiente,
            icon: 'mdi-account-child',
            iconColor: 'green',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Dirección',
            body: `${this.persona.direccion}${this.persona.barrio_id && this.persona.barrio ? ` - ${this.persona.barrio.tipo === 'Barrio' ? 'Barrio' : 'Vereda'} ` + this.persona.barrio.nombre : ''}`,
            icon: 'fas fa-map-signs',
            iconColor: 'purple',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Municipio',
            body: this.persona.municipio ? `${this.persona.municipio.nombre}, ${this.persona.municipio.departamento.nombre}` : '',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'EPS',
            body: this.persona.eps ? this.persona.eps.nombre : '',
            icon: 'fas fa-hospital',
            iconColor: 'pink',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Régimen',
            body: [this.persona.tipo_afiliacion, this.persona.regimen_especial].filter(x => x).join(' - '),
            icon: 'mdi-medical-bag',
            iconColor: 'indigo',
            colmd: '6',
            collg: '4'
          }
      )
      // this.$refs.modalPaciente && this.$refs.modalPaciente.assign(this.persona)
    }
  }
}
</script>

<style scoped>

</style>