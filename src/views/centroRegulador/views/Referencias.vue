<template>
  <v-container fluid>
    <page-title-bar title="Referencias">
      <template slot="actions">
        <template v-if="getUser && !getUser.eps_id">
          <alerta-solicitudes
              @notificar="itemGuardado"
              @seleccionar="val => seleccionarItemAlert(val)"
          />
          <v-divider vertical inset class="mx-4"/>
        </template>
        <c-tooltip
            v-if="permisos.referenciasCrear"
            top
            tooltip="Crear Referencia"
        >
          <v-btn
              color="primary"
              depressed
              :small="$vuetify.breakpoint.xsOnly"
              fab
              @click="crearItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </c-tooltip>
      </template>
    </page-title-bar>
    <v-row>
      <v-col cols="12">
        <v-card tile flat>
          <data-tablex
              v-model="dataTable"
              items-loading
              @applyFilters="$refs && $refs.filtros && $refs.filtros.aplicaFiltros()"
              initial-filter
          >
            <filtros
                slot="filters"
                ref="filtros"
                :ruta-base="rutaBase"
                @filtra="val => dataTable.route = val"
            />
            <template v-slot:tagsfilters="{tags}">
              <tags-filters
                  :tags="tags"
                  @change="$refs && $refs.filtros && $refs.filtros.aplicaFiltros()"
              />
            </template>
            <template v-slot:tabla="{ items, headers, loading }">
              <v-data-table
                  :headers="headers"
                  :items="items"
                  :loading="loading"
                  loading-text="Cargando... por favor espere"
                  class="elevation-1 rounded-0 mb-12"
                  hide-default-footer
                  disable-pagination
              >
                <template v-slot:item.paciente="{ item }">
                  <persona-item :value="item"/>
                </template>
                <template v-slot:item.eps="{ item }">
                  <v-list-item-content
                      v-if="item.eps"
                      class="pa-0"
                  >
                    <v-list-item-subtitle>
                      {{ item.eps.nombre }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{ `Cód: ${item.eps.codigo}` }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.estado="{ item }">
                  <v-chip
                      label
                      class="font-weight-bold"
                      :color="ref_estados && ref_estados.find(x => x.key === item.estado) && ref_estados.find(x => x.key === item.estado).color"
                      dark
                  >
                    {{ item.estado }}
                  </v-chip>
                </template>
                <template v-slot:item.ipsOrigen="{ item }">
                  <v-list-item-content
                      v-if="item.prestador_origen"
                  >
                    <v-list-item-subtitle>
                      {{ item.prestador_origen.nombre }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      <template v-if="item.prestador_origen.telefono">
                        <v-icon small>mdi-phone</v-icon>
                        {{ item.prestador_origen.telefono }}
                      </template>

                      <template v-if="item.prestador_origen.email">
                        <v-icon small>mdi-email</v-icon>
                        {{ item.prestador_origen.email }}
                      </template>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{
                        [item.prestador_origen.direccion, item.prestador_origen.nompio, item.prestador_origen.nomdepto].filter(x => x).join(', ')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.ipsEgreso="{ item }">
                  <v-list-item-content
                      v-if="item.prestador_egreso"
                  >
                    <v-list-item-subtitle>
                      {{ item.prestador_egreso.nombre }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      <template v-if="item.prestador_egreso.telefono">
                        <v-icon small>mdi-phone</v-icon>
                        {{ item.prestador_egreso.telefono }}
                      </template>

                      <template v-if="item.prestador_egreso.email">
                        <v-icon small>mdi-email</v-icon>
                        {{ item.prestador_egreso.email }}
                      </template>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{
                        [item.prestador_egreso.direccion, item.prestador_egreso.nompio, item.prestador_egreso.nomdepto].filter(x => x).join(', ')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.user="{ item }">
                  <v-list-item-content class="pa-0" v-if="item.user">
                    <v-list-item-title>
                      {{ item.user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2">
                      {{ item.user.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.opciones="{ item }">
                  <div class="optionsButtons">
                    <v-toolbar>
                      <c-tooltip
                          v-if="permisos.referenciasVer"
                          bottom
                          tooltip="Detalle Referencia"
                      >
                        <v-btn
                            class="ma-1"
                            color="success"
                            depressed
                            fab
                            x-small
                            @click="detalleItem(item)"
                        >
                          <v-icon>mdi-file-find</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip
                          v-if="permisos.referenciasEditar"
                          bottom
                          tooltip="Editar Referencia"
                      >
                        <v-btn
                            class="ma-1"
                            color="warning"
                            depressed
                            fab
                            x-small
                            @click="editarItem(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip
                          v-if="permisos.referenciasEliminar"
                          bottom
                          tooltip="Eliminar Referencia"
                      >
                        <v-btn
                            class="ma-1"
                            color="error"
                            depressed
                            fab
                            x-small
                            @click="preEliminarItem(item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip
                          v-if="permisos.referenciasAnular"
                          bottom
                          tooltip="Anular Referencia"
                      >
                        <v-btn
                            class="ma-1"
                            color="indigo"
                            depressed
                            fab
                            x-small
                            @click="preAnularItem(item)"
                        >
                          <v-icon class="white--text">mdi-file-cancel</v-icon>
                        </v-btn>
                      </c-tooltip>
                    </v-toolbar>
                  </div>
                </template>
              </v-data-table>
            </template>
          </data-tablex>
        </v-card>
      </v-col>
    </v-row>
    <registro-referencia
        ref="registroItem"
        @guardado="itemGuardado"
    />
    <detalle-referencia
        ref="detalleItem"
        @guardado="itemGuardado"
    />
    <c-dialog
        ref="cdialog"
        @save="eliminarItem"
    />
    <c-dialog
        ref="cdialogAnula"
        @save="anularItem"
        title="Anular Registro"
        text-confirm="Anular"
        color="indigo"
    />
  </v-container>
</template>

<script>
import PersonaItem from 'Views/centroRegulador/components/referencias/PersonaItem'
import DetalleReferencia from 'Views/centroRegulador/components/referencias/detalleReferencia/DetalleReferencia'
import RegistroReferencia from 'Views/centroRegulador/components/referencias/RegistroReferencia'
import Filtros from 'Views/centroRegulador/components/referencias/Filtros'
import TagsFilters from 'Views/centroRegulador/components/referencias/TagsFilters'
import { mapGetters } from 'vuex'
import AlertaSolicitudes from 'Views/centroRegulador/components/referencias/AlertaSolicitudes'
export default {
  name: 'Referencias',
  components: {
    AlertaSolicitudes,
    TagsFilters,
    PersonaItem,
    DetalleReferencia,
    RegistroReferencia,
    Filtros
  },
  data: () => ({
    rutaBase: 'referencias',
    dataTable: {
      advanceFilters: true,
      titleFilters: 'Filtros Referencias',
      nameItemState: 'tablaReferencias',
      route: 'referencias',
      makeHeaders: [
        {
          text: 'ID',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Estado',
          sortable: false,
          value: 'estado'
        },
        {
          text: 'Paciente',
          sortable: false,
          value: 'paciente'
        },
        {
          text: 'EPS',
          sortable: false,
          value: 'eps'
        },
        {
          text: 'IPS Origen',
          sortable: false,
          value: 'ipsOrigen'
        },
        {
          text: 'IPS Egreso',
          sortable: false,
          value: 'ipsEgreso'
        },
        {
          text: 'Usuario',
          sortable: false,
          visibleColumn: false,
          value: 'user'
        },
        {
          text: '',
          value: 'opciones',
          align: 'center',
          sortable: false
        }
      ]
    },
    seleccionado: null
  }),
  computed: {
    ...mapGetters([
        'ref_estados',
        'getUser'
    ]),
    permisos () {
      return this.$store.getters.getPermissionModule('centroRegulador')
    }
  },
  created() {
    this.$store.dispatch('getComplementosReferencias')
  },
  methods: {
    crearItem() {
      this.$refs.registroItem.open()
    },
    seleccionarItemAlert(val) {
      this.detalleItem({ id: val })
      this.$store.commit('notificadoNuevasReferenciaId', val)
      setTimeout(() => {
        this.$store.dispatch('getNuevasReferencias')
      }, 2000)
    },
    editarItem(item) {
      this.$refs.registroItem.open(item)
    },
    detalleItem(item) {
      this.$refs.detalleItem.open(item)
    },
    preAnularItem(item) {
      this.seleccionado = item
      this.$refs.cdialogAnula.open(`¿Está seguro de anular el registro de la referencia ID: <strong>${this.seleccionado.id}</strong>?`)
    },
    anularItem() {
      this.axios.delete(`anular-referencia/${this.seleccionado.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Referencia anulada correctamente.' })
            this.$refs.cdialogAnula.close()
            this.itemGuardado()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al anular el registro de la referencia.', error: error })
            this.$refs.cdialogAnula.loading = false
          })
    },
    preEliminarItem(item) {
      this.seleccionado = item
      this.$refs.cdialog.open(`¿Está seguro de eliminar el registro de la referencia ID: <strong>${this.seleccionado.id}</strong>?`)
    },
    eliminarItem() {
    this.axios.delete(`referencias/${this.seleccionado.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Referencia eliminada correctamente.' })
            this.$refs.cdialog.close()
            this.itemGuardado()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al eliminar el registro de la referencia.', error: error })
            this.$refs.cdialog.loading = false
          })
    },
    itemGuardado() {
      this.$store.commit('reloadTable', 'tablaReferencias')
    }
  }
}
</script>
