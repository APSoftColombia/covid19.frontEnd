<template>
  <v-list-item class="pa-0" v-if="diasUltimaCita">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          :color=colorIconCita
          dark
          v-bind="attrs"
          v-on="on"
        >
          mdi-stethoscope
        </v-icon>
      </template>
      <span>Dias proxima cita: {{ diasUltimaCita }}</span>
    </v-tooltip>

    <v-tooltip top v-if="diasUltimoLab">
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          class="ml-2"
          :color=colorIconLab
          dark
          v-bind="attrs"
          v-on="on"
        >
          mdi-hospital-building
        </v-icon>
      </template>
      <span>Dias proximo Lab: {{ diasUltimoLab }}</span>
    </v-tooltip>
  </v-list-item>
</template>

<script>
    export default {
        name: 'AlertaSeguimiento',
        props: {
            fecha_ultima_cita: {
              required: true,
            },
            fecha_ultimo_lab: {
              required: true,
            },
            periodicidad_cita: {
              required: true,
              default: 0
            },
            periodicidad_lab: {
              required: true,
              default: 0
            }
        },
        data: () => ({
        }),
        computed: {
          colorIconCita() {
            return this.diasUltimaCita > 3 && this.diasUltimaCita <=6 ? "warning" : this.diasUltimaCita <= 3 ? "error" : "success";
          },
          diasUltimaCita() {
              if (this.moment(this.fecha_ultima_cita).isValid()) {
                let currentDate = this.moment();
                var futureMonth = this.moment(this.fecha_ultima_cita).add(this.periodicidad_cita, 'M');
                var futureMonthEnd = this.moment(futureMonth).endOf('month');

                if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                    futureMonth = futureMonth.add(1, 'd');
                }
                let days = futureMonth.diff(currentDate, 'days');
                return days;
              }else {
                return null;
              }
          },
          colorIconLab() {
            return this.diasUltimoLab > 3 && this.diasUltimoLab <=6 ? "warning" : this.diasUltimoLab <= 3 ? "error" : "success";
          },
          diasUltimoLab() {
              if (this.moment(this.fecha_ultimo_lab).isValid()) {
                let currentDate = this.moment();
                var futureMonth = this.moment(this.fecha_ultimo_lab).add(this.periodicidad_lab, 'M');
                var futureMonthEnd = this.moment(futureMonth).endOf('month');

                if(currentDate.date() != futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
                    futureMonth = futureMonth.add(1, 'd');
                }
                let days = futureMonth.diff(currentDate, 'days');
                return days;
              }else {
                return null;
              }
          }
        }
    }
</script>

<style scoped>

</style>