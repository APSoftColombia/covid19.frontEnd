<template>
  <v-container fluid>
    <page-title-bar title="Atenciones Médicas RCV">
      <template slot="actions">
        <excel-file-uploader
            v-if="permisos.manageFile"
            @uploaded="savedItem"
        />
        <v-divider
            v-if="permisos.manageFile && permisos.create"
            class="mx-6"
            vertical
            inset
        />
        <c-tooltip
            v-if="permisos.create"
            tooltip="Crear atención médica"
            top
        >
          <v-btn
              color="primary"
              depressed
              :small="$vuetify.breakpoint.xsOnly"
              fab
              @click="createItem"
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
              @applyFilters="$refs && $refs.filters && $refs.filters.applyFilters()"
          >
            <filters
                slot="filters"
                ref="filters"
                :ruta-base="rutaBase"
                @filtra="val => dataTable.route = val"
            />
            <template v-slot:tagsfilters="{tags}">
              <tags-filters
                  :tags="tags"
                  @change="$refs && $refs.filters && $refs.filters.applyFilters()"
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
                <template v-slot:item.created_at="{ item }">
                  <template v-if="item.created_at">
                    <v-icon small>mdi-calendar-month</v-icon>
                    {{ moment(item.created_at).format('DD/MM/YYYY HH:mm') }}
                  </template>
                </template>
                <template v-slot:item.paciente="{ item }">
                  <persona-item :value="item"/>
                </template>
                <template v-slot:item.eps="{ item }">
                  <v-list-item-content
                      v-if="item.eps"
                      class="pa-0"
                  >
                    <v-list-item-subtitle>
                      {{ item.eps }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="body-2">
                      {{ item.codigo_eps }}
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
                          v-if="permisos.detail"
                          bottom
                          tooltip="Detalle Atención"
                      >
                        <v-btn
                            class="ma-1"
                            color="success"
                            depressed
                            fab
                            x-small
                            @click="detailItem(item)"
                        >
                          <v-icon>mdi-file-find</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip
                          v-if="permisos.edit"
                          bottom
                          tooltip="Editar Atención"
                      >
                        <v-btn
                            class="ma-1"
                            color="warning"
                            depressed
                            fab
                            x-small
                            @click="editItem(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip
                          v-if="permisos.delete"
                          bottom
                          tooltip="Eliminar Atención"
                      >
                        <v-btn
                            class="ma-1"
                            color="error"
                            depressed
                            fab
                            x-small
                            @click="preDeleteItem(item)"
                        >
                          <v-icon>mdi-delete</v-icon>
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
    <c-dialog
        ref="cdialog"
        @save="deleteItem"
    />
  </v-container>
</template>

<script>
import PersonaItem from '../components/PersonaItem'
import TagsFilters from '../components/TagsFilters'
import Filters from '../components/Filters'
import ExcelFileUploader from '../components/ExcelFileUploader'

export default {
  name: 'AtencionMedica',
  components: {
    ExcelFileUploader,
    PersonaItem,
    TagsFilters,
    Filters
  },
  data: () => ({
    selectedItem: null,
    rutaBase: 'seguimientos',
    dataTable: {
      advanceFilters: true,
      titleFilters: 'Filtros para atenciones médicas RCV',
      nameItemState: 'tablaAtencionMedicaRCV',
      route: 'seguimientos',
      makeHeaders: [
        {
          text: 'ID',
          sortable: false,
          value: 'id'
        },
        {
          text: 'Fecha Registro',
          sortable: false,
          value: 'created_at'
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
    }
  }),
  computed: {
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  methods: {
    createItem() {
      // this.$refs.registerItem.open()
    },
    editItem(item) {
      console.log(`Editar Item ${item}`)
      // this.$refs.registerItem.open(item)
    },
    detailItem(item) {
      console.log(`Ver Item ${item}`)
      // this.$refs.detailItem.open(item)
    },
    preDeleteItem(item) {
      this.selectedItem = item
      this.$refs.cdialog.open(`¿Está seguro de eliminar el registro con <strong>ID: ${this.selectedItem.id} de ${this.selectedItem.primer_nombre} ${this.selectedItem.primer_apellido}</strong>?`)
    },
    deleteItem() {
      this.axios.delete(`seguimientos/${this.selectedItem.id}`)
          .then(() => {
            this.$store.commit('snackbar', { color: 'success', message: 'Atención médica eliminada correctamente.' })
            this.$refs.cdialog.close()
            this.savedItem()
          })
          .catch(error => {
            this.$store.commit('snackbar', { color: 'error', message: ' al eliminar el registro de atención médica.', error: error })
            this.$refs.cdialog.loading = false
          })
    },
    savedItem() {
      this.$store.commit('reloadTable', 'tablaAtencionMedicaRCV')
    }
  }
}
</script>