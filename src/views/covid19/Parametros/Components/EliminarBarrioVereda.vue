<template>
    <v-dialog v-model="dialog" width="720px" persistent>
        <v-card v-if="barrioVereda">
            <v-toolbar dark color="error">
                <v-icon left>fas fa-trash-alt</v-icon>
                <v-toolbar-title>Eliminar {{ barrioVereda.tipo === 'Barrio' ? 'Barrio' : 'Vereda' }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <div class="m-6">
                    <p> ¿Esta seguro de eliminar {{ barrioVereda.tipo === 'Barrio' ? 'el Barrio seleccionado' : 'la Vereda seleccionada' }}?</p>
                </div>
            </v-container>
            <v-card-actions>
                <v-btn @click="close">
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
        name: "EliminarBarrioVereda",
        data: () => ({
            barrioVereda: null,
            dialog: false,
            loading: false
        }),
        methods: {
            open(barrioVereda = null){
                this.barrioVereda = barrioVereda
                this.dialog = true
            },
            close(){
                this.dialog = false
            },
            eliminar(){
                this.loading = true
                this.axios.delete(`barrios-veredas/${this.barrioVereda.id}`).then(response => {
                    this.$store.commit('snackbar', {
                        color: 'success',
                        message: response.data.message
                    })
                    this.$emit('actualizarTabla')
                    this.loading = false
                    this.close()
                }).catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {
                        color: 'error',
                        message: ` al eliminar ${this.barrioVereda.tipo === 'Barrio' ? 'Barrio' : 'Vereda'} `,
                        error: error
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>