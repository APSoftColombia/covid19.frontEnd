<template>
    <v-card outlined tile>
        <v-container fluid>
            <label>SÍNTOMAS: Preguntar al paciente sobre los siguientes síntomas, es caso de estudio al presentar más de dos a la vez en los últimos 14 dias.</label>
            <template v-for="(sintoma, indexSintoma) in sintomas">
                <v-row align="center" v-if="sintoma" :key="`sintoma${indexSintoma}`">
                    <v-checkbox
                            :label="!sintoma.id ? sintoma.descripcion : ''"
                            v-model="sintoma.id"
                            class="shrink mr-2"
                            :true-value="sintoma.valueid"
                            :false-value="null"
                            :hide-details="!sintoma.id"
                            :error="!!error"
                    ></v-checkbox>
                    <c-date
                            v-if="sintoma.id"
                            v-model="sintoma.fecha_inicio"
                            rules="required"
                            :label="sintoma.descripcion"
                            placeholder="Fecha Síntoma"
                            name="fecha Síntoma"
                            :vid="`fecha${indexSintoma}`"
                            :max="moment().format('YYYY-MM-DD')"
                            hide-details
                    >
                    </c-date>
                </v-row>
            </template>
            <v-row>
                <v-checkbox
                        label="Ninguno de los anteriores"
                        v-model="sinSintomas"
                        class="shrink mr-2"
                        :error="!!error"
                ></v-checkbox>
            </v-row>
            <v-row v-if="!!error">
                <div class="v-messages theme--light error--text" role="alert">
                    <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                            {{error}}
                        </div>
                    </div>
                </div>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'SintomasFecha',
        props: {
            evolucion: {
                type: Object,
                default: null
            }
        },
        data: () => ({
           error: null,
           sintomas: [],
            sinSintomas: false
        }),
        computed: {
            ...mapGetters([
                'sintomasFecha'
            ])
        },
        watch: {
            evolucion: {
                handler (val) {
                    if (val) {
                        this.reloadSintomas()
                    }
                },
                immediate: true
            },
            sintomas: {
                handler (val) {
                    this.evolucion.sintomas = val
                    if (this.evolucion.sintomas.length && this.evolucion.sintomas.filter(x => x.id !== null).length) {
                       this.sinSintomas = false
                    }
                    this.validate()
                },
                immediate: false,
                deep: true
            },
            sinSintomas: {
                handler (val) {
                    if (val) {
                        this.reloadSintomas()
                    } else {
                        this.validate()
                    }
                },
                immediate: false
            }
        },
        methods: {
            reloadSintomas () {
                this.evolucion.sintomas = []
                this.sintomas = this.clone(this.sintomasFecha).map(x => { return {
                    id: null,
                    valueid: x.id,
                    descripcion: x.descripcion,
                    fecha_inicio: null
                }
                })
              this.evolucion.sintomas = this.sintomas
            },
          assign(sintomas) {
            this.evolucion.sintomas.forEach(x => {
              sintomas.forEach(z => {
                if(x.valueid === z.id) {
                  x.id = z.id
                  x.fecha_inicio = z.fecha_inicio
                }
              })
            })
          },
            validate () {
                console.log('this.evolucion.sintomas', this.evolucion.sintomas)
                if (this.evolucion.sintomas.length) {
                    this.evolucion.sintomas.forEach(x => x.fecha_inicio = x.id ? x.fecha_inicio : null)
                }
                this.error = (this.evolucion.sintomas.length === 0 || this.evolucion.sintomas.filter(x => x.id !== null).length === 0) && !this.sinSintomas ? 'No hay una opción de síntoma seleccionada' : null
                console.log('this.error', this.error)
                return this.error
            }
        }
    }
</script>

<style scoped>

</style>