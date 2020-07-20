<template>
    <v-card>
        <v-toolbar>
            <v-btn v-if="index !== 0" text icon @click.stop="$emit('up')">
                <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-if="!last" text icon @click.stop="$emit('down')" class="mr-2">
                <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
            {{pregunta.id}}
            <v-avatar color="purple" size="38">
                <v-icon class="white--text">{{tiposRespuesta.find(x => x.id === pregunta.tipo_respuesta_id).icono}}</v-icon>
            </v-avatar>
            <v-toolbar-title class="pa-0">
                <v-list-item-content class="py-0 px-3">
                    <v-list-item-title class="text-truncate">{{pregunta.pregunta}}</v-list-item-title>
                    <v-list-item-subtitle class="caption font-weight-bold">{{tiposRespuesta.find(x => x.id === pregunta.tipo_respuesta_id).tipo}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-switch
                    class="mt-0"
                    v-model="pregunta.habilitado"
                    label="Habilitado"
                    color="green"
                    :true-value="1"
                    :false-value="0"
                    hide-details
            ></v-switch>
            <v-divider vertical class="mx-4 my-0"></v-divider>
            <v-btn text icon @click.stop="$emit('delete')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn text color="primary" icon @click.stop="expand = !expand" class="ml-2">
                <v-icon>{{expand ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
            </v-btn>
            <v-menu
                    close-on-click
                    close-on-content-click
            >
                <template v-slot:activator="{ on }">
                    <v-btn
                            color="success"
                            text
                            icon
                            v-on="on"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-list dense>
                    <v-list-item
                            v-for="(tipo, indextipo) in tiposRespuesta"
                            :key="indextipo"
                            @click="$emit('create', {tipo: tipo, index: index})"
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
        </v-toolbar>
        <v-expand-transition>
            <div v-if="expand">
                <v-container fluid class="grid-list-md pt-0">
                    <v-row>
                        <template v-if="![7].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="12">
                                <v-text-field
                                        v-model="pregunta.pregunta"
                                        label="Nombre Pregunta"
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                                <v-textarea
                                        v-model="pregunta.descripcion"
                                        label="Descripción"
                                        rows="3"
                                        outlined
                                ></v-textarea>
                            </v-col>
                            <v-col class="pb-0" cols="6" sm="6" md="3">
                                <v-text-field
                                        v-model="pregunta.referencia"
                                        label="Referencia"
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                        </template>
                        <template v-if="[1].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="6" sm="6" md="3" v-for="(respuesta, indexrespuesta) in pregunta.posibles_respuestas" :key="`posibleRespuestaSiNo${indexrespuesta}`">
                                <v-text-field
                                        v-model.number="respuesta.valor"
                                        :label="`Valor Opción: ${respuesta.nombre}`"
                                        min="0"
                                        type="number"
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                        </template>
                        <template v-if="[4].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="6" sm="6" md="3">
                                <v-text-field
                                        v-model.number="pregunta.valor_minimo"
                                        label="Min."
                                        type="number"
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                            <v-col class="pb-0" cols="6" sm="6" md="3">
                                <v-text-field
                                        v-model.number="pregunta.valor_maximo"
                                        label="Max."
                                        type="number"
                                        outlined
                                        dense
                                ></v-text-field>
                            </v-col>
                        </template>
                        <template v-if="![7, 8, 9].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="12" sm="12" md="4" lg="3">
                                <v-select
                                        v-model="pregunta.ancho"
                                        label="Ancho en pantalla"
                                        :items="anchosPantallaPreguntas"
                                        item-value="id"
                                        item-text="nombre"
                                        outlined
                                        dense
                                        prepend-icon="mdi-arrow-expand-horizontal"
                                ></v-select>
                            </v-col>
                        </template>
                        <template v-if="[2, 15].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col cols="12" sm="12" md="6" lg="3" xl="3">
                                <posibles-respuestas block :pregunta="pregunta"></posibles-respuestas>
                            </v-col>
                        </template>
                        <template v-if="[9].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                                <v-autocomplete
                                        v-model="pregunta.formulario_anidado_uuid"
                                        :label="(pregunta.formulario_anidado_uuid ? 'F' : 'Seleccionar f') + 'ormulario para anidar'"
                                        :items="formularios"
                                        item-value="uuid"
                                        item-text="nombre"
                                        outlined
                                        dense
                                ></v-autocomplete>
                            </v-col>
                        </template>
                        <template v-if="![7, 8, 14, 16].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="6" sm="4" md="3">
                                <v-switch
                                        class="mt-0"
                                        v-model="pregunta.es_requerido"
                                        label="Requerido"
                                        color="green"
                                        :true-value="1"
                                        :false-value="0"
                                ></v-switch>
                            </v-col>
                        </template>
                        <template v-if="![14, 16].find(x => x === pregunta.tipo_respuesta_id) && posiblesPadres.length">
                            <v-col class="pb-0" cols="12" sm="6" md="3" lg="2">
                                <v-switch
                                        class="mt-0"
                                        v-model="pregunta.es_dependiente"
                                        label="Dependiente"
                                        color="green"
                                        :true-value="1"
                                        :false-value="0"
                                ></v-switch>
                            </v-col>
                        </template>
                    </v-row>
                    <template v-if="pregunta && pregunta.tipo_respuesta_id === 16">
                        <v-select
                                v-model="pregunta.tipo_campo_calculado_id"
                                :label="(pregunta.tipo_campo_calculado_id ? 'T' : 'Seleccionar t') + 'ipo de calculo'"
                                :items="tiposCampoCalculado"
                                item-value="id"
                                item-text="nombre"
                                outlined
                                dense
                        ></v-select>
<!--                        <v-card>-->
<!--                            <v-toolbar>-->
<!--                                <v-toolbar-title>-->
<!--                                    Variables-->
<!--                                </v-toolbar-title>-->
<!--                                <v-spacer></v-spacer>-->
<!--                                <v-btn icon color="primary" @click="agregarVariable">-->
<!--                                    <v-icon>mdi-plus</v-icon>-->
<!--                                </v-btn>-->
<!--                            </v-toolbar>-->
<!--                            <v-simple-table dense>-->
<!--                                <template v-slot:default>-->
<!--                                    <thead>-->
<!--                                    <tr>-->
<!--                                        <th class="text-left">Nombre</th>-->
<!--                                        <th class="text-left">Tipo referencia</th>-->
<!--                                        <th class="text-left">Referencia</th>-->
<!--                                        <th class="text-center"></th>-->
<!--                                    </tr>-->
<!--                                    </thead>-->
<!--                                    <tbody>-->
<!--                                    <tr v-for="(item, keyItem) in pregunta.campo_calculado.variables" :key="keyItem">-->
<!--                                        <td>-->
<!--                                            <v-text-field-->
<!--                                                    v-model="item.nombre"-->
<!--                                                    placeholder="Nombre"-->
<!--                                                    outlined-->
<!--                                                    dense-->
<!--                                                    hide-details-->
<!--                                            ></v-text-field>-->
<!--                                        </td>-->
<!--                                        <td>-->
<!--                                            <v-select-->
<!--                                                    v-model="item.tipo"-->
<!--                                                    placeholder="Tipo referencia"-->
<!--                                                    :items="[{id: 1, nombre: 'Preguntas'}, {id: 2, nombre: 'Ubicación'}]"-->
<!--                                                    item-value="id"-->
<!--                                                    item-text="nombre"-->
<!--                                                    outlined-->
<!--                                                    dense-->
<!--                                                    hide-details-->
<!--                                            ></v-select>-->
<!--                                        </td>-->
<!--                                        <td>-->
<!--                                            <v-autocomplete-->
<!--                                                    v-model="item.referencia"-->
<!--                                                    placeholder="Referencia"-->
<!--                                                    :items="item.tipo ? item.tipo === 1 ? posiblesPadresReferencia : camposUbicacion : []"-->
<!--                                                    item-value="id"-->
<!--                                                    item-text="nombre"-->
<!--                                                    outlined-->
<!--                                                    dense-->
<!--                                                    hide-details-->
<!--                                            ></v-autocomplete>-->
<!--                                        </td>-->
<!--                                        <td>-->
<!--                                            <v-tooltip top>-->
<!--                                                <template v-slot:activator="{ on }">-->
<!--                                                    <v-btn color="error" icon slot="activator" v-on="on" @click="pregunta.campo_calculado.variables.splice(keyItem, 1)">-->
<!--                                                        <v-icon small>fas fa-info</v-icon>-->
<!--                                                    </v-btn>-->
<!--                                                </template>-->
<!--                                                <span>Borrar variable</span>-->
<!--                                            </v-tooltip>-->
<!--                                        </td>-->
<!--                                    </tr>-->
<!--                                    </tbody>-->
<!--                                </template>-->
<!--                            </v-simple-table>-->
<!--                        </v-card>-->
                    </template>
                    <v-row v-if="pregunta.es_dependiente && posiblesPadres.length">
                        <v-col class="pb-0" cols="12" sm="12" md="12" lg="5">
                            <v-autocomplete
                                    v-model="pregunta.pregunta_condicional_uuid"
                                    :label="(pregunta.pregunta_condicional_uuid ? 'P' : 'Seleccionar p') + 'regunta padre'"
                                    :items="posiblesPadres"
                                    item-value="uuid"
                                    item-text="pregunta"
                                    outlined
                                    dense
                            ></v-autocomplete>
                        </v-col>
                        <template v-if="![14, 16].find(x => x === pregunta.tipo_respuesta_id)">
                            <v-col class="pb-0" cols="12" sm="12" md="4" lg="2">
                                <v-select
                                        v-model="pregunta.operador"
                                        label="Operador"
                                        :items="operadores.filter(x => x.tipoAplica.find(z => z === (preguntaPadre ? preguntaPadre.tipo_respuesta_id : [])))"
                                        :disabled="!pregunta.pregunta_condicional_uuid"
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
                                        v-model="pregunta.respuesta_condicional_uuid"
                                        :items="itemsRespuesta"
                                ></elemento>
                                <elemento
                                        v-else-if="[16].find(x => x === preguntaPadre.tipo_respuesta_id)"
                                        :tipo="4"
                                        :label="tiposRespuesta.find(x => x.id === preguntaPadre.tipo_respuesta_id).tipo"
                                        :descripcion="preguntaPadre.descripcion"
                                        v-model="pregunta.valor_condicional"
                                ></elemento>
                                <elemento
                                        v-else
                                        :tipo="preguntaPadre.tipo_respuesta_id"
                                        :label="tiposRespuesta.find(x => x.id === preguntaPadre.tipo_respuesta_id).tipo"
                                        :descripcion="preguntaPadre.descripcion"
                                        v-model="pregunta.valor_condicional"
                                        :min="min"
                                        :max="max"
                                ></elemento>
                            </v-col>
                        </template>
                    </v-row>
                </v-container>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex'
    const Elemento = () => import('Views/formularios/components/Elemento')
    const PosiblesRespuestas = () => import('Views/formularios/components/PosiblesRespuestas')
    export default {
        name: 'Pregunta',
        props: {
            secciones: {
                type: Array,
                default: () => []
            },
            pregunta: {
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
            Elemento,
            PosiblesRespuestas
        },
        data: () => ({
            expand: false,
            modelElemento: null
        }),
        watch: {
            'pregunta': {
                handler (val) {
                    val && (val.tipo_respuesta_id === 1) && !val.posibles_respuestas.length && this.assignSINO()
                },
                immediate: true
            },
            'pregunta.es_dependiente': {
                handler (val) {
                    !val && this.resetDependencia()
                },
                immediate: true
            }
            // 'pregunta.pregunta_condicional_uuid' (val) {
            //     if (val) {
            //         this.pregunta.operador = null
            //         this.pregunta.respuesta_condicional_id = null
            //         this.pregunta.respuesta_condicional_uuid = null
            //         this.pregunta.valor_condicional = null
            //     }
            // },
            // 'pregunta.operador' (val) {
            //     if (val) {
            //         this.pregunta.respuesta_condicional_id = null
            //         this.pregunta.respuesta_condicional_uuid = null
            //         this.pregunta.valor_condicional = null
            //     }
            // }
        },
        computed: {
            ...mapGetters([
                'fuentesDatos',
                'tiposCampoCalculado',
                'tiposRespuesta',
                'operadores',
                'tiposPreguntasPadre',
                'anchosPantallaPreguntas',
                'camposUbicacion',
                'formularios'
            ]),
            preguntas () {
                let preguntasList = []
                if (this && this.secciones && this.secciones.length) {
                    this.secciones.map(x => x.preguntas).forEach(z => preguntasList = preguntasList.concat(z))
                }
                return preguntasList
            },
            preguntaPadre () {
                return (this && this.posiblesPadres && this.posiblesPadres.length && this.pregunta && this.posiblesPadres.find(y => y.uuid === this.pregunta.pregunta_condicional_uuid)) || null
            },
            posiblesPadresReferencia () {
              return this.posiblesPadres && this.posiblesPadres.length ? this.posiblesPadres.map(x => {return{id: x.uuid, nombre: x.pregunta}}) : []
            },
            posiblesPadres () {
                if (this && this.preguntas && this.preguntas.length && this.tiposPreguntasPadre && this.tiposPreguntasPadre.length) {
                    if (this.pregunta.tipo_respuesta_id === 14) {
                        // return this.preguntas.filter((y, yindex) => (y.tipo_respuesta_id === 5) && (y.uuid !== this.pregunta.uuid) && (yindex < this.preguntas.findIndex(b => b.uuid === this.pregunta.uuid)))
                        return this.preguntas.filter(y => (y.tipo_respuesta_id === 5) && (y.uuid !== this.pregunta.uuid))
                    } else {
                        // return this.preguntas.filter((y, yindex) => this.tiposPreguntasPadre.find(z => z === y.tipo_respuesta_id) && (y.uuid !== this.pregunta.uuid) && (yindex < this.preguntas.findIndex(b => b.uuid === this.pregunta.uuid)))
                        return this.preguntas.filter(y => this.tiposPreguntasPadre.find(z => z === y.tipo_respuesta_id) && (y.uuid !== this.pregunta.uuid))
                    }
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
        methods: {
            assignSINO () {
              this.pregunta.posibles_respuestas.push(
                  {
                      id: null,
                      uuid: this.$uuid.v1(),
                      nombre: 'SI',
                      valor: null,
                      habilitado: 1,
                      pregunta_uuid: this.pregunta.uuid
                  },
                  {
                      id: null,
                      uuid: this.$uuid.v1(),
                      nombre: 'NO',
                      valor: null,
                      habilitado: 1,
                      pregunta_uuid: this.pregunta.uuid
                  }
              )
            },
            resetDependencia () {
                this.pregunta.pregunta_condicional_uuid = null
                this.pregunta.pregunta_condicional_id = null
                this.pregunta.operador = null
                this.pregunta.respuesta_condicional_id = null
                this.pregunta.respuesta_condicional_uuid = null
                this.pregunta.valor_condicional = null
            },
            agregarVariable () {
                this.pregunta.campo_calculado.variables.push({id: null, nombre: null, tipo: null, referencia: null})
            }
        }
    }
</script>

<style scoped>

</style>