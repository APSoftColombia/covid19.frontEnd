<template>
  <v-container fluid>
    <page-title-bar title="Mi Bodega - Almacemaniento de vacunas">
      <template slot="actions">
        <c-tooltip left tooltip="Crear Nueva Vacunacion" v-if="permisos.gestionarBodega">
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
            @applyFilters="
              $refs && $refs.filtros && $refs.filtros.aplicaFiltros()
            "
          >
            <filtros
              slot="filters"
              ref="filtros"
              :ruta-base="rutaBase"
              @filtra="(val) => (dataTable.route = val)"
            />
            <template v-slot:tagsfilters="{ tags }">
              <tags-filters
                :tags="tags"
                @change="
                  $refs && $refs.filtros && $refs.filtros.aplicaFiltros()
                "
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
                <template v-slot:item.nombre="{ item }">
                  <v-icon v-if="item.principal" color="yellow darken-3">mdi-bookmark-check</v-icon>
                  {{item.nombre}}
                </template>
                <template v-slot:item.ips="{ item }">
                  <ips-component :codigo_ips="item.codigo_ips" :prestadores="prestadores"></ips-component>
                </template>
                <template v-slot:item.responsable="{ item }">
                  <v-list-item-content class="pa-0" v-if="item.responsable">
                    <v-list-item-title>
                      {{ item.responsable.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="body-2">
                      {{ item.responsable.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:item.opciones="{ item }">
                  <div class="optionsButtons">
                    <v-toolbar>
                      <c-tooltip bottom tooltip="Editar" v-if="permisos.gestionarBodega">
                        <v-btn
                          class="ma-1"
                          color="blue"
                          depressed
                          fab
                          x-small
                          @click="editarItem(item)"
                        >
                          <v-icon color="white">mdi-pencil</v-icon>
                        </v-btn>
                      </c-tooltip>
                      <c-tooltip bottom tooltip="Ver Detalle">
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
                      <!-- <c-tooltip bottom tooltip="Eliminar registro" v-if="permisos.eliminarVacunacion">
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
                      </c-tooltip> -->
                    </v-toolbar>
                  </div>
                </template>
              </v-data-table>
            </template>
          </data-tablex>
        </v-card>
      </v-col>
    </v-row>
    <registro-bodega ref="registroBodega" @guardado="itemGuardado" />
    <detalle-bodega ref="detalleBodega" @guardado="itemGuardado" />
    <c-dialog ref="cdialog" @save="eliminarItem" />
  </v-container>
</template>

<script>
// const PersonaItem = () => import("./components/ItemListDataAfiliado");
const RegistroBodega = () => import("./components/NuevaBodega");
const Filtros = () => import("./components/FiltersBodega");
const IpsComponent = () => import("./components/IPSComponent");
const DetalleBodega= () => import("./components/DetalleBodega");
// const UbicacionComponent = () => import("./components/UbicacionComponent");
import TagsFilters from "./components/TagsFilters";

export default {
  name: "MiBodega",
  components: {
    TagsFilters,
    Filtros,
    RegistroBodega,
    IpsComponent,
    DetalleBodega
  },
  data: () => ({
    rutaBase: "bodegas",
    dataTable: {
      advanceFilters: true,
      titleFilters: "Filtros Bodega",
      nameItemState: "tablaBodegas",
      route: "bodegas",
      makeHeaders: [
        {
          text: "ID",
          sortable: false,
          value: "id",
        },
        {
          text: "Nombre",
          sortable: false,
          value: "nombre",
        },
        {
          text: "IPS",
          sortable: false,
          value: "ips",
        },
        {
          text: "Observaciones",
          sortable: false,
          value: "descripcion",
        },
        {
          text: "Responsable",
          sortable: false,
          visibleColumn: false,
          value: "responsable",
        },
        {
          text: "Opciones",
          value: "opciones",
          align: "center",
          sortable: false,
        },
      ],
    },
    seleccionado: null,
    prestadores: [],
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule("bodegas");
    },
  },
  created() {
    this.getIps();
  },
  methods: {
    crearItem() {
      this.$refs.registroBodega.open();
    },
    editarItem(item) {
      this.$refs.registroBodega.open(item.id);
    },
    detalleItem(item) {
      this.$refs.detalleBodega.open(item);
    },
    preEliminarItem(item) {
      this.seleccionado = item;
      this.$refs.cdialog.open(
        `¿Está seguro de eliminar el registro de la vacunacion ID: <strong>${this.seleccionado.id}</strong>?`
      );
    },
    getIps() {
      this.axios.get(`prestadores?filter[vacunador_covid]=1`)
          .then(response => {
              this.prestadores = response.data
          }).catch(e => {
          this.$store.commit('snackbar', {color: 'error', message: `al recuperar las IPS que vacunan covid.`, error: e})
      })
    },
    eliminarItem() {
      this.axios
        .delete(`bodegas/${this.seleccionado.id}`)
        .then(() => {
          this.$store.commit("snackbar", {
            color: "success",
            message: "Bodega eliminada correctamente.",
          });
          this.$refs.cdialog.close();
          this.itemGuardado();
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: " al eliminar el registro de la vacunacion.",
            error: error,
          });
          this.$refs.cdialog.loading = false;
        });
    },
    itemGuardado() {
      this.$store.commit("reloadTable", "tablaBodegas");
    },
  },
};
</script>
