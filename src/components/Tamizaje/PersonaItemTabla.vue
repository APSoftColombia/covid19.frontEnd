<template>
    <div style="min-width: 360px !important; max-width: 400px !important;">
        <v-list-item class="pa-0">
          <div class="mr-2" v-if="!isNotFromNexos">
            <icon-tooltip v-if="[this.value.tipo_identificacion, this.value.identificacion, this.value.nombre1, this.value.apellido1, this.value.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
          </div>
            <v-icon :color="colorText" large class="mr-2" v-if="value.positivo_covid && verDiagnosticados">fas fa-virus</v-icon>
            <v-icon :color="colorText" large class="mr-2">{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
            <v-list-item-content class="pa-0" v-if="isNotFromNexos">
                <v-list-item-title :class="`${colorText}--text body-2 text-truncate`">
                    {{this.value.nombre}}
                    <v-tooltip top v-if="this.value.showButton">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" x-small icon @click.stop="goSeguimiento"><v-icon color="success">mdi-file-find</v-icon></v-btn>
                        </template>
                        <span>Detalle ERP</span>
                    </v-tooltip>
                </v-list-item-title>
                <v-list-item-subtitle :class="`${colorText}--text body-2 text-truncate`">{{this.value.tipoIdentificacion}} {{this.value.identificacion}}{{this.value.celular ? ', Cel. ' + this.value.celular : ''}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content class="pa-0" v-if="!isNotFromNexos">
                <v-list-item-title :class="`${colorText}--text body-2 text-truncate`">{{this.value.nombres}}</v-list-item-title>
                <v-list-item-subtitle :class="`${colorText}--text body-2 text-truncate`">{{this.value.celular ? 'Cel: ' + this.value.celular : ''}} {{ this.value.edad ? "Edad: " + this.value.edad : '' }}</v-list-item-subtitle>
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
        <seguimiento
                ref="seguimiento"
        ></seguimiento>
    </div>
</template>

<script>
    const Seguimiento = () => import('../../views/covid19/tamizaje/Seguimiento')
    export default {
        name: 'PersonaItemTabla',
        props: {
            value: {
                type: Object,
                Default: null
            },
            isNotFromNexos: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            goSeguimiento(){
                this.$refs.seguimiento.open(this.value.erp_origen)
            }
        },
        components: {
            Seguimiento
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