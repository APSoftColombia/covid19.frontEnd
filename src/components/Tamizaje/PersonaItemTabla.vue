<template>
    <div style="min-width: 360px !important; max-width: 400px !important;">
        <v-list-item class="pa-0">
          <div class="mr-2" v-if="!isNotFromNexos">
            <icon-tooltip v-if="[this.value.tipo_identificacion, this.value.identificacion, this.value.nombre1, this.value.apellido1, this.value.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
          </div>
            <v-icon :color="colorText" large class="mr-2" v-if="value.positivo_covid && verDiagnosticados">fas fa-virus</v-icon>
          <v-card align="center" color="transparent" class="elevation-0">
            <v-icon :color="colorText" large>{{this.value.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
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
            <v-list-item-content class="py-1" v-if="isNotFromNexos">
                <v-list-item-title :class="`${colorText}--text body-2 text-truncate`">
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
                    {{value.nombre}}
                    <v-tooltip top v-if="value.showButton">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" x-small icon @click.stop="goSeguimiento"><v-icon color="success">mdi-file-find</v-icon></v-btn>
                        </template>
                        <span>Detalle ERP</span>
                    </v-tooltip>
                </v-list-item-title>
                <v-list-item-subtitle
                    :class="`${colorText}--text body-2 text-truncate`"
                >
                  {{value.tipoIdentificacion}} {{value.identificacion}}
                  <template v-if="value.celular || value.celular2">
                    <c-tooltip
                        v-if="value.cambio_telefono"
                        top
                        :tooltip="`Números de celular actualizados el ${moment(value.cambio_telefono).format('dddd, DD [de] MMMM [de] YYYY')}`"
                    >
                      <v-chip
                          color="green"
                          label
                          class="white--text body-2 px-2 mr-1"
                          style="height: 20px !important;"
                      >
                        Cel.
                      </v-chip>
                    </c-tooltip>
                    <template v-else>
                      Cel.
                    </template>
                    <template v-if="value.celular">
                      <a
                          :href="`tel:${value.celular}`"
                          :style="`color: ${colorText}; text-decoration: underline;`"
                      >
                        {{ value.celular }}
                      </a>
                    </template>
                    <template v-if="value.celular && value.celular2"> | </template>
                    <template v-if="value.celular2">
                      <a
                          :href="`tel:${value.celular2}`"
                          :style="`color: ${colorText}; text-decoration: underline;`"
                      >
                        {{ value.celular2 }}
                      </a>
                    </template>
                  </template>
                </v-list-item-subtitle>
              <v-list-item-subtitle v-if="value.nombre_eps">
                {{ value.nombre_eps }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content class="pa-0" v-if="!isNotFromNexos">
                <v-list-item-title :class="`${colorText}--text body-2 text-truncate`">{{value.nombres}}</v-list-item-title>
                <v-list-item-subtitle :class="`${colorText}--text body-2 text-truncate`">{{ [[value.tipo_identificacion && tiposDocumentoIdentidad ? tiposDocumentoIdentidad.find(x => x.id === value.tipo_identificacion).tipo : null, value.identificacion].filter(x => x).join(' '), this.value.celular ? 'Cel: ' + this.value.celular : null, this.value.edad ? "Edad: " + this.value.edad : null].filter(z => z).join(', ') }}</v-list-item-subtitle>
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
    import {mapGetters} from "vuex";

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