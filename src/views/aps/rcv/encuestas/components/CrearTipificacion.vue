<template>
    <v-dialog
    v-model="dialog"
    max-width="600px"
    transition="dialog-bottom-transition"
    persistent
    >
        <ValidationObserver ref="formTipificacion" v-slot="{ invalid, validated, passes, validate }">
        <v-card>
            <v-card-title>
            <span class="headline">Nueva Tipificacion</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col class="pb-0" cols="12">
                            <c-select-complete
                                v-model="tipificacion.reftipificacion_id"
                                placeholder="Tipo"
                                name="tipo tipificacion"
                                :items="listTipificaciones ? listTipificaciones: []"
                                item-text="descripcion"
                                item-value="id"
                                rules="required"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col class="pb-0" cols="12" v-if="tipificacion.reftipificacion_id && listTipificaciones.find(x => x.id == tipificacion.reftipificacion_id).pedir_codigo == 'Si'">
                            <buscador-cups
                                ref="buscadorcups"
                                label="Codigo Servicio"
                                name="busqueda de codigo cup"
                                v-model="tipificacion.codigo_servicio"
                                rules="required"
                            ></buscador-cups>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <c-date
                                v-model="tipificacion.fecha_solicitud"
                                placeholder="Fecha de Solicitud"
                                :max="moment().format('YYYY-MM-DD')"
                                rules="required"
                            >
                            </c-date>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <c-date
                                v-model="tipificacion.fecha_programada"
                                placeholder="Fecha de Programacion"
                                :max="moment().format('YYYY-MM-DD')"
                            >
                            </c-date>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-date
                                v-model="tipificacion.fecha_prestacion"
                                placeholder="Fecha de Prestacion"
                                :max="moment().format('YYYY-MM-DD')"
                            >
                            </c-date>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-text-area
                                label="Resultados"
                                v-model="tipificacion.resultado"
                                name="observaciones"
                            ></c-text-area>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <p class="caption error--text mb-0 mx-2" v-if="invalid && validated">Hay errores en el formulario</p>
                <v-btn
                    large
                    @click="close"
                >
                    Cancelar
                </v-btn>
                <v-btn
                    color="primary"
                    large
                    @click="save"
                >
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
        </ValidationObserver>
    </v-dialog>
  
</template>

<script>
const BuscadorCups = () => import('Views/aps/rcv/encuestas/components/BuscadorCups')
export default {
    name: "CrearTipificacion",
    props: {
        tipificaciones: {
            type: Array,
            required: true
        },
        listTipificaciones: {
            type: Array,
            required: true
        }
    },
    components: {
        BuscadorCups
    },
    data: () => ({
        dialog: false,
        tipificacion: {},
        tipificacionModel: {
            reftipificacion_id: null,
            codigo_servicio: null,
            fecha_solicitud: null,
            fecha_programada: null,
            fecha_prestacion: null,
            resultado: null,
            fecha_anulacion: null,
            motivo_anulacion: null,
            bitacora_id_origen: null,
            bitacora_id: null
        }
    }),
    watch: {
        'tipificacion.reftipificacion_id': {
            handler(value){
                if(value) this.listTipificaciones.find(x => x.id == value).pedir_codigo != 'Si' ? this.tipificacion.codigo_servicio = null : value
            },
            inmediate: false
        }
    },
    methods: {
        open(){
            this.tipificacion = this.clone(this.tipificacionModel)
            this.dialog = true
        },
        close(){
            this.tipificacion = this.clone(this.tipificacionModel)
            this.$refs.formTipificacion.reset()
            this.dialog = false
        },
        save(){
            this.$refs.formTipificacion.validate().then(result => {
                if (result) {
                    this.tipificaciones.push(this.tipificacion)
                    this.close()
                }
            })
        }
    }
}
</script>

<style>

</style>