<template>
    <v-dialog v-model="dialog" persistent width="720">
        <v-card v-if="rol && rol.id">
            <v-toolbar dark color='indigo'>
                <v-icon left>fas fa-edit</v-icon>
                <v-toolbar-title>Editar Rol {{ rol.nombre }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-content>
                <v-card-text>
                    <ValidationObserver ref="formBarrioVereda" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                        <c-texto
                                v-model="nombre"
                                label="Nombre"
                                name="nombre"
                                rules="required"
                        >
                        </c-texto>
                    </ValidationObserver>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="close">
                        <v-icon>mdi-close</v-icon>
                        <span>Cerrar</span>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="updateRoleName" class="white--text" color="indigo">
                        <v-icon left>fas fa-save</v-icon>
                        <span>Guardar</span>
                    </v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-list dense >
                        <template v-for="(permiso, id) in permisos" style="margin-bottom: 20px; margin-left: 50px" >
                            <v-list-item :key="id+'-tile-'" >
                                <v-list-item-content>
                                    <v-list-item-title>{{permiso && permiso.nombre}}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-switch @change="togglePermission(permiso)" v-model="rol.permisos"  :value="permiso"></v-switch>
                                </v-list-item-action>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-card-text>
            </v-content>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "FormRolPermissions",
        data: () => ({
            rol: null,
            dialog: false,
            permisos: null,
            loading: false,
            nombre: null
        }),
        methods: {
            open(rol = null) {
                this.dialog = true
                this.rol = rol
                this.nombre = rol.nombre
                this.getPermissionsByRol()
            },
            close(){
                this.dialog = false
                this.rol = null
                this.permisos = null
            },
            getPermissionsByRol(){
                this.loading = true
                this.axios.get(`permisos-by-rol/${this.rol.id}`).then(response => {
                    this.permisos = response.data.permisos
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {
                        color: 'error',
                        message: ` al cargar la información del rol`,
                        error: error
                    })
                })
            },
            togglePermission(permiso){
                this.axios.put(`toggle-permission/${this.rol.id}/${permiso.id}`).then(response => {
                    this.$store.commit('snackbar', {
                        color: 'success',
                        message: response.data.message,
                    })
                }).catch(error => {
                    this.$store.commit('snackbar', {
                        color: 'error',
                        message: ` al cargar la información del rol`,
                        error: error
                    })
                })
            },
            updateRoleName(){
                this.loading = true
                this.axios.put(`roles/${this.rol.id}`, {nombre: this.nombre}).then(response => {
                    this.loading = false
                    this.$emit('refreshTable')
                    this.close()
                    this.$store.commit('snackbar', {
                        color: 'success',
                        message: response.data.message,
                    })
                }).catch(error => {
                    this.loading = false
                    this.$store.commit('snackbar', {
                        color: 'error',
                        message: ` al cargar la información del rol`,
                        error: error
                    })
                })
            }
        },
    }
</script>

<style scoped>

</style>