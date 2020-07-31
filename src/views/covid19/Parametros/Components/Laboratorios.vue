<template>
    <v-card>
        <v-card-title>
            <span>Laboratorios</span>
            <v-spacer></v-spacer>
            <form-lab @reloadTable="getLaboratorios"></form-lab>
        </v-card-title>
        <v-card-text>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Laboratorio</th>
                        <th class="text-left">Opciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lab in laboratorios" :key="lab.id">
                            <td>{{ lab.id }}</td>
                            <td>{{ lab.laboratorio }}</td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn small icon v-on="on">
                                            <form-lab @reloadTable="getLaboratorios" :laboratorio="lab"></form-lab>
                                        </v-btn>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn small icon v-on="on">
                                            <eliminar-lab @reloadTable="getLaboratorios" :laboratorio="lab"></eliminar-lab>
                                        </v-btn>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
        <app-section-loader :status="loading"></app-section-loader>
    </v-card>
</template>

<script>
    const FormLab = () => import('./FormLaboratorio')
    const EliminarLab = () => import('./EliminarLaboratorio')
    export default {
        name: "Laboratorios",
        data: () => ({
            laboratorios: null,
            loading: false,
        }),
        components: {
            FormLab,
            EliminarLab
        },
        methods: {
            getLaboratorios(){
                this.loading = true
                this.axios.get('laboratorios').then(response => {
                   this.laboratorios = response.data
                    this.loading = false
                }).catch(error => {
                    this.$store.commit('snackbar', {color: "error", message: ` al cargar laboratorios`, error: error})
                })
            }
        },
        created() {
            this.getLaboratorios()
        }
    }
</script>

<style scoped>

</style>