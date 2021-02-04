<template>
    <v-dialog
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <icon-base
                        class="mr-2"
                        width="30"
                        height="30"
                        view-box="0 0 528.000000 518.000000"
                        icon-name="autopsia"
                >
                    <autopsia
                            fill="#FFFFFF"
                            translatex="-100.00000"
                            translatey="510.00000"
                    ></autopsia>
                </icon-base>
                <v-toolbar-title>{{autopsia && autopsia.id ? `Autopsia No. ${autopsia.id}` : `Nueva Autopsia`}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row no-gutters>
                    <ValidationObserver ref="formAutopsia" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                        <v-col md="6" offset-md="3">
                            <v-row>
                                <v-col cols="12">
                                    <v-list two-line class="notification-wrap">
                                        <v-list-item @click="click = null" style="border-bottom: none !important;">
                                            <v-list-item-avatar size="48" class="my-1 align-self-center">
                                                <v-icon color="info">mdi-tag-text</v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content class="pa-0">
                                                <template v-if="autopsia.fallecido">
                                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Fallecido</v-list-item-subtitle>
                                                    <v-list-item-title>
                                                        <h6 class="mb-0">
                                                            {{nombrePaciente}}
                                                        </h6>
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle class="grey--text fw-normal">
                                                        {{tiposDocumentoIdentidad && autopsia.fallecido.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === autopsia.fallecido.tipo_identificacion).tipo : ''}} {{autopsia.fallecido.identificacion}}
                                                    </v-list-item-subtitle>
                                                </template>
                                                <v-list-item-title v-else class="grey--text">
                                                    <h4 class="mb-0">Datos Fallecido</h4>
                                                    <v-list-item-subtitle v-if="okFallecido === 0" class="error--text fs-12 fw-normal">Es necesario agregar datos del fallecido</v-list-item-subtitle>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <registro-fallecido :fallecido="autopsia.fallecido" @guardar="val => autopsia.fallecido = val"></registro-fallecido>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-list-item @click="click = null" style="border-bottom: none !important;">
                                            <v-list-item-avatar size="48" class="my-1 align-self-center">
                                                <v-icon color="warning">mdi-account-voice</v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content class="pa-0">
                                                <template v-if="autopsia.encuestado">
                                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Informante</v-list-item-subtitle>
                                                    <v-list-item-title>
                                                        <h6 class="mb-0">
                                                            {{[autopsia.encuestado.nombre1, autopsia.encuestado.nombre2, autopsia.encuestado.apellido1, autopsia.encuestado.apellido2].filter(x => x).join(' ')}}
                                                        </h6>
                                                    </v-list-item-title>
                                                    <v-list-item-subtitle class="grey--text fw-normal">
                                                        {{tiposDocumentoIdentidad && autopsia.encuestado.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === autopsia.encuestado.tipo_identificacion).tipo : ''}} {{autopsia.encuestado.identificacion}}
                                                    </v-list-item-subtitle>
                                                </template>
                                                <v-list-item-title v-else class="grey--text">
                                                    <h4 class="mb-0">Datos Informante</h4>
                                                    <v-list-item-subtitle v-if="okEncuestado === 0" class="error--text fs-12 fw-normal">Es necesario agregar datos del informante</v-list-item-subtitle>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <registro-encuestado :encuestado="autopsia.encuestado" @guardar="val => autopsia.encuestado = val"></registro-encuestado>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
