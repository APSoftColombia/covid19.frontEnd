<template>
    <ValidationObserver v-slot="{ invalid, validated, passes, validate }" ref="formSeccion">
        {{step}}
        {{iseccion}}
        <v-stepper-step :editable="encuesta.seccionGuardada === iseccion || (encuesta.seccionGuardada === 0 && iseccion === 0)" :complete="step > iseccion || encuesta.seccionGuardada === iseccion" :step="iseccion" :rules="[() => !(invalid || encuesta.seccionGuardada < iseccion)]">
            {{seccion.nombre}}
            <small class="pt-2 error--text" v-if="invalid">Preguntas por diligenciar</small>
        </v-stepper-step>
        <v-stepper-content :step="iseccion" class="ml-0">
            <v-row v-if="step === iseccion">
                <template v-for="(pregunta, ipregunta) in seccion.preguntas">
                    <elemento-respuesta
                            :referencias="referencias"
                            :key="`elemntoRespuesta${ipregunta}`"
                            :pregunta="pregunta"
                            :secciones="encuesta.formulario.secciones"
                            :encuesta="encuesta"
                            :encuesta-padre="encuestaPadre"
                            v-if="pregunta.referencia !== 'vinculacionFamiliar' || (pregunta.referencia === 'vinculacionFamiliar' && !cabeza)"
                    ></elemento-respuesta>
                </template>
            </v-row>
            <v-divider class="mt-0"></v-divider>
            <div class="mb-2">
                <v-btn @click="$emit('up')" v-if="step > 0 && !invalid" class="mr-2">
                    <v-icon left>mdi-arrow-up-bold</v-icon>
                    Anterior
                </v-btn>
                <v-btn color="primary" @click="$emit('guardar')" v-if="step < (seccioneslength)">
                    <v-icon left>fas fa-save</v-icon>
                    Siguiente
                    <v-icon right>mdi-arrow-down-bold</v-icon>
                </v-btn>
            </div>
        </v-stepper-content>
    </ValidationObserver>
</template>

<script>
    const ElementoRespuesta = () => import('Views/encuestas/components/ElementoRespuesta')
    export default {
        name: 'ElementoSeccion',
        props: {
            referencias: {
                type: Array,
                default: () => []
            },
            seccion: {
                type: Object,
                default: null
            },
            encuesta: {
                type: Object,
                default: null
            },
            encuestaPadre: {
                type: Object,
                default: null
            },
            iseccion: {
                type: Number,
                default: 0
            },
            seccioneslength: {
                type: Number,
                default: 0
            },
            step: {
                type: Number,
                default: 0
            }
        },
        components: {
            ElementoRespuesta
        },
        watch: {
            step (val) {
                if (val !== null && this && this.$refs && this.$refs.formSeccion) {
                    setTimeout(() => {
                        this.$refs.formSeccion.validate()
                    }, 200)
                }
            }
        },
        mounted () {
            this && this.$refs && this.$refs.formSeccion && this.$refs.formSeccion.validate()
        },
        computed: {
            cabeza () {
                return this && this.encuesta && this.encuesta.encuestado && this.encuesta.encuestado.es_cabeza
            }
        }
    }
</script>

<style scoped>
    .v-stepper__step {
        background-color: lightblue !important;
    }
</style>