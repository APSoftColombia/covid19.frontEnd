<template>
  <v-container fluid>
    <page-title-bar title="Compensaciones Económicas Temporal"></page-title-bar>
    <data-table
        ref="tablaCets"
        v-model="dataTable"
        @resetOption="item => resetOptions(item)"
        @addContacto="item => addContactos(item)"
        @infoContacto="item => infoContacto(item)"
        @editContacto="item => editarContacto(item)"
        @fallidas="item => fallidas(item)"
        @apply-filters="$refs && $refs.filtrosCets && $refs.filtrosCets.aplicaFiltros()"
        @clear-filters="$refs && $refs.filtrosCets && $refs.filtrosCets.limpiarFiltros()"
    >
      <template slot="top-actions-right">
          <v-menu offset-y transition="slide-y-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="teal" dark v-bind="attrs" v-on="on">
                Opciones
                <v-icon right>mdi mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list >
              <v-list-item class="pl-1 pr-1">
                <v-list-item-title>
                    <cargar-registros
                        @reloadTable="reloadTable"
                    ></cargar-registros>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-1 pr-1">
                <v-list-item-title>
                    <cargar-negativos
                        @reloadTable="reloadTable"
                    ></cargar-negativos>
                </v-list-item-title>
              </v-list-item>
              <v-list-item class="pl-1 pr-1" v-if="permisos.cetsGruposFamiliares">
                <v-list-item-title>
                    <cargar-grupos-familiares
                        @reloadTable="reloadTable"
                    ></cargar-grupos-familiares>
                </v-list-item-title>
               </v-list-item>
               <v-list-item class="pl-1 pr-1" v-if="permisos.cetsMigrarRegistros">
                <v-list-item-title>
                    <duplicar-registros-nuevo-cet
                        @reloadTable="reloadTable"
                    ></duplicar-registros-nuevo-cet>
                </v-list-item-title>
                </v-list-item>
                <v-list-item class="pl-1 pr-1" v-if="permisos.cetsCrearReporte">
                  <v-list-item-title>
                      <descargar-reporte
                      ></descargar-reporte>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="pl-1 pr-1">
                  <v-list-item-title>
                      <cargar-archivos-consolidado-adres
                      ></cargar-archivos-consolidado-adres>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item class="pl-1 pr-1">
                  <v-list-item-title>
                      <descargar-reporte-adres
                      ></descargar-reporte-adres>
                  </v-list-item-title>
                </v-list-item>
            </v-list>
          </v-menu>
      </template>
      <filtros
          slot="filters"
          ref="filtrosCets"
          :ruta-base="rutaBase"
          @filtra="val => goDatos(val)"
      ></filtros>
    </data-table>
    <cet-view
        ref="addContactos"
        @reloadTable="reloadTable"
    ></cet-view>
    <informacion-persona
        ref="infoContacto"
    ></informacion-persona>
    <editar-contacto
        ref="editarContacto"
        @editado="reloadTable"
    ></editar-contacto>
    <llamadas-fallidas
        ref="llamadasFallidas"
    ></llamadas-fallidas>
  </v-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import PersonaItemTabla from "Views/covid19/Cet/Componentes/PersonaItemTabla";
  import CetView from "./CetView";
  import InformacionPersona from "./InformacionPersona";
  import EstadosCets from "./Componentes/EstadosCets";
  const Filtros = () => import('Views/covid19/Cet/Filtros/Filtros')
  const CargarRegistros = () => import('Views/covid19/Cet/Componentes/CargarRegistros')
  const CargarNegativos = () => import('Views/covid19/Cet/Componentes/CargarNegativos.vue')
  const CargarGruposFamiliares = () => import('Views/covid19/Cet/Componentes/CargarGruposFamiliares.vue')
  const DescargarReporte = () => import('Views/covid19/Cet/Componentes/DescargarReporte')
  const EditarContacto = () => import('./Componentes/EditarContacto')
  const DuplicarRegistrosNuevoCet = () => import('./Componentes/DuplicarRegistrosNuevoCet')
  const LlamadasFallidas = () => import('./Componentes/LlamadasFallidas.vue')
  const CargarArchivosConsolidadoAdres = () => import('./Componentes/CargarArchivosConsolidadoAdres.vue')
  const DescargarReporteAdres = () => import('./Componentes/DescargarReporteAdres.vue')
  export default {
    name: "Cets",
    data: (vm) => ({
      rutaBase: 'infocets',
      dataTable: {
        advanceFilters: true,
        buttonZone: true,
        nameItemState: 'tablaCets',
        route: null,
        makeHeaders: [
          {
            text: 'ID',
            align: 'left',
            sortable: false,
            visibleColumn: true,
            component: {
              render: function (createElement) {
                return createElement(
                    `div`,
                    {
                      domProps: {
                        innerHTML: `
							<v-list-item>
								<v-list-item-content style="display: grid !important;">
									<v-list-item-title class="body-2">Caso: ${this.value.numero_caso}</v-list-item-title>
									<v-list-item-subtitle class="body-2 text-truncate">BDUA: ${this.value.bdua_afl_id}</v-list-item-subtitle>
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
            text: 'Fecha Diagnostico',
            align: 'left',
            sortable: false,
            value: 'fecha_diagnostico'
          },
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
                            value: {
                              sexo : context.props.value.sexo,
                              nombre: [context.props.value.apellido1, context.props.value.apellido2, context.props.value.nombre1, context.props.value.nombre2].filter(x => x).join(' '),
                              tipoIdentificacion: context.props.value.tipoid,
                              identificacion: context.props.value.identificacion,
                              celular: context.props.value.celular ? context.props.value.celular : context.props.value.telefono_fijo,
                              fecha_expedicion: context.props.value.fecha_expedicion,
                              codigo_departamento: context.props.value.codigo_departamento,
                              codigo_municipio: context.props.value.codigo_municipio,
                              autoriza_eps: context.props.value.autoriza_eps,
                              contactosPorDiligenciar: context.props.value.covid_contacto === 1 ? context.props.value.contactos_incompletos : [],
                              comparte_gastos: context.props.value.covid_contacto === 1 ? context.props.value.comparten_gastos : 0,
                              sin_beneficiarios: context.props.value.sin_beneficiarios,
                              fue_confirmado: context.props.value.fue_confirmado,
                              covid_contacto: context.props.value.covid_contacto,
                              no_efectividad: context.props.value.no_efectividad,
                              info_reporte: context.props.value.no_sale_en_archivo,
                            },
                          }
                        }
                    )
                    : createElement('span', '')
              }
            }
          },
          {
            text: 'Fecha de Nacimiento',
            align: 'left',
            sortable: false,
            value: 'fecha_nacimiento'
          },
          {
            text: 'Entidad',
            align: 'left',
            sortable: false,
            visibleColumn: true,
            component: {
              render: function (createElement) {
                return createElement(
                    `div`,
                    {
                      domProps: {
                        innerHTML: `
							<v-list-item style="max-width: 300px; white-space: normal">
								<v-list-item-content style="display: grid !important;">
									<v-list-item-title class="body-2">${this.value.codeps && vm.epss && vm.epss.length && vm.epss.find(x => x.codigo === this.value.codeps) && vm.epss.find(x => x.codigo === this.value.codeps).nombre ? vm.epss.find(x => x.codigo === this.value.codeps).nombre : ''}</v-list-item-title>
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
            text: 'Tipo',
            align: 'left',
            sortable: false,
            visibleColumn: true,
            component: {
              render: function (createElement) {
                return createElement(
                    `div`,
                    {
                      domProps: {
                        innerHTML: `
							<v-list-item>
								<v-list-item-content style="display: grid !important;">
									<v-list-item-title class="body-3">${this.value.covid_contacto === 1 ? 'Confirmado' : 'Contacto'}</v-list-item-title>
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
            text: 'Estado',
            align: 'left',
            sortable: true,
            component: {
              functional: true,
              render: function (createElement, context) {
                return context.props.value.estado_id
                    ? createElement(
                        EstadosCets,
                        {
                          props: {
                            value: {
                              descripcion: context.props.value.descripcion,
                              aplica_devolucion: context.props.value.aplica_devolucion
                            }
                          }
                        }
                    )
                    : createElement('div', '')
              }
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
    computed: {
      ...mapGetters([
          'epss'
      ]),
      permisos() {
        return this.$store.getters.getPermissionModule('covid')
      },
    },
    components: {
      Filtros,
      CetView,
      CargarRegistros,
      InformacionPersona,
      DescargarReporte,
      EditarContacto,
      CargarNegativos,
      DuplicarRegistrosNuevoCet,
      LlamadasFallidas,
      CargarGruposFamiliares,
      CargarArchivosConsolidadoAdres,
      DescargarReporteAdres
    },
    methods: {
      resetOptions(item) {
        if(item.covid_contacto == 1){
          item.colortrrgba = `196, 255, 255, 0.5`
        }
        if (item.covid_contacto === 1 && this.permisos.cetsCrear) item.options.push({
          event: 'addContacto',
          icon: 'mdi-account-multiple-plus-outline',
          color: 'teal',
          tooltip: 'Añadir Contactos'
        })
        if (item.covid_contacto === 1) item.options.push({
          event: 'editContacto',
          icon: 'mdi-pencil-box-multiple-outline',
          color: 'teal',
          tooltip: 'Editar Confirmado'
        })
        item.options.push({
          event: 'infoContacto',
          icon: 'mdi-information-outline',
          color: 'teal',
          tooltip: item.covid_contacto === 1 ? 'Información del Confirmado' : 'Información del Contacto'
        })
        if (item.no_efectivas && item.no_efectivas.length) item.options.push({
          event: 'fallidas',
          icon: 'mdi-alert-box-outline',
          color: 'error',
          tooltip: 'Llamadas fallidas'
        })
        return item
      },
      addContactos(item){
        this.$refs.addContactos.open(item.id)
      },
      infoContacto(item){
        this.$refs.infoContacto.open(item.id)
      },
      goDatos(ruta) {
        this.dataTable.route = ruta
      },
      reloadTable(){
        this.$refs.filtrosCets.getCets()
        this.$store.commit('reloadTable', 'tablaCets')
      },
      editarContacto(contacto){
        let setNoToAuthEPS = null
        if(contacto.contactos){
          setNoToAuthEPS = contacto.contactos.find(contacto => contacto.autoriza_eps === 1)
        }
        let hasContactos = contacto.contactos
        this.$refs.editarContacto.open(contacto, setNoToAuthEPS, hasContactos, true)
      },
      fallidas(item){
          this.$refs.llamadasFallidas.open(item.no_efectivas)
      }
    },
    created() {
      this.dataTable.route = this.rutaBase
    }
  }
</script>

<style scoped>

</style>
