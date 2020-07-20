<template>
    <div>
        <app-card
                :fullBlock="true"
                colClasses="col-height-auto"
                class="top-author-wrap"
        >
            <div class="primary pos-relative white--text">
                <v-container fluid class="px-3 py-0">
                    <v-row no-gutters>
                        <v-col cols="6">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-switch
                                            class="mt-2"
                                            v-on="on"
                                            color="yellow"
                                            v-model="usuario.habilitado"
                                            :true-value="1"
                                            :false-value="0"
                                            hide-details
                                            readonly
                                            @click.stop="cambiaEstado(usuario)"
                                    ></v-switch>
                                </template>
                                <span>{{usuario.habilitado ? 'Deshabilitar' : 'Habilitar'}} Usuario</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="6">
                            <div class="text-sm-right pa-2">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn slot="activator" icon v-on="on" @click="resetPassword(usuario)">
                                            <v-icon color="white" small>mdi-account-key</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Restablecer contraseña</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn slot="activator" icon v-on="on" @click="editarUsuario(usuario)">
                                            <v-icon color="white" small>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Editar Usuario</span>
                                </v-tooltip>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
                <h5 class="mb-0 pb-2 text-center">{{usuario.name}}</h5>
                <h6 class="mb-0 pb-2 text-center">{{usuario.email}}</h6>
            </div>
            <div class="author-detail-wrap">
                <div class="author-avatar primary pos-relative mb-4 text-center">
                    <div class="avatar-img">
                        <img src="/static/avatars/default.png" width="87" height="87" class="img-responsive mx-auto rounded-circle">
                    </div>
                </div>
                <ul class="list-unstyled author-contact-info px-3 py-1">
                    <li>
                                    <span class="mr-3">
                                        <v-icon>fas fa-id-card</v-icon>
                                    </span>
                        <a class="fs-12 grey--text fw-normal">{{usuario.tipo_documento_identidad.tipo}} {{usuario.numero_documento_identidad}}</a>
                    </li>
                    <li>
                                    <span class="mr-3">
                                        <v-icon>fas fa-phone-alt</v-icon>
                                    </span>
                        <a class="fs-12 grey--text fw-normal">{{usuario.telefono}}</a>
                    </li>
                    <li>
                                    <span class="mr-3">
                                        <v-icon>fas fa-map-signs</v-icon>
                                    </span>
                        <a class="fs-12 grey--text fw-normal">{{usuario.direccion}}</a>
                    </li>
                    <li>
                                    <span class="mr-3">
                                        <v-icon>fas fa-landmark</v-icon>
                                    </span>
                        <a class="fs-12 grey--text fw-normal">{{epsNombre}}</a>
                    </li>
                    <li>
                                    <span class="mr-3">
                                        <v-icon>fas fa-birthday-cake</v-icon>
                                    </span>
                        <a class="fs-12 grey--text fw-normal">{{usuario.fecha_nacimiento}}</a>
                    </li>
                </ul>
            </div>
        </app-card>
        <registro-usuario ref="dialogRegistroUsuario" @save="user => $emit('editsave', user)"></registro-usuario>
        <confirmation-dialog
                ref="confirmation"
                :heading="dialog.heading"
                :message="dialog.message"
                :loading="dialog.loading"
                @confirm="confirmResetPassword"
        ></confirmation-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    const RegistroUsuario = () => import('Views/usuarios/components/RegistroUsuario')
    export default {
        name: 'CardUsuario',
        props: {
            usuario: {
                type: Object,
                default: null
            }
        },
        components: {
            RegistroUsuario
        },
        data: () => ({
            dialog: {
                heading: '',
                message: '',
                loading: false,
                registro: null
            }
        }),
        computed: {
            ...mapGetters([
                'epss'
            ]),
            epsNombre () {
                return this && this.usuario && this.usuario.eps_id && this.epss && this.epss.length && this.epss.find(x => x.id === this.usuario.eps_id) ? this.epss.find(x => x.id === this.usuario.eps_id).nombre : null
            }
        },
        methods: {
            editarUsuario (usuario) {
                this.$refs.dialogRegistroUsuario.open(usuario.id)
            },
            cambiaEstado (usuario) {
                this.axios.put(`user/cambiar-estado-habilitado/${usuario.id}`, {id: usuario.id})
                    .then(() => {
                        usuario.habilitado = usuario.habilitado ? 0 : 1
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `al cambiar el estado del usuarios.`, error: error})
                    })
            },
            resetPassword (usuario) {
                this.dialog.heading = 'Reestablecer Contraseña'
                this.dialog.message = `La contraseña del usuario <strong>${usuario.name}</strong> será reestablecida.`
                this.dialog.registro = usuario
                this.$refs.confirmation.open()
            },
            confirmResetPassword () {
                this.dialog.loading = true
                this.axios.put(`user/restablecer-contrasena/${this.dialog.registro.id}`, {id: this.dialog.registro.id})
                    .then(() => {
                        this.$store.commit('snackbar', {color: 'success', message: `La contraseña se reestableció correctamente.`})
                        this.dialog.loading = false
                        this.$refs.confirmation.close()
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `Error al reestablecer la contraseña, ${error.response.data.message}.`})
                        this.dialog.loading = false
                    })
            }
        }
    }
</script>

<style scoped>

</style>