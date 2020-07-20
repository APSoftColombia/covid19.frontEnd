<template>
    <v-col
            :class="[7, 8].find(x => x === pregunta.tipo_respuesta_id) ? 'pa-0' : ''"
            class="pb-0"
            cols="12"
            :sm="pregunta.ancho === 1 ? 6 : 12"
            :md="pregunta.ancho === 1 ? 4 : pregunta.ancho === 2 ? 6 : 12"
            v-if="isVisible"
            :key="`elementoPreguntaCol${pregunta.orden}`"
    >
        <template v-if="pregunta.tipo_respuesta_id === 9">
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>{{pregunta.orden}}. {{pregunta.pregunta}}</v-toolbar-title>
                    <v-spacer></v-spacer>
<!--                    <v-tooltip left>-->
<!--                        <template v-slot:activator="{ on }">-->
<!--                            <v-btn icon color="primary" v-on="on" @click="agregarAnidado(pregunta.formulario_anidado_uuid)">-->
<!--                                <v-icon>mdi-plus</v-icon>-->
<!--                            </v-btn>-->
<!--                        </template>-->
<!--                        <span>Agregar formulario</span>-->
<!--                    </v-tooltip>-->
                </v-toolbar>
<!--                <v-list>-->
<!--                    <template v-for="(anidado, indexanidado) in pregunta.respuesta.formularios_anidados">-->
<!--                        <v-list-item-->
<!--                                :key="`anidado${pregunta.orden}${indexanidado}`"-->
<!--                                @click="agregarAnidado(pregunta.formulario_anidado_uuid, anidado)"-->
<!--                        >-->
<!--                            <v-list-item-content>-->
<!--                                <v-list-item-title>{{[anidado.encuestado.nombre1, anidado.encuestado.nombre2, anidado.encuestado.apellido1, anidado.encuestado.apellido2].filter(x => x).join(' ')}} </v-list-item-title>-->
<!--                                <v-list-item-subtitle>{{anidado.uuid}}</v-list-item-subtitle>-->
<!--                            </v-list-item-content>-->
<!--                            <v-list-item-action>-->
<!--                                <v-tooltip top>-->
<!--                                    <template v-slot:activator="{ on }">-->
<!--                                        <v-btn icon color="error" v-on="on" @click.stop="pregunta.respuesta.formularios_anidados.splice(indexanidado, 1)">-->
<!--                                            <v-icon>mdi-delete-forever</v-icon>-->
<!--                                        </v-btn>-->
<!--                                    </template>-->
<!--                                    <span>Borrar formulario</span>-->
<!--                                </v-tooltip>-->
<!--                            </v-list-item-action>-->
<!--                        </v-list-item>-->
<!--                        <v-divider class="ma-0 pa-0" :key="`anidadoDivider${pregunta.orden}${indexanidado}`"></v-divider>-->
<!--                    </template>-->
<!--                </v-list>-->
            </v-card>
            <formulario-anidado ref="formularioAnidado" :encuesta-padre="encuesta" :pregunta="pregunta"></formulario-anidado>
        </template>
        <template v-else>
            <elemento
                    v-if="[1, 2, 15].find(x => x === pregunta.tipo_respuesta_id)"
                    :tipo="pregunta.tipo_respuesta_id"
                    :label="`${pregunta.orden}. ${pregunta.pregunta}`"
                    :descripcion="pregunta.descripcion"
                    v-model="pregunta.respuesta.posibles_respuesta_uuid"
                    :items="pregunta.posibles_respuestas"
                    :key="`elementoPreguntaElemento12${pregunta.orden}`"
                    :dense="false"
                    :name="`${pregunta.orden}`"
                    :rules="validateString"
            ></elemento>
            <template v-else-if="[10].find(x => x === pregunta.tipo_respuesta_id)">
                <ValidationProvider :name="`${pregunta.orden}`" :rules="validateString" v-slot="{ errors, valid }">
                    <elemento
                            :tipo="pregunta.tipo_respuesta_id"
                            :label="`${pregunta.orden}. ${pregunta.pregunta}`"
                            :descripcion="pregunta.descripcion"
                            v-model="pregunta.respuesta.respuesta_abierta"
                            :min="pregunta.valor_minimo"
                            :max="pregunta.valor_maximo"
                            :error-messages="errors"
                            :key="`elementoPreguntaElementoOtro${pregunta.orden}`"
                            :dense="false"
                    ></elemento>
                </ValidationProvider>
            </template>
            <elemento-calculado
                    v-else-if="[16].find(x => x === pregunta.tipo_respuesta_id)"
                    :label="`${pregunta.orden}. ${pregunta.pregunta}`"
                    :descripcion="pregunta.descripcion"
                    v-model="pregunta.respuesta.respuesta_abierta"
                    :key="`elementoPreguntaCalculada${pregunta.orden}`"
                    :dense="false"
                    :name="`${pregunta.orden}`"
                    :rules="validateString"
                    readonly
                    :pregunta="pregunta"
                    :encuesta="encuesta"
                    :encuesta-padre="encuestaPadre"
                    :referencias="referencias"
            ></elemento-calculado>
            <elemento
                    v-else
                    :tipo="pregunta.tipo_respuesta_id"
                    :label="[7, 8].find(x => x === pregunta.tipo_respuesta_id) ? `${pregunta.pregunta}` : `${pregunta.orden}. ${pregunta.pregunta}`"
                    v-model="pregunta.respuesta.respuesta_abierta"
                    :min="pregunta.valor_minimo"
                    :max="pregunta.valor_maximo"
                    :key="`elementoPreguntaElementoOtro${pregunta.orden}`"
                    :dense="false"
                    :name="`${pregunta.orden}`"
                    :rules="validateString"
                    :data-extra="dataExtra"
                    :readonly="pregunta.tipo_respuesta_id === 14"
            ></elemento>
        </template>
    </v-col>
