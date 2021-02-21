<template>
    <v-dialog v-model="dialog" persistent width="720">
        <v-card v-if="(rol && rol.id) || (isCreating)">
            <v-toolbar dark color='indigo'>
                <v-icon left>fas fa-edit</v-icon>
                <v-toolbar-title>{{ !isCreating ? 'Editar Rol ' + rol.nombre : 'Crear Rol' }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="mt-6 mb-0">
                <ValidationObserver ref="formRol" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row>
                        <v-col cols="10" sm="10" md="10" lg="10">
                            <c-texto
                                    v-model="nombre"
                                    label="Nombre"
                                    name="nombre"
                                    rules="required"
                            >
                            </c-texto>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" lg="1">
                            <v-btn v-if="!isCreating" @click="updateRoleName" class="white--text" color="indigo">
                                <v-icon>fas fa-save</v-icon>
                            </v-btn>
                            <v-btn v-else @click="createRol" class="white--text" color="indigo">
                                <v-icon>fas fa-save</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </ValidationObserver>
                <v-list dense v-if="!isCreating">
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
            <v-card-actions>
                <v-btn @click="close">
                    <v-icon>mdi-close</v-icon>
                    <span>Cerrar</span>
                </v-btn>
            </v-card-actions>
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
            nombre: null,
            isCreating: false
        }),
        methods: {
            open(rol = null) {
                this.dialog = true
                this.rol = rol
                this.nombre = rol.nombre
                this.getPermissionsByRol()
            },
            openCreate(){
                this.dialog = true
                this.isCreating = true
                this.nombre = null
            },
            close(){
                this.dialog = false
                this.isCreating = false
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
                this.$refs.formRol.validate().then(result => {
                    if(result) {
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
                                message: ` al actualizar el rol`,
                                error: error
                            })
                        })
                    }
                })
            },
            createRol(){
                this.$refs.formRol.validate().then(result => {
                    if(result) {
                        this.loading = true
                        this.axios.post(`roles`, {nombre: this.nombre}).then(response => {
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
                                message: ` al crear el rol`,
                                error: error
                            })
                        })
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>