<template>
    <v-container fluid class="grid-list-md">
        <v-card>
            <page-title-bar title="Encuestas registradas">
                <template slot="actions">
                    <v-btn icon @click="$router.push({name: 'Encuestas'})">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </page-title-bar>
            <v-card-text class="ma-0 pa-0">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-center"></th>
                                <th class="text-left">Encuesta</th>
                                <th class="text-left">Estado</th>
                                <th class="text-left">Dirección</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                    v-for="(encuesta, indexencuesta) in encuestasLite"
                                    :key="`encuesta${indexencuesta}`"
                            >
                                <td class="text-center">
<!--                                    <v-tooltip top v-if="encuesta && !encuesta.finalizada">-->
<!--                                        <template v-slot:activator="{ on }">-->
<!--                                            <v-btn class="mx-2" icon color="primary" v-on="on" :to="{name: 'EditaEncuesta', params: {uuid: encuesta.uuid}}">-->
<!--                                                <v-icon>mdi-pencil</v-icon>-->
<!--                                            </v-btn>-->
<!--                                        </template>-->
<!--                                        <span>Actualizar Encuesta</span>-->
<!--                                    </v-tooltip>-->
                                    <v-tooltip top v-if="encuesta && encuesta.finalizada">
                                        <template v-slot:activator="{ on }">
                                            <v-btn class="mx-2" icon color="primary" v-on="on" :to="{name: 'Resultados', params: {uuid: encuesta.uuid, encuesta: encuesta}}">
                                                <v-icon>mdi-file-chart</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Resultados</span>
                                    </v-tooltip>
<!--                                    <v-tooltip top v-if="encuesta && onLine && !encuesta.fecha_sincronizado">-->
<!--                                        <template v-slot:activator="{ on }">-->
<!--                                            <v-btn class="mx-2" icon color="orange" v-on="on" @click.stop="sincronizar(encuesta)">-->
<!--                                                <v-icon>mdi-sync</v-icon>-->
<!--                                            </v-btn>-->
<!--                                        </template>-->
<!--                                        <span>Sincronizar</span>-->
<!--                                    </v-tooltip>-->
                                </td>
                                <td>
                                    <v-list-item class="pa-0">
                                        <v-list-item-content class="pa-0">
                                            <v-list-item-title>Codigo: {{encuesta && encuesta.uuid}}</v-list-item-title>
                                            <v-list-item-subtitle v-if="encuesta.created_at">Creada: {{moment(encuesta.created_at).format('YYYY-MM-DD HH:mm')}}</v-list-item-subtitle>
                                            <v-list-item-subtitle v-if="encuesta.updated_at">Actualizada: {{moment(encuesta.updated_at).format('YYYY-MM-DD HH:mm')}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </td>
                                <td>
                                    <v-list-item class="pa-0">
                                        <v-list-item-content class="pa-0">
                                            <v-list-item-subtitle>
                                                <v-chip
                                                        class="mr-4"
                                                        color="primary"
                                                        label
                                                        small
                                                >
                                                    <v-icon left small>mdi-timer</v-icon>
                                                    {{getTime(encuesta && encuesta.duracion)}}
                                                </v-chip>
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle>
                                                <v-chip
                                                        label
                                                        :color="encuesta && encuesta.finalizada ? 'Success' : 'warning'"
                                                        small
                                                >
                                                    {{encuesta && encuesta.finalizada ? 'Finalizada' : 'Pendiente'}}
                                                </v-chip>
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </td>
                                <td>
                                    <v-list-item class="pa-0">
                                        <v-list-item-content class="pa-0">
                                            <v-list-item-title>{{encuesta && encuesta.direccion}}</v-list-item-title>
                                            <v-list-item-subtitle>{{`${encuesta.count_individuales} Integrante${encuesta.count_individuales !== 1 ? 's' : ''}`}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
        </v-card>
        <app-section-loader :status="loading"></app-section-loader>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'ListadoEncuestas',
        props: {
            formulariouuid: {
                type: [String, Number],
                default: null
            }
        },
        data: () => ({
            loading: false,
            listaEncuestas: []
        }),
        computed: {
            ...mapGetters([
                'encuestasLite',
                'onLine'
            ])
        },
        created() {
            this.getRespuestas()
        },
        methods: {
            getTime (duracion) {
                let h = 0
                let m = 0
                let s = 0
                let initime = Number(duracion)
                h = Math.trunc(initime / 3600)
                initime = initime - (h * 3600)
                m = Math.trunc(initime / 60)
                initime = initime - (m * 60)
                s = initime
                return [h > 9 ? h : `0${h}`, m > 9 ? m : `0${m}`, s > 9 ? s : `0${s}`].join(' : ')
            },
            getRespuestas () {
                this.loading = true
                // this.$store.dispatch('getEncuestasFormulario', this.formulariouuid).then(response => {
                //     this.loading = false
                //     if (!response) this.$router.go(-1)
                // })
                this.$store.dispatch('getEncuestasFormulario', this.formulariouuid).then(response => {
                    this.loading = false
                    this.listaEncuestas = response
                })
            },
            sincronizar (encuesta) {
                this.loading = true
                this.$store.dispatch('guardarEncuesta', encuesta).then(response => {
                    if (response) {
                        this.loading = false
                        this.$store.commit('snackbar', {
                            color: 'success',
                            message: `La encuesta se ha sincronizado correctamente`
                        })
                        this.getRespuestas()
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>