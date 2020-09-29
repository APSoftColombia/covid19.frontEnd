<template>
    <v-card flat>
        <v-toolbar dark color="warning" dense>
            <v-icon left>fas fa-people-arrows</v-icon>
            <v-toolbar-title>{{ sonNexos ? 'Nexos' : 'Convivientes' }}</v-toolbar-title>
            <template v-if="editable">
                <v-spacer></v-spacer>
                <v-btn dark @click="agregarNexo" color="warning darken-3">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar {{ sonNexos ? 'nexo' : 'conviviente' }}
                </v-btn>
            </template>
        </v-toolbar>
        <v-card-text class="text-center font-lg" v-if="!tamizaje.nexos.length">
            No registra {{ sonNexos ? 'nexos' : 'convivientes' }}
        </v-card-text>
        <v-row v-else>
            <v-col cols="12" class="pt-0">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left">{{ sonNexos ? 'Nexo' : 'Conviviente' }}</th>
                          <th class="text-left">Persona</th>
                          <th class="text-left">Ubicación</th>
                          <th class="text-left">Parentesco</th>
                          <th class="text-left">Observaciones</th>
                          <th class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, nexoIndex) in tamizaje.nexos" :key="`nexo${nexoIndex}`">
                            <td>
                                <v-list-item class="pa-0">
                                  <div class="mr-2">
                                    <icon-tooltip v-if="[item.tipo_identificacion, item.identificacion, item.nombre1, item.apellido1, item.celular].filter(x => !x).length" tooltip="Hay campos por diligenciar en el registro"></icon-tooltip>
                                  </div>
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">Id: {{item.id}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption">
                                            {{moment(item.created_at).format('DD/MM/YYYY')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                            <td>
                                <v-list-item class="pa-0">
                                    <v-list-item-avatar>
                                        <v-icon large>{{item.sexo === 'M' ? 'mdi mdi-face' : 'mdi mdi-face-woman'}}</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">{{item.nombres}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption" v-if="item.tipo_identificacion && item.identificacion">
                                            {{ `${tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo}${item.identificacion}` }}
                                        </v-list-item-subtitle>
                                      <v-list-item-subtitle class="title caption">
                                            {{[item.edad ? ('Edad: ' + item.edad) : '', item.celular ? ('Cel: ' + item.celular) : ''].filter(x => x).join(', ')}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                            <td>
                                <v-list-item class="pa-0">
                                    <v-list-item-content class="pa-0">
                                        <v-list-item-title class="body-2">{{municipiosTotal && municipiosTotal.length && item.municipio_id && municipiosTotal.find(x => x.id === item.municipio_id) ?  `${municipiosTotal.find(x => x.id === item.municipio_id).nombre}, ${municipiosTotal.find(x => x.id === item.municipio_id).departamento.nombre}` : ''}}</v-list-item-title>
                                        <v-list-item-subtitle class="title caption">
                                            {{item.direccion}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </td>
                          <td>
                            <div style="max-width: 150px; white-space: normal">
                              {{ parentescos && parentescos.length && parentescos.find(x => x.id === item.parentesco_id) ? parentescos.find(x => x.id === item.parentesco_id).descripcion : '' }}
                            </div>
                          </td>
                            <td>
                              <div style="white-space: initial !important;">
                                {{item.observaciones}}
                              </div>
                            </td>
                            <td class="text-center">
                              <v-tooltip top v-if="editable">
                                <template v-slot:activator="{on}">
                                  <v-btn icon color="orange" v-on="on" @click="editarNexo(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{ 'Editar' }}</span>
                              </v-tooltip>
                              <v-tooltip top v-if="permisos.tamizajeCrear && !item.tamizaje">
                                <template v-slot:activator="{on}">
                                  <v-btn icon color="primary" v-on="on" @click="crearTamizaje(item)">
                                    <v-icon>fas fa-file-medical</v-icon>
                                  </v-btn>
                                </template>
                                <span>Crear ERP</span>
                              </v-tooltip>
                              <template>
                                <v-tooltip top v-if="item.tamizaje">
                                  <template v-slot:activator="{on}">
                                    <v-btn icon :color="item.tamizaje.medico_id ? 'primary' : 'success'" v-on="on" @click="verSeguimiento(item)">
                                      <v-icon>fas fa-file-medical-alt</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{ item.tamizaje.medico_id ? 'Caso de Estudio' : 'Detalle ERP' }}</span>
                                </v-tooltip>
                              </template>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <registro-reporte-comunitario
                ref="registroNexo"
                @guardado="val => nexoGuardado(val)"
                :sonNexos="sonNexos"
        ></registro-reporte-comunitario>
        <registro-tamizaje
            v-if="permisos.tamizajeCrear"
            ref="registroTamizaje"
            @guardado="val => nexoGuardado(val)"
        ></registro-tamizaje>
      <seguimiento
          ref="seguimiento"
      ></seguimiento>
    </v-card>
</template>

<script>
    import {mapGetters} from "vuex";
    const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
    const RegistroTamizaje = () => import('Views/covid19/tamizaje/RegistroTamizaje')
    const RegistroReporteComunitario = () => import('Views/covid19/reporteComunitario/RegistroReporteComunitario')
    export default {
        name: 'Nexos',
        components: {
            Seguimiento,
            RegistroTamizaje,
            RegistroReporteComunitario
        },
        props: {
            tamizaje: {
                type: Object,
                default: null
            },
            editable: {
                type: Boolean,
                default: false
            },
            sonNexos: {
              type: Boolean,
              default: null
            }
        },
        computed: {
            ...mapGetters([
                'municipiosTotal',
                'tiposDocumentoIdentidad',
                'parentescos'
            ]),
            permisos () {
                return this.$store.getters.getPermissionModule('covid')
            },
        },
        methods: {
            agregarNexo () {
                this.$refs.registroNexo.open(null, this.tamizaje)
            },
          editarNexo (nexo) {
            this.$refs.registroNexo.open(nexo, this.tamizaje)
          },
            nexoGuardado (item) {
                this.$emit('change', item)
            },
            crearTamizaje (item) {
              this.$refs.registroTamizaje.open(null, item.id)
            },
            verSeguimiento (item) {
              if (item && item.tamizaje) this.$refs.seguimiento.open(item.tamizaje.id)
            }
        }
    }
</script>

<style scoped>
.v-sheet {
    border-radius: 0 !important;
}
</style>