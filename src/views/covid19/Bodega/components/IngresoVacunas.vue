<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="800"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-icon left>fas fa-warehouse</v-icon>
        <v-toolbar-title>Ingreso de Vacunas a Bodega</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="10" offset-md="1">
            <ValidationObserver
              v-if="ingreso"
              ref="formIngreso"
              v-slot="{ invalid, validated, passes, validate }"
              autocomplete="off"
            >
              <v-row>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="ingreso.biologico"
                    label="Biologico"
                    rules="required"
                    name="biologico"
                    :items="dosisVacunas.Tipo_biologico"
                    item-text="nombre"
                    item-value="nombre"
                  >
                  </c-select-complete>
                </v-col>
                <!-- <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-select-complete
                    v-model="ingreso.bodega_destino"
                    label="Bodega destino"
                    rules="required"
                    name="bodega_destino"
                    :items="bodegas"
                    item-text="text"
                    item-value="id"
                  >
                  </c-select-complete>
                </v-col> -->
                <v-col class="pb-0" cols="12" sm="12" md="5">
                  <c-number
                    v-model="ingreso.cantidad"
                    label="Cantidad a ingresar"
                    name="cantidad"
                    upper-case
                    rules="required|min:1"
                  >
                  </c-number>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="4">
                  <c-texto
                    v-model="ingreso.lote"
                    label="Lote"
                    name="lote"
                    upper-case
                  >
                  </c-texto>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="3">
                  <v-checkbox
                    class="mt-0"
                    v-model="ingreso.ajusteEntrada"
                    label="Ajuste"
                    :true-value="true"
                    :false-value="false"
                  ></v-checkbox>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-text-area
                    v-model="ingreso.observaciones"
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
  name: "IngresoVacunas",
  components: {
  },
  data: () => ({
    dialog: false,
    loading: false,
    ingreso: null,
    ingresoModel: {
        id: null,
        bodega_id: null,
        biologico: null,
        cantidad: null,
        lote: null,
        observaciones: null,
        ajusteEntrada: null,
    },
    biologicos: [],
    bodegas: []
  }),
  computed: {
    ...mapGetters([
      "dosisVacunas",
    ]),
  },
  watch: {},
  created() {
    this.getIps()
  },
  methods: {
    getIps() {
        this.axios.get(`prestadores?filter[vacunador_covid]=1`)
            .then(response => {
                this.prestadores = response.data
            }).catch(e => {
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar las IPS que vacunan covid.`, error: e})
        })
    },
    guardar() {
      this.$refs.formIngreso.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.ingreso);
          let request = copiaData.id
            ? this.axios.put(`registrar-entrada/${copiaData.id}`, copiaData)
            : this.axios.post(`registrar-entrada`, copiaData);
          request
            .then((response) => {
              this.$emit("guardado", response.data);
              this.$store.commit("snackbar", {
                color: "success",
                message: `Ingreso guardado correctamente.`,
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
      this.ingreso = this.clone(this.ingresoModel);
      this.ingreso.bodega_id = id;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.loading = false;
        this.ingreso = this.clone(this.ingresoModel);
        this.$refs.formIngreso.reset();
      }, 400);
    },
  },
};
</script>

<style scoped>
</style>