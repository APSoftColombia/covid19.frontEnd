<template>
    <v-container fluid>
        <page-title-bar title="Parametros"></page-title-bar>
        <v-row>
            <v-col cols="12" sm="12" md="4" lg="3">
                <v-list two-line class="notification-wrap">
                    <v-list-item-group v-model="currentOption" color="indigo">
                        <template v-for="option in options">
                            <v-hover v-if="permisos[option.permission]" v-slot:default="{ hover }" :key="`option-${ option.value }`">
                                <v-list-item @click="selectTable(option.value)">
                                    <v-list-item-avatar class="my-1 align-self-center">{{ (option.value + 1) }}</v-list-item-avatar>
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title><h5 class="mb-0 text-truncate">{{ option.name }}</h5></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-hover>
                        </template>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 0 && permisos.barriosVeredasCrud">
                <barrios-veredas/>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 1 && permisos.laboratoriosCrud">
                <laboratorios/>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 2 && permisos.vacunadoresCrud">
              <Vacunadores/>
            </v-col>
          <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 3 && permisos.dependenciasCrud">
              <Dependencias/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    const BarriosVeredas = () => import('./Components/BarriosVeredas')
    const Laboratorios = () => import('./Components/Laboratorios')
    const Vacunadores = () => import('./Components/Vacunadores')
    const Dependencias = () => import('./Components/dependencias/Index')
    export default {
        name: 'ParametrosView',
        components: {
            BarriosVeredas,
            Laboratorios,
            Vacunadores,
            Dependencias
        },
        data: () => ({
            currentOption: 0,
            options: [
                {name: 'Barrios y Veredas', value: 0, permission: 'barriosVeredasCrud'},
                {name: 'Laboratorios', value: 1, permission: 'laboratoriosCrud'},
                {name: 'Vacunadores', value: 2, permission: 'vacunadoresCrud'},
                {name: 'Dependencias', value: 3, permission: 'dependenciasCrud'}
            ]
        }),
        computed: {
            currentOptionC(){
                return this.currentOption
            },
            permisos() {
              return this.$store.getters.getPermissionModule("parametros");
            },
        },
        methods: {
            selectTable(value){
                this.currentOption = value
            },
        }
    }
</script>