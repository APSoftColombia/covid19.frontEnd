<template>
  <v-expansion-panels
    v-if="seguimiento"
    v-model="panel"
    multiple
    style="z-index: 0 !important"
  >
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
            <v-col
              cols="12"
              :md="item.colmd"
              :lg="item.collg"
              xl="3"
              :key="`col${indexItem}`"
            >
              <v-list two-line class="notification-wrap">
                <v-list-item>
                  <v-list-item-avatar class="my-1">
                    <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">{{
                      item.label
                    }}</v-list-item-subtitle>
                    <v-list-item-title
                      ><h6 class="mb-0">{{ item.body }}</h6></v-list-item-title
                    >
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
      default: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    seguimiento: {
      type: [Object, Array],
      default: null,
    },
  },
  data: () => ({
    datos: [],
    panel: [],
  }),
  watch: {
    abierto: {
      handler(val) {
        if (this) {
          this.panel = val ? [0] : [];
        }
      },
      immediate: true,
    },
    seguimiento: {
      handler(val) {
        val && this.assign();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    assign() {
      this.datos = [];
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
          label: "Fecha de ingreso al programa de nefroprotección",
          body: this.seguimiento.ingreso_nefroproteccion,
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "¿Perdida Funcional Renal?",
          body: this.seguimiento.perdida_funcional_renal
            ? this.seguimiento.perdida_funcional_renal
              ? "Si"
              : "No"
            : "-",
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Clasificacion Findrisc",
          body: this.seguimiento.clasificacion_findrisc ? this.seguimiento.clasificacion_findrisc : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Riesgo Framingham",
          body: this.seguimiento.resultado_riesgo_framingham ? this.seguimiento.resultado_riesgo_framingham : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Antihipertensivos IECA",
          body: this.seguimiento.antihipertensivos_ieca ? this.seguimiento.antihipertensivos_ieca.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Antihipertensivos ARA II",
          body: this.seguimiento.antihipertensivos_ara_2 ? this.seguimiento.antihipertensivos_ara_2.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Diag. Enfermedad Renal",
          body: this.seguimiento.diagnostico_enfermedad_renal ? this.seguimiento.diagnostico_enfermedad_renal.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Estadio ERC",
          body: this.seguimiento.estadio_erc ? this.seguimiento.estadio_erc.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Estadio ERC 5",
          body: this.seguimiento.fecha_erc_estadio_5 ? this.seguimiento.fecha_erc_estadio_5 : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Programa atencion ERC",
          body: this.seguimiento.programa_atencion_erc ? this.seguimiento.programa_atencion_erc.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Novedad",
          body: this.seguimiento.novedad_option ? this.seguimiento.novedad_option.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Causa de muerte",
          body: this.seguimiento.causa_de_muerte ? this.seguimiento.causa_de_muerte.opcion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha de muerte",
          body: this.seguimiento.fecha_muerte ? this.seguimiento.fecha_muerte : '-',
          icon: 'mdi mdi-calendar-range',
          iconColor: 'warning',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Diagnóstico confirmado de Hipertensión Arterial',
          body: this.seguimiento.hta ? 'Si' : 'No',
          icon: 'mdi mdi-check',
          iconColor: 'green',
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
            iconColor: 'blue',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Costo HTA durante el período de reporte',
            body: this.seguimiento.costo_hta,
            icon: 'mdi mdi-currency-usd',
            iconColor: 'cyan',
            colmd: '4',
            collg: '4'
          },
        )
      }
      this.datos.push(
        {
          label: 'Diagnóstico confirmado de Diabetes Mellitus - DM',
          body: this.seguimiento.diabetes_melitus ? this.seguimiento.diabetes_melitus.opcion : '',
          icon: 'mdi mdi-check',
          iconColor: 'lime',
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
            iconColor: 'orange',
            colmd: '4',
            collg: '4'
          },
          {
            label: 'Costo DM durante el período de reporte',
            body: this.seguimiento.costo_dm,
            icon: 'mdi mdi-currency-usd',
            iconColor: 'teal',
            colmd: '4',
            collg: '4'
          },
        )
      }
      this.datos.push(
        {
          label: 'Insulinorequiriente',
          body: this.seguimiento.insulinorequiriente ? 'Si' : 'No',
          icon: 'mdi mdi-needle',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Etiología de la ERC',
          body: this.seguimiento.etiologia_enfermedad_renal ? this.seguimiento.etiologia_enfermedad_renal.opcion : '',
          icon: 'mdi mdi-help-circle-outline',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Peso',
          body: this.seguimiento.peso + " kg",
          icon: 'mdi mdi-weight-pound',
          iconColor: 'blue accent-4',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Talla',
          body: this.seguimiento.talla + " cmts",
          icon: 'mdi mdi-size-l',
          iconColor: 'amber',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'IMC',
          body: this.seguimiento.imc,
          icon: 'mdi mdi-tape-measure',
          iconColor: 'orange accent-4',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación de IMC',
          body: this.seguimiento.clasificacion_imc,
          icon: 'mdi mdi-file-tree-outline',
          iconColor: 'brown',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Circunferencia abdominal',
          body: this.seguimiento.circunferencia_abdominal,
          icon: 'mdi mdi-tape-measure',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Alcoholismo',
          body: this.seguimiento.alcohol ? 'Si' : 'No',
          icon: 'mdi mdi-glass-mug-variant',
          iconColor: 'pink',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tabaquismo',
          body: this.seguimiento.tabaquismo ? 'Si' : 'No',
          icon: 'mdi mdi-smoking-off',
          iconColor: 'purple',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Sedentarismo',
          body: this.seguimiento.sedentarismo ? 'Si' : 'No',
          icon: 'mdi mdi-cup-water',
          iconColor: 'indigo',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Adherencia',
          body: this.seguimiento.adherencia ? 'Si' : 'No',
          icon: 'mdi mdi-account-search',
          iconColor: 'light-blue',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tension arterial sistolica',
          body: this.seguimiento.tension_arterial_sistolica + " Mm de Hg",
          icon: 'mdi mdi-heart-pulse',
          iconColor: 'purple',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tension arterial diastolica',
          body: this.seguimiento.tension_arterial_diastolica + " Mm de Hg",
          icon: 'mdi mdi-heart-pulse',
          iconColor: 'red',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Estadio HTA',
          body: this.seguimiento.estadio_hta,
          icon: 'mdi mdi-file-tree-outline',
          iconColor: 'orange',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación del riesgo cardiovascular y metabolico',
          body: this.seguimiento.clasificacion_rcv,
          icon: 'mdi mdi-file-tree-outline',
          iconColor: 'light-green',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Tasa de filtración Glomerular',
          body: this.seguimiento.tfg,
          icon: 'mdi mdi-tape-measure',
          iconColor: 'blue',
          colmd: '4',
          collg: '4'
        },
        {
          label: 'Clasificación estadio ERC KCG',
          body: this.seguimiento.clasificacion_estadio_erc_kcg,
          icon: 'mdi mdi-counter',
          iconColor: 'green darken-4',
          colmd: '4',
          collg: '4'
        },
        {
          label: "Causa de muerte externa",
          body: this.seguimiento.causa_muerte_externa ? this.seguimiento.causa_muerte_externa : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Hospitalizado hace 6 meses",
          body: this.seguimiento.hospitalizado_reciente ? this.seguimiento.hospitalizado_reciente : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha de Hospitalizacion",
          body: this.seguimiento.fecha_hospitalizacion_reciente ? this.seguimiento.fecha_hospitalizacion_reciente : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Observaciones",
          body: this.seguimiento.observaciones ? this.seguimiento.observaciones : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "IPS Asiste",
          body: this.seguimiento.ips_asistencia ? this.seguimiento.ips_asistencia : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Nutricion",
          body: this.seguimiento.fecha_valoracion_nutricion ? this.seguimiento.fecha_valoracion_nutricion : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Internista",
          body: this.seguimiento.fecha_valoracion_internista ? this.seguimiento.fecha_valoracion_internista : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Nefrologia",
          body: this.seguimiento.fecha_valoracion_nefrologia ? this.seguimiento.fecha_valoracion_nefrologia : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Endocrinologia",
          body: this.seguimiento.fecha_valoracion_endocrinologia ? this.seguimiento.fecha_valoracion_endocrinologia : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Psicologia",
          body: this.seguimiento.fecha_valoracion_psicologia ? this.seguimiento.fecha_valoracion_psicologia : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Valoracion Oftamologia",
          body: this.seguimiento.fecha_valoracion_oftamologia ? this.seguimiento.fecha_valoracion_oftamologia : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Control Grupal",
          body: this.seguimiento.control_grupal ? this.seguimiento.control_grupal : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        },
        {
          label: "Fecha Control Enfermeria",
          body: this.seguimiento.control_enfermeria ? this.seguimiento.control_enfermeria : '-',
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
        }
      );
    },
  },
};
</script>

<style scoped>
</style>
