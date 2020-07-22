<template>
    <div style="min-width: 360px !important; max-width: 400px !important;">
        <v-list-item class="pa-0">
            <v-icon :color="colorText" large class="mr-2" v-if="value.positivo_covid && verDiagnosticados">fas fa-virus</v-icon>
            <v-icon :color="colorText" large class="mr-2">{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
            <v-list-item-content class="pa-0">
                <v-list-item-title :class="`${colorText}--text body-2 text-truncate`">{{this.value.nombre}}</v-list-item-title>
                <v-list-item-subtitle :class="`${colorText}--text body-2 text-truncate`">{{this.value.tipoIdentificacion}} {{this.value.identificacion}}{{this.value.celular ? ', Cel. ' + this.value.celular : ''}}</v-list-item-subtitle>
            </v-list-item-content>
<!--            <template v-if="verAltoCosto">-->
<!--                <v-tooltip top>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                        <v-btn-->
<!--                                x-large-->
<!--                                icon-->
<!--                                v-on="on"-->
<!--                        >-->
<!--                            <img-->
<!--                                    width="44"-->
<!--                                    :src="`/static/enfermedades/vih.png`"-->
<!--                                    alt="VIH"-->
<!--                            >-->
<!--                        </v-btn>-->
<!--                    </template>-->
<!--                    <span>cancer</span>-->
<!--                </v-tooltip>-->
<!--                <v-tooltip top>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                        <v-btn-->
<!--                                x-large-->
<!--                                icon-->
<!--                                v-on="on"-->
<!--                        >-->
<!--                            <img-->
<!--                                    width="44"-->
<!--                                    :src="`/static/enfermedades/cancer.png`"-->
<!--                                    alt="Cancer"-->
<!--                            >-->
<!--                        </v-btn>-->
<!--                    </template>-->
<!--                    <span>cancer</span>-->
<!--                </v-tooltip>-->
<!--                <v-tooltip top>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                        <v-btn-->
<!--                                x-large-->
<!--                                icon-->
<!--                                v-on="on"-->
<!--                        >-->
<!--                            <img-->
<!--                                    width="44"-->
<!--                                    :src="`/static/enfermedades/hemofilia.png`"-->
<!--                                    alt="Hemofilia"-->
<!--                            >-->
<!--                        </v-btn>-->
<!--                    </template>-->
<!--                    <span>cancer</span>-->
<!--                </v-tooltip>-->
<!--            </template>-->
        </v-list-item>
    </div>
</template>

<script>

    export default {
        name: 'PersonaItemTabla',
        props: {
            value: {
                type: Object,
                Default: null
            }
        },
        computed: {
            colorText () {
            return this.value.total_riesgo > 50 ? 'white' : ''
            }
        }
    }
</script>

<style scoped>

</style>