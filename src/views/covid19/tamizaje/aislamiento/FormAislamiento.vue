<template>
    <div>
        <v-row>
            <v-col class="pb-0" cols="12">
                <c-date
                        v-model="aislamiento.fecha_ingreso"
                        rules="required"
                        label="Fecha Ingreso"
                        name="fecha de ingreso"
                        :max="moment().format('YYYY-MM-DD')"
                        :min="fechaMinimaAislamiento ? moment(fechaMinimaAislamiento).format('YYYY-MM-DD') : null"
                >
                </c-date>
            </v-col>
            <v-col class="pb-0" cols="12">
                <c-select-complete
                        v-model="aislamiento.tipo"
                        label="Tipo de Aislamiento"
                        :items="tiposAislamiento"
                        rules="required"
                        name="tipo de aislamiento"
                >
                </c-select-complete>
            </v-col>
            <v-col cols="12">
                <v-card outlined tile>
                    <v-card-text>
                        <c-radio
                                v-model="aislamiento.individual"
                                label="Aislada en habitación individual"
                                rules="required"
                                name="aislada en habitación individual"
                                :items="[{value: 1, text: 'SI'}, {value: 0, text: 'NO'}]"
                                item-text="text"
                                item-value="value"
                        >
                        </c-radio>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="pb-0" cols="12">
                <c-select-complete
                        v-model="aislamiento.ambito"
                        label="Ambito de atención médica"
                        :items="ambitosAtencion"
                        rules="required"
                        name="ambito de atención médica"
                >
                </c-select-complete>
            </v-col>
            <v-col class="pb-0" cols="12" v-if="aislamiento.ambito === 'Otro'">
                <c-text-area
                        v-model="aislamiento.otro_ambito"
                        label="Descripción del ambito"
                        rules="required"
                        name="descripción del ambito"
                        rows="1"
                >
                </c-text-area>
            </v-col>
          <v-col cols="12" sm="12" md="12" lg="12">
            <ValidationProvider name="IPS" rules="required" v-slot="{ errors }">
              <v-autocomplete
                  v-model="aislamiento.codigo_habilitacion"
                  outlined
                  dense
                  label="IPS que ordena aislamiento"
                  :loading="loadingPrestador"
                  :search-input.sync="searchPrestador"
                  :items="prestadores"
                  hide-selected
                  cache-items
                  item-value="codigohabilitacion"
                  item-text="nombre"
                  :error-messages="errors"
                  :filter="filterPrestadores"
                  placeholder="IPS que ordena aislamiento"
                  single-line
              >
                <template v-slot:selection="{ item }">
                  <span style="width: 100% !important;" class="text-truncate">{{`${item.nitsnit + "-" + item.nombre}`}}</span>
                </template>
                <template v-slot:item="{ item }">
                  <span>{{`${item.nitsnit}-${item.nombre}`}}</span>
                </template>
              </v-autocomplete>
            </ValidationProvider>
          </v-col>
        </v-row>
        <form-seguimiento-aislamiento
                :aislamiento="aislamiento"
                :seguimiento_aislamiento="seguimiento_aislamiento"
        >
        </form-seguimiento-aislamiento>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import FormSeguimientoAislamiento from 'Views/covid19/tamizaje/aislamiento/FormSeguimientoAislamiento'
    export default {
        name: 'FormAislamiento',
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            aislamiento: {
                type: Object,
                default: null
            },
            seguimiento_aislamiento: {
                type: Object,
                default: null
            }
        },
      data: () => ({
        filterPrestadores (item, queryText) {
          const hasValue = val => val != null ? val : ''
          const text = hasValue(item.nitsnit + ' ' + item.nombre)
          const query = hasValue(queryText)
          return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        },
        searchPrestador: null,
        prestadores: [],
        loadingPrestador: false,
      }),
        components: {
            FormSeguimientoAislamiento
        },
        computed: {
            ...mapGetters([
                'tiposAislamiento',
                'ambitosAtencion'
            ]),
            fechaMinimaAislamiento () {
                return this && this.tamizaje && this.tamizaje.aislamientos && this.tamizaje.aislamientos.length ? this.tamizaje.aislamientos[0].fecha_egreso ? this.tamizaje.aislamientos[0].fecha_egreso : this.tamizaje.aislamientos[0].fecha_ingreso : null
            }
        },
        watch: {
            'aislamiento.ambito': {
                handler (val) {
                    if (val !== 'Otro') {
                        this.aislamiento.otro_ambito = null
                    }
                },
                immediate: false
            },
            'seguimiento_aislamiento.fecha_egreso': {
                handler (val) {
                    this.aislamiento.fecha_egreso = val
                },
                immediate: false
            },
          'searchPrestador'(val) {
            if(this.loadingPrestador)
              return
            this.loadingPrestador = true
            this.axios.get(`prestadores?filter[search]=${val}`)
                .then(response => {
                  this.prestadores = response.data
                  this.loadingPrestador = false
                }).catch(e => {
                  this.loadingPrestador = false
              this.$store.commit('snackbar', {color: 'error', message: `al buscar prestadores`, error: e})
            })
          },
        }
    }
</script>

<style scoped>

</style>