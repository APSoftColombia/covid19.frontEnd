<template>
    <v-dialog
    v-model="dialogNuevaBitacora"
    max-width="1200px"
    transition="dialog-bottom-transition"
    persistent
    >
        <v-toolbar dark color="primary">
            <!-- <v-icon left>far fa-clipboard</v-icon> -->
            <v-toolbar-title id="inicio">{{ bitacora.id ? 'Editar bitacora' : 'Crear bitacora' }}</v-toolbar-title>
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
                                name="fecha bitacora"
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
                            <ValidationProvider name="alerta inmediata" rules="required" v-slot="{ errors }">
                            <v-checkbox
                                v-model="bitacora.alerta_inmediata"
                                label="Alerta inmediata"                                
                                :true-value="1"
                                :false-value="0"
                                :error-messages="errors"                                
                            >
                            </v-checkbox>
                            </ValidationProvider>
                        </v-col>
                        <v-col class="pb-0" cols="6">
                            <ValidationProvider name="patologia" rules="required" v-slot="{ errors }">
                            <v-checkbox
                                v-model="bitacora.paciente_no_rcv"
                                label="Usuario que refiere no tener ninguna patologia"                                
                                :true-value="1"
                                :false-value="0"
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
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                color="primary"
                                                v-bind="attrs"
                                                v-on="on"
                                                dark
                                                class="mb-2"
                                                @click="crearNuevaTipificacion"
                                                >
                                                    <v-icon dark>
                                                        mdi-plus
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Agregar tipificacion</span>
                                        </v-tooltip>
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
                                    @click="editTipificacion(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteTipificacion(item)"
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
                :disabled="loadingButtons"
                :loading="loadingButtons"
            >
                Cancelar
            </v-btn>
            <v-btn
                large
                color="primary"
                @click="bitacora.id ? update() : save()"
                :disabled="loadingButtons"
                :loading="loadingButtons"
            >
                <v-icon left>fas fa-save</v-icon>
                {{ bitacora.id ? 'Editar' : 'Crear' }}
            </v-btn>
            </v-card-actions>
        </v-card>
        </ValidationObserver>
        <crear-tipificacion 
            ref="crearTipificacion"
            :listTipificaciones="complementosRCV ? complementosRCV.ref_tipificaciones: []"
            @add-tipificacion="addTipificacion"
            @update-tipificacion="updateTipificacion"
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
        loadingButtons: false,
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
        open(item, bitacora = null){
          if(!bitacora){
            this.getTipificacionesPendientes(item.id)
            this.bitacora.alerta_inmediata = 0
            this.bitacora.paciente_no_rcv = 0
            this.bitacora.afiliado_id = item.id
          }else{
            this.bitacora = {...bitacora}
            console.log(this.bitacora);
          }
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
        editTipificacion(item){
            let editedIndex = this.bitacora.tipificaciones.indexOf(item)
            item.index = editedIndex
            this.$refs.crearTipificacion.open(this.clone(item))
        },
        addTipificacion(item){
            this.bitacora.tipificaciones.push(item)
        },
        updateTipificacion(item){
            Object.assign(this.bitacora.tipificaciones[item.index], item.tipificacion)
        },
        deleteTipificacion(item){
            let editedIndex = this.bitacora.tipificaciones.indexOf(item)
            this.bitacora.tipificaciones.splice(editedIndex, 1)
        },
        save(){
            this.$refs.formBitacora.validate().then(result => {
                if (result) {
                    this.loading = true
                    this.loadingButtons = true
                    this.axios.post(`bitacoras`, this.bitacora).then(response => {
                        this.$emit('guardado', response.data)
                        this.$store.commit('snackbar', {color: 'success', message: `Bitacora creada correctamente.`})
                        this.close()
                        this.loadingButtons = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.loadingButtons = false
                        this.$store.commit('snackbar', {color: 'error', message: `al guardar la encuesta.`, error: error})
                    })
                }
            })
        },
        update(){
            this.$refs.formBitacora.validate().then(result => {
                if (result) {
                    this.loading = true
                    this.loadingButtons = true
                    this.axios.put(`bitacoras/${this.bitacora.id}`, this.bitacora).then(response => {
                        this.$emit('guardado', response.data)
                        this.$store.commit('snackbar', {color: 'success', message: `Bitacora actualizada correctamente.`})
                        this.close()
                        this.loadingButtons = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.loadingButtons = false
                        this.$store.commit('snackbar', {color: 'error', message: `al actualizar la encuesta.`, error: error})
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