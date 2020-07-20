<template>
    <v-dialog v-model="dialog" persistent max-width="900">
        <v-card>
            <v-toolbar dark color="primary">
                <v-icon left>fas fa-map-marker-alt</v-icon>
                <v-list-item v-if="tamizaje">
                    <v-list-item-content>
                        <v-list-item-title class="title">Asignación de Coordenadas:
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
                <datos-personales :abierto="false" :tamizaje="tamizaje"></datos-personales>
                <v-row>
                    <v-col cols="12" class="pb-0">
                        <georreferenciador ref="georreferenciador" :tamizaje="tamizaje" @changemarker="val => marker = val"></georreferenciador>
                    </v-col>
                </v-row>
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
            <app-section-loader style="z-index: 5 !important;" :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
    const Georreferenciador = () => import('Views/covid19/tamizaje/georreferenciacion/Georreferenciador')
    export default {
        name: 'AsignarGeorreferenciacion',
        components: {
            DatosPersonales,
            Georreferenciador
        },
        data: () => ({
            dialog: false,
            loading: false,
            tamizaje: null,
            marker: null
        }),
        computed: {
            ...mapGetters([
                'modelTamizaje'
            ])
        },
        created() {
            this.tamizaje = this.clone(this.modelTamizaje)
        },
        methods: {
            open (tamizaje) {
                this.tamizaje = this.clone(tamizaje)
                this.dialog = true
            },
            close () {
                this.loading = false
                this.dialog = false
                this.tamizaje = null
                this.$refs.georreferenciador.deleteMarkers()
            },
            asignar () {
                let latlng = this.marker ? `${this.marker.getPosition().lat()}, ${this.marker.getPosition().lng()}` : null
                console.log('changemarker', latlng)
                this.loading = true
                this.axios.put(`tamizajes/${this.tamizaje.id}/ubicacion`, {coordenadas: latlng})
                    .then(response => {
                        this.$emit('guardado', response.data)
                        this.$store.commit('snackbar', {color: 'success', message: `Las coordenadas se actualizaron correctamente.`})
                        this.close()
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al actualizar las coordenadas.`, error: error})
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