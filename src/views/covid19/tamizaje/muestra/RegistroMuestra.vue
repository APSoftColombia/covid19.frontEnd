<template>
    <v-dialog v-model="dialog" persistent max-width="720">
        <v-card>
            <v-toolbar dark color="error">
                <v-icon left>fas fa-vials</v-icon>
                <v-toolbar-title v-if="muestra">
                    <v-toolbar-title>{{muestra.id ? `muestra No. ${muestra.id}` : 'Nueva muestra'}}</v-toolbar-title>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <ValidationObserver ref="formMuestra" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row>
                        <v-col class="pb-0" cols="12">
                            <span class="title">Toma de la muestra</span>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-date
                                    v-model="muestra.fecha_toma"
                                    rules="required"
                                    label="Fecha"
                                    name="fecha de toma de la muestra"
                                    :max="moment().format('YYYY-MM-DD')"
                                    :min="fechaMinimaMuestra ? moment(fechaMinimaMuestra).format('YYYY-MM-DD') : null"
                            >
                            </c-date>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-texto
                                    v-model="muestra.lugar_toma"
                                    label="Lugar"
                                    rules="required"
                                    name="lugar de la toma"
                                    upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-select-complete
                                    v-model="muestra.tipo"
                                    label="Tipo de Muestra"
                                    :items="tiposMuestra"
                                    rules="required"
                                    name="tipo de muestra"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-select-complete
                                    v-model="muestra.tomador_muestra_id"
                                    label="Entidad que realiza la toma"
                                    :items="tomadores"
                                    rules="required"
                                    name="entidad que realiza la toma"
                                    item-text="institucion"
                                    item-value="id"
                            >
                            </c-select-complete>
                        </v-col>
                        <v-col class="pb-0" cols="12" v-if="muestra.tomador_muestra_id === 0">
                            <c-texto
                                    v-model="muestra.tomado_por"
                                    label="Nombre Entidad"
                                    rules="required"
                                    name="nombre entidad"
                                    upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <c-texto
                                    v-model="muestra.nombre_tomador"
                                    label="Tomado por"
                                    rules="required"
                                    name="tomado por"
                                    upper-case
                            >
                            </c-texto>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                            <span class="title">Resultado de la muestra</span>
                        </v-col>
                        <v-col class="pb-0" cols="12" sm="12">
                            <c-select-complete
                                    v-model="muestra.resultado"
                                    label="Resultado"
                                    :items="[{value: 0, text: 'Negativo'}, {value: 1, text: 'Positivo'}, {value: 2, text: 'No Procesado | Falla Preanalítica'}]"
                                    item-value="value"
                                    item-text="text"
                            >
                            </c-select-complete>
                        </v-col>
                        <template v-if="muestra.resultado !== null">
                            <v-col class="pb-0" cols="12">
                                <c-date
                                        v-model="muestra.fecha_resultado"
                                        label="Fecha"
                                        :max="moment().format('YYYY-MM-DD')"
                                        name="fecha resultado"
                                        :rules="[muestra.resultado !== null ? 'required' : null, muestra.fecha_toma ? `mindate:${moment(muestra.fecha_toma).format('DD/MM/YYYY')}` : null].filter(x => x).join('|')"
                                        :min="muestra.fecha_toma ? moment(muestra.fecha_toma).format('YYYY-MM-DD') : null"
                                >
                                </c-date>
                            </v-col>
                            <v-col class="pb-0" cols="12">
                                <c-select-complete
                                        v-model="muestra.laboratorio_id"
                                        label="Laboratorio"
                                        :items="laboratorios"
                                        :rules="muestra.resultado !== null ? 'required' : null"
                                        name="laboratorio"
                                        item-text="laboratorio"
                                        item-value="id"
                                >
                                </c-select-complete>
                            </v-col>
                            <v-col class="pb-0" cols="12" v-if="muestra.laboratorio_id === 0">
                                <c-texto
                                        v-model="muestra.laboratorio"
                                        label="Nombre Laboratorio"
                                        rules="required"
                                        name="nombre laboratorio"
                                        upper-case
                                >
                                </c-texto>
                            </v-col>
                            <v-col class="pb-0" cols="12" sm="12">
                                <v-file-input
                                        v-model="muestra.archivo"
                                        :hint="muestra.path_resultado && !muestra.archivo ? `Cargado actualmente: ${muestra.path_resultado.split('/')[1]}` : ''"
                                        label="Archivo"
                                        prepend-icon="mdi-file-pdf"
                                        accept=".pdf"
                                        outlined
                                        dense
                                        persistent-hint
                                ></v-file-input>
                            </v-col>
                        </template>
                    </v-row>
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
                        color="error"
                        @click.stop="guardarMuestra"
                >
                    <v-icon left>fas fa-save</v-icon>
                    Guardar Muestra
                </v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'RegistroMuestra',
        data: () => ({
            loading: false,
            dialog: false,
            muestra: null,
            tamizaje: null
        }),
        computed: {
            ...mapGetters([
                'modelMuestra',
                'tiposMuestra',
                'tomadores',
                'laboratorios'
            ]),
            fechaMinimaMuestra () {
                return this && this.tamizaje && this.tamizaje.muestras && this.tamizaje.muestras.length ? this.tamizaje.muestras[0].fecha_resultado ? this.tamizaje.muestras[0].fecha_resultado : this.tamizaje.muestras[0].fecha_toma : null
            }
        },
        watch: {
          'muestra.tomador_muestra_id': {
              handler (val) {
                  if (val !== 0) {
                      this.muestra.tomado_por = null
                  }
              },
              immediate: false
          },
            'muestra.laboratorio_id': {
              handler (val) {
                  if (val !== 0) {
                      this.muestra.laboratorio = null
                  }
              },
              immediate: false
          }
        },
        created() {
            this.muestra = this.clone(this.modelMuestra)
        },
        methods: {
            guardarMuestra () {
                this.$refs.formMuestra.validate().then(result => {
                    if (result) {
                        this.loading = true
                        let data = new FormData()
                        for (const prop in this.muestra) {
                            if (this.muestra[prop] !== null && typeof this.muestra[prop] !== 'undefined') data.append(`${prop}`, this.muestra[prop])
                            // if (this.muestra[prop] !== null && typeof this.muestra.archivo !== 'undefined') data.append(`${prop}`, this.muestra[prop])
                        }
                        let request = this.muestra.id
                            ? this.axios.post(`muestras/${this.muestra.id}`, data)
                            : this.axios.post(`tamizajes/${this.muestra.tamizaje_id}/muestras`, data)
                        request
                            .then(response => {
                                this.$emit('guardado', response.data)
                                this.$store.commit('snackbar', {color: 'success', message: `La muestra se guardo correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al guardar la muestra.`, error: error})
                            })
                    }
                })
            },
            open (muestra = null, tamizaje = null) {
                if (muestra) this.muestra = muestra
                else if (tamizaje) {
                    this.tamizaje = tamizaje
                    this.muestra.tamizaje_id = this.tamizaje.id
                }
                this.dialog = true
            },
            close () {
                this.$refs.formMuestra.reset()
                this.dialog = false
                this.loading = false
                this.muestra = this.clone(this.modelMuestra)
            }
        }
    }
</script>

<style scoped>

</style>