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
                <definicionvi1 v-if="item.idShow === 'VI1'" :item="item"></definicionvi1>
                <definicionvi2 v-if="item.idShow === 'VI2'" :item="item"></definicionvi2>
                <definicionvi3 v-if="item.idShow === 'VI3'" :item="item"></definicionvi3>
                <definicionvi31 v-if="item.idShow === 'VI3.1'" :item="item"></definicionvi31>
                <definicionvi32 v-if="item.idShow === 'VI3.2'" :item="item"></definicionvi32>
                <definicionvi4 v-if="item.idShow === 'VI4'" :item="item"></definicionvi4>
                <definicionvi5 v-if="item.idShow === 'VI5'" :item="item"></definicionvi5>

              <definicionviip1 v-if="item.idShow === 'VIIP1'" :item="item"></definicionviip1>
              <definicionviip2 v-if="item.idShow === 'VIIP2'" :item="item"></definicionviip2>
              <definicionviip4 v-if="item.idShow === 'VIIP4'" :item="item"></definicionviip4>
              <definicionviip5 v-if="item.idShow === 'VIIP5'" :item="item"></definicionviip5>

              <definicionviic1 v-if="item.idShow === 'VIIC1'" :item="item"></definicionviic1>
              <definicionviic2 v-if="item.idShow === 'VIIC2'" :item="item"></definicionviic2>
              <definicionviic4 v-if="item.idShow === 'VIIC4'" :item="item"></definicionviic4>
              <definicionviic5 v-if="item.idShow === 'VIIC5'" :item="item"></definicionviic5>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    const Definicionvi1 = () => import('./Definiciones/Definicion1')
    const Definicionvi2 = () => import('./Definiciones/Definicion2')
    const Definicionvi3 = () => import('./Definiciones/Definicion3')
    const Definicionvi31 = () => import('./Definiciones/Definicion31')
    const Definicionvi32 = () => import('./Definiciones/Definicion32')
    const Definicionvi4 = () => import('./Definiciones/Definicion4')
    const Definicionvi5 = () => import('./Definiciones/Definicion5')
    ///VII
    const Definicionviip1 = () => import('./Definiciones/v2/probables/P1')
    const Definicionviip2 = () => import('./Definiciones/v2/probables/P2')
    const Definicionviip4 = () => import('./Definiciones/v2/probables/P4')
    const Definicionviip5 = () => import('./Definiciones/v2/probables/P5')

    const Definicionviic1 = () => import('./Definiciones/v2/confirmados/C1')
    const Definicionviic2 = () => import('./Definiciones/v2/confirmados/C2')
    const Definicionviic4 = () => import('./Definiciones/v2/confirmados/C4')
    const Definicionviic5 = () => import('./Definiciones/v2/confirmados/C5')
    export default {
        name: 'HelpModal',
        components: {
          Definicionvi1,
          Definicionvi2,
          Definicionvi3,
          Definicionvi31,
          Definicionvi32,
          Definicionvi4,
          Definicionvi5,
          /////VII
          Definicionviip1,
          Definicionviip2,
          Definicionviip4,
          Definicionviip5,
          Definicionviic1,
          Definicionviic2,
          Definicionviic4,
          Definicionviic5
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