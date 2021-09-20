<template>
    <v-container fluid>
        <page-title-bar title="Parametros"></page-title-bar>
        <v-row>
            <v-col cols="12" sm="12" md="4" lg="3">
                <v-list two-line class="notification-wrap">
                    <v-list-item-group v-model="currentOption" color="indigo">
                        <template v-for="option in options">
                            <v-hover v-slot:default="{ hover }" :key="`option-${ option.value }`">
                                <v-list-item @click="selectTable(option.value)" v-if="option.value === 2 ? datosEmpresa.departamento_id === 29 : true">
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
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 0">
                <barrios-veredas></barrios-veredas>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 1">
                <laboratorios></laboratorios>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 2">
              <Vacunadores></Vacunadores>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapGetters} from "vuex";

    const BarriosVeredas = () => import('./Components/BarriosVeredas')
    const Laboratorios = () => import('./Components/Laboratorios')
    const Vacunadores = () => import('./Components/Vacunadores')
    export default {
        name: "ParametrosView",
        components: {
            BarriosVeredas,
            Laboratorios,
            Vacunadores
        },
        data: () => ({
            currentOption: 0,
            options: [
                {name: 'Barrios y Veredas', value: 0},
                {name: 'Laboratorios', value: 1},
                {name: 'Vacunadores', value: 2}
            ]
        }),
        computed: {
            currentOptionC(){
                return this.currentOption
            },
          ...mapGetters([
                'datosEmpresa'
            ])
        },
        methods: {
            selectTable(value){
                this.currentOption = value
            }
        }
    }
</script>

<style scoped>

</style>