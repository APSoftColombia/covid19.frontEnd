<template>
    <v-dialog v-model="dialog" width="720px" persistent>
        <template v-slot:activator="{ on }">
            <v-btn color="error" v-on="on" small icon>
                <v-icon>fas fa-trash-alt</v-icon>
            </v-btn>
        </template>
        <v-card v-if="laboratorio">
            <v-toolbar dark color="error">
                <v-icon left>fas fa-trash-alt</v-icon>
                <v-toolbar-title>Eliminar Laboratorio</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <div class="m-6">
                    <p> ¿Esta seguro de eliminar el laboratorio {{laboratorio.laboratorio}}?</p>
                </div>
            </v-container>
            <v-card-actions>
                <v-btn @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                    <span>Cerrar</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click.stop="eliminar" class="error white--text">
                    <v-icon left>fas fa-save</v-icon>
                    <span>Aceptar</span>
                </v-btn>
            </v-card-actions>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "EliminarLaboratorio",
        props: {
            laboratorio: {
                type: Object,
                default: null
            }
        },
        data: () => ({
            dialog: false,
            loading: false
        }),
        methods: {
            eliminar(){
                this.loading = true
                this.axios.delete(`laboratorios/${this.laboratorio.id}`).then(response => {
                    this.$store.commit('snackbar', {
                        color: 'success',
                        message: response.data.message
                    })
                    this.loading = false
                    this.$emit('reloadTable')
                    this.dialog = false
                }).catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {
                        color: 'error',
                        message: ` al eliminar laboratorio`,
                        error: error
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>