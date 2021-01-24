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
          <v-icon class="ml-2">fas fa-user-md</v-icon>
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
                            <ValidationProvider name="médico asignado" rules="required" v-slot="{ errors }">
                                <buscador-ips
                                    ref="buscadoripsreps"
                                    label="¿Cual es su IPS de atención?"
                                    v-model="cod_habilitacion_ips"
                                    name="ips de atención"
                                    rules="required"
                                ></buscador-ips>
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
            cod_habilitacion_ips: null
        }),
        computed: {
            ...mapGetters([
              'tiposDocumentoIdentidad',
              'departamentos',
              'municipiosTotal'
            ])
        },
        methods: {
            close () {
              this.dialog = false
              setTimeout(() => {
                this.cod_habilitacion_ips = null
                this.$refs.formAsignacion.reset()
              }, 400)
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