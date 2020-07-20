<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
        <v-card>
            <v-toolbar dark color="primary" v-if="autopsia">
                <v-icon left>mdi-file-find</v-icon>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">{{autopsia.id ? `Autopsia No. ${autopsia.id}` : ''}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid v-if="autopsia">
                <datos-personales
                        tipo="Fallecido"
                        :abierto="false"
                        v-if="autopsia.fallecido"
                        :tamizaje="autopsia.fallecido"
                ></datos-personales>
                <datos-personales
                        tipo="Informante"
                        :abierto="false"
                        class="mt-2"
                        v-if="autopsia.encuestado"
                        :tamizaje="autopsia.encuestado"
                ></datos-personales>
                <datos-autopsia :autopsia="autopsia" class="mt-3"></datos-autopsia>
                <v-divider></v-divider>
                <v-tabs
                        class="mt-3"
                        v-model="tab"
                        fixed-tabs
                        right
                        icons-and-text
                        show-arrows
                        :color="tab === 'tab-2' ? 'warning' : 'error'"
                >
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab
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
                <v-tabs-items v-model="tab" class="mt-2" touchless>
                    <v-tab-item
                            value="tab-2"
                    >
                        <div v-if="!permisos.nexoVer" class="font-weight-bold grey--text text--lighten-1 text-center mt-10">
                            <v-icon color="warning" large left>mdi-alert-outline</v-icon>
                            No tiene permisos para ver ésta sección.
                        </div>
                    </v-tab-item>
                    <v-tab-item
                            value="tab-3"
                    >
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
    const DatosPersonales = () => import('Views/covid19/tamizaje/DatosPersonales')
    const DatosAutopsia = () => import('Views/covid19/autopsia/DatosAutopsia')
    export default {
        name: 'Seguimiento',
        components: {
            DatosPersonales,
            DatosAutopsia
        },
        data: () => ({
            dialog: false,
            loading: false,
            autopsia: null,
            tab: null
        }),
        computed: {
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
            ...mapGetters([
                'modelAutopsia'
            ])
        },
        created() {
            this.autopsia = this.clone(this.modelAutopsia)
        },
        methods: {
            open (idAutopsia = null) {
                if (idAutopsia) this.getAutopsia(idAutopsia)
                this.dialog = true
            },
            close () {
                this.dialog = false
                this.autopsia = this.clone(this.modelAutopsia)
            },
            changeAutopsia (idAutopsia) {
                this.getAutopsia(idAutopsia)
                this.$store.commit('reloadTable', 'tablaAutopsias')
            },
            getAutopsia (idAutopsia) {
                this.loading = true
                this.axios.get(`autopsias/${idAutopsia}`)
                    .then(response => {
                        console.log('response autopsia', response)
                        this.autopsia = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.loading = false
                        this.$store.commit('snackbar', {color: 'error', message: `al recuperar el registro de la autopsia.`, error: error})
                    })
            }
        }
    }
</script>

<style scoped>

</style>