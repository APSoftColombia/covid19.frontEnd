<template>
  <v-container fluid>
    <page-title-bar
        title="Estudios"
        subtitle="Laboratorio departamental de salud pública"
    >
      <template slot="actions">
        <c-tooltip
            v-if="permisos.crear"
            left
            tooltip="Crear Estudio"
        >
          <v-btn
              color="primary"
              depressed
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
                <template v-slot:item.estado_proceso="{ item }">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ item.estado_proceso }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      <v-icon small>mdi-calendar-month</v-icon>
                      {{ item.fecha_estudio ? moment(item.fecha_estudio).format('DD/MM/YYYY HH:mm') : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.paciente="{ item }">
                  <persona-item :value="item"/>
                </template>
                <template v-slot:item.muestras="{ item }">
                  <v-avatar
                      color="green"
                      class="white--text font-weight-bold font-lg"
                  >
                    {{ item.muestras.length }}
                  </v-avatar>
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
                      {{ item.eps.codigo }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.ips="{ item }">
                  <v-list-item-content
                      v-if="item.ips"
                  >
                    <v-list-item-subtitle>
                      {{ item.ips.nombre }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      <template v-if="item.ips.telefono">
                        <v-icon small>mdi-phone</v-icon>
                        {{ item.ips.telefono }}
                      </template>

                      <template v-if="item.ips.email">
                        <v-icon small>mdi-email</v-icon>
                        {{ item.ips.email }}
                      </template>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{
                        [item.ips.direccion, item.ips.nompio, item.ips.nomdepto].filter(x => x).join(', ')
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
                          tooltip="Detalle Estudio"
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
                          v-if="permisos.editar"
                          bottom
                          tooltip="Editar Estudio"
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
                          v-if="permisos.eliminar"
                          bottom
                          tooltip="Eliminar Estudio"
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
                          v-if="permisos.anular"
                          bottom
                          tooltip="Anular Estudio"
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
    <registro-estudio
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
import PersonaItem from 'Views/laboratorioSaludPublica/components/PersonaItem'
import Filtros from 'Views/laboratorioSaludPublica/components/estudios/Filtros'
import TagsFilters from 'Views/laboratorioSaludPublica/components/estudios/TagsFilters'
import DetalleReferencia from 'Views/centroRegulador/components/referencias/detalleReferencia/DetalleReferencia'
import RegistroEstudio from 'Views/laboratorioSaludPublica/components/estudios/registro/RegistroEstudio'
export default {
  name: 'EstudiosLaboratorioSaludPublica',
  components: {
    TagsFilters,
    PersonaItem,
    DetalleReferencia,
    RegistroEstudio,
    Filtros
  },
  data: () => ({
    rutaBase: 'lab-estudios',
    dataTable: {
      advanceFilters: true,
      titleFilters: 'Filtros Estudios del Laboratorio de Salud Pública',
      nameItemState: 'tablaEstudiosLaboratorioSaludPublica',
      route: 'lab-estudios',
      makeHeaders: [
        {
          text: 'ID',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Estado',
          sortable: false,
          value: 'estado_proceso'
        },
        {
          text: 'Paciente',
          sortable: false,
          value: 'paciente'
        },
        {
          text: 'Muestras',
          sortable: false,
          value: 'muestras'
        },
        {
          text: 'EPS',
          sortable: false,
          value: 'eps'
        },
        {
          text: 'IPS Origen',
          sortable: false,
          value: 'ips'
        },
        {
          text: 'Usuario Registra',
          sortable: false,
          visibleColumn: true,
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
    permisos () {
      return this.$store.getters.getPermissionModule('estudiosLabSP')
    }
  },
  created() {
    this.$store.dispatch('getComplementosEstudiosLDSP')
  },
  methods: {
    crearItem() {
      this.$refs.registroItem.open()
    },
    editarItem(item) {
      this.$refs.registroItem.open(item)
    },
    detalleItem(item) {
      this.$refs.detalleItem.open(item)
    },
    preAnularItem(item) {
      this.seleccionado = item
      this.$refs.cdialogAnula.open(`¿Está seguro de anular el registro del estudio con ID: <strong>${this.seleccionado.id}</strong>?`)
    },
    anularItem() {
      this.axios.get(`anular-lab-estudios/${this.seleccionado.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Estudio anulado correctamente.' })
            this.$refs.cdialogAnula.close()
            this.itemGuardado()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al anular el registro del estudio.', error: error })
            this.$refs.cdialogAnula.loading = false
          })
    },
    preEliminarItem(item) {
      this.seleccionado = item
      this.$refs.cdialog.open(`¿Está seguro de eliminar el registro del estudio con ID: <strong>${this.seleccionado.id}</strong>?`)
    },
    eliminarItem() {
    this.axios.delete(`lab-estudios/${this.seleccionado.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Estudio eliminado correctamente.' })
            this.$refs.cdialog.close()
            this.itemGuardado()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al eliminar el registro del estudio.', error: error })
            this.$refs.cdialog.loading = false
          })
    },
    itemGuardado() {
      this.$store.commit('reloadTable', 'tablaEstudiosLaboratorioSaludPublica')
    }
  }
}
</script>
