<template>
  <v-expansion-panels :flat="flat" :readonly="readOnly" v-if="afiliado" v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="teal" large>{{afiliado.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face'}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                {{afiliado.nombre}}
              </h4>
            </v-list-item-title>
            <v-list-item-title>
              <h6 class="mb-0">
                {{ afiliado.tipoid ? afiliado.tipoid : '' }} {{afiliado.identificacion}}
              </h6>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ calculaEdad(afiliado && fixFecha(this.afiliado.fecha_nacimiento)).stringDate }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-divider class="ma-0"></v-divider>
        <v-row no-gutters>
          <template v-for="(item, indexItem) in datos">
            <v-col cols="12" :md="item.colmd" :lg="item.collg" xl="3" :key="`col${indexItem}`">
              <v-list two-line class="notification-wrap">
                <v-list-item>
                  <v-list-item-avatar class="my-1">
                    <v-icon :color="item.iconColor">{{item.icon}}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{item.label}}</v-list-item-subtitle>
                    <v-list-item-title><h6 class="mb-0">{{item.body}}</h6></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="item.action">
                    <v-list-item-action-text>{{item.action}}</v-list-item-action-text>
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
    name: "DatosAfiliado",
    data: () => ({
      datos: [],
      panel: []
    }),
    props: {
      afiliado: {
        type: Object,
        default: null
      },
      abierto: {
        type: Boolean,
        default: true
      },
      dense: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      flat: {
        type: Boolean,
        default: false
      },
      columMD: {
        type: Number,
        default: 6
      }
    },
    watch: {
      abierto: {
        handler (val) {
          if (this) {
            this.panel = val ? [0] : []
          }
        },
        immediate: true
      },
      afiliado: {
        handler (val) {
          val && this.assign()
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      assign () {
        this.datos = []
        this.datos.push(
            {
              label: 'Fecha Nacimiento',
              body: this.afiliado && this.afiliado.fecha_nacimiento ? this.moment(this.fixFecha(this.afiliado.fecha_nacimiento)).format('DD/MM/YYYY') : '',
              icon: 'mdi-calendar-month',
              iconColor: 'warning',
              colmd: this.columMD,
              collg: this.dense ? '6' : '4'
            },
            {
              label: 'Sexo',
              body: this.afiliado.sexo ? this.afiliado.sexo === 'M' ? 'Masculino' : 'Femenino' : '',
              icon: 'mdi-human-male-female',
              iconColor: 'primary',
              colmd: this.columMD,
              collg: this.dense ? '6' : '4'
            },
            {
              label: 'Fecha Diagnostico',
              body: this.afiliado && this.afiliado.fecha_diagnostico ? this.moment(this.fixFecha(this.afiliado.fecha_diagnostico)).format('DD/MM/YYYY') : '',
              icon: 'mdi-calendar-month',
              iconColor: 'warning',
              colmd: this.columMD,
              collg: this.dense ? '6' : '4'
            },
        )
      },
      fixFecha(fecha){
        let splitFecha = fecha.split('/')
        return new Date(+splitFecha[2], splitFecha[1] - 1, +splitFecha[0])
      }
    }
  }
</script>

<style scoped>

</style>