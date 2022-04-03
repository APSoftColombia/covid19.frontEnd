<template>
  <v-card v-if="item">
    <v-list two-line dense>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="teal" large>{{ item.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face' }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="pa-0">
          <v-list-item-title class="grey--text fs-12 fw-normal">
            <h4 class="ma-0">
              {{ [item.primer_nombre, item.segundo_nombre, item.primer_apellido, item.segundo_apellido].filter(x => x).join(' ') }}
            </h4>
          </v-list-item-title>
          <v-list-item-title>
            <h6 class="mb-0">
              {{`${item.tipo_identificacion} ${item.numero_identificacion}`}}
            </h6>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{item.fecha_nacimiento ? calculaEdad(item.fecha_nacimiento).stringDate : ''}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action-text>
          <v-chip
              label
              color="primary"
              class="mr-2"
          >
            Estado: {{estadoAfiliacion}}
          </v-chip>
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
          <v-row dense>
            <template v-for="(item, indexItem) in information">
              <v-col cols="12" :md="item.colmd" :lg="item.collg" :key="`col${indexItem}`">
                <v-list class="notification-wrap">
                  <v-list-item class="pa-0">
                    <v-list-item-avatar class="my-1">
                      <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{ item.label }}</v-list-item-subtitle>
                      <v-list-item-title v-if="item.label === 'Email' || item.label === 'Celular'">
                        <template v-if="item.label === 'Email' && item.body">
                          <a :href="`mailto:${item.body}`">
                            <h6 class="mb-0">{{ item.body }}</h6>
                          </a>
                        </template>
                        <template v-if="item.label === 'Celular'">
                          <a :href="`tel:${item.body}`">
                            <h6 class="mb-0">{{ item.body }}</h6>
                          </a>
                        </template>
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        <h6 class="mb-0">{{ item.body }}</h6>
                      </v-list-item-title>
                      <v-list-item-subtitle
                          v-if="item.subtitle"
                          class="fs-12 fw-normal"
                          :class="item.clasSubtitle"
                      >
                        {{ item.subtitle }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
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
import {mapGetters} from 'vuex'
export default {
  name: 'PersonalInformation',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    information: [],
    panel: true
  }),
  watch: {
    item: {
      handler(val) {
        val && this.assign()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    estadoAfiliacion() {
      return this.item?.afiliado?.estado || 'No registra afiliación'
    },
    permisos() {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    },
    ...mapGetters([
        'estadosAfiliacion'
    ])
  },
  methods: {
    assign() {
      this.information = []
      this.information.push(
          {
            label: 'Fecha Nacimiento',
            body: this.item.fecha_nacimiento || '',
            icon: 'mdi-calendar-month',
            iconColor: 'warning',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Celular',
            body: this.item.telefono,
            icon: 'mdi-cellphone-iphone',
            iconColor: 'info',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Dirección residencia',
            body: this.item.direccion_residencia,
            icon: 'fas fa-map-signs',
            iconColor: 'purple',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Municipio',
            body: this.item.municipio || '',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Grupo Poblacional',
            body: this.item.grupo_poblacional ||  '',
            icon: 'mdi-account-card-details',
            iconColor: 'indigo',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Pertenencia etnica',
            body: this.item.grupo_poblacional ||  '',
            icon: 'mdi-handshake',
            iconColor: '',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Régimen',
            body: this.item.regimen,
            icon: 'mdi-medical-bag',
            iconColor: 'indigo',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'EPS',
            body: this.item.eps || '',
            subtitle: this.item.fecha_afiliacion_eps || '',
            icon: 'fas fa-hospital',
            iconColor: 'pink',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'IPS Primaria',
            body: this.item.codigo_ips_primer_nivel || '',
            // subtitle: `Tel. ${this.item.ips_medicamentos.telefono}, ${[this.item.ips_medicamentos.direccion, this.item.ips_medicamentos.nompio, this.item.ips_medicamentos.nomdepto].filter(x => x).join(', ')}`,
            icon: 'fas fa-clinic-medical',
            iconColor: 'primary',
            colmd: '6',
            collg: '4'
          }
      )
    }
  }
}
</script>