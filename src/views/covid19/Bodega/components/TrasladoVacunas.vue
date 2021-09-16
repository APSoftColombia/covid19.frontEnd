<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="800"
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-warehouse</v-icon>
        <v-toolbar-title>Traslado de Vacunas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="10" offset-md="1">
            <ValidationObserver
              v-if="traslado"
              ref="formTraslado"
              v-slot="{ invalid, validated, passes, validate }"
              autocomplete="off"
            >
              <v-row>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="traslado.biologico"
                    label="Biologico"
                    rules="required"
                    name="biologico"
                    :items="inventario ? inventario : []"
                    item-text="biologico"
                    item-value="biologico"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="traslado.bodega_destino"
                    label="traslado destino"
                    rules="required"
                    name="bodega_destino"
                    :items="bodegas.filter(x => x.id !== traslado.bodega_origen)"
                    item-text="nombre"
                    item-value="id"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-number
                    v-model="traslado.cantidad"
                    label="Cantidad a trasladar"
                    name="cantidad"
                    upper-case
                    min="0"
                    :max="inventario && traslado.biologico ? inventario.find(x => x.biologico == traslado.biologico).cantidad : null"
                    :rules="`required|min:0|max:${inventario && traslado.biologico ? inventario.find(x => x.biologico == traslado.biologico).cantidad : null}`"
                    :disabled="!traslado.biologico"
                  >
                  </c-number>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-select-complete
                    v-model="traslado.lote"
                    label="Lote"
                    rules="required"
                    name="lote"
                    :items="inventario && traslado.biologico ? inventario.filter(x => x.biologico == traslado.biologico).map(x => x.lote) : []"
                    :disabled="!traslado.biologico"
                  >
                  </c-select-complete>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn @click.stop="close">
            <v-icon>mdi-close</v-icon>
            Cerrar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.stop="guardar">
            <v-icon left>fas fa-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-container>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "TrasladoVacunas",
  props: {
    inventario: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    traslado: null,
    trasladoModel: {
        id: null,
        bodega_origen: null,
        bodega_destino: null,
        cantidad: null,
        biologico: null,
        lote: null,
    },
    biologicos: [],
    bodegas: []
  }),
  computed: {
    ...mapGetters([
      "dosisVacunas",
    ]),
  },
  watch: {
    "traslado.biologico": {
      handler(value) {
        if (value) {
          this.traslado.lote = null
          this.traslado.cantidad = null
        } else {
          this.traslado.lote = null
          this.traslado.cantidad = null
        }
      }
    }
  },
  methods: {
    guardar() {
      this.$refs.formTraslado.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.traslado);
          let request = copiaData.id
            ? this.axios.put(`registrar-traslado/${copiaData.id}`, copiaData)
            : this.axios.post(`registrar-traslado`, copiaData);
          request
            .then((response) => {
              this.$emit("guardado", response.data);
              this.$store.commit("snackbar", {
                color: "success",
                message: `Registro guardado correctamente.`,
              });
              this.close();
            })
            .catch((error) => {
              this.loading = false;
              this.$store.commit("snackbar", {
                color: "error",
                message: `al guardar el registro.`,
                error: error,
              });
            });
        }
      });
    },
    getBodegas() {
        this.axios
        .get(`bodegas`)
        .then((response) => {
          this.bodegas = response.data ? response.data.data : [];
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar la info de las bodegas`,
            error: error,
          });
          this.close();
        });
    },
    open(id = null) {
      this.getBodegas();
      this.traslado = this.clone(this.trasladoModel);
      this.traslado.bodega_origen = id;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.loading = false;
        this.traslado = this.clone(this.trasladoModel);
        this.$refs.formTraslado.reset();
      }, 400);
    },
  },
};
</script>

<style scoped>
</style>