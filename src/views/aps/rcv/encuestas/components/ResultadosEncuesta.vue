<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="teal" large>fas fa-poll-h</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <h6 class="mb-0">{{encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Encuesta`}}</h6>
            </v-list-item-title>
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                Resultados
              </h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row v-if="encuesta">
          <template v-if="encuesta.sintomas.length > 1 && !encuesta.dispuesto">
            <v-col cols="12">
              <v-alert
                  border="right"
                  colored-border
                  type="error"
                  elevation="2"
              >
                De acuerdo a su sintomatología debe brindar atención inmediata:
                <br/>
                <br/>
                <p class="mb-0 red--text">Anexo de IPS Urgencias  y atención domiciliaria según Municipio</p>
                <br/>
                No hay red:
                <br/>
                Buscar en la base de portabilidad. Indicar: Señor usted por favor acerquese a la IPS más cercana.
                <br/>
                <br/>
                SI EL USUARIO REFIERE QUE POR SU CONDICIÓN DE SALUD NO PUEDE DESPLAZARSE A URGENCIA: Recuerde antes de trasladar llamada al área de referencia y contrareferencia, evaluar pertinencia, si se detecta que el usuario se encuentra inestable validar si requiere ambulancia.
                <br/>
                Educación y recomendaciones:
                <br/>
                - Cuidados en el Desplazamiento.
              </v-alert>
            </v-col>
          </template>
          <template v-else-if="encuesta.resultado">
            <template v-if="encuesta.resultado.findrisc && encuesta.resultado.oms">
              <!--                    FINDRISC & OMS-->
              <v-col cols="12">
                <v-list two-line class="notification-wrap">
                  <v-list-item
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1" :size="60">
                      <v-icon large :color="encuesta.resultado.findrisc.rgb_riesgo">mdi-alert</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        Evalución riesgo cardiovascular (FINDRISC)
                        <v-chip
                            class="ml-2"
                            small
                            :color="encuesta.resultado.findrisc.rgb_riesgo"
                            label
                            text-color="white"
                        >
                          {{encuesta.resultado.findrisc.porcentaje_findrisc}}
                        </v-chip>
                      </v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0 text-justify">De acuerdo a las respuestas brindadas señor usuario me permito informar que se refleja un riesgo cardiovascular <strong>{{(encuesta.resultado.findrisc.riesgo).toUpperCase()}}</strong>.</h6></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12">
                <v-list two-line class="notification-wrap">
                  <v-list-item
                      style="border-bottom: none !important;"
                      @click="click = null"
                  >
                    <v-list-item-avatar class="my-1" :size="60">
                      <v-icon large :color="encuesta.resultado.oms.rgb_riesgo">mdi-alert</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        Evalución riesgo cardiovascular (OMS)
                        <v-chip
                            class="ml-2"
                            small
                            :color="encuesta.resultado.oms.rgb_riesgo"
                            label
                            text-color="white"
                        >
                          {{encuesta.resultado.oms.porcentaje_rxoms}}
                        </v-chip>
                      </v-list-item-subtitle>
                      <v-list-item-title><h6 class="mb-0 text-justify">De acuerdo a las respuestas brindadas señor usuario me permito informar que se refleja un riesgo cardiovascular <strong>{{(encuesta.resultado.oms.riesgo).toUpperCase()}}</strong>.</h6></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" v-if="!['Bajo', 'Moderado'].find(x => x === encuesta.resultado.oms.riesgo) || !['Bajo', 'Moderado', 'Ligeramente elevado'].find(x => x === encuesta.resultado.findrisc.riesgo)">
                <v-alert
                    border="left"
                    colored-border
                    icon="mdi-information"
                    color="light-blue"
                    elevation="2"
                >
                  De acuerdo a lo indicado se asignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permítame un momento le informamos el día y la hora de su cita.
                </v-alert>
              </v-col>
            </template>
            <template>
              <!--                    Atención medica & laboratorios-->
              <v-col cols="12">
                <v-subheader class="font-weight-bold">Evalución atención medica general: {{encuesta.consulta_medicina_g}}</v-subheader>
                <v-alert
                    border="left"
                    colored-border
                    icon="mdi-information"
                    color="light-blue"
                    elevation="2"
                >
                  <p class="mb-0" v-if="encuesta.consulta_medicina_g === 'MENOR A 3 MESES'">De acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control.</p>
                  <p class="mb-0" v-else>de acuerdo a lo indicado se asignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permítame un momento le informamos el día y la hora de su cita.</p>
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-subheader class="font-weight-bold">Evalución atención medica especializada: {{encuesta.consulta_medicina_i}}</v-subheader>
                <v-alert
                    border="left"
                    colored-border
                    icon="mdi-information"
                    color="light-blue"
                    elevation="2"
                >
                  <p class="mb-0" v-if="encuesta.consulta_medicina_i === 'MENOR A 6 MESES'">De acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control.</p>
                  <p class="mb-0" v-else>de acuerdo a lo indicado se asignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permítame un momento le informamos el día y la hora de su cita.</p>
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-subheader class="font-weight-bold">Evalución toma de laboratorios: {{encuesta.laboratorios}}</v-subheader>
                <v-alert
                    border="left"
                    colored-border
                    icon="mdi-information"
                    color="light-blue"
                    elevation="2"
                >
                  <p class="mb-0" v-if="encuesta.laboratorios === 'MENOR A 6 MESES'">de acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control y recordar la toma de sus laboratorios correspondiente. {{encuesta.diabetes === 'Si' ? 'recordar la toma d ela hemoglobina glicosilada.' : '' }}</p>
                  <p class="mb-0" v-else>De acuerdo a lo indicado se asignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV y toma de laboratorios correspondientes. Permítame un momento le informamos el día y la hora de su cita.</p>
                </v-alert>
              </v-col>
            </template>
            <template>
              <!--                    Medicamentos-->
              <template v-if="encuesta.formula_hta_dm === 'Si'">
                <v-col cols="12">
                  <v-subheader class="font-weight-bold">Evalución medicamentos</v-subheader>
                  <v-alert
                      border="left"
                      colored-border
                      icon="mdi-information"
                      color="light-blue"
                      elevation="2"
                  >
                    <p class="mb-0">Verificar fecha de entrega, recordar la importancia de asistir puntualmente a la entrega y dejar registro para seguimento.</p>
                    <p class="mb-0" v-if="encuesta.tiene_medicamentos === 'Si'">de acuerdo a lo indicado se asignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV y fromulación de medicamentos correspondientes. Permítame un momento le informamos el día y la hora de su cita.</p>
                  </v-alert>
                </v-col>
                <v-col cols="12" v-if="encuesta.resultado.morisky">
                  <v-list two-line class="notification-wrap mb-3">
                    <v-list-item
                        style="border-bottom: none !important;"
                        @click="click = null"
                    >
                      <v-list-item-avatar class="my-1" :size="60">
                        <v-icon large :color="encuesta.resultado.morisky.rgb_riesgo">mdi-alert</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                          Evaluación adherencia al tratamiento (Test Morisky Green)
                        </v-list-item-subtitle>
                        <v-list-item-title><h6 class="mb-0 text-justify">{{encuesta.resultado.morisky.riesgo !== 'Indeterminado' ? 'El Paciente' : '' }} <strong>{{(encuesta.resultado.morisky.riesgo).toUpperCase()}}</strong>.</h6></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-alert
                      v-if="encuesta.resultado.morisky.riesgo !== 'Cumple'"
                      border="left"
                      colored-border
                      icon="mdi-information"
                      color="light-blue"
                      elevation="2"
                  >
                    <!--                            <p class="mb-0" v-if="encuesta.resultado.morisky.riesgo === 'Cumple'">Pasar a la fase de Recomendaciones y educación de acuerdo  a las repsuestas brindadas por el usuario.</p>-->
                    <p class="mb-0">de acuerdo a lo indicado se realizará visita domiciliaria por parte de la promotora de salud de su municipio para verificar el estado de sus medicamentos y acordar un sistema personalizado de dosificación. Permítame un momento le informamos el día y la hora de su cita.</p>
                  </v-alert>
                </v-col>
              </template>
              <!--                      <template v-else>-->
              <!--                        <p>Pasar a la fase de Recomendaciones y educación de acuerdo a las repsuestas brindadas por el usuario.</p>-->
              <!--                      </template>-->
            </template>
            <!--Educación-->
            <template v-if="encuesta.resultado.oms && encuesta.resultado.oms.riesgo !== 'Indeterminado'">
              <definicion1 v-if="encuesta.resultado.oms.riesgo === 'Bajo'"></definicion1>
              <definicion2 v-if="encuesta.resultado.oms.riesgo === 'Moderado'"></definicion2>
              <definicion3 v-if="encuesta.resultado.oms.riesgo === 'Alto'"></definicion3>
              <definicion4 v-if="encuesta.resultado.oms.riesgo === 'Muy alto' || encuesta.resultado.oms.riesgo === 'Crítico'"></definicion4>
            </template>
            <recomendaciones-diabeticos v-if="encuesta.diabetes === 'Si'"></recomendaciones-diabeticos>
            <recomendaciones></recomendaciones>
            <semaforo-alimentacion></semaforo-alimentacion>
          </template>
          <template v-else>
            <v-subheader>La encuesta no tiene resultados disponibles.</v-subheader>
          </template>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
    import Definicion1 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion1'
    import Definicion2 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion2'
    import Definicion3 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion3'
    import Definicion4 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion4'
    import Recomendaciones from 'Views/aps/rcv/resultado/educacion/Recomendaciones'
    import RecomendacionesDiabeticos from 'Views/aps/rcv/resultado/educacion/RecomendacionesDiabeticos'
    import SemaforoAlimentacion from 'Views/aps/rcv/resultado/educacion/SemaforoAlimentacion'
  export default {
    name: "ResultadosEncuesta",
    props: {
      encuesta: {
        type: Object,
        default: null
      }
    },
    data: () => ({
      panel: [0]
    }),
    components: {
      Recomendaciones,
        RecomendacionesDiabeticos,
        SemaforoAlimentacion,
        Definicion1,
        Definicion2,
        Definicion3,
        Definicion4
    },
    watch: {
      abierto: {
        handler(val) {
          if (this) {
            this.panel = val ? [0] : []
          }
        },
        immediate: true
      },
    }
  }
</script>

<style scoped>

</style>