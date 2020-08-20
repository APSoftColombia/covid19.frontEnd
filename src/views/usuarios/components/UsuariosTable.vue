<template>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    label="Buscar"
                    clearable
                    hide-details
                    append-icon="search"
                    single-line
                    @keyup.enter="reloadCurrentPage"
            >
            </v-text-field>
        </v-card-title>
        <v-card-text>
            <v-data-table
                    :headers="headers"
                    :items="usuarios"
                    :page.sync="paginationData.current_page"
                    :items-per-page="paginationData.per_page"
                    hide-default-footer
                    class="elevation-1"
                    @page-count="pageCount = $event"
            >
                <template v-slot:item.name="{ item }">
                    <div style="min-width: 250px !important;">
                        <v-list-item>
                            <v-list-item-content style="display: grid !important;">
                                <v-list-item-title class="body-5">{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle class="body-5">
                                    {{ item.tipo + ' ' + item.numero_documento_identidad }}
                                    {{'Cel.' + item.telefono }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                </template>
                <template v-slot:item.eps="{ item }">
                    <span>{{ item.eps_id ? epsNombre(item) : 'N/A' }}</span>
                </template>
                <template v-slot:item.options="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn slot="activator" icon small v-on="on" @click="resetPassword(item)">
                                <v-icon color="primary" small>mdi-account-key</v-icon>
                            </v-btn>
                        </template>
                        <span>Restablecer contraseña</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn slot="activator" icon small v-on="on" @click="editarUsuario(item)">
                                <v-icon color="primary" small>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span>Editar Usuario</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" icon small @click="cambiaEstado(item)" color="primary" :loading="item.loadingUser">
                                <v-icon>{{ item.habilitado ? 'far fa-window-close' : 'far fa-check-circle' }}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ item.habilitado ? 'Deshabilitar' : 'Habilitar' }} Usuario</span>
                    </v-tooltip>
                </template>
            </v-data-table>
            <div class="text-center pt-2">
                <v-pagination v-model="paginationData.current_page" :length="paginationData.last_page" @input="getUsuarios"></v-pagination>
            </div>
        </v-card-text>
        <registro-usuario ref="dialogRegistroUsuario" @save="reloadCurrentPage()"></registro-usuario>
        <confirmation-dialog
                ref="confirmation"
                :heading="dialog.heading"
                :message="dialog.message"
                :loading="dialog.loading"
                @confirm="confirmResetPassword"
        ></confirmation-dialog>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";

    const RegistroUsuario = () => import('Views/usuarios/components/RegistroUsuario')
    export default {
        name: "UsuariosTable",
        data: () => ({
            pageCount: 0,
            headers: [
                {
                    text: 'ID',
                    sortable: false,
                    value: 'id'
                },
                {
                    text: 'Usuario',
                    sortable: false,
                    value: 'name'
                },
                {
                    text: 'Email',
                    sortable: false,
                    value: 'email'
                },
                {
                    text: 'Dirección',
                    sortable: false,
                    value: 'direccion'
                },
                {
                    text: 'Eps',
                    sortable: false,
                    value: 'eps'
                },
                {
                    text: 'Opciones',
                    sortable: false,
                    value: 'options'
                },
            ],
            paginationData: {
                current_page: 1,
                last_page: 0,
                per_page: 5,
                to: 0,
                total: 0
            },
            usuarios: [],
            search: '',
            dialog: {
                heading: '',
                message: '',
                loading: false,
                registro: null
            },
        }),
        components: {
            RegistroUsuario
        },
        computed: {
            ...mapGetters([
                'epss'
            ]),
        },
        methods: {
            epsNombre (usuario) {
                return this && this.epss && this.epss.length && this.epss.find(x => x.id === usuario.eps_id) ? this.epss.find(x => x.id === usuario.eps_id).nombre : null
            },
            getUsuarios () {
                this.loading = true
                this.axios.get(`user?per_page=${this.paginationData.per_page}&page=${this.paginationData.current_page}&filter[search]=${this.search}`)
                    .then(response => {
                        this.usuarios = response.data.data
                        this.loading = false
                        this.paginationData.current_page = response.data.current_page
                        this.paginationData.last_page = response.data.last_page
                        this.paginationData.per_page = parseInt(response.data.per_page)
                        this.paginationData.to = response.data.to
                        this.paginationData.total = response.data.total
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `al traer los usuarios.`, error: error})
                        this.loading = false
                    })
            },
            reloadCurrentPage(){
                this.paginationData.current_page = 1
                this.getUsuarios()
            },
            cambiaEstado (usuario) {
                usuario.loadingUser = true
                this.axios.put(`user/cambiar-estado-habilitado/${usuario.id}`, {id: usuario.id})
                    .then(() => {
                        usuario.loadingUser = false
                        usuario.habilitado = usuario.habilitado ? 0 : 1
                    })
                    .catch(error => {
                        usuario.loadingUser = false
                        this.$store.commit('snackbar', {color: 'error', message: `al cambiar el estado del usuarios.`, error: error})
                    })
                this.$emit('userDisabled')
            },
            resetPassword (usuario) {
                this.dialog.heading = 'Reestablecer Contraseña'
                this.dialog.message = `La contraseña del usuario <strong>${usuario.name}</strong> será reestablecida.`
                this.dialog.registro = usuario
                this.$refs.confirmation.open()
            },
            editarUsuario (usuario) {
                this.$refs.dialogRegistroUsuario.open(usuario.id)
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
        },
        created() {
            this.getUsuarios()
        }
    }
</script>

<style scoped>

</style>