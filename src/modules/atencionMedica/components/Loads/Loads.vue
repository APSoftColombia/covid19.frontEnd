<template>
  <div>
    <data-tablex
        :searchable="false"
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
          <template v-slot:item.prestador="{ item }">
            <v-list-item-content
                v-if="item.prestador"
                class="pa-0"
            >
              <v-list-item-subtitle>
                {{ item.prestador.nombre }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="body-2">
                {{ `${item.prestador.telefono ? `Tel. ${item.prestador.telefono}, ` : ''} ${[item.prestador.direccion, item.prestador.nompio, item.prestador.nomdepto].filter(x => x).join(', ')}` }}
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
                    v-if="permisos.manageFile"
                    top
                    tooltip="Descargar Archivo"
                >
                  <v-btn
                      class="ma-1"
                      color="green"
                      depressed
                      fab
                      x-small
                      @click="fileDownload(item)"
                  >
                    <v-icon class="white--text">mdi-file-download</v-icon>
                  </v-btn>
                </c-tooltip>
              </v-toolbar>
            </div>
          </template>
        </v-data-table>
      </template>
    </data-tablex>
  </div>
</template>

<script>
import TagsFilters from './TagsFilters'
import Filters from './Filters'
import {mapState} from 'vuex'
export default {
  name: 'Loads',
  components: {
    TagsFilters,
    Filters
  },
  data: () => ({
    rutaBase: 'archivos-atencion-rcv',
    dataTable: {
      advanceFilters: true,
      titleFilters: 'Filtros para cargues masivos de atenciones médicas RCV',
      nameItemState: 'tablaAtencionMedicaLoadsRCV',
      route: 'archivos-atencion-rcv',
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
          text: 'Nombre Archivo',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Prestador',
          sortable: false,
          value: 'prestador'
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
    ...mapState('atencionMedicaRCVModule', ['loadsChangeCounter']),
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  watch: {
    loadsChangeCounter: {
      handler () {
        this.savedItem()
      },
      immediate: false
    }
  },
  methods: {
    fileDownload(item) {
      console.log('item', item)
      // this.$refs.itemDetail.open(item.id)
    },
    savedItem() {
      this.$store.commit('reloadTable', 'tablaAtencionMedicaLoadsRCV')
    }
  }
}
</script>