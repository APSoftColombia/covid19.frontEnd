<template>
    <v-container fluid class="grid-list-md">
        <page-title-bar title="Usuarios">
            <template slot="actions">
                <v-text-field
                        prepend-inner-icon="mdi-account-search"
                        v-if="$vuetify.breakpoint.smAndUp"
                        v-model="search"
                        :class="$vuetify.breakpoint.mdAndUp ? 'mr-8' : 'mr-4'"
                        placeholder="Buscar"
                        filled
                        solo
                        rounded
                        dense
                        hide-details
                        clearable
                        :disabled="showInTable"
                ></v-text-field>
                <v-btn color="primary" @click="crearUsuario">
                    <v-icon left>mdi-plus</v-icon>
                    Crear Usuario
                </v-btn>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="ml-4" icon v-bind="attrs" v-on="on" @click="showInTable = !showInTable">
                            <v-icon color="primary">{{ showInTable ? 'fas fa-id-card-alt' : 'fas fa-table' }}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ showInTable ? 'Ver en Cartas' : 'Ver en Tabla' }}</span>
                </v-tooltip>
            </template>
        </page-title-bar>
        <v-row v-if="!showInTable">
            <v-col cols="12">
                <v-text-field
                        prepend-inner-icon="mdi-account-search"
                        v-if="$vuetify.breakpoint.xsOnly"
                        v-model="search"
                        placeholder="Buscar"
                        filled
                        solo
                        rounded
                        dense
                        hide-details
                        clearable
                ></v-text-field>
            </v-col>
            <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="4"
                    xl="3"
                    v-for="(usuario, index) in usuarios"
                    :key="index"
            >
                <card-usuario
                        :usuario="usuario"
                        @editsave="user => guardaUsuario(user)"
                ></card-usuario>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <usuarios-table
                    @userDisabled="getUsuarios(false)"
                ></usuarios-table>
            </v-col>
        </v-row>
        <registro-usuario ref="dialogRegistroUsuario" @save="user => guardaUsuario(user)"></registro-usuario>
        <app-section-loader :status="loading"></app-section-loader>
    </v-container>
</template>

<script>
    const RegistroUsuario = () => import('Views/usuarios/components/RegistroUsuario')
    const CardUsuario = () => import('Views/usuarios/components/CardUsuario')
    const UsuariosTable = () => import('Views/usuarios/components/UsuariosTable')
    export default {
        name: 'Usuarios',
        data: () => ({
            loading: false,
            usuarios: [],
            users: [],
            search: null,
            showInTable: false
        }),
        watch: {
            search: {
                handler () {
                    this.buscarUsuarios()
                },
                immediate: true
            },
            'users.length': {
                handler () {
                    this.buscarUsuarios()
                },
                immediate: true
            }
        },
        components: {
            RegistroUsuario,
            CardUsuario,
            UsuariosTable
        },
        created () {
            this.getUsuarios()
        },
        methods: {
            buscarUsuarios () {
                this.usuarios = this.search ? this.users.filter(x => (x.name.toLowerCase().search(this.search.toLowerCase()) > -1) || (x.email.toLowerCase().search(this.search.toLowerCase()) > -1) || (x.numero_documento_identidad.toLowerCase().search(this.search.toLowerCase()) > -1)) : this.users
            },
            guardaUsuario (usuario) {
                let indexUsuario = this.usuarios.findIndex(x => x.id === usuario.id)
                this.usuarios.splice(indexUsuario > -1 ? indexUsuario : 0, indexUsuario > -1 ? 1 : 0, usuario)
            },
            crearUsuario () {
                this.$refs.dialogRegistroUsuario.open()
            },
            getUsuarios (loading = true) {
                if(loading){
                    this.loading = true
                }
                this.axios.get(`user`)
                    .then(response => {
                        this.users = response.data
                        this.loading = false
                    })
                    .catch(error => {
                        this.$store.commit('snackbar', {color: 'error', message: `al traer los usuarios.`, error: error})
                        this.loading = false
                    })
            }
        }
    }
</script>

<style scoped>

</style>