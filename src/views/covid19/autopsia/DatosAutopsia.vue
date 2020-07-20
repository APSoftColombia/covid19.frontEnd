<template>
    <v-expansion-panels v-model="panel" multiple style="z-index: 0 !important;" flat>
        <v-expansion-panel>
            <v-expansion-panel-header>
                <span class="title">Datos de la Encuesta</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-divider class="ma-0"></v-divider>
                <v-row>
                    <v-col cols="12">
                        <v-list class="notification-wrap" subheader>
                            <template v-for="(item, index) in listItem">
                                <v-subheader :key="`item${index}`" v-if="item.subheader">{{item.subheader}}</v-subheader>
                                <v-list-item v-else @click="click = null" style="border-bottom: none !important;" :class="index%2 ? 'white' : 'grey lighten-4'" :key="`item${index}`">
                                    <v-list-item-content class="pa-0 py-1">
                                        <v-list-item-title v-if="item.resultado">
                                            <h6 class="mb-0 fw-normal">
                                                Resultado de la muestra:
                                                <span class="font-weight-bold" :class="(item.resultado === 'Positivo' ? 'error' : item.resultado === 'Negativo' ? 'success' : 'warning') + '--text'">{{item.resultado}}</span>
                                            </h6>
                                        </v-list-item-title>
                                        <v-list-item-title v-if="item.text"><h6 class="mb-0 fw-normal" v-html="item.text"></h6></v-list-item-title>
                                        <h6 v-if="item.p" class="mb-0 fw-normal">{{item.p}}</h6>
                                        <v-list-item-subtitle v-if="item.subtitle" class="primary--text fs-12 fw-normal">{{item.subtitle}}</v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="item.sintomas" class="primary--text fs-12 fw-normal">
                                            {{item.sintomas.length ? '' : 'Síntomas: '}}
                                            <template v-for="(chip, indexChip) in item.sintomas">
                                                <v-chip small label class="mr-2 mb-2 white--text" color="indigo" :key="`chip${indexChip}`">{{chip}}</v-chip>
                                            </template>
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="item.comorbilidades" class="primary--text fs-12 fw-normal">
                                            {{item.comorbilidades.length ? '' : 'Comorbilidades: '}}
                                            <template v-for="(chip, indexChip) in item.comorbilidades">
                                                <v-chip small label class="mr-2 mb-2 white--text" color="purple" :key="`chip${indexChip}`">{{chip}}</v-chip>
                                            </template>
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-avatar class="my-1 align-self-center white--text" size="36" v-if="item.value" :color="item.value === 'SI' ? 'green' : item.value === 'NO' ? 'error' : item.value === 'NS' ? 'orange' : ''">
                                        {{item.value}}
                                    </v-list-item-avatar>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-col>
                </v-row>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'DatosAutopsia',
        props: {
            autopsia: {
                type: Object,
                default: null
            }
        },
        data: () => ({
           listItem: [],
            click: null,
            panel: [0]
        }),
        computed: {
            ...mapGetters([
                'sintomasAutopsia',
                'resultadosPCR',
                'comorbAutopsias',
                'clasificacionesAutopsia',
                'causasExternas'
            ]),
            nombreCortoPaciente () {
                return this.autopsia && this.autopsia.fallecido ? [this.autopsia.fallecido.nombre1, this.autopsia.fallecido.apellido1].filter(x => x).join(' ') : ''
            }
        },
        watch: {
            autopsia: {
                handler (val) {
                    val && this.assign()
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            assign () {
                this.listItem = []
                this.listItem.push(
                    {
                        text: `¿Encuentra evidencia si ${this.nombreCortoPaciente} falleció por una lesión, accidente, caída u otra causa externa?`,
                        value: this.autopsia.es_causa_externa,
                        subtitle: this.autopsia.es_causa_externa === 'SI' ? `Causa Externa: ${this.causasExternas && this.autopsia.covid_causaexterna_id ? this.causasExternas.find(x => x.id === this.autopsia.covid_causaexterna_id).causa : ''}` : null
                    },
                    {
                        subheader: 'POSIBLES NEXOS EPIDEMIOLÓGICOS'
                    },
                    {
                        text: `¿Conoce si algún familiar y/o amigo cercano de ${this.nombreCortoPaciente} está o ha estado hospitalizado en el último mes por problemas respiratorios?`,
                        value: this.autopsia.cercano_hospitalizado
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} en las dos semanas previas a la muerte, tuvo contacto con una persona con diagnóstico confirmado de COVID-19 o que estuviese en espera de resultados?`,
                        value: this.autopsia.contacto_covid
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} en las dos semanas previas a la muerte tuvo contacto con personas en sitios donde se ha confirmado casos por COVID-19, tales como hospitales, mercados, u otros espacios con aglomeraciones?`,
                        value: this.autopsia.contacto_sitio_covid
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} o alguien de su núcleo familiar es profesional de la salud y ha realizado atención a pacientes en hospitales o clínicas?`,
                        value: this.autopsia.familiar_profesional_salud
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} compartía su habitación con más de una persona?`,
                        value: this.autopsia.habitacion_compartida
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} utilizaba transporte público habitualmente?`,
                        value: this.autopsia.transporte_publico
                    },
                    {
                        subheader: 'SIGNOS Y SÍNTOMAS'
                    },
                    {
                        text: `¿Durante los últimos 15 días antes de su muerte, ${this.nombreCortoPaciente} presentó alguno de los siguientes síntomas?`,
                        value: this.autopsia.presenta_sintomas,
                        sintomas: this.autopsia.presenta_sintomas === 'SI' ? this.autopsia.sintomas.map(x => x.descripcion) : []
                    },
                    {
                        text: `<strong>Otros Síntomas</strong>`,
                        p: this.autopsia.otro_sintoma
                    }
                )

                if (this.autopsia.fallecido && this.autopsia.fallecido.sexo === 'F' && this.autopsia.fallecido.edad && (this.autopsia.fallecido.edad >= 10 && this.autopsia.fallecido.edad <= 54)) {
                    this.listItem.push(
                        {
                            subheader: 'ANTECEDENTES OBSTÉTRICOS'
                        },
                        {
                            text: `¿${this.nombreCortoPaciente} estaba embarazada al momento de la muerte?`,
                            value: this.autopsia.embarazada
                        },
                        {
                            text: `¿${this.nombreCortoPaciente} falleció después de un parto o durante la dieta (puerperio)?`,
                            value: this.autopsia.puerperio
                        },
                        {
                            text: `¿${this.nombreCortoPaciente} falleció durante y/o después de un aborto?`,
                            value: this.autopsia.aborto
                        }
                    )
                }
                this.listItem.push(
                    {
                        subheader: 'COMORBILIDADES'
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} le habían diagnosticado alguna de las siguientes enfermedades o factores de riesgo?`,
                        value: this.autopsia.tenia_comorbilidades,
                        comorbilidades: this.autopsia.tenia_comorbilidades === 'SI' ? this.autopsia.comorbilidades.map(x => x.descripcion) : []
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} tomaba medicamentos inmunosupresores?`,
                        value: this.autopsia.inmunosupresores
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} fumaba?`,
                        value: this.autopsia.fumaba
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} tenía otros problemas de salud?`,
                        value: this.autopsia.tenia_otros_problemas_salud
                    }
                )

                if (this.autopsia.tenia_otros_problemas_salud === 'SI') {
                    this.listItem.push(
                        {
                            text: `<strong>Otros problemas de salud</strong>`,
                            p: this.autopsia.otros_problemas_salud
                        }
                    )
                }

                this.listItem.push(
                    {
                        subheader: 'ATENCIÓN MÉDICA'
                    },
                    {
                        text: `¿Conoce si ${this.nombreCortoPaciente} recibió atención médica durante los últimos 15 días?`,
                        value: this.autopsia.atencion_medica_reciente
                    },
                    {
                        text: `¿Conoce si a ${this.nombreCortoPaciente} le habían indicado aislamiento preventivo obligatorio?`,
                        value: this.autopsia.aislamiento_preventivo
                    },
                    {
                        text: `¿Conoce si a ${this.nombreCortoPaciente} le habían tomado algún examen?`,
                        value: this.autopsia.examen
                    },
                    {
                        subheader: 'VERIFICACIÓN'
                    },
                    {
                        text: `Había sido notificado como caso sospechoso de COVID a través del SIVIGILA`,
                        value: this.autopsia.reporte_sivigila
                    },
                    {
                        text: `Le tomaron muestra de hisopado faríngeo para RT/PCR-SARS-CoV-2`,
                        value: this.autopsia.pcr
                    }
                )
                if (this.autopsia.pcr === 'SI') {
                    this.listItem.push(
                        {
                            resultado: this.autopsia.resultado_pcr,
                            subtitle: `Fecha: ${this.autopsia.fecha_resultado ? this.moment(this.autopsia.fecha_resultado).format('DD/MM/YYYY') : ''}`
                        }
                    )
                }

                this.listItem.push(
                    {
                        text: `Le tomaron Radiografía de Tórax`,
                        value: this.autopsia.radiografia_torax
                    },
                    {
                        text: `¿Cuál es la clasificación final del caso?`,
                        subtitle: this.autopsia.clasificacion
                    },
                    {
                        subheader: 'EVALUACION DEL ENTREVISTADOR MEDICO / CERTIFICADOR'
                    },
                    {
                        text: `<strong>Según el informante (familiar o relacionado, autoridad, testigo): ¿cuál fue la causa de muerte?</strong>`,
                        p: this.autopsia.causa_segun_informante
                    },
                    {
                        text: `<strong>Resumen de síntomas, signos y antecedentes positivos más relevante</strong>`,
                        p: this.autopsia.resumen_sintomas
                    },
                    {
                        text: `<strong>Luego del análisis de información: ¿Cuál es la causa probable de muerte?</stron>`,
                        p: this.autopsia.causa_segun_analisis
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>