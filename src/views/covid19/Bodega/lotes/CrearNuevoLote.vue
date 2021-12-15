<template>
  <v-dialog
      v-model="modalLote"
      max-width="450"
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
        <ValidationObserver
            v-if="lote_object"
            ref="formLote"
            v-slot="{ invalid, validated, passes, validate }"
            autocomplete="off"
        >
          <v-row>
            <v-col class="pb-0" cols="12">
              <c-select-complete
                  v-model="lote_object.biologico_id"
                  label="Biológico"
                  rules="required"
                  name="biológico"
                  :items="dosisVacunas.Tipo_biologico"
                  item-text="nombre"
                  item-value="id"
                  :disabled="!!biologico"
              />
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-texto
                  v-model="lote_object.codigo"
                  label="Codigo"
                  name="codigo"
                  rules="required"
              >
              </c-texto>
            </v-col>
            <v-col class="pb-0" cols="12">
              <c-date
                  v-model="lote_object.fecha_vencimiento"
                  label="Fecha vencimiento"
                  name="fecha vencimiento"
                  rules="required"
              />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
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
    </v-card>
  </v-dialog>
</template>
<script>

import {mapGetters} from 'vuex'

export default {
  name: 'CrearNuevoLote',
  props: {
    biologico: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    modalLote: false,
    loading: false,
    lote_object: null,
    loteModel: {
      biologico_id: null,
      codigo: null,
      fecha_vencimiento: null
    }
  }),
  computed: {
    ...mapGetters([
      "dosisVacunas",
    ]),
  },
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
      this.lote_object.biologico_id = this.biologico ? this.biologico.id : null
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