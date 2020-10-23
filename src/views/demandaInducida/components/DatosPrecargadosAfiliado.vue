<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <h4 class="ma-4">Informacion precargada</h4>
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
export default {
  name: 'DatosPersonalesdatosPrecargados',
  props: {
    datosPrecargados: {
      type: Object,
      default: null
    },
    edad: {
      type: Number,
      required: true
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
    datosPrecargados: {
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
          label: 'Fecha aplicacion influenza',
          body: this.datosPrecargados.fecha_aplicacion_influenza ? this.datosPrecargados.fecha_aplicacion_influenza : '-',
          icon: 'mdi-calendar-month',
          iconColor: 'warning',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Fecha aplicación DPT Acelular',
          body: this.datosPrecargados.fecha_aplicacion_dpt ? this.datosPrecargados.fecha_aplicacion_dpt : '-',
          icon: 'mdi-calendar-month',
          iconColor: 'primary',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Cronico',
          body: this.datosPrecargados.cronico ? this.datosPrecargados.cronico == 'X' ? 'Si' : 'No' : 'No',
          icon: 'mdi-cellphone-iphone',
          iconColor: 'info',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Materno perinatal',
          body: this.datosPrecargados.maternoperinatal ? this.datosPrecargados.maternoperinatal == 'X' ? 'Si' : 'No' : 'No',
          icon: 'mdi-cellphone-iphone',
          iconColor: 'info',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Alto costo',
          body: this.datosPrecargados.alto_costo ? this.datosPrecargados.alto_costo == 'X' ? 'Si' : 'No' : 'No',
          icon: 'mdi-cellphone-iphone',
          iconColor: 'info',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Inducir vacunacion influenza',
          body: this.datosPrecargados.inducir_vacunacion ? this.datosPrecargados.inducir_vacunacion == 'X' ? 'Si' : 'No' : 'No',
          icon: 'mdi-map-marker-radius',
          iconColor: 'blue',
          colmd: '6',
          collg: '4'
        },
        {
          label: 'Cronico Inasistente',
          body: this.datosPrecargados.cronico_inasistente ? this.datosPrecargados.cronico_inasistente == 'X' ? 'Si' : 'No' : 'No',
          icon: 'mdi-map-marker-radius',
          iconColor: 'blue',
          colmd: '6',
          collg: '4'
        }
      )
      if(this.edad >= 0 && this.edad <= 5){
        this.datos.push(
          {
            label: 'Inasistente vacunacion niños (0 - 5) años',
            body: this.datosPrecargados.niño_inasistente_vacuna ? this.datosPrecargados.niño_inasistente_vacuna == 'X' ? 'Si' : 'No' : 'No',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
        )
      }
      if(this.datosPrecargados.genero == 'F'){
        this.datos.push(
          {
            label: 'Gestante inasistente a control',
            body: this.datosPrecargados.gestante_inasistente_control ? this.datosPrecargados.gestante_inasistente_control == 'X' ? 'Si' : 'No' : 'No',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          },
          {
            label: 'Gestante inasistente a vacunacion',
            body: this.datosPrecargados.gestante_inasistente_vacuna ? this.datosPrecargados.gestante_inasistente_vacuna == 'X' ? 'Si' : 'No' : 'No',
            icon: 'mdi-map-marker-radius',
            iconColor: 'blue',
            colmd: '6',
            collg: '4'
          }
        )
      }
    }
  }
}
</script>

<style scoped>

</style>