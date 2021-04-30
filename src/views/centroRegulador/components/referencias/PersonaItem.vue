<template>
  <v-list-item class="pa-0">
    <v-icon large class="mr-2" v-if="value.positivo_covid && verDiagnosticados">fas fa-virus</v-icon>
    <v-card align="center" color="transparent" class="elevation-0">
      <v-icon large>{{value.sexo === 'M' ? 'mdi mdi-face' : value.sexo === 'F' ? 'mdi mdi-face-woman' : 'mdi-account'}}</v-icon>
      <v-card-actions class="py-0 px-1" v-if="value && (typeof value.cantidad_nexos !== 'undefined')">
        <v-chip
            align="center"
            color="primary"
            class="font-weight-bold pl-2 pr-1"
            label
            x-small
        >
          <v-icon left x-small>
            fas fa-users
          </v-icon>
          <p class="ma-0 align-center">{{ value && value.cantidad_nexos ? value.cantidad_nexos : '0' }}</p>
        </v-chip>
      </v-card-actions>
    </v-card>
    <v-list-item-content class="py-1">
      <v-list-item-title class="body-2 text-truncate">
        <template v-if="!!(value && value.reporte && value.reporte.tamizaje_id)">
          <v-btn
              style="width: 20px !important; height: 20px !important;"
              depressed
              fab
              color="indigo"
              x-small
              dark
              @click="$emit('verTamizajeOrigen', value.reporte.tamizaje_id)"
          >
            <v-icon x-small>fas fa-people-arrows</v-icon>
          </v-btn>
        </template>
        {{[value.nombre1, value.nombre2, value.apellido1, value.apellido2].filter(x => x).join(' ')}}
      </v-list-item-title>
      <v-list-item-subtitle class="body-2 text-truncate">
        {{[value.tipo_id ? value.tipo_id.tipo : null, value.identificacion, value.celular ? `, Cel.${value.celular}` : ''].filter(x => x).join('')}}
      </v-list-item-subtitle>
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
</template>

<script>
    import {mapGetters} from 'vuex'

    // const Seguimiento = () => import('../../views/covid19/tamizaje/Seguimiento')
    export default {
        name: 'PersonaItem',
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
            // Seguimiento
        },
        computed: {
          ...mapGetters([
            'tiposDocumentoIdentidad'
          ]),
            colorText () {
            // return this.value.estado === 'Cerrado' ? 'white' : (this.value.total_riesgo > 50 ? 'white' : '')
            return this.value.total_riesgo > 50 ? 'white' : ''
            }
        }
    }
</script>

<style scoped>

</style>