<!--                                <template v-if="autopsia && autopsia.fallecido && autopsia.encuestado">-->
                                <template>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.es_causa_externa"
                                                        :label="`¿Encuentra evidencia si ${nombreCortoPaciente} falleció por una lesión, accidente, caída u otra causa externa?`"
                                                        rules="required"
                                                        name="riesgo de procedencia"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" v-if="autopsia.es_causa_externa === 'SI'">
                                        <c-select-complete
                                                v-model="autopsia.covid_causaexterna_id"
                                                label="Causa Externa"
                                                rules="required"
                                                name="causa externa"
                                                    :items="causasExternas"
                                                item-text="causa"
                                                item-value="id"
                                        >
                                        </c-select-complete>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">POSIBLES NEXOS EPIDEMIOLÓGICOS</span>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.cercano_hospitalizado"
                                                        :label="`¿Conoce si algún familiar y/o amigo cercano de ${nombreCortoPaciente} está o ha estado hospitalizado en el último mes por problemas respiratorios?`"
                                                        rules="required"
                                                        name="persona cercana hospitalizada"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.contacto_covid"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} en las dos semanas previas a la muerte, tuvo contacto con una persona con diagnóstico confirmado de COVID-19 o que estuviese en espera de resultados?`"
                                                        rules="required"
                                                        name="contacto con persona diagnónticada"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.contacto_sitio_covid"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} en las dos semanas previas a la muerte tuvo contacto con personas en sitios donde se ha confirmado casos por COVID-19, tales como hospitales, mercados, u otros espacios con aglomeraciones?`"
                                                        rules="required"
                                                        name="contacto en sitios con casos confirmados"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.familiar_profesional_salud"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} o alguien de su núcleo familiar es profesional de la salud y ha realizado atención a pacientes en hospitales o clínicas?`"
                                                        rules="required"
                                                        name="familiar profesional de la salud"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.habitacion_compartida"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} compartía su habitación con más de una persona?`"
                                                        rules="required"
                                                        name="compartía su habitación"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.transporte_publico"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} utilizaba transporte público habitualmente?`"
                                                        rules="required"
                                                        name="utilizaba transporte público"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">SIGNOS Y SÍNTOMAS</span>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.presenta_sintomas"
                                                        :label="`¿Durante los últimos 15 días antes de su muerte, ${nombreCortoPaciente} presentó alguno de los siguientes síntomas?`"
                                                        rules="required"
                                                        name="presentaba síntomas"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                        :column="!$vuetify.breakpoint.smAndUp"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                            <v-card-text>
                                                <c-check
                                                        v-model="autopsia.sintomas"
                                                        label="SÍNTOMAS"
                                                        rules="required"
                                                        name="síntomas"
                                                        :items="sintomasAutopsia"
                                                        item-text="descripcion"
                                                        item-value="id"
                                                        :disabled="autopsia.presenta_sintomas !== 'SI'"
                                                >
                                                </c-check>
                                            </v-card-text>
                                            <v-card-text>
                                                <c-text-area
                                                        v-model="autopsia.otro_sintoma"
                                                        label="Otros Síntomas"
                                                        rows="1"
                                                >
                                                </c-text-area>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <template v-if="autopsia.fallecido && autopsia.fallecido.sexo === 'F' && autopsia.fallecido.edad && (autopsia.fallecido.edad >= 10 && autopsia.fallecido.edad <= 54)">
                                        <v-col cols="12" class="pb-0">
                                            <span class="title">ANTECEDENTES OBSTÉTRICOS</span>
                                        </v-col>
                                        <v-col cols="12" class="pb-0">
                                            <v-card outlined tile>
                                                <v-card-text>
                                                    <c-radio
                                                            v-model="autopsia.embarazada"
                                                            :label="`¿${nombreCortoPaciente} estaba embarazada al momento de la muerte?`"
                                                            rules="required"
                                                            name="estaba embarazada"
                                                            :items="siNoNs"
                                                            item-text="text"
                                                            item-value="value"
                                                    >
                                                    </c-radio>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" class="pb-0">
                                            <v-card outlined tile>
                                                <v-card-text>
                                                    <c-radio
                                                            v-model="autopsia.puerperio"
                                                            :label="`¿${nombreCortoPaciente} falleció después de un parto o durante la dieta (puerperio)?`"
                                                            rules="required"
                                                            name="durante el puerperio"
                                                            :items="siNoNs"
                                                            item-text="text"
                                                            item-value="value"
                                                    >
                                                    </c-radio>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-card outlined tile>
                                                <v-card-text>
                                                    <c-radio
                                                            v-model="autopsia.aborto"
                                                            :label="`¿${nombreCortoPaciente} falleció durante y/o después de un aborto?`"
                                                            rules="required"
                                                            name="durante y/o después de un aborto"
                                                            :items="siNoNs"
                                                            item-text="text"
                                                            item-value="value"
                                                    >
                                                    </c-radio>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </template>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">COMORBILIDADES</span>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.tenia_comorbilidades"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} le habían diagnosticado alguna de las siguientes enfermedades o factores de riesgo?`"
                                                        rules="required"
                                                        name="presentaba enfermedades o factores de riesgo"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                        :column="!$vuetify.breakpoint.smAndUp"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                            <v-card-text>
                                                <c-check
                                                        v-model="autopsia.comorbilidades"
                                                        label="Enfermedades"
                                                        rules="required"
                                                        name="enfermedades"
                                                        :items="comorbAutopsias"
                                                        item-text="descripcion"
                                                        item-value="id"
                                                        :disabled="autopsia.tenia_comorbilidades !== 'SI'"
                                                >
                                                </c-check>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.inmunosupresores"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} tomaba medicamentos inmunosupresores?`"
                                                        rules="required"
                                                        name="tomaba inmunosupresores"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.fumaba"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} fumaba?`"
                                                        rules="required"
                                                        name="fumaba"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" :class="autopsia.tenia_otros_problemas_salud === 'SI' ? 'pb-0' : ''">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.tenia_otros_problemas_salud"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} tenía otros problemas de salud?`"
                                                        rules="required"
                                                        name="tenía otros problemas de salud"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" v-if="autopsia.tenia_otros_problemas_salud === 'SI'">
                                        <c-text-area
                                                v-model="autopsia.otros_problemas_salud"
                                                label="Otros problemas de salud"
                                                rows="1"
                                                rules="required"
                                                name="otros problemas de salud"
                                        >
                                        </c-text-area>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">ATENCIÓN MÉDICA</span>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.atencion_medica_reciente"
                                                        :label="`¿Conoce si ${nombreCortoPaciente} recibió atención médica durante los últimos 15 días?`"
                                                        rules="required"
                                                        name="atención médica reciente"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.aislamiento_preventivo"
                                                        :label="`¿Conoce si a ${nombreCortoPaciente} le habían indicado aislamiento preventivo obligatorio?`"
                                                        rules="required"
                                                        name="aislamiento preventivo"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.examen"
                                                        :label="`¿Conoce si a ${nombreCortoPaciente} le habían tomado algún examen?`"
                                                        rules="required"
                                                        name="le habían tomado algún examen"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">VERIFICACIÓN</span>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.reporte_sivigila"
                                                        :label="`Había sido notificado como caso sospechoso de COVID a través del SIVIGILA`"
                                                        rules="required"
                                                        name="reporte de SIVIGILA"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.pcr"
                                                        :label="`Le tomaron muestra de hisopado faríngeo para RT/PCR-SARS-CoV-2`"
                                                        rules="required"
                                                        name="le tomaron muestra PCR"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <template v-if="autopsia.pcr === 'SI'">
                                        <v-col cols="12" class="pb-0">
                                            <v-card outlined tile>
                                                <v-card-text>
                                                    <c-radio
                                                            v-model="autopsia.resultado_pcr"
                                                            :label="`Resultado de muestra PCR`"
                                                            rules="required"
                                                            name="resultado de muestra PCR"
                                                            :items="resultadosPCR.map(x => {return {text: x, value: x}})"
                                                            item-text="text"
                                                            item-value="value"
                                                    >
                                                    </c-radio>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" class="pb-0">
                                            <c-date
                                                    v-model="autopsia.fecha_resultado"
                                                    rules="required"
                                                    label="Fecha de Resultado Muestra PCR"
                                                    name="fecha de resultado muestra PCR"
                                                    :max="moment().format('YYYY-MM-DD')"
                                            >
                                            </c-date>
                                        </v-col>
                                    </template>
                                    <v-col cols="12" class="pb-0">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.radiografia_torax"
                                                        :label="`Le tomaron Radiografía de Tórax`"
                                                        rules="required"
                                                        name="radiografía de tórax"
                                                        :items="siNoNs"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-card outlined tile>
                                            <v-card-text>
                                                <c-radio
                                                        v-model="autopsia.clasificacion"
                                                        :label="`¿Cuál es la clasificación final del caso?`"
                                                        rules="required"
                                                        name="clasificación del caso"
                                                        :items="clasificacionesAutopsia.map(x => {return {text: x, value: x}})"
                                                        item-text="text"
                                                        item-value="value"
                                                >
                                                </c-radio>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <span class="title">EVALUACION DEL ENTREVISTADOR MEDICO / CERTIFICADOR</span>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Según el informante (familiar o relacionado, autoridad, testigo): ¿cuál fue la causa de muerte?</v-label>
                                        <c-text-area
                                                v-model="autopsia.causa_segun_informante"
                                                placeholder="Según el informante (familiar o relacionado, autoridad, testigo): ¿cuál fue la causa de muerte?"
                                                rules="required"
                                                name="causas segun el informante"
                                        >
                                        </c-text-area>
                                    </v-col>
                                    <v-col class="pb-0" cols="12">
                                        <v-label>Resumen de síntomas, signos y antecedentes positivos más relevante</v-label>
                                        <c-text-area
                                                v-model="autopsia.resumen_sintomas"
                                                placeholder="Resumen de síntomas, signos y antecedentes positivos más relevante"
                                                rules="required"
                                                name="resumen de síntomas, signos y antecedentes"
                                        >
                                        </c-text-area>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-label>Luego del análisis de información: ¿Cuál es la causa probable de muerte?</v-label>
                                        <c-text-area
                                                v-model="autopsia.causa_segun_analisis"
                                                placeholder="Luego del análisis de información: ¿Cuál es la causa probable de muerte?"
                                                rules="required"
                                                name="causas de acuerdo al análisis"
                                        >
                                        </c-text-area>
                                    </v-col>
                                    <v-col class="pb-0" cols="12" sm="12">
                                        <v-file-input
                                                v-model="autopsia.archivo"
                                                :hint="autopsia.path_autopsia && !autopsia.archivo ? `Cargado actualmente: ${autopsia.path_autopsia.split('/')[1]}` : ''"
                                                label="Certificado de Defunción"
                                                prepend-icon="mdi-file-pdf"
                                                accept=".pdf"
                                                outlined
                                                dense
                                                persistent-hint
                                                :truncate-length="$vuetify.breakpoint.xsOnly ? 22 : 44"
                                        ></v-file-input>
                                    </v-col>
                                </template>
                            </v-row>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                    large
                                    @click.stop="close"
                            >
                                <v-icon>mdi-close</v-icon>
                                Cerrar
                            </v-btn>
                            <v-spacer></v-spacer>
                            <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                            <v-btn
                                    large
                                    color="primary"
                                    @click.stop="guardarAutopsia"
                            >
                                <v-icon left>fas fa-save</v-icon>
                                Guardar Autopsia
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                    </ValidationObserver>
                </v-row>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    const RegistroFallecido = () => import('./registroAutopsia/RegistroFallecido')
    const RegistroEncuestado = () => import('./registroAutopsia/RegistroEncuestado')
    export default {
        name: 'RegistroAutopsia',
        components: {
            RegistroFallecido,
            RegistroEncuestado
        },
        data: () => ({
            click: null,
            loading: false,
            dialog: false,
            autopsia: null,
            okFallecido: null,
            okEncuestado: null,
            siNoNs: [{value: 'SI', text: 'SI'}, {value: 'NO', text: 'NO'}, {value: 'NS', text: 'NS'}]
        }),
        computed: {
            ...mapGetters([
                'modelAutopsia',
                'sintomasAutopsia',
                'resultadosPCR',
                'comorbAutopsias',
                'clasificacionesAutopsia',
                'causasExternas',
                'tiposDocumentoIdentidad'
            ]),
            nombrePaciente () {
                return this.autopsia && this.autopsia.fallecido ? [this.autopsia.fallecido.nombre1, this.autopsia.fallecido.nombre2, this.autopsia.fallecido.apellido1, this.autopsia.fallecido.apellido2].filter(x => x).join(' ') : ''
            },
            nombreCortoPaciente () {
                return this.autopsia && this.autopsia.fallecido ? [this.autopsia.fallecido.nombre1, this.autopsia.fallecido.apellido1].filter(x => x).join(' ') : ''
            }
        },
        watch: {
          'autopsia.fallecido': {
              handler (val) {
                  val && (this.okFallecido = 1)
              },
              immediate: false
          },
            'autopsia.encuestado': {
                handler (val) {
                    val && (this.okEncuestado = 1)
                },
                immediate: false
            },
            'autopsia.pcr': {
              handler (val) {
                  if (val && (['NO', 'NS'].find(x => x === val))) {
                      this.autopsia.resultado_pcr = null
                      this.autopsia.fecha_resultado = null
                  }
              },
              immediate: false
          },
            'autopsia.tenia_otros_problemas_salud': {
              handler (val) {
                  if (val && (['NO', 'NS'].find(x => x === val))) {
                      this.autopsia.otros_problemas_salud = null
                  }
              },
              immediate: false
          },
            'autopsia.tenia_comorbilidades': {
              handler (val) {
                  if (val && (['NO', 'NS'].find(x => x === val))) {
                      this.autopsia.comorbilidades = []
                  }
              },
              immediate: false
          },
            'autopsia.presenta_sintomas': {
              handler (val) {
                  if (val && (['NO', 'NS'].find(x => x === val))) {
                      this.autopsia.sintomas = []
                  }
              },
              immediate: false
          },
            'autopsia.es_causa_externa': {
              handler (val) {
                  val && (['NO', 'NS'].find(x => x === val)) && (this.autopsia.covid_causaexterna_id = null)
              },
              immediate: false
          }
        },
        created() {
            this.autopsia = this.clone(this.modelAutopsia)
        },
        methods: {
            guardarAutopsia () {
                if (this.autopsia.fallecido && this.autopsia.encuestado) {
                    this.$refs.formAutopsia.validate().then(result => {
                        if (result) {
                            this.loading = true
                            let data = new FormData()
                            for (const prop in this.autopsia) {
                                if (this.autopsia[prop] !== null && typeof this.autopsia.archivo !== 'undefined') {
                                  if (prop === 'fallecido' || prop === 'encuestado') {
                                    data.append(`${prop}`, JSON.stringify(this.autopsia[prop]))
                                  } else {
                                    data.append(`${prop}`, this.autopsia[prop])
                                  }
                                }
                            }
                            let request = this.autopsia.id
                                ? this.axios.post(`autopsias/${this.autopsia.id}`, data)
                                : this.axios.post(`autopsias`, data)
                            request
                                .then(response => {
                                    this.$emit('guardado', response.data)
                                    this.$store.commit('snackbar', {color: 'success', message: `La autopsia se guardo correctamente.`})
                                    this.close()
                                })
                                .catch(error => {
                                    this.loading = false
                                    this.$store.commit('snackbar', {color: 'error', message: `al guardar la autopsia.`, error: error})
                                })
                        }
                    })
                } else {
                    this.$refs.formAutopsia.validate()
                    this.okFallecido = this.autopsia.fallecido ? 1 : 0
                    this.okEncuestado = this.autopsia.encuestado ? 1 : 0
                }
            },
            open (idAutopsia = null) {
                if (idAutopsia) this.getAutopsia(idAutopsia)
                this.dialog = true
            },
            close () {
                this.$refs.formAutopsia.reset()
                this.dialog = false
                this.loading = false
                this.autopsia = this.clone(this.modelAutopsia)
            },
            getAutopsia (idAutopsia) {
                this.loading = true
                this.axios.get(`autopsias/${idAutopsia}`)
                    .then(response => {
                        console.log('response get Autopsia', response)
                        this.autopsia = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar la autopsia.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>