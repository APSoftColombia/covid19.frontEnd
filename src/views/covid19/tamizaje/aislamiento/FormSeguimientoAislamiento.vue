<template>
    <v-row>
        <v-col class="pb-0" cols="12" v-if="registraFecha">
            <c-date
                    v-model="seguimiento_aislamiento.fecha"
                    rules="required"
                    label="Fecha Seguimiento"
                    name="fecha seguimiento"
                    :max="moment().format('YYYY-MM-DD')"
                    :min="fechaMinimaIngreso"
            >
            </c-date>
        </v-col>
        <v-col class="pb-0" cols="12">
            <c-select-complete
                    v-model="seguimiento_aislamiento.soporte_ventilatorio"
                    label="Soporte Ventilatorio"
                    :items="tiposSoporteVentilatorio"
            >
            </c-select-complete>
        </v-col>
        <v-col cols="12">
            <v-card outlined tile>
                <v-card-text>
                    <c-radio
                            v-model="seguimiento_aislamiento.soporte_hemodinamico"
                            label="Soporte Hemodinámico"
                            rules="required"
                            name="soporte hemodinámico"
                            :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                            item-text="text"
                            item-value="value"
                            :column="!$vuetify.breakpoint.smAndUp"
                    >
                    </c-radio>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col class="pb-0" cols="12">
            <v-switch
                    v-model="seguimiento_aislamiento.registra_egreso"
                    :true-value="1"
                    :false-value="0"
                    label="Registra Egreso de Aislamiento"
            ></v-switch>
        </v-col>
        <v-col class="pb-0" cols="12" v-if="seguimiento_aislamiento.registra_egreso">
            <c-date
                    v-model="seguimiento_aislamiento.fecha_egreso"
                    rules="required"
                    label="Fecha Egreso"
                    name="fecha de egreso"
                    :max="moment().format('YYYY-MM-DD')"
                    :min="fechaMinimaEgreso"
            >
            </c-date>
        </v-col>
    </v-row>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'FormSeguimientoAislamiento',
        props: {
            registraFecha: {
              type: Boolean,
              default: false
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
        computed: {
            ...mapGetters([
                'tiposSoporteVentilatorio'
            ]),
            fechaMinimaIngreso () {
                return this && this.aislamiento && this.aislamiento.seguimientos && this.aislamiento.seguimientos.length ? this.aislamiento.seguimientos[0].fecha : null
            },
            fechaMinimaEgreso () {
                return this && (this.seguimiento_aislamiento && this.seguimiento_aislamiento.fecha) ? this.seguimiento_aislamiento.fecha : this.aislamiento && this.aislamiento.seguimientos && this.aislamiento.seguimientos.length ? this.aislamiento.seguimientos[0].fecha : this.aislamiento.fecha_ingreso ? this.aislamiento.fecha_ingreso : null
            }
        },
        watch: {
            'seguimiento_aislamiento.registra_egreso': {
                handler (val) {
                    this.seguimiento_aislamiento.fecha_egreso = val ? this.seguimiento_aislamiento.fecha_egreso ? this.moment(this.seguimiento_aislamiento.fecha_egreso).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD') : null
                },
                immediate: false
            }
        }
    }
</script>

<style scoped>

</style>