<template>
    <v-dialog
            v-model="dialog"
            width="600"
    >
        <v-card>
            <v-card-title
                    class="info white--text py-2"
            >
                Resumen Clínico
            </v-card-title>
            <v-list two-line class="list-aqua-ripple">
                <v-list-item v-if="obj.clasificacion === 6 && obj.justificacion_no_clasificado">
                    <v-list-item-content>
                        <h6 class="mb-0 info--text text--darken-3">Justificación Clínica de no Clasificado</h6>
                        <p class="fs-12 mb-0 fw-normal">{{obj.justificacion_no_clasificado}}</p>
                    </v-list-item-content>
                </v-list-item>
                <template v-if="obj.lugar_evolucion && (obj.lugar_evolucion.id === 3 || obj.lugar_evolucion.id === 2)">
                    <template v-if="obj.lugar_evolucion.id === 2">
                        <v-list-item>
                            <v-list-item-content>
                                <h6 class="mb-0 info--text text--darken-3">Motivo de la consulta</h6>
                                <p class="fs-12 mb-0 fw-normal">{{obj.motivo_consulta}}</p>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <h6 class="mb-0 info--text text--darken-3">Enfermedad actual</h6>
                                <p class="fs-12 mb-0 fw-normal">{{obj.anamnesis}}</p>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <h6 class="mb-0 info--text text--darken-3">Examen físico</h6>
                                <p class="fs-12 mb-0 fw-normal">{{obj.examen_fisico}}</p>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <h6 class="mb-0 info--text text--darken-3">Diagnóstico</h6>
                                <p class="fs-12 mb-0 fw-normal">{{obj.cie10 ? (`${obj.cie10.codigo} - ${obj.cie10.descrip}`) : ''}}</p>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <h6 class="mb-0 info--text text--darken-3">Tratamiento</h6>
                                <p class="fs-12 mb-0 fw-normal">{{obj.tratamiento}}</p>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <v-list-item v-if="obj.lugar_evolucion.id === 3">
                        <v-list-item-content>
                            <h6 class="mb-0 info--text text--darken-3">Evolución Diaria Hospitalaria</h6>
                            <p class="fs-12 mb-0 fw-normal">{{obj.evolucion_diaria_hospitalaria}}</p>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-list-item>
                    <v-list-item-content>
                        <h6 class="mb-0 info--text text--darken-3">Observaciones - Ruta de tratamiento a seguir del paciente</h6>
                        <p class="fs-12 mb-0 fw-normal">{{obj.observaciones}}</p>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'HelpModal',
        data: () => ({
            dialog: false,
            obj: null,
            makeObj: {
                motivo_consulta: null,
                anamnesis: null,
                cie10_id: null,
                cie10: null,
                tratamiento: null,
                observaciones: null,
                evolucion_diaria_hospitalaria: null
            }
        }),
        watch: {
            dialog: {
                handler (val) {
                    !val && (this.obj = this.clone(this.makeObj))
                },
                immediate: false
            }
        },
        created () {
            this.obj = this.clone(this.makeObj)
        },
        methods: {
            open (item) {
                if (item) {
                    this.obj = item
                    this.dialog = true
                }
            }
        }
    }
</script>

<style scoped>

</style>