<template>
    <v-container fluid>
        <page-title-bar title="Parametros"></page-title-bar>
        <v-row>
            <v-col cols="12" sm="12" md="4" lg="3">
                <v-list two-line class="notification-wrap">
                    <v-list-item-group v-model="currentOption" color="indigo">
                        <template v-for="option in options">
                            <v-hover v-slot:default="{ hover }" :key="`option-${ option.value }`">
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
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 0">
                <barrios-veredas></barrios-veredas>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="9" v-if="currentOptionC === 1">
                <laboratorios></laboratorios>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    const BarriosVeredas = () => import('./Components/BarriosVeredas')
    const Laboratorios = () => import('./Components/Laboratorios')
    export default {
        name: "ParametrosView",
        components: {
            BarriosVeredas,
            Laboratorios
        },
        data: () => ({
            currentOption: 0,
            options: [
                {name: 'Barrios y Veredas', value: 0},
                {name: 'Laboratorios', value: 1}
            ]
        }),
        computed: {
            currentOptionC(){
                return this.currentOption
            }
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