<template>
    <div>
        <v-list-item class="pa-0">
            <v-icon :color="value.fecha_dosis1 ? 'green' : '#dedddd'" large class="mr-2">mdi-needle</v-icon>
            <v-icon :color="value.fecha_dosis2 ? 'green' : '#dedddd'" large class="mr-2">mdi-needle</v-icon>
        </v-list-item>
    </div>
</template>

<script>
    export default {
        name: 'DosisItemTabla',
        props: {
            value: {
                type: Object,
                Default: null
            }
        },
    }
</script>

<style scoped>

</style>