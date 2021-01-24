<template>
    <v-dialog v-model="dialog" persistent max-width="900">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="purple lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
        >
          Asignar Pruebas a IPS
          <v-icon class="ml-2">fas fa-clinic-medical</v-icon>
        </v-btn>
      </template>
        <v-card>
          <v-card-title>
            Asignación de pruebas a IPS
            <v-spacer/>
            <v-btn icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
            <v-container fluid>
              <v-expansion-panels multiple style="z-index: 0 !important;">
                <v-expansion-panel>
                  <v-expansion-panel-header class="py-1">
                    {{ seleccionados.length }} persona{{ seleccionados.length === 1 ? '' : 's' }} seleccionada{{ seleccionados.length === 1 ? '' : 's' }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-divider class="ma-0"></v-divider>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                        <tr>
                          <th>Persona</th>
                          <th>Contacto</th>
                          <th>Ubicación</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="(item, indexItem) in seleccionados"
                            :key="indexItem"
                        >
                          <td>
                            <v-list-item class="pa-0">
                              <v-icon color="primary" large class="mr-2">{{item.sexo === null ? 'mdi mdi-emoticon-happy' : item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                              <v-list-item-content class="pa-0">
                                <v-list-item-title class="body-2 text-truncate">{{[item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')}}</v-list-item-title>
                                <v-list-item-subtitle class="body-2 text-truncate">{{ [tiposDocumentoIdentidad && item.tipo_identificacion ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : null, item.identificacion].filter(x => x).join(' ') }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </td>
                          <td>
                            <v-list-item class="pa-0">
                              <v-list-item-content class="pa-0">
                                <v-list-item-title class="body-2 text-truncate">Celular: {{ item.celular || '' }}</v-list-item-title>
                                <v-list-item-subtitle class="body-2 text-truncate">Email: {{ item.email || '' }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </td>
                          <td>
                            <v-list-item class="pa-0">
                              <v-list-item-content class="pa-0">
                                <v-list-item-title class="body-2 text-truncate">{{ [municipiosTotal && item.municipio_id ? municipiosTotal.find(x => x.id === item.municipio_id).nombre : null, departamentos && item.departamento_id ? departamentos.find(x => x.id === item.departamento_id).nombre : null].filter(x => x).join(', ') }}</v-list-item-title>
                                <v-list-item-subtitle class="body-2 text-truncate">{{ item.direccion || '' }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
                <ValidationObserver ref="formAsignacion" v-slot="{ invalid, validated, passes, validate }" autocomplete="off">
                    <v-row class="mt-3">
                        <v-col cols="12" class="pb-0">
                          <ValidationProvider name="IPS que toma muestras" rules="required" v-slot="{ errors }">
                            <v-autocomplete
                                label="IPS que toma muestras"
                                v-model="cod_habilitacion_ips"
                                item-value="codigohabilitacion"
                                :items="prestadores"
                                placeholder="Buscar por código de habilitación, NIT o nombre"
                                no-data-text="No hay registros para mostrar"
                                outlined
                                :error-messages="errors"
                                persistent-hint
                                :hint="ipsSeleccionada ? [ipsSeleccionada.telefono ? `Tel.${ipsSeleccionada.telefono}`: null, `${ipsSeleccionada.direccion} ${ipsSeleccionada.nompio}, ${ipsSeleccionada.nomdepto}`].filter(x => x).join(' | '): null"
                            >
                              <template v-slot:selection="data">
                                <v-list-item class="pa-0" style="width: 100% !important;">
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title class="body-2 text-truncate">
                                      {{ data.item.nombre }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="caption text-truncate">Código de
                                      Habilitación:{{ data.item.codigohabilitacion }}
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <template v-slot:item="data">
                                <div style="width: 100% !important;">
                                  <v-list-item class="pa-0">
                                    <v-list-item-content class="text-truncate pa-0">
                                      <v-list-item-title class="body-2">
                                        {{ data.item.nombre }}
                                      </v-list-item-title>
                                      <v-list-item-subtitle class="caption">Código de
                                        Habilitación:{{ data.item.codigohabilitacion }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-divider class="ma-0"></v-divider>
                                </div>
                              </template>
                            </v-autocomplete>
                          </ValidationProvider>
                        </v-col>
                    </v-row>
                </ValidationObserver>
                <v-card-actions>
                    <v-btn @click.stop="close">
                        <v-icon>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.stop="asignar">
                        <v-icon left>fas fa-save</v-icon>
                        Asignar
                    </v-btn>
                </v-card-actions>
            </v-container>
            <app-section-loader :status="loading"></app-section-loader>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'Asignador',
        props: {
            seleccionados: {
                type: Array,
                default: () => []
            },
          muestras: {
                type: Array,
                default: () => []
            }
        },
        data: () => ({
            dialog: false,
            loading: false,
            cod_habilitacion_ips: null,
            prestadores: []
        }),
        computed: {
          ipsSeleccionada() {
            return (this && this.prestadores && this.cod_habilitacion_ips && this.prestadores.find(x => x.codigohabilitacion === this.cod_habilitacion_ips)) || null
          },
            ...mapGetters([
              'tiposDocumentoIdentidad',
              'departamentos',
              'municipiosTotal'
            ])
        },
      created() {
        console.log('entra al xcreated las ips')
          this.getips()
      },
      methods: {
            close () {
              this.dialog = false
              setTimeout(() => {
                this.cod_habilitacion_ips = null
                this.$refs.formAsignacion.reset()
              }, 400)
            },
          getips() {
            this.axios.get(`prestadores?filter[laboratorio_covid]=1`)
                .then(response => {
                  console.log('las ips', response)
                  this.prestadores = response.data
                }).catch(e => {
              this.$store.commit('snackbar', {color: 'error', message: `al recuperar las IPS que toman muestras.`, error: e})
            })
          },
            asignar () {
                this.$refs.formAsignacion.validate().then(result => {
                    if (result) {
                        this.loading = true
                        this.axios.post(`asignar-pruebas`, { tamizaje_ids: this.seleccionados.map(x => x.id), cod_habilitacion_ips : this.cod_habilitacion_ips })
                            .then(() => {
                                this.$emit('guardado')
                                this.$store.commit('snackbar', {color: 'success', message: `Pruebas de tamizaje asignadas correctamente.`})
                                this.close()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$store.commit('snackbar', {color: 'error', message: `al asignar pruebas de tamizajes.`, error: error})
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>