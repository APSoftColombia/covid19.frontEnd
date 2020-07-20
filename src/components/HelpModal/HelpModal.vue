<template>
    <v-dialog
            v-model="dialog"
            width="760"
    >
        <v-card v-if="item">
            <v-card-title class="warning white--text py-2">
                {{item.nombre}}
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon color="white">mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-container>
                <definicion1 v-if="item.id === '1'" :item="item"></definicion1>
                <definicion2 v-if="item.id === '2'" :item="item"></definicion2>
                <definicion3 v-if="item.id === '3'" :item="item"></definicion3>
                <definicion31 v-if="item.id === '3.1'" :item="item"></definicion31>
                <definicion32 v-if="item.id === '3.2'" :item="item"></definicion32>
                <definicion4 v-if="item.id === '4'" :item="item"></definicion4>
                <definicion5 v-if="item.id === '5'" :item="item"></definicion5>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    const Definicion1 = () => import('./Definiciones/Definicion1')
    const Definicion2 = () => import('./Definiciones/Definicion2')
    const Definicion3 = () => import('./Definiciones/Definicion3')
    const Definicion31 = () => import('./Definiciones/Definicion31')
    const Definicion32 = () => import('./Definiciones/Definicion32')
    const Definicion4 = () => import('./Definiciones/Definicion4')
    const Definicion5 = () => import('./Definiciones/Definicion5')
    export default {
        name: 'HelpModal',
        components: {
            Definicion1,
            Definicion2,
            Definicion3,
            Definicion31,
            Definicion32,
            Definicion4,
            Definicion5
        },
        data: () => ({
            dialog: false,
            item: null
        }),
        methods: {
            open (item) {
                if (item) {
                    this.item = item
                    this.dialog = item.modal
                }
            }
        }
    }
</script>

<style scoped>

</style>