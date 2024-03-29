<template>
  <div>
    <data-table
        ref="tablaTamizajes"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @actualizar="item => actualizarTamizaje(item)"
        @seguimiento="item => verSeguimiento(item)"
        @asignarmedico="item => asignarMedico(item)"
        @georeferenciar="item => asignarGeorreferenciacion(item)"
        @verpdf="item => descargarPDF(item)"
        @apply-filters="$refs && $refs.filtrosTamizaje && $refs.filtrosTamizaje.aplicaFiltros()"
        @clear-filters="$refs && $refs.filtrosTamizaje && $refs.filtrosTamizaje.limpiarFiltros()"
    >
      <template slot="top-actions-right" v-if="permisos.tamizajeCrear || permisos.tamizajeViajeroCrear">
        <v-tooltip top v-if="permisos.tamizajeViajeroCrear" :disabled="$vuetify.breakpoint.smAndUp">
          <template v-slot:activator="{on}">
            <v-btn
                v-on="on"
                color="indigo"
                @click.stop="crearViajero"
                class="white--text mr-2"
            >
              <v-icon :left="$vuetify.breakpoint.smAndUp">mdi-bus-marker</v-icon>
              {{ $vuetify.breakpoint.smAndUp ? 'Crear ERP Viajero' : '' }}
            </v-btn>
          </template>
          <span>Crear Encuesta de Riesgo Poblacional Viajero</span>
        </v-tooltip>
        <v-tooltip top v-if="permisos.tamizajeCrear" :disabled="$vuetify.breakpoint.smAndUp">
          <template v-slot:activator="{on}">
            <v-btn
                v-on="on"
                color="primary"
                @click.stop="crearTamizaje"
                class="white--text"
            >
              <v-icon :left="$vuetify.breakpoint.smAndUp">fas fa-file-medical</v-icon>
              {{ $vuetify.breakpoint.smAndUp ? 'Crear ERP' : '' }}
            </v-btn>
          </template>
          <span>Crear Encuesta de Riesgo Poblacional</span>
        </v-tooltip>
      </template>
      <filtros
          slot="filters"
          v-if="permisos.filtrosTamizaje"
          ref="filtrosTamizaje"
          :ruta-base="rutaBase"
          @filtra="val => goDatos(val)"
      />
    </data-table>
    <registro-viajero
        v-if="permisos.tamizajeViajeroCrear"
        ref="registroViajero"
        @guardado="val => tamizajeGuardado(val)"
        @close="loading = false"
    />
    <registro-tamizaje
        v-if="permisos.tamizajeCrear"
        ref="registroTamizaje"
        @guardado="item => tamizajeGuardado(item)"
        @close="loading = false"
    />
    <seguimiento
        ref="seguimiento"
    />
    <asigna-medico
        v-if="permisos.tamizajeAsignarMedico"
        :medicos="medicos"
        ref="asignaMedico"
        @guardado="item => tamizajeGuardado(item)"
    />
    <asignar-georreferenciacion
        ref="asignaGeorreferenciacion"
        @guardado="item => tamizajeGuardado(item)"
    />
    <help-modal ref="helpModal"/>
    <grupo-familiar-table
        ref="grupoFamiliar"
    />
    <detalle-vacunacion ref="detalleDosisAplicada" />
    <app-section-loader :status="loading"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import BotonClasificacion from '../../../components/Tamizaje/BotonClasificacion'
import DatoUltimaAtencion from '../../../components/Tamizaje/DatoUltimaAtencion'
import SemaforoAvatar from "../../../components/Tamizaje/SemaforoAvatar";
import PersonaItemTabla from "../../../components/Tamizaje/PersonaItemTabla";
import axios from 'axios'

const RegistroViajero = () => import('Views/covid19/viajero/RegistroViajero')
import RegistroTamizaje from 'Views/covid19/tamizaje/RegistroTamizaje'
// import BotonTieneAislamientos from "../../../components/Tamizaje/BotonTieneAislamientos";

const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
const AsignaMedico = () => import('Views/covid19/tamizaje/AsignaMedico')
const AsignarGeorreferenciacion = () => import('Views/covid19/tamizaje/georreferenciacion/AsignarGeorreferenciacion')
const Filtros = () => import('Views/covid19/tamizaje/filtros/Filtros')
const HelpModal = () => import('../../../components/HelpModal/HelpModal')
const DetalleVacunacion = () => import("../vacunacionSucre/components/DetalleVacunacion");
import GrupoFamiliarTable from "Views/covid19/Cet/Componentes/GrupoFamiliarTable";
import BotonCet from "../Cet/Componentes/BotonCet";
import BotonVacunacion from "./BotonVacunacion";

