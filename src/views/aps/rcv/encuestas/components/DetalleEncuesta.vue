<template>
    <v-dialog
            v-model="dialog"
            max-width="920"
            persistent
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-clipboard-list</v-icon>
                <v-list-item-content class="pa-0">
                    <v-list-item-title class="mb-0"><h6 class="mb-0 title">{{encuesta && encuesta.id ? `Encuesta No. ${encuesta.id}` : `Encuesta`}}</h6></v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        {{encuesta.created_at ? moment(encuesta.created_at).format('DD/MM/YYYY HH:mm') : ''}}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row v-if="encuesta">
                  <template v-if="encuesta.sintomas.length > 1">
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
                        Buscar en la base de portabilidad. indicar: Señor usted por favor acerquese a la IPS más cercana.
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
                    <template v-if="encuesta.resultado.findrisc || encuesta.resultado.oms">
<!--                    FINDRISC & OMS-->
                      <v-col cols="12">
                        <v-subheader>Evalución riesgo cardiovascular (FINDRISC)</v-subheader>
                        <p class="mb-0">De acuerdo a las respuestas brindadas señor usuario me permito informar que se refleja un riesgo cardiovascular {{encuesta.resultado.findrisc.riesgo}}.</p>
                        {{encuesta.resultado.findrisc}}
                      </v-col>
                      <v-col cols="12">
                        <v-subheader>Evalución riesgo cardiovascular (OMS)</v-subheader>
                        <p class="mb-0">De acuerdo a las respuestas brindadas señor usuario me permito informar que se refleja un riesgo cardiovascular {{encuesta.resultado.oms.riesgo}}.</p>
                        {{encuesta.resultado.oms}}
                      </v-col>
                      <v-col cols="12" v-if="!['Bajo', 'Moderado'].find(x => x === encuesta.resultado.oms.riesgo) || !['Bajo', 'Moderado', 'Ligeramente elevado'].find(x => x === encuesta.resultado.findrisc.riesgo)">
                        <v-alert
                            border="top"
                            colored-border
                            type="info"
                            elevation="2"
                        >
                          De acuerdo a lo indicado se aignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permitame un momento le informamos el día y la hora de su cita.
                        </v-alert>
                      </v-col>
                    </template>
                    <template>
                      <!--                    Atención medica & laboratorios-->
                      <v-col cols="12">
                        <v-subheader>Evalución atención medica general: {{encuesta.consulta_medicina_g}}</v-subheader>
                        <v-alert
                            border="top"
                            colored-border
                            type="info"
                            elevation="2"
                        >
                          <p class="mb-0" v-if="encuesta.consulta_medicina_g === 'MENOR A 3 MESES'">De acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control el día XXXXX.</p>
                          <p class="mb-0" v-else>de acuerdo a lo indicado se aignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permitamen un momento le informamos el día y la hora de su cita.</p>
                        </v-alert>
                      </v-col>
                      <v-col cols="12">
                        <v-subheader>Evalución atención medica especializada: {{encuesta.consulta_medicina_i}}</v-subheader>
                        <v-alert
                            border="top"
                            colored-border
                            type="info"
                            elevation="2"
                        >
                          <p class="mb-0" v-if="encuesta.consulta_medicina_i === 'MENOR A 6 MESES'">De acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control el día XXXXX.</p>
                          <p class="mb-0" v-else>de acuerdo a lo indicado se aignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV. Permitamen un momento le informamos el día y la hora de su cita.</p>
                        </v-alert>
                      </v-col>
                      <v-col cols="12">
                        <v-subheader>Evalución toma de laboratorios: {{encuesta.laboratorios}}</v-subheader>
                        <v-alert
                            border="top"
                            colored-border
                            type="info"
                            elevation="2"
                        >
                          <p class="mb-0" v-if="encuesta.laboratorios === 'MENOR A 6 MESES'">de acuerdo a lo indicado por favor tener presente asistir de manera puntual a su control el día XXXXX y recordar la toma de sus laboratorios correspondiente. {{encuesta.diabetes === 'Si' ? 'recordar la toma d ela hemoglobina glicosilada.' : '' }}</p>
                          <p class="mb-0" v-else>De acuerdo a lo indicado se aignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV y toma de laboratorios correspondientes. Permitame un momento le informamos el día y la hora de su cita.</p>
                        </v-alert>
                      </v-col>
                    </template>
                    <template>
                      <!--                    Medicamentos-->
                      <template v-if="encuesta.formula_hta_dm === 'Si'">
                        <v-col cols="12">
                          <v-subheader>Evalución medicamentos</v-subheader>
                          <v-alert
                              border="top"
                              colored-border
                              type="info"
                              elevation="2"
                          >
                            <p class="mb-0">Verificar fecha de entrega, recordar la importancia de asistir puntualmente a la entrega y dejar registro para seguimento.</p>
                            <p class="mb-0" v-if="encuesta.tiene_medicamentos === 'Si'">de acuerdo a lo indicado se aignará una cita con su IPS primaria para iniciar proceso de retoma al programa de RCV y fromulación de medicamentos correspondientes. Permitame un momento le informamos el día y la hora de su cita.</p>
                          </v-alert>
                        </v-col>
                        <v-col cols="12" v-if="encuesta.resultado.morisky">
                          <v-subheader>Evaluación adherencia al tratamiento (Test Morisky Green): {{encuesta.resultado.morisky.riesgo}}</v-subheader>
                          {{encuesta.resultado.morisky}}
                          <v-alert
                              border="top"
                              colored-border
                              type="info"
                              elevation="2"
                          >
                            <p class="mb-0" v-if="encuesta.resultado.morisky.riesgo === 'Cumple'">Pasar a la fase de Recomendaciones y educación de acuerdo  a las repsuestas brindadas por el usuario.</p>
                            <p class="mb-0" v-else>de acuerdo a lo indicado se realizará visita domiciliaria por parte de la promotora de salud de su municipio para verificar el estado de sus medicamentos y acordar un sistema personalizado de dosificación. Permitame un momento le informamos el día y la hora de su cita.</p>
                          </v-alert>
                        </v-col>
                      </template>
                      <template v-else>
                        <p>Pasar a la fase de Recomendaciones y educación de acuerdo a las repsuestas brindadas por el usuario.</p>
                      </template>
                    </template>
                    <!--FINDRISC & OMS-->
                    <definicion1></definicion1>
                    <definicion2></definicion2>
                    <definicion3></definicion3>
                    <definicion4></definicion4>
