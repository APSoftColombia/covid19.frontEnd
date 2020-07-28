<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-toolbar dark color="primary" v-if="tamizaje">
                <v-icon left> {{tamizaje.medico_id ? 'fas fa-file-medical-alt' : 'mdi-file-find'}}</v-icon>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">{{tamizaje.medico_id ? 'Caso de Estudio, ' : ''}}
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
                <div style="padding-bottom: 15px; text-align: right" v-if="permisos.descargarERPPDF">
                    <v-btn :loading="loadingPDF" class="red darken-4" @click.stop="descargarPDF">
                        <v-icon color="white" left>fas fa-file-pdf</v-icon>
                        <span class="font-weight-bold white--text">Descargar PDF</span>
                    </v-btn>
                </div>
                <datos-personales :tamizaje="tamizaje"></datos-personales>
                <datos-tamizaje class="mt-2" :tamizaje="tamizaje"></datos-tamizaje>
                <v-tabs
                        class="mt-3"
                        v-if="tamizaje.medico"
                        id="tabsSeguimiento"
                        v-model="tab"
                        fixed-tabs
                        right
                        icons-and-text
                        show-arrows
                        :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : 'deep-purple'"
                >
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab
                            href="#tab-1"
                    >
                        Seguimientos
                        <v-icon>fas fa-chart-line</v-icon>
                    </v-tab>
                    <v-tab
                            href="#tab-4"
                    >
                        Ordenes de Aislamiento
                        <v-icon>mdi-door-closed-lock</v-icon>
                    </v-tab>
                    <v-tab
                            v-if="(tamizaje.muestras && tamizaje.muestras.filter(x => x.resultado).length) || (tamizaje.nexos && tamizaje.nexos.length)"
                            href="#tab-2"
                    >
                        Nexos
                        <v-icon>fas fa-people-arrows</v-icon>
                    </v-tab>
                    <v-tab
                            href="#tab-3"
                    >
                        Muestras
                        <v-icon>fas fa-vials</v-icon>
                    </v-tab>
                </v-tabs>
<!--                <v-divider class="mt-0"></v-divider>-->
                <v-tabs-items v-model="tab" class="mt-2" touchless>
                    <v-tab-item
                            value="tab-1"
                    >
                        <evoluciones
                                v-if="permisos.seguimientoVer"
                                :tamizaje="tamizaje"
                                :editable="editable"
                                @change="changeTamizaje(tamizaje.id)"
                        ></evoluciones>
                        <div v-if="!permisos.seguimientoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                            <v-icon color="primary" large left>mdi-alert-outline</v-icon>
                            No tiene permisos para ver ésta sección.
                        </div>
                    </v-tab-item>
                    <v-tab-item
                            value="tab-4"
                    >
                        <aislamientos
                                v-if="permisos.aislamientoVer"
                                :tamizaje="tamizaje"
                                :editable="editable"
                                @change="changeTamizaje(tamizaje.id)"
                        ></aislamientos>
                        <div v-if="!permisos.aislamientoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                            <v-icon color="deep-purple" large left>mdi-alert-outline</v-icon>
                            No tiene permisos para ver ésta sección.
                        </div>
                    </v-tab-item>
                    <v-tab-item
                            v-if="(tamizaje.muestras && tamizaje.muestras.filter(x => x.resultado).length) || (tamizaje.nexos && tamizaje.nexos.length)"
                            value="tab-2"
                    >
                        <nexos
                                v-if="permisos.nexoVer"
                                :tamizaje="tamizaje"
                                :editable="editable"
                                @change="changeTamizaje(tamizaje.id)"
                        ></nexos>
                        <div v-if="!permisos.nexoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                            <v-icon color="warning" large left>mdi-alert-outline</v-icon>
                            No tiene permisos para ver ésta sección.
                        </div>
                    </v-tab-item>
                    <v-tab-item
                            value="tab-3"
                    >
                        <muestras
                                v-if="permisos.muestraVer"
                                :tamizaje="tamizaje"
                                :editable="editable"
                                @change="changeTamizaje(tamizaje.id)"
                        ></muestras>
                        <div v-if="!permisos.muestraVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                            <v-icon color="error" large left>mdi-alert-outline</v-icon>
                            No tiene permisos para ver ésta sección.
                        </div>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    //import {store} from "../../../store/store";
    const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
    const DatosTamizaje = () => import('Views/covid19/tamizaje/DatosTamizaje')
    const Evoluciones = () => import('Views/covid19/tamizaje/evolucion/Evoluciones')
    const Aislamientos = () => import('Views/covid19/tamizaje/aislamiento/Aislamientos')
    const Muestras = () => import('Views/covid19/tamizaje/muestra/Muestras')
    const Nexos = () => import('Views/covid19/tamizaje/nexo/Nexos')
    export default {
        name: 'Seguimiento',
        components: {
            DatosPersonales,
            DatosTamizaje,
            Evoluciones,
            Aislamientos,
            Muestras,
            Nexos
        },
        data: () => ({
            dialog: false,
            loading: false,
            loadingPDF: false,
            tamizaje: null,
            tab: null
        }),
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            editable () {
                if (this && this.tamizaje && this.tamizaje.medico_id) {
                    return this.tamizaje.clasificacion !== '4' && this.tamizaje.clasificacion !== '6'
                }
                return false
            },
            ...mapGetters([
                'modelTamizaje'
            ])
        },
        created() {
            this.tamizaje = this.clone(this.modelTamizaje)
        },
        methods: {
            descargarPDF(){
                this.loadingPDF = true
                this.axios( {
                    url: `/pdf-tamizaje/${this.tamizaje.id}`, //your url
                    method: 'GET',
                    responseType: 'blob', // important
                }).then( async response => {
                    const fileURL = window.URL.createObjectURL(new Blob(
                        [response.data],
                        {type: 'application/pdf'}));
                    await window.open(fileURL,'_blank')
                    this.loadingPDF = false
                }).catch(error => {
                    this.loadingPDF = false
                    this.$store.commit('snackbar', {color: 'error', message: 'al cargar el pdf', error: error})
                })
            },
            open (idTamizaje = null) {
                if (idTamizaje) this.getTamizaje(idTamizaje)
                this.dialog = true
            },
            close () {
                this.dialog = false
                this.tamizaje = this.clone(this.modelTamizaje)
            },
            changeTamizaje (idTamizaje) {
                this.getTamizaje(idTamizaje)
                this.$store.commit('reloadTable', 'tablaTamizajes')
            },
            getTamizaje (idTamizaje) {
                this.loading = true
                this.axios.get(`tamizajes/${idTamizaje}`)
                    .then(response => {
                        this.tamizaje = response.data
                        if (this.tamizaje.evoluciones.length) this.tamizaje.evoluciones.map((x,i) => { x.numero = (this.tamizaje.evoluciones.length - i) })
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