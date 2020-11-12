<template>
    <v-dialog
    v-model="dialogNuevaBitacora"
    max-width="1200px"
    transition="dialog-bottom-transition"
    persistent
    >
        <v-toolbar dark color="primary">
            <!-- <v-icon left>far fa-clipboard</v-icon> -->
            <v-toolbar-title id="inicio">Nueva bitacora</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <ValidationObserver ref="formBitacora" v-slot="{ invalid, validated, passes, validate }">
        <v-card>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col class="pb-0" cols="6">
                            <c-date
                                v-model="bitacora.fecha"
                                placeholder="Fecha de bitacora"
                                :max="moment().format('YYYY-MM-DD')"
                                rules="required"
                            >
                            </c-date>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <c-texto
                                v-model="bitacora.periodicidad_seguimientos"
                                label="Periodicidad (meses)"
                                name="periodicidad"
                                rules="required|numeric"
                                upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-text-area
                                label="Bitacora"
                                v-model="bitacora.bitacora"
                                name="bitacora"
                                rules="required"
                            ></c-text-area>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <ValidationProvider name="alerta inmediata" rules="required" v-slot="{ errors, valid }">
                            <v-checkbox
                                v-model="bitacora.alerta_inmediata"
                                label="Alerta inmediata"                                
                                :true-value="true"
                                :false-value="false"
                                :error-messages="errors"                                
                            >
                            </v-checkbox>
                            </ValidationProvider>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <ValidationProvider name="patologia" rules="required" v-slot="{ errors, valid }">
                            <v-checkbox
                                v-model="bitacora.paciente_no_rcv"
                                label="Usuario que refiere no tener ninguna patologia"                                
                                :true-value="true"
                                :false-value="false"
                                :error-messages="errors"                                
                            >
                            </v-checkbox>
                            </ValidationProvider>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-text-area
                                label="Observaciones"
                                v-model="bitacora.observaciones"
                                name="observaciones"
                            ></c-text-area>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pb-0" cols="12">
                            <v-data-table
                                :headers="headers"
                                :items="bitacora.tipificaciones"
                                class="elevation-1 mt-4"
                            >
                                <template v-slot:top>
                                    <v-toolbar
                                        flat
                                    >
                                        <v-toolbar-title>Tipificaciones</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                        color="primary"
                                        dark
                                        class="mb-2"
                                        @click="crearNuevaTipificacion"
                                        >
                                            <v-icon dark>
                                                mdi-plus
                                            </v-icon>
                                        </v-btn>
                                        <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                                        <v-card>
                                            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                            <v-spacer></v-spacer>
                                            </v-card-actions>
                                        </v-card>
                                        </v-dialog> -->
                                    </v-toolbar>
                                </template>
                                
                                <template v-slot:item.reftipificacion_id="{ item }">
                                    <span>{{ complementosRCV ? complementosRCV.ref_tipificaciones.find(x => x.id == item.reftipificacion_id).descripcion: '-' }}</span>
                                </template>
                                <template v-slot:item.actions="{ item }">                                    
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editItem(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    v-if="!item.bitacora_id"
                                    small
                                    @click="deleteItem(item)"
                                >
                                    mdi-delete
                                </v-icon>
                                </template>
                                <template v-slot:no-data>
                                    <div class="title grey--text text-center pa-4">No hay registros para mostrar</div>
                                </template>
                            </v-data-table>
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
                large
                color="primary"
                @click="save"
            >
                <v-icon left>fas fa-save</v-icon>
                Guardar
            </v-btn>
            </v-card-actions>
        </v-card>
        </ValidationObserver>
        <crear-tipificacion 
            ref="crearTipificacion" 
            :tipificaciones="bitacora.tipificaciones"
            :listTipificaciones="complementosRCV ? complementosRCV.ref_tipificaciones: []"
            ></crear-tipificacion>
    </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
const CrearTipificacion = () => import('Views/aps/rcv/encuestas/components/CrearTipificacion')
export default {
    components: {
        CrearTipificacion
    },
    data: () => ({
        dialogNuevaBitacora: false,
        bitacora: null,
        bitacorasModel: {
            rcv_id: null,
            fecha: null,
            afiliado_id: null,
            periodicidad_seguimientos: null,
            bitacora: null,
            alerta_inmediata: null,
            paciente_no_rcv: null,
            observaciones: null,
            tipificaciones: [],
        },
        headers: [
            { text: 'Tipificacion', value: 'reftipificacion_id'},
            { text: 'Cod. Servicio', value: 'codigo_servicio' },
            { text: 'F. Solicitud', value: 'fecha_solicitud' },
            { text: 'F. Programacion', value: 'fecha_programada' },
            { text: 'F. Prestacion', value: 'fecha_prestacion' },
            { text: 'Opciones', value: 'actions'}
        ],
    }),
    computed: {
        ...mapGetters([
            'complementosRCV'
        ])
    },
    created(){
        this.bitacora = this.clone(this.bitacorasModel)
    },
    methods: {
        open(item){
            this.getTipificacionesPendientes(item.id)
            this.bitacora.afiliado_id = item.id
            this.dialogNuevaBitacora = true
        },
        close(){
            this.$refs.formBitacora.reset()
            this.bitacora = this.clone(this.bitacorasModel)
            this.dialogNuevaBitacora = false
        },
        crearNuevaTipificacion(){
            this.$refs.crearTipificacion.open()
        },
        editItem(item){
            console.log(item);
        },
        deleteItem(item){
            let editedIndex = this.bitacora.tipificaciones.indexOf(item)
            this.bitacora.tipificaciones.splice(editedIndex, 1)
        },
        save(){
            this.$refs.formBitacora.validate().then(result => {
                if (result) {
                    this.loading = true
                    this.bitacora.alerta_inmediata = this.bitacora.alerta_inmediata ? 1 : 0
                    this.bitacora.paciente_no_rcv = this.bitacora.paciente_no_rcv ? 1 : 0
                    if(this.bitacora.bitacora_id) delete this.bitacora.bitacora_id
                    this.axios.post(`bitacoras`, this.bitacora)
                        .then(response => {
                            this.$emit('guardado', response.data)
                            this.$store.commit('snackbar', {color: 'success', message: `Bitacora creada correctamente.`})
                            this.close()
                        })
                        .catch(error => {
                            this.loading = false
                            this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                        })
                }
            })
        },
        getTipificacionesPendientes(afiliado_id){
            this.loading = true
            this.axios.get(`tipificaciones-pendientes/${afiliado_id}`)
                .then(response => {
                    console.log(response.data);
                    this.bitacora.tipificaciones = response.data
                })
                .catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {color: 'error', message: `al recuperar la encuesta.`, error: error})
                })
        }
        
    }

}
</script>

<style>

</style>