export default {
  name: 'Tamizajes',
  components: {
    AsignarGeorreferenciacion,
    RegistroViajero,
    RegistroTamizaje,
    Seguimiento,
    AsignaMedico,
    HelpModal,
    Filtros,
    GrupoFamiliarTable,
    DetalleVacunacion
  },
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covid')
    },
    ...mapGetters([
      'tiposDocumentoIdentidad',
      'estadosAfiliacion'
    ]),
  },
  watch: {
    permisos: {
      handler(val) {
        if (val && val.tamizajeViajeroCrear || val.tamizajeCrear) this.dataTable.buttonZone = true
        if (val && val.filtrosTamizaje) this.dataTable.advanceFilters = true
      },
      immediate: true
    }
  },
  data: (vm) => ({
    loading: false,
    medicos: [],
    rutaBase: 'tamizajes',
    dataTable: {
      advanceFilters: false,
      buttonZone: false,
      nameItemState: 'tablaTamizajes',
      route: null,
      makeHeaders: [
        {
          text: 'ID',
          align: 'left',
          sortable: false,
          value: 'id',
          component: {
            functional: true,
            render: function (createElement, context) {
              return createElement(
                  'a',
                  {
                    class: ['font-weight-bold'],
                    on: {
                      click: () => {
                        vm.verSeguimiento(context.props.value)
                      }
                    }
                  },
                  context.props.value.id
              )
            }
          }
        },
        {
          text: 'Creación',
          align: 'left',
          sortable: true,
          visibleColumn: false,
          value: 'created_at',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  this.value.created_at ? this.moment(this.value.created_at).format('DD/MM/YYYY HH:mm') : ''
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Actualización',
          align: 'left',
          sortable: true,
          visibleColumn: false,
          value: 'updated_at',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  this.value.updated_at ? this.moment(this.value.updated_at).format('DD/MM/YYYY HH:mm') : ''
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Estado ERP',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          value: 'id',
          component: {
            functional: true,
            render: function (createElement, context) {
              return createElement(
                  `div`,
                  {
                    class: ['white-space-normal']
                  },
                  context.props.value.localiza_persona === 1 && context.props.value.contesta_encuesta === 1
                      ? 'Encuesta Realizada'
                      : context.props.value.localiza_persona === null
                      ? `Pendiente`
                      : context.props.value.localiza_persona === 0
                          ? `Fallida - Persona No Localizada${context.props.value.no_efectividad ? ` - ${context.props.value.no_efectividad}` : ''}`
                          : context.props.value.contesta_encuesta === 0
                              ? 'Fallida - Persona No Desea Responder'
                              : ''
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Punto ERP',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.tamizador.nombre}</v-list-item-title>
														<v-list-item-subtitle class="body-1">
                                                            ${this.value.infoviajero ? this.value.infoviajero.lugar : ''}
                                                        </v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Municipio',
          align: 'left',
          sortable: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
                                                <v-list-item>
                                                    <v-list-item-content style="display: grid !important;">
                                                        <v-list-item-title class="body-2">
                                                            ${this.value.municipio ? this.value.municipio.nombre : ''}
                                                        </v-list-item-title>
                                                        <v-list-item-subtitle class="body-1">
                                                            ${this.value.municipio ? this.value.municipio.departamento.nombre : ''}
                                                        </v-list-item-subtitle>
                                                    </v-list-item-content>
                                                </v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Cets',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.tiene_cet
                  ? createElement(
                      BotonCet,
                      {
                        props: {
                          item: context.props.value.tiene_cet,
                          textColor: context.props.value.total_riesgo > 50 ? 'white' : ''
                        },
                        on: {
                          click: (value) => {
                            vm.openTableCets(value)
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Vacunas',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.tiene_dosis_aplicadas
                  ? createElement(
                      BotonVacunacion,
                      {
                        props: {
                          item: context.props.value.tiene_dosis_aplicadas,
                          textColor: context.props.value.total_riesgo > 50 ? 'white' : ''
                        },
                        on: {
                          click: (value) => {
                            vm.openDosisAplicadas(value)
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        // {
        //   text: 'Afiliación',
        //   align: 'left',
        //   sortable: false,
        //   component: {
        //     render: function (createElement) {
        //       return createElement(
        //           `div`,
        //           this.value.afiliado_id && this.value.estado_afiliado ? vm.estadosAfiliacion && vm.estadosAfiliacion.length && vm.estadosAfiliacion.find(x => x.value === this.value.estado_afiliado) ? vm.estadosAfiliacion.find(x => x.value === this.value.estado_afiliado).text : '' : ''
        //       )
        //     },
        //     props: ['value']
        //   }
        // },
        {
          text: 'Persona',
          align: 'left',
          sortable: false,
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value
                  ? createElement(
                      PersonaItemTabla,
                      {
                        props: {
                          value: context.props.value
                        },
                        on: {
                          verTamizajeOrigen: (tamizajeId) => {
                            vm.verSeguimiento({ id: tamizajeId })
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'EPS',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          value: 'eps_id',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<span>${this.value.eps ? this.value.eps.nombre : ''}</span>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Médico',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.medico ? this.value.medico.name : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.medico ? `Telefono: ${this.value.medico.telefono}` : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Segui.',
          align: 'left',
          sortable: true,
          value: 'seguimientos',
          component: {
            functional: true,
            render: function (createElement, context) {
              let texts = []
              texts.push(createElement('c-chip', {
                props: {
                  text: context.props.value.seguimientos || 0,
                  color: 'deep-purple',
                  tooltip: `Seguimiento${context.props.value.seguimientos === 1 ? '' : 's'}`,
                  textColor: 'white',
                  label: true
                }
              }))
              return texts.length ? texts : createElement('div', '')
            }
          }
        },
        {
          text: 'Afectación',
          align: 'left',
          sortable: false,
          value: 'estado_afectacion'
        },
        {
          text: 'Oportunidad Atención',
          align: 'left',
          sortable: true,
          visibleColumn: true,
          value: 'ultimo_seguimiento',
          component: {
            functional: true,
            render: function (createElement, context) {
              return createElement(
                  DatoUltimaAtencion,
                  {
                    props: {
                      tamizaje: context.props.value
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Último Seguimiento',
          align: 'left',
          sortable: true,
          visibleColumn: false,
          value: 'ultimo_seguimiento',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.ultimo_seguimiento ? this.moment(this.value.ultimo_seguimiento).format('DD/MM/YYYY') : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.evolucion ? this.value.evolucion : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Orden médica',
          align: 'left',
          sortable: false,
          visibleColumn: true,
          value: 'orden_medica_id',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<span>
                                                    ${this.value.orden_medica ? this.value.orden_medica.orden : ''}
                                                </span>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Riesgos',
          align: 'left',
          sortable: true,
          value: 'total_riesgo',
          component: {
            functional: true,
            render: function (createElement, context) {
              let texts = []
              texts.push(createElement('c-chip', {
                props: {
                  text: context.props.value.cantidad_sintomas || 0,
                  color: 'indigo',
                  clase: 'mr-1',
                  tooltip: 'Síntomas',
                  textColor: 'white',
                  label: true
                }
              }))
              if (context.props.value.riesgo_procedencia) texts.push(createElement('c-chip', {
                props: {
                  text: 'V',
                  color: 'green',
                  clase: 'mr-1',
                  tooltip: 'Antecedentes de viaje',
                  textColor: 'white',
                  label: true
                }
              }))
              if (context.props.value.riesgo_ocupacional) texts.push(createElement('c-chip', {
                props: {
                  text: 'O',
                  color: 'blue',
                  clase: 'mr-1',
                  tooltip: 'Es trabajador de la Salud',
                  textColor: 'white',
                  label: true
                }
              }))
              if (context.props.value.riesgo_contacto) texts.push(createElement('c-chip', {
                props: {
                  text: 'C',
                  color: 'purple',
                  clase: 'mr-1',
                  tooltip: 'Ha tenido contacto estrecho',
                  textColor: 'white',
                  label: true
                }
              }))

              return texts.length ? texts : createElement('div', '')
            }
          }
        },
        {
          text: 'Clasificación',
          align: 'center',
          sortable: false,
          value: 'clasificacion',
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.clasificacion
                  ? createElement(
                      BotonClasificacion,
                      {
                        props: {
                          clasificacion: context.props.value.clasificacion,
                          version: context.props.value.version_lineamientos,
                          confirmado: context.props.value.positivo_covid,
                          color: 'orange',
                          textColor: 'white'
                        },
                        on: {
                          click: (modal) => {
                            vm.verModalClasificacion(modal)
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Atención',
          sortable: false,
          value: 'semaforo',
          component: {
            functional: true,
            render: function (createElement, context) {
              return context.props.value.semaforo
                  ? createElement(
                      SemaforoAvatar,
                      {
                        props: {
                          value: {
                            color: context.props.value.semaforo
                          }
                        }
                      }
                  )
                  : createElement('span', '')
            }
          }
        },
        {
          text: 'Aislamiento',
          sortable: false,
          value: 'aislamiento',
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.ultimo_aislamiento_activo && this.value.ultimo_aislamiento_activo.fecha_ingreso ? (`${(this.moment().diff(this.moment(this.value.ultimo_aislamiento_activo.fecha_ingreso), 'days') + 1)} Día${(this.moment().diff(this.moment(this.value.ultimo_aislamiento_activo.fecha_ingreso), 'days') + 1) === 1 ? '' : 's'} Activo`) : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2">${this.value.ultimo_aislamiento_activo && this.value.ultimo_aislamiento_activo.fecha_ingreso ? `Desde: ${this.moment(this.value.ultimo_aislamiento_activo.fecha_ingreso).format('DD/MM/YYYY')}` : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
          // component: {
          //   functional: true,
          //   render: function (createElement, context) {
          //     return context.props.value.ultimo_aislamiento_activo
          //         ? createElement(
          //             BotonTieneAislamientos,
          //             {
          //               props: {
          //                 aislamiento: context.props.value.ultimo_aislamiento_activo
          //               }
          //             }
          //         )
          //         : createElement('span', '')
          //   }
          // }
        },
        {
          text: 'Muestra',
          align: 'left',
          sortable: false,
          value: 'estado_prueba'
        },
        {
          text: 'Usuario Registra',
          align: 'left',
          sortable: false,
          visibleColumn: false,
          component: {
            render: function (createElement) {
              return createElement(
                  `div`,
                  {
                    domProps: {
                      innerHTML: `
												<v-list-item>
													<v-list-item-content style="display: grid !important;">
														<v-list-item-title class="body-2">${this.value.user ? this.value.user.name : ''}</v-list-item-title>
														<v-list-item-subtitle class="body-2 text-truncate">${this.value.user && this.value.user.telefono ? `Telefono: ${this.value.user.telefono}` : ''}</v-list-item-subtitle>
													</v-list-item-content>
												</v-list-item>
											`
                    }
                  }
              )
            },
            props: ['value']
          }
        },
        {
          text: 'Opciones',
          align: 'center',
          sortable: false,
          actions: true,
          singlesActions: true
        }
      ]
    }
  }),
  created() {
    // this.dataTable.route = this.esMedico ? null : 'tamizajes'
    this.dataTable.route = 'tamizajes'
    // this.rutaBase = this.clone(this.dataTable.route)
    this.getMedicos()
  },
  methods: {
    goDatos(ruta) {
      this.dataTable.route = ruta
    },
    verModalClasificacion(modal) {
      this.$refs.helpModal.open(modal)
    },
    crearTamizaje() {
      this.loading = true
      this.$refs.registroTamizaje.open()
    },
    crearViajero() {
      this.loading = true
      this.$refs.registroViajero.open()
    },
    asignarMedico(item) {
      this.$refs.asignaMedico.open(item.id)
    },
    asignarGeorreferenciacion(item) {
      this.$refs.asignaGeorreferenciacion.open(item)
    },
    actualizarTamizaje(item) {
      this.loading = true
      if (!item.infoviajero) {
        this.$refs.registroTamizaje.open(item.id)
      } else {
        this.$refs.registroViajero.open(item.id)
      }
    },
    verSeguimiento(item) {
      this.$refs.seguimiento.open(item.id)
    },
    tamizajeGuardado(tamizaje) {
      if(tamizaje?.id) this.verSeguimiento(tamizaje)
      this.$store.commit('reloadTable', 'tablaTamizajes')
    },
    resetOptions(item) {
      item.nombre = [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(x => x).join(' ')
      item.tipoIdentificacion = this.tiposDocumentoIdentidad && item.tipo_identificacion && this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion) ? this.tiposDocumentoIdentidad.find(x => x.id === item.tipo_identificacion).tipo : ''
      // item.colortrrgba = item.estado === 'Cerrado' ? '143,143,143,0.8' : (item.total_riesgo > 0 ? `254,0,0, ${item.total_riesgo / 100}` : '')
      // item.colortext = item.estado === 'Cerrado' ? 'white' : (item.total_riesgo > 50 ? 'white' : '')
      item.colortrrgba = item.total_riesgo > 0 ? `254,0,0, ${item.total_riesgo / 100}` : ''
      item.colortext = item.total_riesgo > 50 ? 'white' : ''
      item.options = []
      if ((this.permisos.tamizajeEditar && !item.medico_id && !!(item.localiza_persona && item.contesta_encuesta)) || this.esSuperAdmin) item.options.push({
        event: 'actualizar',
        icon: 'mdi-file-document-edit',
        tooltip: 'Actualizar tamizaje',
        color: 'warning'
      })
      if (this.permisos.tamizajeGeorreferenciar) item.options.push({
        event: 'georeferenciar',
        icon: 'fas fa-map-marker-alt',
        tooltip: item.coordenadas ? 'Actualizar Coordenadas' : 'Asignar Coordenadas',
        color: item.coordenadas ? 'info' : 'grey'
      })
      if (item.medico_id) item.options.push({
        event: 'seguimiento',
        icon: 'fas fa-file-medical-alt',
        // color: (item.estado_afectacion === 'Fallecido' || item.estado_afectacion === 'Recuperado' || item.clasificacion === '4' || item.clasificacion === '6' || item.estado === 'Cerrado') ? 'muted' : 'primary',
        color: (item.estado_afectacion === 'Fallecido' || item.estado_afectacion === 'Recuperado' || item.clasificacion === '4' || item.clasificacion === '6') ? 'muted' : 'primary',
        tooltip: `Caso ${(item.estado_afectacion === 'Fallecido' || item.estado_afectacion === 'Recuperado' || item.clasificacion === '4' || item.clasificacion === '6') ? 'Cerrado' : 'de Estudio'}`
      })

      if (!item.medico_id) item.options.push({
        event: 'seguimiento',
        icon: 'mdi-file-find',
        tooltip: 'Detalle ERP',
        color: 'success'
      })
      if (this.permisos.descargarERPPDF) item.options.push({
        event: 'verpdf',
        icon: 'fas fa-file-pdf',
        tooltip: `Descargar PDF ${item.medico_id ? 'Caso de Estudio' : 'Detalle ERP'}`,
        color: 'blue-grey darken-4'
      })
      // if (this.permisos.tamizajeAsignarMedico && item.total_riesgo && !item.medico_id) item.options.push({
      if (item.total_riesgo && !item.medico_id && !!(item.localiza_persona && item.contesta_encuesta)) item.options.push({
        event: 'asignarmedico',
        icon: 'fas fa-hand-holding-medical',
        tooltip: `${item.orden_medica_id ? 'Reasignar Médico' : 'Asignar como Caso de Estudio'}`,
        color: 'deep-purple'
      })
      return item
    },
    openTableCets(cet) {
      this.$refs.grupoFamiliar.open(cet)
    },
    openDosisAplicadas(value){
      this.$refs.detalleDosisAplicada.open({identificacion: value[0]['identificacion']})
    },
    descargarPDF(tamizaje) {
      const apiAxios = axios.create()
      apiAxios.defaults.baseURL = `http://aps.backend.test/api`
      apiAxios.defaults.headers.common["Authorization"] = `${this.token_type} ${this.access_token}`
      tamizaje.loading = true
      this.axios({
        url: `pdf-tamizaje/${tamizaje.id}`, //your url
        method: 'GET',
        responseType: 'blob', // important
      }).then(async response => {
        const fileURL = window.URL.createObjectURL(
            new Blob([response.data], {type: 'application/pdf'}))
        await window.open(fileURL, '_blank')
        tamizaje.loading = false
      }).catch(error => {
        tamizaje.loading = false
        this.$store.commit('snackbar', {color: 'error', message: 'al descargar el PDF', error: error})
      })
    },
    getMedicos() {
      this.axios.get(`users-role?role=Médico`)
          .then(response => {
            this.medicos = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los registros de los médicos.`,
              error: error
            })
          })
    }
  }
}
</script>

<style scoped>

</style>