<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title v-if="item && item.id">
            {{ `Detalle Bodega No. ${item.id}` }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row v-if="item" no-gutters>
            <v-col lg="10" md="12" sm="12" class="mx-auto">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-right
                      "
                      >Bodega
                    </v-list-item-subtitle>
                    <v-list-item class="py-2">
                      <v-list-item-content class="pb-0">
                        <v-list-item-title class="font-weight-bold grey--text">
                            {{ this.item ? item.nombre : '' }}
                          </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                  <v-card class="mt-2">
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-right
                      "
                      >IPS
                    </v-list-item-subtitle>
                    <v-list-item class="pt-0 pb-2 mh-30 mt-2" v-if="item.codigo_ips && this.prestadores && this.prestadores.length">
                      
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="font-weight-bold">
                          {{ this.prestadores.find(x => x.codigohabilitacion === item.codigo_ips).nombre }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2">
                          <v-icon small class="mr-1">fas fa-mobile-alt</v-icon> {{ this.prestadores.find(x => x.codigohabilitacion === item.codigo_ips).telefono }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="body-2">
                          {{ `${this.prestadores.find(x => x.codigohabilitacion === item.codigo_ips).direccion}, ${this.prestadores.find(x => x.codigohabilitacion === item.codigo_ips).nompio}, ${this.prestadores.find(x => x.codigohabilitacion === item.codigo_ips).nomdepto}` }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-else>
                      <v-list-item-content>
                        <v-list-item-title>
                          No aplica
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                  <v-card class="mt-2">
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-right
                      "
                      >Responsable
                    </v-list-item-subtitle>
                    <template v-if="item && item.responsable">

                      <v-list-item>
                        <v-icon large class="mr-2">{{
                            item.responsable.sexo === "M" ? "mdi mdi-face" : "mdi mdi-face-woman"
                          }}</v-icon>
                        <v-list-item-content class="pb-0">
                          <v-list-item-title class="font-weight-bold grey--text">
                            {{item.responsable.name}}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              [
                                item.responsable.tipo_identificacion
                                  ? this.tiposDocumentoIdentidad.find(
                                      (x) => x.id === item.responsable.tipo_identificacion
                                    ).tipo
                                  : null
                                ,
                                item.responsable.identificacion,
                              ]
                                .filter((x) => x)
                                .join(" ")
                            }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-if="item.responsable.fecha_nacimiento">
                            {{ calculaEdad(item.responsable.fecha_nacimiento).stringDate }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="py-0 mh-30 mt-3" v-if="item.responsable.telefono_contacto">
                        <v-icon small class="mr-1">mdi-cellphone</v-icon>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="body-2">
                            {{ item.responsable.telefono_contacto }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="pb-2 mh-30" v-if="item.responsable.email">
                        <v-icon small class="mr-1">mdi-email</v-icon>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="body-2">
                            {{ item.responsable.email }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="py-0 mh-30" v-if="item.responsable && item.responsable.direccion">
                        <v-icon small class="mr-1">fas fa-map-signs</v-icon>
                        <v-list-item-content class="pa-0">
                          <v-list-item-subtitle class="body-2">
                            {{ item.responsable.direccion }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                              v-if="item.responsable.cod_mpio"
                              class="body-2"
                          >
                            {{
                              municipiosTotal && municipiosTotal.length &&
                              parseInt(item.responsable.cod_mpio) && municipiosTotal.find(x => x.id ===
                                  parseInt(item.responsable.cod_mpio)) ? `${municipiosTotal.find(x => x.id ===
                                  parseInt(item.responsable.cod_mpio)).nombre}, ${municipiosTotal.find(x => x.id
                                  === parseInt(item.responsable.cod_mpio)).departamento.nombre}` : ''
                            }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-if="item.zona" class="body-2">
                            {{ item.zona ? item.zona : '' }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-else>
                      <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No registra
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </template>
                  </v-card>
                </v-col>
                <v-col cols="12" md="8">
                  <v-row v-if="permisos.gestionarBodega" justify="end">
                    <v-col cols="2" v-if="!getUser || !getUser.cod_ips">
                      <v-btn @click="openIngresoVacunas">Ingresos</v-btn>
                    </v-col>
                    <v-col class="" cols="2">
                      <v-btn @click="openPerdidasVacunas">Salidas</v-btn>
                    </v-col>
                    <v-col class="pl-0" cols="2">
                      <v-btn @click="openTrasladoVacunas">Traslados</v-btn>
                    </v-col>
                  </v-row>
                    <v-tabs
                        class="mt-3"
                        id="tabsBodega"
                        v-model="tab"
                        fixed-tabs
                        center-active
                        show-arrows
                        :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : tab === 'tab-4' ? 'deep-purple' : tab === 'tab-5' ? 'indigo' : 'teal'"
                    >
                            <v-tabs-slider></v-tabs-slider>
                            <v-tab
                                href="#tab-1"
                            >
                                Inventario
                            </v-tab>
                            <v-tab
                                href="#tab-2"
                            >
                                Movimientos
                            </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab" class="mt-2" touchless>
                        <v-tab-item
                            value="tab-1"
                        >
                            <v-card>
                                <v-container fluid>
                                    <v-row v-if="inventario && inventario.length">
                                        <v-col cols="12">
                                        <v-simple-table>
                                            <template v-slot:default>
                                                <thead>
                                                    <tr>
                                                        <th>Biologico</th>
                                                        <th>Lote</th>
                                                        <th>Cantidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr
                                                    v-for="(biologico, indexBiologico) in inventario"
                                                    :key="`biologico-${indexBiologico}`"
                                                >
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{biologico.biologico ? biologico.biologico : ''}}</v-list-item-title>
                                                    </v-list-item-content>
                                                    </td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{ biologico.lote ? biologico.lote : '' }}</v-list-item-title>
                                                    </v-list-item-content>
                                                    </td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{ biologico.cantidad ? biologico.cantidad : '' }}</v-list-item-title>
                                                    </v-list-item-content>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                        </v-col>
                                    </v-row>
                                    <v-row justify="center" v-else>
                                        <div class="subtitle-2 grey--text mb-4">No registra biologicos</div>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item
                            value="tab-2"
                        >
                            <v-card>
                                <v-container fluid>
                                    <v-row v-if="item && item.movimientos && item.movimientos.length">
                                        <v-col cols="12">
                                            <v-simple-table>
                                                <template v-slot:default>
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Biologico</th>
                                                    <th>Fecha</th>
                                                    <th>Tipo</th>
                                                    <th>Cantidad</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr
                                                    v-for="(movimiento, indexMovimiento) in item.movimientos"
                                                    :key="`movimiento-${indexMovimiento}`"
                                                >
                                                  <td>{{ movimiento.id }}</td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{movimiento.vacuna_id ? dosisVacunas.Tipo_biologico.find(x => parseInt(x.codigo) === movimiento.vacuna_id).nombre : ''}}</v-list-item-title>
                                                        <v-list-item-subtitle class="subtitle-2 grey--text">{{movimiento.lote ? movimiento.lote : ''}}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    </td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{ movimiento.fecha ? moment(movimiento.fecha).format('DD/MM/YYYY') : '' }}</v-list-item-title>
                                                    </v-list-item-content>
                                                    </td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{ movimiento.tipo ? movimiento.tipo : '' }}</v-list-item-title>
                                                        <v-list-item-subtitle v-if="movimiento.motivo">{{ movimiento.motivo }}</v-list-item-subtitle>
                                                    </v-list-item-content>
                                                    </td>
                                                    <td>
                                                    <v-list-item-content class="pa-0">
                                                        <v-list-item-title>{{ movimiento.cantidad ? movimiento.cantidad : '' }}</v-list-item-title>
                                                    </v-list-item-content>
                                                    </td>
                                                </tr>
                                                </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-col>
                                    </v-row>
                                    <v-row justify="center" v-else>
                                        <div class="subtitle-2 grey--text mb-4">No registra ningun movimiento</div>
                                    </v-row>
                                </v-container>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <app-section-loader :status="loading" />
      <ingreso-vacunas ref="ingresoVacunas" @guardado="reloadTable"></ingreso-vacunas>
      <perdida-vacunas ref="perdidaVacunas" @guardado="reloadTable" :inventario="inventario"></perdida-vacunas>
      <traslado-vacunas ref="trasladoVacunas" @guardado="reloadTable" :inventario="inventario"></traslado-vacunas>
    </v-card>
  </v-dialog>
</template>

<script>
const IngresoVacunas = () => import("./IngresoVacunas");
const PerdidaVacunas = () => import("./PerdidaVacunas");
const TrasladoVacunas = () => import("./TrasladoVacunas");
import { mapGetters } from "vuex";

export default {
  name: "DetalleBodega",
  components: {
    IngresoVacunas,
    PerdidaVacunas,
    TrasladoVacunas,
  },
  data: () => ({
    loading: false,
    dialog: false,
    item: [],
    tab: null,
    prestadores: [],
    inventario: [],
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('bodegas')
    },
    ...mapGetters(["municipiosTotal", "tiposDocumentoIdentidad", "dosisVacunas", 'getUser']),
  },
  created() {
    this.getIps();
  },
  methods: {
    reloadTable() {
      this.getInventario(this.item.id);
      this.getItem(this.item.id);
    },
    openTrasladoVacunas() {
      this.$refs.trasladoVacunas.open(this.item.id)
    },
    openPerdidasVacunas() {
      this.$refs.perdidaVacunas.open(this.item.id)
    },
    openIngresoVacunas() {
      this.$refs.ingresoVacunas.open(this.item.id)
    },
    getInventario(id) {
      this.axios
        .get(`inventario-bodegas/${id}`)
        .then((response) => {
          this.inventario = response.data;
        })
        .catch((e) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar el inventario de la bodega`,
            error: e,
          });
        });
    },
    getIps() {
      this.axios
        .get(`prestadores?filter[vacunador_covid]=1`)
        .then((response) => {
          this.prestadores = response.data;
        })
        .catch((e) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar las IPS que vacunan covid.`,
            error: e,
          });
        });
    },
    open(item = null) {
      if (item) {
        this.getItem(item.id);
        this.getInventario(item.id)
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.item = null;
    },
    getItem(id) {
      this.loading = true;
      this.axios
        .get(`bodegas/${id}`)
        .then((response) => {
          this.item = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar el registro de la bodega`,
            error: error,
          });
        });
    },
  },
};
</script>

<style>
.mh-30 {
  min-height: 30px !important;
}
</style>