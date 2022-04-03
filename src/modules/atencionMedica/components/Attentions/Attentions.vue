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
          <template v-slot:item.paciente="{ item }">
            <persona-item :value="item"/>
          </template>
          <template v-slot:item.domicilio="{ item }">
            {{[item.direccion_residencia, item.municipio].filter(x => x).join(', ')}}
          </template>
          <template v-slot:item.tension="{ item }">
            {{[item.ta_sistolica, item.ta_diastolica].join('/')}}
          </template>
          <template v-slot:item.dm="{ item }">
            {{ [item.diabetes === null ? null : item.diabetes === 1 ? 'SI' : 'NO', item.fecha_dx_dm].filter(x => x).join(' - ') }}
          </template>
          <template v-slot:item.imc="{ item }">
            <v-list-item-content class="pa-0">
              <v-list-item-subtitle>
                {{[item.imc, item.clasificacion_imc].filter(x => x).join(' - ')}}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="body-2">
                Peso:{{ item.peso === null ? '' : `${item.peso}Kg` }} | Talla:{{ item.talla === null ? '' : `${item.talla}cm` }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-slot:item.hta="{ item }">
            <v-list-item-content class="pa-0">
              <v-list-item-subtitle>
                {{ [item.hta === null ? '' : item.hta === 1 ? 'SI' : 'NO', item.estadio_hta].filter(x => x).join(' | ') }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="body-2">
                Fecha: {{ item.fecha_dx_hta }}
              </v-list-item-subtitle>
            </v-list-item-content>
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
                      @click="itemDetail(item)"
                  >
                    <v-icon>mdi-file-find</v-icon>
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
    <item-detail
        ref="itemDetail"
    />
    <c-dialog
        ref="cdialog"
        @save="deleteItem"
    />
  </div>
</template>

<script>
import PersonaItem from '../PersonaItem'
import TagsFilters from './TagsFilters'
import Filters from './Filters'
import ItemDetail from '../detail/ItemDetail'
import {mapState} from 'vuex'
export default {
  name: 'Attentions',
  components: {
    ItemDetail,
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
          text: 'Última Consulta',
          sortable: false,
          value: 'fecha_ultima_consulta'
        },
        {
          text: 'Nefroprotección EPS',
          sortable: false,
          value: 'fecha_nefroproteccion'
        },
        {
          text: 'Paciente',
          sortable: false,
          value: 'paciente'
        },
        {
          text: 'Domicilio',
          sortable: false,
          value: 'domicilio'
        },
        {
          text: 'Tensión Arterial',
          sortable: false,
          value: 'tension'
        },
        {
          text: 'HTA',
          sortable: false,
          value: 'hta'
        },
        {
          text: 'DM',
          sortable: false,
          value: 'dm'
        },
        {
          text: 'IMC',
          sortable: false,
          value: 'imc'
        },
        {
          text: 'IPS Primaria',
          sortable: false,
          value: 'ips_donde_asiste'
        },
        {
          text: 'EPS',
          sortable: false,
          value: 'eps',
          visibleColumn: false
        },
        {
          text: 'Usuario Registra',
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
    }
  }),
  computed: {
    ...mapState('atencionMedicaRCVModule', ['attentionsChangeCounter']),
    permisos () {
      return this.$store.getters.getPermissionModule('atencionMedicaRCV')
    }
  },
  watch: {
    attentionsChangeCounter: {
      handler () {
        this.savedItem()
      },
      immediate: false
    }
  },
  methods: {
    itemDetail(item) {
      this.$refs.itemDetail.open(item.id)
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