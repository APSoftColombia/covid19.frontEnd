<template>
    <v-dialog v-model="dialog" persistent max-width="720">
        <v-card>
            <v-toolbar dark color="deep-purple">
                <v-icon left>mdi-door-closed-lock</v-icon>
                <v-toolbar-title v-if="aislamiento">
                    <v-toolbar-title>{{aislamiento.id ? `Orden de Aislamiento No. ${aislamiento.id}` : 'Nueva Orden de Aislamiento'}}</v-toolbar-title>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <ValidationObserver ref="formAislamiento" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <form-aislamiento :tamizaje="tamizaje" :aislamiento="aislamiento" :seguimiento_aislamiento="seguimiento_aislamiento"></form-aislamiento>
                </ValidationObserver>
            </v-container>
            <v-divider class="mt-0"></v-divider>
            <v-card-actions>
                <v-btn
                        large
                        @click.stop="close"
                >
                    <v-icon>mdi-close</v-icon>
                    Cerrar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                        large
                        color="deep-purple"
                        @click.stop="guardarAislamiento"
                        class="white--text"
                >
                    <v-icon left>fas fa-save</v-icon>
                    Guardar Aislamiento
                </v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    import FormAislamiento from 'Views/covid19/tamizaje/aislamiento/FormAislamiento'
    export default {
        name: 'RegistroAislamiento',
        components: {
            FormAislamiento
        },
        data: () => ({
            loading: false,
            dialog: false,
            aislamiento: null,
            seguimiento_aislamiento: null,
            tamizaje: null
        }),
        computed: {
            ...mapGetters([
                'modelAislamiento',
                'modelSeguimientoAislamiento'
            ])
        },
        created() {
            this.aislamiento = this.clone(this.modelAislamiento)
            this.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
        },
        methods: {
            guardarAislamiento () {
                this.$refs.formAislamiento.validate().then(result => {
                    if (result) {
                        this.loading = true
                        let request = null
                        if (this.aislamiento.id) {
                            request = this.axios.put(`aislamientos/${this.aislamiento.id}`, this.aislamiento)
                        } else {
                            this.aislamiento.tamizaje_id = this.tamizaje.id
                            this.seguimiento_aislamiento.fecha = this.aislamiento.fecha_ingreso
                            this.aislamiento.fecha_egreso = this.seguimiento_aislamiento.fecha_egreso
                            request = this.axios.post(`aislamientos`, {aislamiento: this.aislamiento, seguimiento_aislamiento: this.seguimiento_aislamiento})
                        }
                        request
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `El aislamiento se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar el aislamiento.`, error: error})
                            })
                    }
                })
            },
            open (aislamiento = null, tamizaje = null) {
                if (aislamiento) this.aislamiento = aislamiento
                else if (tamizaje) {
                    this.tamizaje = tamizaje
                    this.aislamiento.tamizaje_id = this.tamizaje.id
                }
                this.dialog = true
            },
            close () {
                this.$refs.formAislamiento.reset()
                this.dialog = false
                this.loading = false
                this.aislamiento = this.clone(this.modelAislamiento)
                this.seguimiento_aislamiento = this.clone(this.modelSeguimientoAislamiento)
            }
        }
    }
</script>

<style scoped>

</style>