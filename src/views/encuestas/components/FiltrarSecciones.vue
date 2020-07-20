<template>
    <div></div>
</template>

<script>
    export default {
        name: 'FiltrarSecciones',
        props: {
            encuesta: {
                type: Object,
                default: null
            }
        },
        data: () => ({
            preguntaCondicional: null,
            list: []
        }),
        computed: {
            preguntas () {
                let preguntasList = []
                if (this && this.encuesta && this.encuesta.formulario && this.encuesta.formulario.secciones && this.encuesta.formulario.secciones.length) {
                    this.encuesta.formulario.secciones.map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z))
                }
                return preguntasList
            }
        },
        watch: {
            'encuesta': {
                handler () {
                    console.log('llega')
                    this.reload()
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            reload () {
                this.list = []
                if (this.preguntas) {
                    this.encuesta.formulario.secciones.forEach(x => {
                        this.preguntaCondicional = this.preguntas.find(y => y.uuid === x.pregunta_condicional_uuid) ? this.preguntas.find(y => y.uuid === x.pregunta_condicional_uuid) : null
                        if (!x.pregunta_condicional_uuid) {
                            this.list.push(x)
                        } else {
                            if (this.preguntaCondicional && ((this.preguntaCondicional.respuesta && this.preguntaCondicional.respuesta.posibles_respuesta_uuid && this.operar(x.operador, this.preguntaCondicional.respuesta.posibles_respuesta_uuid, x.respuesta_condicional_uuid)) || (this.preguntaCondicional && this.preguntaCondicional.respuesta && this.preguntaCondicional.respuesta.respuesta_abierta > -1 && this.preguntaCondicional.respuesta.respuesta_abierta !== null && typeof this.preguntaCondicional.respuesta.respuesta_abierta !== 'undefined') && this.operar(x.operador, this.preguntaCondicional.respuesta.respuesta_abierta, x.valor_condicional))) {
                                this.list.push(x)
                            }
                        }
                    })
                    this.$emit('input', this.list)
                } else {
                    this.$emit('input', [])
                }
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