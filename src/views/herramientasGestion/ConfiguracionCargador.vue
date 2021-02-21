<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >Creacion y configuracion de Cargadores</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="crearCargador"> Nuevo Cargador </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          
          <v-row>
            <v-col cols="12" sm="12" md="4">
              <v-card>
                <v-list two-line class="notification-wrap">
                  <v-list-item-group>
                    <template v-for="(cargador, indexReporte) in cargadores">
                      <v-hover
                        v-slot:default="{ hover }"
                        :key="`Cargador ${indexReporte}`"
                      >
                        <v-list-item>
                          <v-list-item-avatar class="my-1 align-self-center">{{
                            cargador.id
                          }}</v-list-item-avatar>
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              ><h5 class="mb-0 text-truncate">
                                Cargador: {{ cargador.nombre_cargador }}
                              </h5></v-list-item-title
                            >
                            <v-list-item-subtitle
                              class="grey--text fs-12 fw-normal text-truncate"
                              >Tabla temp:
                              {{
                                cargador.nombre_table_temp
                              }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                          <v-list-item-action v-if="hover">
                            <v-btn
                              icon
                              color="warning"
                              @click.stop="editarCargador(cargador)"
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn
                              icon
                              color="error"
                              @click.stop="selectDeleted(cargador.id)"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-hover>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="8">
              <crear-cargador
                :cargador="copyCargador"
                :stateCrearCargador="stateCrearCargador"
                @closeCrearCargador="closeCrearCargador"
                @deleteHeader="deleteHeader"
                @addHeader="addHeader"
                @updateHeader="updateHeader"
                @editCargador="editCargador"
                @saveNewCargador="saveNewCargador"
                @addQuery="addQuery"
                @deleteQuery="deleteQuery"
              ></crear-cargador>
              <v-card>
                <v-card-text
                  v-if="!stateCrearCargador"
                  class="text-center headline"
                >
                  No hay un cargador seleccionado
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <app-section-loader :status="loading"></app-section-loader>
      <!-- Dialog delete cargador -->
      <v-dialog v-model="dialogDelete" max-width="500px" persistent>
        <v-card>
          <v-card-title class="headline">Esta seguro que desea borrar este cargador?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="unselectDeleted">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteCargador">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
  </v-row>
</template>

<script>
const CrearCargador = () => import('Views/herramientasGestion/CrearCargador')
export default {
  components: {
    CrearCargador,
  },
  data: () => ({
    cargadorToDeleted: null,
    dialogDelete: false,
    dialog: false,
    notifications: "",
    sound: "",
    widgets: "",
    loading: false,
    cargadores: [],
    reportesFull: [],
    reportesFiltrados: [],
    seleccionado: null,
    indexSeleccionado: null,
    copyCargador: null,
    modelCargador: {
      id: null,
      nombre_cargador: null,
      nombre_table_temp: null,
      delete_temp: true,
      like_table: null,
      separator: null,
      cabeceras: [],
      querys: [],
    },
    stateCrearCargador: false,
  }),
  methods: {
    open() {
      this.dialog = true;
      this.copyCargador = this.clone(this.modelCargador);
      this.getAllCargadores();
    },
    close() {
      this.dialog = false;
    },
    closeCrearCargador(value) {
      this.stateCrearCargador = value;
      this.copyCargador = this.clone(this.modelCargador);
    },
    editCargador() {
      this.loading = true;
      let cargador = {
        cargador: {
          id: this.copyCargador.id,
          nombre_cargador: this.copyCargador.nombre_cargador,
          nombre_table_temp: this.copyCargador.nombre_table_temp,
          separator: this.copyCargador.separator,
          delete_temp: this.copyCargador.delete_temp,
          like_table: this.copyCargador.like_table
        },
        cabeceras : this.copyCargador.cabeceras.map(x => {
          return {
            header: x.header,
            type: x.type,
            required: x.required,
            length: x.length
          }
        }),
        querys: this.copyCargador.querys.map(a => { 
          return {
            query: a.query,
            orden: a.orden,
            makeRollback: a.makeRollback,
            makeResult:a.makeResult
            } 
          })
      }
      this.axios
        .put(`config-cargador/${this.copyCargador.id}`, cargador)
        .then((response) => {
          this.loading = false;
          console.log(response);
          this.getAllCargadores();
          this.closeCrearCargador(false);
          this.$store.commit("snackbar", {
            color: "success",
            message: `Cargador modificado`
          });
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al editar el cargador`,
            error: error,
          });
          this.loading = false;
        });
    },
    saveNewCargador() {
      this.loading = true;
      let cargador = {
        cargador: {
          nombre_cargador: this.copyCargador.nombre_cargador,
          nombre_table_temp: this.copyCargador.nombre_table_temp,
          separator: this.copyCargador.separator,
          delete_temp: this.copyCargador.delete_temp,
          like_table: this.copyCargador.like_table
        },
        cabeceras : this.copyCargador.cabeceras,
        querys: this.copyCargador.querys.map(a => { 
          return {
            query: a.query,
            orden: a.orden,
            makeRollback:a.makeRollback,
            makeResult:a.makeResult
            } 
          })
      }
      this.axios
        .post("config-cargador", cargador)
        .then((response) => {
          this.loading = false;
          console.log(response);
          this.getAllCargadores();
          this.closeCrearCargador(false);
          this.$store.commit("snackbar", {
            color: "success",
            message: `Cargador creado exitosamente`
          });
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al guardar la configuracion del cargador`,
            error: error,
          });
          this.loading = false;
        });
    },
    selectDeleted(id) {
      this.dialogDelete = true
      this.cargadorToDeleted = id
    },
    unselectDeleted() {
      this.dialogDelete = false
      this.cargadorToDeleted = null
    },
    deleteCargador() {
      this.loading = false;
      this.axios
        .delete(`config-cargador/${this.cargadorToDeleted}`)
        .then((response) => {
          this.dialogDelete = false;
          this.loading = false;
          console.log(response);
          this.getAllCargadores();
          this.$store.commit("snackbar", {
            color: "success",
            message: `Cargador borrado`
          });
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al borrar el cargador`,
            error: error,
          });
          this.loading = false;
        });
    },
    addQuery(item) {
      this.copyCargador.querys.push(item)
    },
    deleteQuery(item) {
      this.copyCargador.querys.splice(item, 1)
    },
    crearCargador() {
      this.copyCargador = this.clone(this.modelCargador);
      this.stateCrearCargador = true;
    },
    editarCargador(cargador) {
      this.copyCargador = this.clone(cargador);
      this.stateCrearCargador = true;
    },
    deleteHeader(item) {
      this.copyCargador.cabeceras.splice(item, 1)
    },
    addHeader(item) {
      this.copyCargador.cabeceras.push(item.header)
    },
    updateHeader(item) {
      let itemF = this.clone(item)
      delete itemF.index
      Object.assign(this.copyCargador.cabeceras[item.index], itemF)
    },
    getAllCargadores() {
      this.loading = true;
      this.axios
        .get("config-cargador")
        .then((response) => {
          this.cargadores = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar la configuracion de los cargadores`,
            error: error,
          });
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.CodeMirror-gutter-wrapper {
  left: -34px !important;
}
.CodeMirror-gutters {
  left: 0px !important;
}
</style>