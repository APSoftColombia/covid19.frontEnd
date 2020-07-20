<template>
    <v-dialog v-model="dialog" persistent max-width="720">
        <template v-slot:activator="{onx}">
            <v-tooltip top>
                <template v-slot:activator="{on}">
                    <v-btn
                            icon
                            x-large
                            color="primary"
                            v-on="on"
                            @click.stop="dialog = true"
                    >
                        <v-icon>fas fa-upload</v-icon>
                    </v-btn>
                </template>
                <span>Cargar Archivo</span>
            </v-tooltip>
        </template>
        <v-card>
            <v-card-title class="headline">Carga masiva de registros</v-card-title>
            <v-card-text>
                <ValidationObserver ref="formArchivo" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <ValidationProvider name="archivo" rules="required" v-slot="{ errors, valid }">
                        <v-file-input
                                v-model="archivo"
                                placeholder="Archivo"
                                prepend-icon="fas fa-file-csv"
                                accept=".csv,.txt"
                                outlined
                                dense
                                hint="Extensiones permitidas: .csv, .txt"
                                persistent-hint
                                :error-messages="errors"
                        >
                            <template v-slot:append-outer>
                                <v-btn x-large color="green darken-1" v-if="$vuetify.breakpoint.xsOnly" icon @click="cargarArchivo" style="top: -4px !important;">
                                    <v-icon>mdi-file-upload</v-icon>
                                </v-btn>
                                <v-btn v-else large color="green darken-1" text @click="cargarArchivo" style="top: -10px !important;">
                                    <v-icon left large>mdi-file-upload</v-icon>
                                    Cargar Archivo
                                </v-btn>
                            </template>
                        </v-file-input>
                    </ValidationProvider>
                </ValidationObserver>
            </v-card-text>
            <v-expand-transition>
                <v-card-text v-if="errores && errores.length">
                    <v-row class="headline justify-center">
                        <v-icon color="orange" left>mdi-alert</v-icon>
                        Errores en el archivo
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-list dense>
                                <v-list-item
                                        v-for="(error, indexError) in errores"
                                        :key="`Error${indexError}`"
                                        @click="hover = true"
                                >
                                    <v-list-item-avatar class="ma-0">
                                        <span>{{indexError + 1}}</span>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title v-text="error"></v-list-item-title>
                                    </v-list-item-content>
                                    <!--                                <v-list-item-action>-->
                                    <!--                                    <v-btn icon>-->
                                    <!--                                        <v-icon color="grey lighten-1">mdi-information</v-icon>-->
                                    <!--                                    </v-btn>-->
                                    <!--                                </v-list-item-action>-->
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-expand-transition>
            <v-divider class="pa-0 ma-0"></v-divider>
            <v-card-actions class="justify-center">
                <v-btn block text @click="close">Cerrar</v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'CargadorSeguimientos',
        data: () => ({
            hover: true,
            loading: false,
            dialog: false,
            archivo: null,
            errores: []
        }),
        watch: {
            'archivo': {
                handler () {
                    this.errores = []
                },
                immediate: false
            }
        },
        methods: {
            cargarArchivo () {
                this.$refs.formArchivo.validate().then(result => {
                    if (result) {
                        this.errores = []
                        this.loading = true
                        let data = new FormData()
                        data.append('archivo', this.archivo)
                        this.axios.post(`archivo-tamizajes`, data)
                            .then(response => {
                                console.log('response', response)
                                this.$store.commit('snackbar', {color: 'success', message: `Los registros del archivo se cargaron correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                console.log('error', error.response)
                                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors.length) {
                                    this.errores = error.response.data.errors
                                }
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al procesar el archivo.`, error: error})
                            })

                        this.axios.get(`archivo-tamizajes`)
                            .then(response => {
                                console.log('response get', response)
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al recuperar el listado de procesos de carga masiva.`, error: error})
                            })
                    }
                })
            },
            close () {
                this.$refs.formArchivo.reset()
                this.errores = []
                this.dialog = false
                this.loading = false
                this.archivo = null
            }
        }
    }
</script>

<style scoped>

</style>