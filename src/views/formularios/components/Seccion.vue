<template>
    <v-card>
        <v-card-title class="pb-0 grey lighten-2">
            <v-btn v-if="index !== 0" text icon @click.stop="$emit('up')" class="mb-5 mr-2">
                <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-if="!last" text icon @click.stop="$emit('down')" class="mb-5 mr-2">
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
            {{seccion.id}}
            <v-text-field
                class="mt-1"
                v-model="seccion.nombre"
                label="Nombre Sección"
                outlined
                dense
            ></v-text-field>
            <v-btn text icon @click.stop="$emit('deleteseccion')" class="mb-5 ml-2">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn text color="primary" icon @click.stop="expand = !expand" class="mb-5 ml-2">
                <v-icon>{{expand ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
            </v-btn>
        </v-card-title>
        <v-expand-transition>
            <v-container v-if="expand" fluid class="grid-list-md blue-grey lighten-5">
                <v-row>
                    <v-col class="pb-0" cols="12" sm="6" md="3" lg="2" v-if="index > 0 && posiblesPadres.length">
                        <v-switch
                                class="mt-0"
                                v-model="seccion.es_dependiente"
                                label="Dependiente"
                                color="green"
                                :true-value="1"
                                :false-value="0"
                        ></v-switch>
                    </v-col>
                    <template v-if="seccion.es_dependiente && posiblesPadres.length">
                        <v-col class="pb-0" cols="12" sm="12" md="12" lg="5">
                            <v-autocomplete
                                    v-model="seccion.pregunta_condicional_uuid"
                                    :label="(seccion.pregunta_condicional_uuid ? 'P' : 'Seleccionar p') + 'regunta padre'"
                                    :items="posiblesPadres"
                                    item-value="uuid"
                                    item-text="pregunta"
                                    outlined
                                    dense
                            ></v-autocomplete>
                        </v-col>
                        <template>
                            <v-col class="pb-0" cols="12" sm="12" md="4" lg="2">
                                <v-select
                                        v-model="seccion.operador"
                                        label="Operador"
                                        :items="operadores.filter(x => x.tipoAplica.find(z => z === (preguntaPadre ? preguntaPadre.tipo_respuesta_id : [])))"
                                        :disabled="!seccion.pregunta_condicional_uuid"
                                        outlined
                                        dense
                                ></v-select>
                            </v-col>
                            <v-col class="pb-0" cols="12" sm="12" md="8" lg="5" v-if="preguntaPadre">
                                <elemento
                                        v-if="[1, 2, 15].find(x => x === preguntaPadre.tipo_respuesta_id)"
                                        :tipo="preguntaPadre.tipo_respuesta_id"
                                        :label="tiposRespuesta.find(x => x.id === preguntaPadre.tipo_respuesta_id).tipo"
                                        :descripcion="preguntaPadre.descripcion"
                                        v-model="seccion.respuesta_condicional_uuid"
                                        :items="itemsRespuesta"
                                ></elemento>
                                <elemento
                                        v-else-if="[16].find(x => x === preguntaPadre.tipo_respuesta_id)"
                                        :tipo="4"
                                        :label="tiposRespuesta.find(x => x.id === preguntaPadre.tipo_respuesta_id).tipo"
                                        :descripcion="preguntaPadre.descripcion"
                                        v-model="seccion.valor_condicional"
                                ></elemento>
                                <elemento
                                        v-else
                                        :tipo="preguntaPadre.tipo_respuesta_id"
                                        :label="tiposRespuesta.find(x => x.id === preguntaPadre.tipo_respuesta_id).tipo"
                                        :descripcion="preguntaPadre.descripcion"
                                        v-model="seccion.valor_condicional"
                                        :min="min"
                                        :max="max"
                                ></elemento>
                            </v-col>
                        </template>
                    </template>
                </v-row>
                <v-row>
                    <template v-for="(pregunta, indexpregunta) in seccion.preguntas">
                        <v-col cols="12" :key="`pregunta${indexpregunta}seccion${index}`">
                            <pregunta
                                    :secciones="secciones"
                                    :pregunta="pregunta"
                                    :index="indexpregunta"
                                    :last="indexpregunta === (seccion.preguntas.length - 1)"
                                    @down="down(indexpregunta)"
                                    @up="up(indexpregunta)"
                                    @delete="deletePregunta(pregunta.uuid, indexpregunta)"
                                    @create="val => agregarPregunta(val.tipo, val.index)"
                            ></pregunta>
                        </v-col>
                    </template>
                </v-row>
                <v-row
                        align="center"
                        justify="center"
                >
                    <v-menu
                            close-on-click
                            close-on-content-click
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    color="primary"
                                    text
                                    v-on="on"
                            >
                                <v-icon left>mdi-plus</v-icon>
                                Agregar Elemento
                            </v-btn>
                        </template>
                        <v-list dense>
                            <v-list-item
                                    v-for="(tipo, indextipo) in tiposRespuesta"
                                    :key="indextipo"
                                    @click="agregarPregunta(tipo)"
                            >
                                <v-list-item-icon>
                                    <v-icon >{{tipo.icono}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ tipo.tipo }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-container>
        </v-expand-transition>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    const Pregunta = () => import('Views/formularios/components/Pregunta')
    export default {
        name: 'Seccion',
        props: {
            secciones: {
                type: Array,
                default: () => []
            },
            seccion: {
              type: Object,
              default: null
            },
            index: {
                type: Number,
                default: 0
            },
            last: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Pregunta
        },
        watch: {
            'seccion.es_dependiente': {
                handler (val) {
                    !val && this.resetDependencia()
                },
                immediate: true
            }
            // 'seccion.pregunta_condicional_uuid' (val) {
            //     if (val) {
            //         this.seccion.operador = null
            //         this.seccion.respuesta_condicional_id = null
            //         this.seccion.respuesta_condicional_uuid = null
            //         this.seccion.valor_condicional = null
            //     }
            // },
            // 'seccion.operador' (val) {
            //     if (val) {
            //         this.seccion.respuesta_condicional_id = null
            //         this.seccion.respuesta_condicional_uuid = null
            //         this.seccion.valor_condicional = null
            //     }
            // }
        },
        computed: {
            ...mapGetters([
                'tiposRespuesta',
                'operadores',
                'tiposPreguntasPadre'
            ]),
            preguntas () {
                let preguntasList = []
                if (this && this.secciones && this.secciones.length) {
                    // this.secciones.filter((z, zxxindex) => zxxindex < this.index).map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z))
                    this.secciones.map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z))
                }
                return preguntasList
            },
            preguntaPadre () {
                return (this && this.posiblesPadres && this.posiblesPadres.length && this.seccion && this.posiblesPadres.find(y => y.uuid === this.seccion.pregunta_condicional_uuid)) || null
            },
            posiblesPadres () {
                if (this && this.preguntas && this.preguntas.length && this.tiposPreguntasPadre && this.tiposPreguntasPadre.length) {
                    return this.preguntas.filter(y => this.tiposPreguntasPadre.find(z => z === y.tipo_respuesta_id))
                }
                return []
            },
            itemsRespuesta () {
                if (this && this.preguntaPadre) {
                    if ([1, 2, 15].find(x => x === this.preguntaPadre.tipo_respuesta_id)) {
                        return this.preguntaPadre.posibles_respuestas
                    }
                    return []
                } else {
                    return []
                }
            },
            min () {
                if (this && this.preguntaPadre && [4, 5, 6].find(x => x === this.preguntaPadre.tipo_respuesta_id)) {
                    return this.preguntaPadre.valor_minimo
                }
                return ''
            },
            max () {
                if (this && this.preguntaPadre && [4, 5, 6].find(x => x === this.preguntaPadre.tipo_respuesta_id)) {
                    return this.preguntaPadre.valor_maximo
                }
                return ''
            }
        },
        data: () => ({
            expand: false,
            makePregunta: {
                id: null,
                uuid: null,
                pregunta: null,
                descripcion: null,
                orden: null,
                ancho: 3,
                habilitado: 1,
                tipo_respuesta_id: null,
                formulario_id: null,
                valor_minimo: null,
                valor_maximo: null,
                es_requerido: 1,
                es_dependiente: 0,
                pregunta_condicional_id: null,
                pregunta_condicional_uuid: null,
                respuesta_condicional_id: null,
                respuesta_condicional_uuid: null,
                valor_condicional: null,
                operador: null,
                posibles_respuestas: [],
                seccion_formulario_id: null,
                formulario_anidado_id: null,
                formulario_anidado_uuid: null,
                tipo_campo_calculado_id: null,
                referencia: null
            }
        }),
        created () {
        },
        methods: {
            agregarPregunta (tipo, index = null) {
                let pregunta = this.clone(this.makePregunta)
                pregunta.tipo_respuesta_id = tipo.id
                pregunta.seccion_formulario_id = this.seccion.id
                pregunta.formulario_id = this.seccion.formulario_id
                pregunta.uuid = this.$uuid.v1()
                if (pregunta.tipo_respuesta_id === 14 || pregunta.tipo_respuesta_id === 16) {
                    pregunta.es_dependiente = 1
                }
                if ([7, 8, 9, 14, 16].find(x => x === pregunta.tipo_respuesta_id)) {
                    pregunta.es_requerido = 0
                }
                if (pregunta.tipo_respuesta_id === 16) {
                    pregunta.campo_calculado = {
                        id: null,
                        uuid: this.$uuid.v1(),
                        variables: [],
                        tipo_campo_calculado_id: null
                    }
                }

                if (index !== null) {
                    this.seccion.preguntas.splice(index + 1, 0, pregunta)
                } else {
                    this.seccion.preguntas.push(pregunta)
                }
            },
            up (index) {
                if (index > 0) {
                    let ahora = this.clone(this.seccion.preguntas[index])
                    let anterior = this.clone(this.seccion.preguntas[index - 1])
                    this.seccion.preguntas.splice((index - 1), 1, ahora)
                    this.seccion.preguntas.splice(index, 1, anterior)
                }
            },
            down (index) {
                if (index < (this.seccion.preguntas.length - 1)) {
                    let ahora = this.clone(this.seccion.preguntas[index])
                    let posterior = this.clone(this.seccion.preguntas[index + 1])
                    this.seccion.preguntas.splice((index + 1), 1, ahora)
                    this.seccion.preguntas.splice(index, 1, posterior)
                }
            },
            deletePregunta (uuid, index) {
                if (this.seccion.preguntas.find(x => x.respuesta_pregunta_padre_uuid === uuid)) {
                    this.$store.commit('snackbar', {color: 'warning', message: `El elemento no se puede eliminar, tiene elementos dependientes.`})
                } else {
                    this.seccion.preguntas.splice(index, 1)
                }
            },
            resetDependencia () {
                this.seccion.pregunta_condicional_uuid = null
                this.seccion.pregunta_condicional_id = null
                this.seccion.operador = null
                this.seccion.respuesta_condicional_id = null
                this.seccion.respuesta_condicional_uuid = null
                this.seccion.valor_condicional = null
            }
        }
    }
</script>

<style scoped>

</style>