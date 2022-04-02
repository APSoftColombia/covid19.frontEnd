<template>
  <v-expansion-panels
      v-model="panel"
      multiple style="z-index: 0 !important;"
  >
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon
                color="teal"
                large
            >
              {{ afiliado && afiliado.genero ? afiliado.genero === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face' : null }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                {{ afiliado ? [afiliado.primer_nombre, afiliado.segundo_nombre, afiliado.primer_apellido, afiliado.segundo_apellido].filter(x => x).join(' ') : null }}
              </h4>
            </v-list-item-title>
            <v-list-item-title>
              <h6 class="mb-0">
                {{ afiliado ? afiliado.tipo_identificacion : null }}
                {{ afiliado ? afiliado.numero_identificacion : null }}
              </h6>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ calculaEdad(afiliado && afiliado.fecha_nacimiento).stringDate }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-divider class="ma-0"/>
        <v-row no-gutters>
          <template v-for="(item, indexItem) in datos">
            <v-col
                cols="12"
                :md="item.colmd"
                :lg="item.collg"
                :key="`col${indexItem}`"
            >
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
export default {
  name: 'DatosPersonalesAfiliado',
  props: {
    afiliado: {
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
    afiliado: {
      handler(val) {
        val && this.assign()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    assign() {
      this.datos = []
      this.datos.push(
          {
            label: 'Fecha Nacimiento',
            body: this.afiliado.fecha_nacimiento,
            icon: 'mdi-calendar-month',
            iconColor: 'warning',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Sexo',
            body: this.afiliado.genero ? this.afiliado.genero === 'M' ? 'Masculino' : 'Femenino' : '',
            icon: 'mdi-human-male-female',
            iconColor: 'primary',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Celular',
            body: [this.afiliado.telefono_1, this.afiliado.telefono_2].filter(x => x).join(' - '),
            icon: 'mdi-cellphone-iphone',
            iconColor: 'info',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Municipio',
            body: this.afiliado.municipio && this.afiliado.departamento ? `${this.afiliado.municipio}, ${this.afiliado.departamento}` : '',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'IPS',
            body: this.afiliado.ips_asignada ? this.afiliado.ips_asignada : '',
            icon: 'fas fa-hospital',
            iconColor: 'pink',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Régimen/Estado',
            body: [this.afiliado.regimen, this.afiliado.estado_afiliacion].filter(x => x).join(' - '),
            icon: 'mdi-medical-bag',
            iconColor: 'indigo',
            colmd: '6',
            collg: '4'
          }
      )
    }
  }
}
</script>
