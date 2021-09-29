<template>
    <div>
        <v-list-item class="pa-0" v-if="value && value.dosis_usuario && value.dosis_usuario.length">
            <v-row>
                <template v-for="(vacuna, index_1) in value.dosis_usuario">
                    <v-col :key="index_1" cols="12" class="pt-1 pb-1">
                        <template v-for="(dosis, index_2) in vacuna.cantidad">
                            <v-icon :key="`${index_1}-${index_2}`" color="green" dense>mdi-needle</v-icon>
                        </template>
                        <span :key="index_1"> - {{ vacuna.nombre }}</span>
                    </v-col>
                </template>
            </v-row>
            <!-- <v-icon :color="value.fecha_dosis2 ? 'green' : '#dedddd'" dense>mdi-needle</v-icon> -->
        </v-list-item>
        <v-list-item class="pa-0" v-else>
            <span>No registra</span>
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