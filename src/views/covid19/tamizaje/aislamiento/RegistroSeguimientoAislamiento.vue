<template>
    <v-dialog v-model="dialog" persistent max-width="420">
        <v-card>
            <v-toolbar dark color="deep-purple">
                <v-icon left>mdi-door-closed-lock</v-icon>
                <v-toolbar-title v-if="seguimiento_aislamiento">
                    <v-toolbar-title>Seguimiento {{seguimiento_aislamiento.id ? `No. ${seguimiento_aislamiento.id}` : ''}}</v-toolbar-title>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <ValidationObserver ref="formSeguimientoAislamiento" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <form-seguimiento-aislamiento
                            registra-fecha
                            :aislamiento="aislamiento"
                            :seguimiento_aislamiento="seguimiento_aislamiento"
                    />
                </ValidationObserver>
            </v-container>
            <v-divider class="mt-0"/>
            <v-card-actions>
                <v-btn
                        large
                        @click.stop="close"
                >
                    <v-icon>mdi-close</v-icon>
                    Cerrar
                </v-btn>
                <v-spacer/>
                <v-btn
                        large
                        color="deep-purple"
                        @click.stop="guardarSeguimiento"
                        class="white--text"
                >
                    <v-icon left>fas fa-save</v-icon>
                    Guardar Seguimiento
                </v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"/>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import FormSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/FormSeguimientoAislamiento'

    export default {
        name: 'RegistroSeguimientoAislamiento',
        props: {
            aislamiento: {
                type: Object,
                default: null
            }
        },
        components: {
            FormSeguimientoAislamiento
        },
        data: () => ({
            loading: false,
            dialog: false,
            seguimiento_aislamiento: null
        }),
        computed: {
            ...mapGetters([
                'modelSeguimientoAislamiento'
            ])
        },
        created() {
            this.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
        },
        methods: {
            guardarSeguimiento () {
                this.$refs.formSeguimientoAislamiento.validate().then(result => {
                    if (result) {
                        this.loading = true
                        let request = null
                        if (this.seguimiento_aislamiento.id) {
                            request = this.axios.put(`update-seguimiento-aislamiento/${this.seguimiento_aislamiento.id}`, this.seguimiento_aislamiento)
                        } else {
                            request = this.axios.post(`aislamientos/${this.seguimiento_aislamiento.aislamiento_id}/seguimientos`, this.seguimiento_aislamiento)
                        }
                        request
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El seguimiento de aislamiento se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar el seguimiento de aislamiento.`, error: error})
                            })
                    }
                })
            },
            open (seguimiento = null) {
              if(seguimiento) {
                seguimiento.registra_egreso = seguimiento.fecha_egreso ? 1 : 0
                this.seguimiento_aislamiento = this.clone(seguimiento)
              } else {
                this.seguimiento_aislamiento.aislamiento_id = this.aislamiento.id
              }
                this.dialog = true
            },
            close () {
                this.dialog = false
                this.loading = false
                this.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
                this.$refs.formSeguimientoAislamiento.reset()
            }
        }
    }
</script>

<style scoped>

</style>