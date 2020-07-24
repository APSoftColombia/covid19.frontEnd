<template>
    <v-row align="center" justify="end" fill-height>
        <c-select-complete
                v-model="datavmodel"
                label="Estado de la Prueba"
                :items="data1"
        >
        </c-select-complete>
    </v-row>
</template>

<script>
    export default {
        name: "Filtros",
        data: () => ({
            data1: [
                {id: 1, name: "algo"}
            ],
            datavmodel: ''
        })
    }
</script>

<style scoped>

</style>