</template>

<script>
    const FormularioAnidado = () => import('Views/encuestas/components/FormularioAnidado')
    export default {
        name: 'ElementoRespuesta',
        props: {
            encuesta: {
                type: Object,
                default: null
            },
            encuestaPadre: {
                type: Object,
                default: null
            },
            pregunta: {
                type: Object,
                default: null
            },
            referencias: {
                type: Array,
                default: () => []
            },
            secciones: {
                type: Array,
                default: () => []
            }
        },
        data: () => ({
            dataExtra: null
        }),
        components: {
            FormularioAnidado
        },
        watch: {
            'preguntaCondicional.respuesta.posibles_respuesta_uuid' () {
                this.pregunta && this.pregunta.respuesta && (this.pregunta.respuesta.respuesta_abierta = null)
                this.pregunta && this.pregunta.respuesta && (this.pregunta.respuesta.posibles_respuesta_uuid = null)
            },
            'preguntaCondicional.respuesta.respuesta_abierta' (val) {
                this.pregunta && this.pregunta.respuesta && (this.pregunta.respuesta.respuesta_abierta = null)
                this.pregunta && this.pregunta.respuesta && (this.pregunta.respuesta.posibles_respuesta_uuid = null)
                if (val && this.pregunta.tipo_respuesta_id === 14) {
                    this.dataExtra = val
                } else {
                    this.dataExtra = null
                }
            },
            'isVisible' (val) {
                if (val && this.pregunta.tipo_respuesta_id === 14) {
                    this.dataExtra = this.preguntaCondicional.respuesta.respuesta_abierta
                } else {
                    this.dataExtra = null
                }
            }
        },
        computed: {
            preguntas () {
                let preguntasList = []
                if (this && this.secciones && this.secciones.length) {
                    this.secciones.map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z))
                }
                return preguntasList
            },
            preguntaCondicional () {
                if (this && this.pregunta && this.pregunta.pregunta_condicional_uuid && this.preguntas && this.preguntas.length) {
                    return this.preguntas.find(x => x.uuid === this.pregunta.pregunta_condicional_uuid)
                } else {
                    return null
                }
            },
            isVisible () {
                if (this && this.pregunta && this.pregunta.respuesta && this.preguntas) {
                    if (!this.pregunta.pregunta_condicional_uuid) {
                        return true
                    } else {
                        if (this.preguntaCondicional && this.preguntaCondicional.respuesta) {
                            if (this.pregunta.tipo_respuesta_id === 14 || (this.pregunta.tipo_respuesta_id === 16 && (typeof this.preguntaCondicional.respuesta.respuesta_abierta !== 'undefined') && (this.preguntaCondicional.respuesta.respuesta_abierta !== null || (isNaN(this.preguntaCondicional.respuesta.respuesta_abierta) && Number(this.preguntaCondicional.respuesta.respuesta_abierta) > -1)))) {
                                return true
                            } else {
                                return (this.preguntaCondicional.respuesta.posibles_respuesta_uuid && this.operar(this.pregunta.operador, this.preguntaCondicional.respuesta.posibles_respuesta_uuid, this.pregunta.respuesta_condicional_uuid)) || (this.preguntaCondicional.respuesta.respuesta_abierta && this.operar(this.pregunta.operador, this.preguntaCondicional.respuesta.respuesta_abierta, this.pregunta.valor_condicional))
                            }
                        } else {
                            return false
                        }
                    }
                } else {
                    return false
                }
            },
            validateString () {
                let theString = ''
                if (this && this.pregunta) {
                    theString = this.pregunta.es_requerido ? 'requiredPregunta' : ''
                    theString = theString + (this.pregunta.valor_minimo ? `|minPregunta:${this.pregunta.valor_minimo}` : '')
                    theString = theString + (this.pregunta.valor_maximo ? `|maxPregunta:${this.pregunta.valor_maximo}` : '')
                }
                return theString
            }
        },
        methods: {
            agregarAnidado (formulariouuid, formularioAnidado = null) {
                this.$refs.formularioAnidado.assign(formulariouuid, formularioAnidado)
            },
            // valorRespuestaPregunta:: valor de la respuesta padre en la encuesta
            // valorRespuestaCondicional:: valor registrado como respuesta condicional de la pregunta padre en la pregunta actual
            operar (operador, valorRespuestaPregunta, valorRespuestaCondicional) {
                let response = false
                if ([4, 14, 16].find(x => x === this.preguntaCondicional.tipo_respuesta_id)) {
                    valorRespuestaCondicional = Number(valorRespuestaCondicional)
                    valorRespuestaPregunta = Number(valorRespuestaPregunta)
                }
                if (this.preguntaCondicional.tipo_respuesta_id === 5) {
                    valorRespuestaCondicional = new Date(valorRespuestaCondicional).valueOf()
                    valorRespuestaPregunta = new Date(valorRespuestaPregunta).valueOf()
                }
                if (this.preguntaCondicional.tipo_respuesta_id === 6) {
                    let date1 = '1900-01-01 ' + valorRespuestaCondicional
                    let date2 = '1900-01-01 ' + valorRespuestaPregunta
                    valorRespuestaCondicional = new Date(date1).valueOf()
                    valorRespuestaPregunta = new Date(date2).valueOf()
                }
                switch (operador) {
                    case '=': {
                        if (this.preguntaCondicional.tipo_respuesta_id === 15) {
                            let esta = 0
                            valorRespuestaCondicional.forEach(x => {
                                if (valorRespuestaPregunta.includes(x)) esta++
                            })
                            response = (valorRespuestaCondicional.length === esta)
                        } else {
                            response = (valorRespuestaPregunta === valorRespuestaCondicional)
                        }
                        break
                    }
                    case '>': {
                        response = (valorRespuestaPregunta > valorRespuestaCondicional)
                        break
                    }
                    case '<': {
                        response = (valorRespuestaPregunta < valorRespuestaCondicional)
                        break
                    }
                    case '!=': {
                        if (this.preguntaCondicional.tipo_respuesta_id === 15) {
                            if (!valorRespuestaPregunta.length) {
                                response = false
                            } else {
                                let esta = 0
                                valorRespuestaCondicional.forEach(x => {
                                    if (!valorRespuestaPregunta.includes(x)) esta++
                                })
                                response = (valorRespuestaCondicional.length === esta)
                            }
                        } else {
                            response = (valorRespuestaPregunta !== valorRespuestaCondicional)
                        }
                        break
                    }
                    case '>=': {
                        response = (valorRespuestaPregunta >= valorRespuestaCondicional)
                        break
                    }
                    case '<=': {
                        response = (valorRespuestaPregunta <= valorRespuestaCondicional)
                        break
                    }
                }
                return response
            }
        }
    }
</script>

<style scoped>

</style>