<!--                    <recomendaciones></recomendaciones>-->
                    <semaforo-alimentacion></semaforo-alimentacion>
                  </template>
                  <template v-else>
                    <v-subheader>La encuesta no tiene resultados disponibles.</v-subheader>
                  </template>
                </v-row>
            </v-container>
          <v-divider class="pa-0 ma-0"></v-divider>
          <v-card-actions class="justify-center">
            <v-btn block text @click="close">Cerrar</v-btn>
          </v-card-actions>
          <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Definicion1 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion1'
    import Definicion2 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion2'
    import Definicion3 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion3'
    import Definicion4 from 'Views/aps/rcv/resultado/educacion/definiciones/Definicion4'
    // import Recomendaciones from 'Views/aps/rcv/resultado/educacion/Recomendaciones'
    import SemaforoAlimentacion from 'Views/aps/rcv/resultado/educacion/SemaforoAlimentacion'
    export default {
        name: 'DetalleEncuesta',
      components: {
        SemaforoAlimentacion,
        Definicion1,
        Definicion2,
        Definicion3,
        Definicion4
      },
        data: () => ({
            dialog: false,
            loading: false,
            click: null,
            encuesta: null
        }),
        computed: {
            ...mapGetters([
                'modelEncuestaRCV'
            ])
        },
        created() {
            this.encuesta = this.clone(this.modelEncuestaRCV)
        },
        methods: {
            open(item = null) {
                if (item && item.id) this.getencuesta(item.id)
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.encuesta = this.clone(this.modelEncuestaRCV)
            },
          getencuesta (idencuesta) {
            this.loading = true
            this.axios.get(`rcvs/${idencuesta}`)
                .then(response => {
                  console.log('response get encuesta', response)
                  this.encuesta = response.data
                  this.loading = false
                })
                .catch(error => {
                  this.loading = false
                  this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                })
          },
        }
    }
</script>

<style scoped>

</style>