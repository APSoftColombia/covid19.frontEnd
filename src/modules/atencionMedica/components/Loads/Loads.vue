<template>
  <div>
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
          <template v-slot:item.estado="{ item }">
            <v-btn
                v-if="item.errors && item.errors.length"
                small
                color="warning"
                @click="showErrors(item)"
            >
              <v-icon>mdi-alert</v-icon>
              {{item.estado}}
            </v-btn>
            <file-download
                v-else-if="item.estado=== 'Exitoso'"
                :id="item.id"
                :estado="item.estado"
            />
            <span v-else>{{item.estado}}</span>
          </template>
          <template v-slot:item.prestador="{ item }">
            <v-list-item-content
                v-if="item.prestador"
                class="pa-0"
            >
              <v-list-item-subtitle>
                {{ item.prestador }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="body-2">
                {{ [item.nompio, item.nomdepto].join(', ') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
<!--          <template v-slot:item.user="{ item }">-->
<!--            <v-list-item-content class="pa-0" v-if="item.user">-->
<!--              <v-list-item-title>-->
<!--                {{ item.user.name }}-->
<!--              </v-list-item-title>-->
<!--              <v-list-item-subtitle class="body-2">-->
<!--                {{ item.user.email }}-->
<!--              </v-list-item-subtitle>-->
<!--            </v-list-item-content>-->
<!--          </template>-->
<!--          <template v-slot:item.opciones="{ item }">-->
<!--            <div class="optionsButtons">-->
<!--              <v-toolbar>-->
<!--                <c-tooltip-->
<!--                    v-if="permisos.manageFile"-->
<!--                    top-->
<!--                    tooltip="Descargar Archivo"-->
<!--                >-->
<!--                  <v-btn-->
<!--                      class="ma-1"-->
<!--                      color="green"-->
<!--                      depressed-->
<!--                      fab-->
<!--                      x-small-->
<!--                      @click="fileDownload(item)"-->
<!--                  >-->
<!--                    <v-icon class="white&#45;&#45;text">mdi-file-download</v-icon>-->
<!--                  </v-btn>-->
<!--                </c-tooltip>-->
<!--              </v-toolbar>-->
<!--            </div>-->
<!--          </template>-->
        </v-data-table>
      </template>
    </data-tablex>
    <load-errors
        ref="errors"
        :errors="errors"
        :id="errorsId"
    />
  </div>
</template>

<script>
import TagsFilters from './TagsFilters'
import Filters from './Filters'
import LoadErrors from './LoadErrors'
import {mapState} from 'vuex'
import FileDownload from './FileDownload'
export default {
  name: 'Loads',
  components: {
    FileDownload,
    TagsFilters,
    LoadErrors,
    Filters
  },
  data: () => ({
    errors: [],
    errorsId: null,
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
        }
        // {
        //   text: 'Usuario Registra',
        //   sortable: false,
        //   visibleColumn: true,
        //   value: 'user'
        // }
        // {
        //   text: '',
        //   value: 'opciones',
        //   align: 'center',
        //   sortable: false
        // }
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
    showErrors(item) {
      this.errors = JSON.parse(item.errors)
      this.errorsId = item.id
      this.$refs.errors.open()
    },
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