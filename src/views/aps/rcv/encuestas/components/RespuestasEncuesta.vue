<template>
  <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;">
    <v-expansion-panel>
      <v-expansion-panel-header class="py-1 pl-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon color="teal" large>fas fa-reply</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <h6 class="mb-0"></h6>
            </v-list-item-title>
            <v-list-item-title class="grey--text fs-12 fw-normal">
              <h4 class="ma-0">
                Respuestas
              </h4>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row no-gutters>
          <v-col cols="8" class="mx-auto">
            <v-list class="pa-2">
              <v-list-item @click="click = null">
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">¿Quien Responde la Encuesta?</v-list-item-subtitle>
                  <v-list-item-title>
                    <h6 class="pl-2 mb-0">{{ encuesta.acudiente && encuesta.acudiente.id ? 'Acudiente' : 'Paciente' }}</h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :class="`'v-list-item--three-line'`" @click="click = null">
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <p>¿Cual es su IPS de atención?</p>
                  </v-list-item-subtitle>
                  <template v-if="encuesta.ips_atencion">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal pt-0">
                      <span class="font-weight-bold">IPS:</span> {{ encuesta.ips_atencion.nombre + ' - ' + encuesta.ips_atencion.codigohabilitacion }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal pt-0">
                      <span class="font-weight-bold">Sede:</span> {{ encuesta.sede }}
                    </v-list-item-subtitle>
                  </template>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="click = null">
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <p>¿Ha consultado por urgencias debido a su enfermedad? <span :style="`color: ${encuesta.consulta_por_urgencias ? 'green' : 'red'}`">{{ encuesta.consulta_por_urgencias ? 'Si' : 'No' }}</span></p>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item :class="`'v-list-item--three-line'`" @click="click = null">
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                    <p>¿El paciente se encuentra hospitalizado? <span :style="`color: ${ encuesta.paciente_hospitalizado ? 'green' : 'red'}`">{{ encuesta.paciente_hospitalizado ? 'Si' : 'No' }}</span></p>
                  </v-list-item-subtitle>
                  <template v-if="encuesta.paciente_hospitalizado">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      IPS: {{ encuesta.prestador.nombre + ' - ' + encuesta.prestador.codigohabilitacion }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      Motivo Hospitalización: {{ encuesta.motivo_hospitalizacion }}
                    </v-list-item-subtitle>
                  </template>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line @click="click = null">
                <v-list-item-content class="pa-0">
                  <v-list-item-subtitle class="grey--text fs-12 fw-normal">1. ¿Usted presenta ALGUNO de los siguientes síntomas?</v-list-item-subtitle>
                  <v-list-item-title v-if="encuesta.sintomas && encuesta.sintomas.length">
                    <v-chip outlined label class="white text--black ma-1 mt-0" v-for="(sintoma, index) in encuesta.sintomas" :key="index">
                      {{sintoma.descripcion}}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    <h6 class="pl-2">No presenta ningun sintoma</h6>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <template v-if="encuesta.dispuesto">
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>¿Cuenta con Glucómetro en casa? <span :style="`color: ${color(encuesta.glucometro)}`">{{ encuesta.glucometro }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>¿Cuenta con Tensiómetro en casa? <span :style="`color: ${color(encuesta.tensiometro)}`">{{ encuesta.tensiometro }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item :class="`${encuesta.peso && encuesta.talla ? 'v-list-item--two-line' : ''}`" @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>2. ¿Conoce usted su peso y talla? <span :style="`color: ${encuesta.peso && encuesta.talla  ? 'green' : 'red'}`">{{ encuesta.peso && encuesta.talla ? 'Si' : 'No' }}</span></p>
                    </v-list-item-subtitle>
                    <template v-if="encuesta.peso && encuesta.talla">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        Peso: {{ encuesta.peso }}, Talla: {{ encuesta.talla }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item :class="`${encuesta.sistolica && encuesta.diastolica ? 'v-list-item--two-line' : ''} pt-1 pb-1`" @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>3. ¿Se ha tomado la tensión arterial el día de hoy? <span :style="`color: ${encuesta.sistolica && encuesta.diastolica  ? 'green' : 'red'}`">{{ encuesta.sistolica && encuesta.diastolica ? 'Si' : 'No' }}</span></p>
                    </v-list-item-subtitle>
                    <template v-if="encuesta.sistolica && encuesta.diastolica">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        Sistólica: {{ encuesta.sistolica }}, Diastólica: {{ encuesta.diastolica }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>4. ¿Realiza diariamente al menos 30 minutos de actividad física, en el trabajo y/o en el tiempo libre? <span :style="`color: ${color(encuesta.actividad_fisica)}`">{{ encuesta.actividad_fisica }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">5. ¿Con qué frecuencia come verduras o frutas?</v-list-item-subtitle>
                    <v-list-item-title>
                      <h6 class="pl-2 mb-0">{{ encuesta.frutas_verduras }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>6. ¿Toma medicación para la hipertensión regularmente? <span :style="`color: ${color(encuesta.medicacion_hta)}`">{{ encuesta.medicacion_hta }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p>7. ¿Le han encontrado alguna vez valores de azucar altos? <span :style="`color: ${color(encuesta.antecedente_glucosa)}`">{{ encuesta.antecedente_glucosa }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item :class="`${encuesta.familiares_diabetes !== 'No' ? 'v-list-item--two-line' : ''}`" @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">8. ¿Se le ha diagnosticado diabetes (tipo 1 o tipo 2) a alguno de sus familiares allegados u otros parientes? <span v-if="encuesta.familiares_diabetes === 'No'" :style="`color:${color(encuesta.familiares_diabetes)}`">{{encuesta.familiares_diabetes}}</span></v-list-item-subtitle>
                    <v-list-item-title v-if="encuesta.familiares_diabetes !== 'No'">
                      <h6 class="pl-2 mb-0">{{ encuesta.familiares_diabetes }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p class="mb-0">9. ¿Es usted diabetico? <span :style="`color: ${ color(encuesta.diabetes) }`">{{ encuesta.diabetes }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="encuesta.diabetes === 'Si'" @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">10. ¿Tipo diabetes?</v-list-item-subtitle>
                    <v-list-item-title>
                      <h6 class="pl-2 mb-0">{{ encuesta.tipo_diabetes }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p class="mb-0">11. ¿Fuma? <span :style="`color: ${color(encuesta.fumador)}`">{{ encuesta.fumador }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p class="mb-0">12. ¿Tiene diagnosticado ya una enfermedad cardiovascular (HTA-IAM-ACV-RENAL)? <span :style="`color: ${color(encuesta.diagnosticado_rcv)}`">{{ encuesta.diagnosticado_rcv }}</span></p>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal pt-2" v-if="encuesta.diagnosticado_rcv && encuesta.enfermedad_cv.length">
                      <p class="mb-0">¿Cuales?</p>
                    </v-list-item-subtitle>
                    <v-list-item-title v-if="encuesta.diagnosticado_rcv && encuesta.enfermedad_cv.length">
                      <v-chip outlined label class="white text--black ma-1 mt-0" v-for="(enfermedad, index) in encuesta.enfermedad_cv" :key="index">
                        {{ enfermedad !== 'Otro' ? enfermedad : encuesta.otra_enfermedad_cv }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">13. ¿Señor usuario cuando fue su ultima consulta por medicina general?  (Registrar e identificar riesgo)?</v-list-item-subtitle>
                    <v-list-item-title>
                      <h6 class="pl-2 mb-0">{{ encuesta.consulta_medicina_g }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">14. ¿Señor usuario cuando fue su última consulta por medicina especializada?</v-list-item-subtitle>
                    <v-list-item-title>
                      <h6 class="pl-2 mb-0">{{ encuesta.consulta_medicina_i }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!--15. ¿Qué especialidades?-->
                <v-list-item two-line @click="click = null" v-if="encuesta.consulta_medicina_i && encuesta.consulta_medicina_i !== 'No sabe'">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">15. ¿Qué especialidades?</v-list-item-subtitle>
                    <v-list-item-title class="pl-2" v-if="encuesta.especialidad && encuesta.especialidad.length">
                      <span style="font-size: 16px" v-for="(especialdad, index) in encuesta.especialidad" :key="index">
                        {{ especialdad !== 'Otra especialidad' ? especialdad + ', ' : encuesta.otra_especialidad }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-title v-else>
                      <h6 class="pl-2">No sabe</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">16. ¿Señor usuario cuando fue la ultima vez que le tomaron laboratorios clinicos?</v-list-item-subtitle>
                    <v-list-item-title>
                      <h6 class="pl-2 mb-0">{{ encuesta.laboratorios }}</h6>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <!--17. ¿Que examenes le tomaron?-->
                <v-list-item two-line @click="click = null" v-if="encuesta.laboratorios && encuesta.laboratorios !== 'No sabe'">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">17. ¿Que examenes le tomaron?</v-list-item-subtitle>
                    <v-list-item-title class="pl-2" v-if="encuesta.laboratorio && encuesta.laboratorio.length">
                      <span style="font-size: 16px" v-for="(laboratorio, index) in encuesta.laboratorio" :key="index">
                        {{ laboratorio !== 'Otro' ? laboratorio + ', ' : encuesta.otro_examen }}
                      </span>
                    </v-list-item-title>
                    <v-list-item-title v-else>
                      <span class="pl-2">No sabe</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = null">
                  <v-list-item-content class="pa-0">
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                      <p class="mb-0">18. ¿Señor usuario actualmente su medico tratante le ha formulado medicamentos para la HTA y/o DM? <span :style="`color: ${color(encuesta.formula_hta_dm)}`">{{ encuesta.formula_hta_dm }}</span></p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <template v-if="encuesta.formula_hta_dm === 'Si'">
                  <v-list-item class="pt-2 pb-2" @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">19. ¿Que tipo de medicamentos?</v-list-item-subtitle>
                      <v-list-item-title>
                        <template v-if="encuesta.medicamentos && encuesta.medicamentos.length">
                          <v-expansion-panel class="blue-grey lighten-5">
                            <v-expansion-panel-header class="pt-0 pb-0">
                              <p>Medicamentos</p>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                              <v-chip outlined label class="blue-grey lighten-5 ma-1 mt-0" v-for="(medicamento, index) in encuesta.medicamentos" :key="index">
                                <h6 class="mb-0">{{ medicamento.nombre }} ({{ medicamento.tipo }})</h6>
                              </v-chip>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </template>
                        <template v-else>
                          <v-list-item-title><h6 class="mb-0">Desconoce los tipos de medicamentos</h6></v-list-item-title>
                        </template>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        <p class="mb-0">20. ¿Cuenta con medicamentos actualmente? <span :style="`color: ${color(encuesta.tiene_medicamentos)}`">{{ encuesta.tiene_medicamentos }}</span></p>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">21. ¿Me puede indicar cuando fue la ultima entrega de medicamentos?</v-list-item-subtitle>
                      <v-list-item-title>
                        <h6 class=" pl-2 mb-0">{{ encuesta.entrega_medicamentos ? moment(encuesta.entrega_medicamentos).format('DD/MM/YYYY') : 'No sabe/No responde' }}</h6>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">22. ¿Me puede indicar para cuando tiene programada la próxima entrega de medicamentos?</v-list-item-subtitle>
                      <v-list-item-title>
                        <h6 class="pl-2 mb-0">{{ encuesta.proxima_entrega_medicamentos ? moment(encuesta.proxima_entrega_medicamentos).format('DD/MM/YYYY') : 'No sabe/No responde' }}</h6>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        <p>23. ¿Deja de tomar alguna vez los medicamentos para tratar su enfermedad? <span :style="`color: ${color(encuesta.interrumpe_tto)}`">{{ encuesta.interrumpe_tto }}</span></p>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        <p>24. ¿Toma los medicamentos a las horas indicadas? <span :style="`color: ${color(encuesta.a_tiempo_tto)}`">{{ encuesta.a_tiempo_tto }}</span></p>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        <p>25. Cuando se encuentra bien, ¿deja de tomar la medicación? <span :style="`color: ${color(encuesta.suspende_mejora_tto)}`">{{ encuesta.suspende_mejora_tto }}</span></p>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="click = null">
                    <v-list-item-content class="pa-0">
                      <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        <p>26. Si le cae mal un medicamento, ¿deja usted de tomarlo? <span :style="`color: ${color(encuesta.suspende_adverso_tto)}`">{{ encuesta.suspende_adverso_tto }}</span></p>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  export default {
    name: "RespuestasEncuesta",
    props: {
      encuesta: {
        type: Object,
        default: null
      },
      abierto: {
        type: Boolean,
        default: true
      },
    },
    data: () => ({
      panel: [],
      complementos: []
    }),
    watch: {
      abierto: {
        handler(val) {
          if (this) {
            this.panel = val ? [0] : []
          }
        },
        immediate: true
      }
    },
    methods: {
      color(answer){
        if(answer === 'Si'){
          return 'green'
        }else{
          return 'red'
        }
      }
    },
    created() {

    }
  }
</script>

<style scoped>

</style>