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
                <v-col class="pb-0" cols="12" sm="12" md="5">
                  <ValidationProvider
                      name="lote"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <v-autocomplete
                        label="Lote"
                        v-model="ingreso.lote"
                        :items="lotesFiltrados"
                        outlined
                        dense
                        item-value="codigo"
                        item-text="codigo"
                        clearable
                        :error-messages="errors"
                    >
                      <template v-slot:append-outer>
                        <v-btn
                            style="bottom: 6px !important;"
                            color="primary"
                            dark
                            @click="openModalNuevoLote"
                        >
                          <v-icon dark>
                            mdi-plus
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col class="pb-0" cols="12" sm="12" md="2">
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
    <crear-nuevo-lote
        :biologico="biologicoSeleccionado"
        ref="nuevoLote"
        @guardado="val => loteGuardado(val)"
    />
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import CrearNuevoLote from './../lotes/CrearNuevoLote'

export default {
  name: "IngresoVacunas",
  components: {
    CrearNuevoLote
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
    bodegas: [],
    lotes: [],
    modalLote: false,
  }),
  computed: {
    ...mapGetters([
      "dosisVacunas",
    ]),
    biologicoSeleccionado () {
      return (this.ingreso && this.dosisVacunas?.Tipo_biologico?.length && this.dosisVacunas.Tipo_biologico.find(x => x.nombre === this.ingreso.biologico)) || null
    },
    lotesFiltrados () {
      return (this.biologicoSeleccionado && this.lotes?.length && this.lotes.filter(x => x.biologico_id === this.biologicoSeleccionado.id)) || []
    }
  },
  watch: {
    biologicoSeleccionado: {
      handler () {
        this.ingreso.lote = null
      },
      immediate: false
    }
  },
  methods: {
    loteGuardado(codigo) {
      this.getLotes()
      this.ingreso.lote = codigo
    },
    openModalNuevoLote() {
      this.$refs.nuevoLote.open();
    },
    getLotes() {
        this.axios.get(`lotes`)
            .then(response => {
                this.lotes = response.data
            }).catch(e => {
            this.$store.commit('snackbar', {color: 'error', message: `al recuperar los lotes.`, error: e})
        })
    },
    guardar() {
      this.$refs.formIngreso.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.ingreso);
          if (!copiaData.lote) copiaData.lote_object = this.lote_object;
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
      this.getLotes()
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