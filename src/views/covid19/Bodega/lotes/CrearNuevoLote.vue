<template>
  <v-dialog
        v-model="modalLote"
        max-width="500"
        persistent
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Creacion de Nuevo Lote</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container>
            
            <v-card-text class="pb-0">
              <v-container fluid>
                <v-row>

                  <v-card
                    class="mx-auto"
                    max-width="344"
                    outlined
                  >
                    <v-card-text>
                        <ValidationObserver
                            v-if="lote_object"
                            ref="formLote"
                            v-slot="{ invalid, validated, passes, validate }"
                            autocomplete="off"
                        >
                            <v-row>
                                <v-col class="pb-0" cols="12" sm="12" md="12">
                                <c-texto
                                    v-model="lote_object.codigo"
                                    label="Codigo"
                                    name="codigo"
                                    rules="required"
                                >
                                </c-texto>
                                </v-col>
                                <v-col class="pb-0" cols="12" sm="12" md="12">
                                <c-date
                                    v-model="lote_object.fecha_vencimiento"
                                    label="Fecha vencimiento"
                                    name="fecha vencimiento"
                                    rules="required"
                                />
                                </v-col>
                            </v-row>
                        </ValidationObserver>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-container>
            </v-card-text>

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
        </v-card>
      </v-dialog>
</template>
<script>

export default {
  name: "CrearNuevoLote",
  components: {
  },
  data: () => ({
    modalLote: false,
    loading: false,
    lote_object: null,
    loteModel: {
        codigo: null,
        fecha_vencimiento: null
    }
  }),
  methods: {
    guardar() {
      this.$refs.formLote.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.lote_object);
          let request = copiaData.id
            ? this.axios.put(`lotes/${copiaData.id}`, copiaData)
            : this.axios.post(`lotes`, copiaData);
          request
            .then((response) => {
              this.$emit("guardado", response.data ? response.data.codigo : null);
              this.$store.commit("snackbar", {
                color: "success",
                message: `Lote guardado correctamente.`,
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
    open() {
        this.lote_object = this.clone(this.loteModel);
        this.modalLote = true
    },
    close() {
        this.modalLote = false;
        setTimeout(() => {
            this.loading = false;
            this.lote_object = this.clone(this.loteModel);
            this.$refs.formLote.reset();
        }, 400);
    },
  },
};
</script>

<style scoped>
</style>