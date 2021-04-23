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
          label: "IPS del seguimiento",
          body: this.seguimiento.ips_seguimiento
            ? this.seguimiento.ips_seguimiento.nombre
            : "",
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
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
          icon: "mdi mdi-calendar-range",
          iconColor: "red",
          colmd: "4",
          collg: "4",
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
