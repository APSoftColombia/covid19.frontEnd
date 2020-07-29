<template>
    <v-card v-if="rolesD && rolesD.roles.length">
        <v-card-title>
            <span>Roles</span>
            <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Nombre</th>
                        <th class="text-left">Opciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="rol in rolesD.roles" :key="rol.id">
                        <td>{{ rol.id }}</td>
                        <td>{{ rol.nombre }}</td>
                        <td>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn small icon v-on="on" color="warning" @click.stop="editRol(rol)">
                                        <v-icon>fas fa-edit</v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
        <form-rol
            ref="formRol"
            @refreshTable="getRoles"
        ></form-rol>
    </v-card>
</template>

<script>
    const FormRol = () => import('./FormRolPermissions')
    export default {
        name: "Roles",
        data: () => ({
            rolesD: null
        }),
        methods: {
            getRoles(){
                this.axios.get('roles').then(response => {
                    this.rolesD = response.data
                    for (const[key,value] of Object.entries(this.rolesD.roles)){
                        for (const[index,permiso] of Object.entries(value.permisos)){
                            key + index
                            delete permiso.pivot
                        }
                    }
                }).catch(error => {
                    this.$store.commit('snackbar', {color: 'error', message: ` al cargar roles`, error: error})
                })
            },
            editRol(rol){
                this.$refs.formRol.open(rol)
            }
        },
        components: {
            FormRol,
        },
        created() {
            this.getRoles()
        }
    }
</script>

<style scoped>

</style>