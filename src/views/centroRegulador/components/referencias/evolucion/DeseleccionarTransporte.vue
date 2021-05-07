<template>
  <v-dialog v-model="dialog" max-width="620">
    <template v-slot:activator="{ on, attrs }">
      <c-tooltip top :tooltip="accion.tooltip">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="ma-1"
          :color="accion.color"
          depressed
          fab
          x-small
        >
          <v-icon class="white--text">{{ accion.icon }}</v-icon>
        </v-btn>
      </c-tooltip>
    </template>
    <v-card>
      <v-toolbar dark :color="accion.color">
        <v-icon left>{{ accion.icon }}</v-icon>
        <v-toolbar-title> {{ accion.accion }} Presentación </v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid class="pb-0">
        <ValidationObserver
          ref="formItem"
          v-slot="{ invalid, validated, passes, validate }"
          autocomplete="off"
        >
          <v-row dense>
            <v-col cols="12" sm="6">
              <c-date-manual
                v-model="item.fecha"
                label="Fecha"
                name="Fecha"
                rules="required"
                :max="moment().format('YYYY-MM-DD')"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <c-time
                v-model="item.hora"
                label="Hora"
                name="Hora"
                rules="required"
              />
            </v-col>
            <v-col cols="12">
              <c-text-area label="Observaciones" rules="required" name="observaciones" v-model="item.observaciones" />
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-container>
      <v-card-actions>
        <v-btn text @click="close"> Cancelar </v-btn>
        <v-spacer />
        <v-btn :color="accion.color" class="white--text" @click="save">
          Guardar
        </v-btn>
      </v-card-actions>
      <app-section-loader :status="loading" />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeseleccionarTransporte",
  props: {
    referencia: {
      type: Object,
      default: null,
    },
    accion: {
      type: Object,
      default: null,
    },
    id: {
      type: [String, Number],
      default: null,
    },
  },
  data: () => ({
    dialog: false,
    loading: false,
    item: null,
    itemModel: {
      fecha: null,
      hora: null,
      observaciones: null
    }
  }),
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          this.open();
        }
      },
      inmeadiate: false
    }
  },
  methods: {
    open() {
      if (this.referencia) {
        this.item = this.clone(this.itemModel);
        this.item.fecha = this.moment().format("YYYY-MM-DD");
        this.item.hora = this.moment().format("HH:mm");
      } else {
        this.$store.commit("snackbar", {
          color: "error",
          message: `No hay una referencia seleccionada.`,
        });
        this.close();
      }
    },
    close() {
      this.loading = false;
      this.dialog = false;
      this.$refs.formItem.reset();
      this.item = this.clone(this.itemModel);
    },
    save() {
      this.$refs.formItem.validate().then(async result => {
        if (result) {
          this.loading = true;
          let itemCopia = this.clone(this.item);
          itemCopia.fecha = `${itemCopia.fecha} ${itemCopia.hora}`
          this.axios.post(`deseleccionar-transporte/${this.id}`, itemCopia).then(() => {
            this.$emit('guardado', this.referencia.id);
            this.$store.commit('snackbar', {color: 'success', message: `${this.accion.accion} se guardo correctamente.`});
            this.close();
          }).catch(error => {
            this.loading = false;
            this.$store.commit('snackbar', {color: 'error', message: `al guardar al ${this.accion.accion}.`, error: error});
          })
        }
      })
    },
  },
};
</script>

<style>
</style>
