<template>
    <v-dialog
            v-model="dialog"
            max-width="720"
    >
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-file-prescription</v-icon>
                <v-list-item-content class="pa-0">
                    <v-list-item-title class="mb-0"><h6 class="mb-0 title">{{reporteComunitario && reporteComunitario.id ? `Reporte No. ${reporteComunitario.id}` : `Reporte Comunitario`}}</h6></v-list-item-title>
                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                        {{reporteComunitario.created_at ? moment(reporteComunitario.created_at).format('DD/MM/YYYY HH:mm') : ''}}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-list two-line class="notification-wrap">
                            <v-list-item @click="click = null" style="border-bottom: none !important;">
                                <v-list-item-avatar class="my-1 align-self-center">
                                    <v-icon color="error">fas fa-user-secret</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="pa-0">
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Quien Reporta</v-list-item-subtitle>
                                    <v-list-item-title><h6 class="mb-0">{{ reporteComunitario.nombre_reportante }}</h6></v-list-item-title>
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                                        <v-icon small>mdi-phone</v-icon>
                                        {{ reporteComunitario.celular_reportante }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="click = null" style="border-bottom: none !important;">
                                <v-list-item-avatar class="my-1 align-self-center">
                                    <v-icon color="teal" large>{{ reporteComunitario.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi mdi-face' }}</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="pa-0">
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Posible Caso</v-list-item-subtitle>
                                    <v-list-item-title>
                                      <h6 class="mb-0">
                                        {{ reporteComunitario.nombres }}
                                      </h6>
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                                        {{ [reporteComunitario.edad ? `${reporteComunitario.edad} Años` : null, reporteComunitario.celular ? `Celular: ${reporteComunitario.celular}` : null].filter(x => x).join(', ') }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="click = null" style="border-bottom: none !important;">
                                <v-list-item-avatar class="my-1 align-self-center">
                                    <v-icon color="purple">fas fa-map-signs</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="pa-0">
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Ubicación Posible Caso</v-list-item-subtitle>
                                    <v-list-item-title><h6 class="mb-0">{{ reporteComunitario.direccion }}</h6></v-list-item-title>
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                                        {{ reporteComunitario.municipio_id && divipol ? divipol.find(x => x.id === reporteComunitario.municipio_id).nombre : '' }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="click = null" style="border-bottom: none !important;" v-if="reporteComunitario.observaciones">
                                <v-list-item-content>
                                    <h6 class="mb-0 info--text text--darken-3">Observaciones</h6>
                                    <p class="fs-12 mb-0 fw-normal">{{ reporteComunitario.observaciones }}</p>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="click = null" v-if="reporteComunitario.user" style="border-bottom: none !important;">
                                <v-list-item-avatar class="my-1 align-self-center">
                                    <v-icon color="primary">fas fa-user</v-icon>
                                </v-list-item-avatar>
                                <v-list-item-content class="pa-0">
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">Usuario que Registra</v-list-item-subtitle>
                                    <v-list-item-title><h6 class="mb-0">{{ reporteComunitario.user.name }}</h6></v-list-item-title>
                                    <v-list-item-subtitle class="grey--text fs-12 fw-normal">
                                        <v-icon small>mdi-phone</v-icon>
                                        {{ reporteComunitario.user.telefono }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'DetalleReporteComunitario',
        data: () => ({
            dialog: false,
            loading: false,
            click: null,
            reporteComunitario: null
        }),
        computed: {
            ...mapGetters([
                'modelReporteComunitario',
                'divipol'
            ])
        },
        created() {
            this.reporteComunitario = this.clone(this.modelReporteComunitario)
        },
        methods: {
            open(item = null) {
                if (item !== null) this.reporteComunitario = item
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.reporteComunitario = this.clone(this.modelReporteComunitario)
            }
        }
    }
</script>

<style scoped>

</style>