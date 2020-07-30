<template>
    <v-container fluid>
        <page-title-bar title="Parametros"></page-title-bar>
        <v-row>
            <v-col cols="12">
                <barrios-veredas></barrios-veredas>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6">
                <roles></roles>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6">
                <laboratorios></laboratorios>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    const BarriosVeredas = () => import('./Components/BarriosVeredas')
    const Laboratorios = () => import('./Components/Laboratorios')
    const Roles = () => import('./Components/Roles')
    export default {
        name: "ParametrosView",
        components: {
            BarriosVeredas,
            Laboratorios,
            Roles
        },
    }
</script>

<style scoped>

</style>