<template>
    <div>
        <v-row>
            <v-col class="pb-0" cols="12">
                <c-date
                        v-model="aislamiento.fecha_ingreso"
                        rules="required"
                        label="Fecha Ingreso"
                        name="fecha de ingreso"
                        :max="moment().format('YYYY-MM-DD')"
                        :min="fechaMinimaAislamiento ? moment(fechaMinimaAislamiento).format('YYYY-MM-DD') : null"
                >
                </c-date>
            </v-col>
            <v-col class="pb-0" cols="12">
                <c-select-complete
                        v-model="aislamiento.tipo"
                        label="Tipo de Aislamiento"
                        :items="tiposAislamiento"
                        rules="required"
                        name="tipo de aislamiento"
                >
                </c-select-complete>
            </v-col>
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="aislamiento.individual"
                                label="Aislada en habitación individual"
                                rules="required"
                                name="aislada en habitación individual"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="pb-0" cols="12">
                <c-select-complete
                        v-model="aislamiento.ambito"
                        label="Ambito de atención médica"
                        :items="ambitosAtencion"
                        rules="required"
                        name="ambito de atención médica"
                >
                </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="aislamiento.ambito === 'Otro'">
                <c-text-area
                        v-model="aislamiento.otro_ambito"
                        label="Descripción del ambito"
                        rules="required"
                        name="descripción del ambito"
                        rows="1"
                >
                </c-text-area>
            </v-col>
        </v-row>
        <form-seguimiento-aislamiento
                :aislamiento="aislamiento"
                :seguimiento_aislamiento="seguimiento_aislamiento"
        >
        </form-seguimiento-aislamiento>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import FormSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/FormSeguimientoAislamiento'
    export default {
        name: 'FormAislamiento',
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            aislamiento: {
                type: Object,
                default: null
            },
            seguimiento_aislamiento: {
                type: Object,
                default: null
            }
        },
        components: {
            FormSeguimientoAislamiento
        },
        computed: {
            ...mapGetters([
                'tiposAislamiento',
                'ambitosAtencion'
            ]),
            fechaMinimaAislamiento () {
                return this && this.tamizaje && this.tamizaje.aislamientos && this.tamizaje.aislamientos.length ? this.tamizaje.aislamientos[0].fecha_egreso ? this.tamizaje.aislamientos[0].fecha_egreso : this.tamizaje.aislamientos[0].fecha_ingreso : null
            }
        },
        watch: {
            'aislamiento.ambito': {
                handler (val) {
                    if (val !== 'Otro') {
                        this.aislamiento.otro_ambito = null
                    }
                },
                immediate: false
            },
            'seguimiento_aislamiento.fecha_egreso': {
                handler (val) {
                    this.aislamiento.fecha_egreso = val
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>