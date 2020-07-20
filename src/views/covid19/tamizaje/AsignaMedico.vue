<template>
    <v-dialog v-model="dialog" persistent max-width="900">
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-user-md</v-icon>
                <v-list-item v-if="tamizaje">
                    <v-list-item-content>
                        <v-list-item-title class="title">Asignación de caso de estudio:
                            <template v-if="tamizaje.id">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{on}">
                                        <span v-on="on" class="border-bottom-1">ERP</span>
                                    </template>
                                    <span>Encuesta de Riesgo Poblacional</span>
                                </v-tooltip>
                                No. {{tamizaje.id}}
                            </template>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid v-if="tamizaje">
                <datos-personales :tamizaje="tamizaje"></datos-personales>
<!--                <v-row v-if="tamizaje.ultima_reasignacion">-->
<!--                    <v-col cols="12">-->
<!--                        <v-card-->
<!--                                class="mx-auto"-->
<!--                                outlined-->
<!--                        >-->
<!--                            <v-list-item two-line>-->
<!--                                <v-list-item-avatar-->
<!--                                        tile-->
<!--                                        size="70"-->
<!--                                        color="orange"-->
<!--                                >-->
<!--                                    <v-icon large color="white">mdi-share-variant</v-icon>-->
<!--                                </v-list-item-avatar>-->
<!--                                <v-list-item-content>-->
<!--                                    <div class="overline">Solicitud de reasignación</div>-->
<!--                                    <v-list-item-title class="headline">{{ordenesMedicas && ordenesMedicas.find(x => x.id === tamizaje.ultima_reasignacion.orden_medica_id).orden}}</v-list-item-title>-->
<!--                                    <v-list-item-subtitle>{{tamizaje.ultima_reasignacion.causa}}</v-list-item-subtitle>-->
<!--                                </v-list-item-content>-->
<!--                            </v-list-item>-->
<!--                        </v-card>-->
<!--                    </v-col>-->
<!--                </v-row>-->
                <ValidationObserver ref="formAsignacion" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row class="mt-3">
                        <v-col cols="12" class="pb-0">
                            <c-select-complete
                                    v-model="orden_medica_id"
                                    label="Tipo de asignación"
                                    rules="required"
                                    name="tipo de asignación"
                                    :items="ordenesMedicas"
                                    item-text="orden"
                                    item-value="id"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                            <ValidationProvider name="médico asignado" rules="required" v-slot="{ errors }">
                                <v-autocomplete
                                        :label="medicoId ? 'Médico' : 'Seleccionar Médico'"
                                        v-model="medicoId"
                                        :items="medicos"
                                        outlined
                                        :error-messages="errors"
                                        :filter="filterMedicos"
                                        item-value="id"
                                >
                                    <template v-slot:selection="{ item, index }">
                                        <v-list-item class="pa-0" style="width: 100% !important;">
                                            <v-list-item-content class="pa-0">
                                                <v-list-item-title>{{item.name}}</v-list-item-title>
                                                <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                    <template v-slot:item="{ item, index }">
                                        <template>
                                            <v-list-item-content class="pa-0">
                                                <v-list-item-title>{{item.name}}</v-list-item-title>
                                                <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                        </template>
                                    </template>
                                </v-autocomplete>
                            </ValidationProvider>
                        </v-col>

                    </v-row>
                </ValidationObserver>
                <v-card-actions>
                    <v-btn @click.stop="close">
                        <v-icon>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.stop="asignar">
                        <v-icon left>fas fa-save</v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
    export default {
        name: 'AsignarMedico',
        props: {
            medicos: {
                type: Array,
                default: () => []
            }
        },
        components: {
            DatosPersonales
        },
        data: () => ({
            dialog: false,
            loading: false,
            tamizaje: null,
            medicoId: null,
            orden_medica_id: null,
            filterMedicos (item, queryText) {
                const hasValue = val => val != null ? val : ''
                const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
                const query = hasValue(queryText)
                return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
            }
        }),
        computed: {
            ...mapGetters([
                'modelTamizaje',
                'tiposDocumentoIdentidad',
                'ordenesMedicas'
            ])
        },
        created() {
            this.tamizaje = this.clone(this.modelTamizaje)
        },
        methods: {
            open (idTamizaje = null) {
                if (idTamizaje) this.getTamizaje(idTamizaje)
                this.dialog = true
            },
            close () {
                this.dialog = false
                this.tamizaje = this.clone(this.modelTamizaje)
                this.medicoId = null
                this.orden_medica_id = null
                this.$refs.formAsignacion.reset()
            },
            asignar () {
                this.$refs.formAsignacion.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.axios.post(`asignar-estudio`, {tamizaje_id: this.tamizaje.id, user_id : this.medicoId, orden_medica_id: this.orden_medica_id})
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El caso de estudio se asignó correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al asignar el caso de estudio.`, error: error})
                            })
                    }
                })
            },
            getTamizaje (idTamizaje) {
                this.loading = true
                this.axios.get(`tamizajes/${idTamizaje}`)
                    .then(response => {
                        this.tamizaje = response.data
                        this.orden_medica_id = this.tamizaje.orden_medica_id
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar el tamizaje.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>