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
        <v-toolbar-title>Salida de Vacunas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="10" offset-md="1">
            <ValidationObserver
              v-if="perdida"
              ref="formPerdida"
              v-slot="{ invalid, validated, passes, validate }"
              autocomplete="off"
            >
              <v-row>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="perdida.biologico"
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
                    v-model="perdida.motivo"
                    label="Motivo salida"
                    rules="required"
                    name="motivo_salida"
                    :items="dosisVacunas ? dosisVacunas.motivos : []"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-number
                    v-model="perdida.cantidad"
                    label="Cantidad perdida"
                    name="cantidad"
                    upper-case
                    min="0"
                    :max="inventario && perdida.biologico ? inventario.find(x => x.biologico == perdida.biologico).cantidad : null"
                    :rules="`required|min:0|max:${inventario && perdida.biologico ? inventario.find(x => x.biologico == perdida.biologico).cantidad : null}`"
                    :disabled="!perdida.biologico"
                  >
                  </c-number>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="6">
                  <c-select-complete
                    v-model="perdida.lote"
                    label="Lote"
                    rules="required"
                    name="lote"
                    :items="inventario && perdida.biologico ? inventario.filter(x => x.biologico == perdida.biologico).map(x => x.lote) : []"
                    :disabled="!perdida.biologico"
                  >
                  </c-select-complete>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-text-area
                    v-model="perdida.observaciones"
                    label="Observaciones"
                    name="observaciones"
                    rules="required"
                  >
                  </c-text-area>
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
  name: "PerdidaVacunas",
  props: {
    inventario: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    loading: false,
    perdida: null,
    perdidaModel: {
        id: null,
        biologico: null,
        lote: null,
        cantidad: null,
        observaciones: null,
        bodega_id: null,
        motivo: null,
    },
    biologicos: [],
  }),
  computed: {
    ...mapGetters([
      "dosisVacunas",
    ]),
  },
  watch: {
    "perdida.biologico": {
      handler(value) {
        if (value) {
          this.perdida.lote = null
          this.perdida.cantidad = null
        } else {
          this.perdida.lote = null
          this.perdida.cantidad = null
        }
      }
    }
  },
  methods: {
    guardar() {
      this.$refs.formPerdida.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.perdida);
          let request = copiaData.id
            ? this.axios.put(`registrar-salida/${copiaData.id}`, copiaData)
            : this.axios.post(`registrar-salida`, copiaData);
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
    open(id = null) {
      this.perdida = this.clone(this.perdidaModel);
      this.perdida.bodega_id = id;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.loading = false;
        this.perdida = this.clone(this.perdidaModel);
        this.$refs.formPerdida.reset();
      }, 400);
    },
  },
};
</script>

<style scoped>
</style>