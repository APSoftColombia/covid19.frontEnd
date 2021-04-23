<template>
  <v-expansion-panels v-if="seguimiento" v-model="panel" multiple style="z-index: 0 !important;">
      <v-expansion-panel>
          <v-expansion-panel-header class="py-1 pl-0">
              <v-list-item>
                  <v-list-item-content class="pa-0">
                      <v-list-item-title class="grey--text fs-12 fw-normal">
                          <h4 class="ma-0">Información del seguimiento</h4>
                      </v-list-item-title>
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
  name: "InformacionSeguimiento",
  props: {
    abierto: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    seguimiento: {
      type: [Object, Array],
      default: null
    }
  },
  data: () => ({
    datos: [],
    panel: []
  }),
  watch: {
    abierto: {
      handler (val) {
        if (this) {
            this.panel = val ? [0] : []
        }
      },
      immediate: true
    },
    seguimiento: {
        handler (val) {
            val && this.assign()
        },
        deep: true,
        immediate: true
    }
  },
  methods: {
    assign(){
      this.datos = []
      this.datos.push(
        {
          label: 'IPS del seguimiento',
          body: this.seguimiento.ips_seguimiento ? this.seguimiento.ips_seguimiento.nombre : '',
          icon: 'mdi mdi-medical-bag',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Fecha de ingreso al programa de nefroprotección',
          body: this.seguimiento.ingreso_nefroproteccion,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'warning',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Diagnóstico confirmado de Hipertensión Arterial',
          body: this.seguimiento.hta ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        }
      )

      if(this.seguimiento.hta){
        this.datos.push(
          {
            label: 'Fecha del diagnóstico de Hipertensión Arterial',
            body: this.seguimiento.fecha_dx_hta,
            icon: 'mdi mdi-calendar-range',
            iconColor: 'red',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Costo HTA durante el período de reporte',
            body: this.seguimiento.costo_hta,
            icon: 'mdi mdi-calendar-range',
            iconColor: 'red',
            colmd: '4',
            collg: '4'
          },
        )
      }
      this.datos.push(
        {
          label: 'Diagnóstico confirmado de Diabetes Mellitus - DM',
          body: this.seguimiento.diabetes_melitus ? this.seguimiento.diabetes_melitus.opcion : '',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
      )
      if(this.seguimiento.diabetes != 2){
        this.datos.push(
          {
            label: 'Fecha de diagnostico de la Diabetes Mellitus',
            body: this.seguimiento.fecha_dx_dm,
            icon: 'mdi mdi-calendar-range',
            iconColor: 'red',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Costo DM durante el período de reporte',
            body: this.seguimiento.costo_dm,
            icon: 'mdi mdi-calendar-range',
            iconColor: 'red',
            colmd: '4',
            collg: '4'
          },
        )
      }
      this.datos.push(
        {
          label: 'Insulinorequiriente',
          body: this.seguimiento.insulinorequiriente ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Etiología de la ERC',
          body: this.seguimiento.etiologia_enfermedad_renal ? this.seguimiento.etiologia_enfermedad_renal.opcion : '',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Peso',
          body: this.seguimiento.peso + " kg",
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Talla',
          body: this.seguimiento.talla + " cmts",
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'IMC',
          body: this.seguimiento.imc,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación de IMC',
          body: this.seguimiento.clasificacion_imc,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Circunferencia abdominal',
          body: this.seguimiento.circunferencia_abdominal,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Alcoholismo',
          body: this.seguimiento.alcohol ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tabaquismo',
          body: this.seguimiento.tabaquismo ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Sedentarismo',
          body: this.seguimiento.sedentarismo ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Adherencia',
          body: this.seguimiento.adherencia ? 'Si' : 'No',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tension arterial sistolica',
          body: this.seguimiento.tension_arterial_sistolica + " Mm de Hg",
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tension arterial diastolica',
          body: this.seguimiento.tension_arterial_diastolica + " Mm de Hg",
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Estadio HTA',
          body: this.seguimiento.estadio_hta,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación del riesgo cardiovascular y metabolico',
          body: this.seguimiento.clasificacion_rcv,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tasa de filtración Glomerular',
          body: this.seguimiento.tfg,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación estadio ERC KCG',
          body: this.seguimiento.clasificacion_estadio_erc_kcg,
          icon: 'mdi mdi-calendar-range',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
      )
    },
  }
}
</script>

<style scoped>

</style>
