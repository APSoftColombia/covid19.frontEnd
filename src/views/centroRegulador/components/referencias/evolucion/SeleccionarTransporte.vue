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
            <v-col cols="12" sm="6">
                <c-select-complete
                    name="tipo traslado"
                    label="Tipo Traslado"
                    v-model="item.tipo_traslado"
                    :items="ref_tiposTraslados"
                    rules="required"
                />
            </v-col>
            <v-col cols="12" sm="6">
                <c-select-complete
                    label="Tipo Ambulancia"
                    name="tipo ambulancia"
                    v-model="item.tipo_ambulancia"
                    :items="ref_tiposAmbulancia"
                    rules="required"
                />
            </v-col>
            <v-col cols="12" sm="12" class="mt-2">
              <buscador-ips
                ref="buscadoripsOrigen"
                label="IPS de Origen"
                name="IPS de Origen"
                v-model="item.codigo_prestador_origen"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <buscador-ips
                label="IPS de Traslado"
                name="IPS de Origen"
                v-model="item.codigo_prestador_traslado"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <buscador-ips
                ref="buscadoripsDestino"
                label="IPS de Destino"
                name="IPS de Origen"
                v-model="item.codigo_prestador_destino"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <c-texto
                v-model="item.contacto"
                label="Celular Contacto"
                name="celular contacto"
                type="tel"
                rules="required|numeric|minlength:10|maxlength:10"
              >
              </c-texto>
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
import BuscadorIps from "Views/centroRegulador/components/referencias/BuscadorIps";
import { mapGetters } from "vuex";

export default {
  name: "SeleccionarTransporte",
  components: {
    BuscadorIps,
  },
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
      observaciones: null,
      tipo_traslado: null,
      tipo_ambulancia: null,
      contacto: null,
      codigo_prestador_origen: null,
      codigo_prestador_traslado: null,
      codigo_prestador_destino: null,
    },
  }),
  computed: {
    ...mapGetters(['ref_tiposAmbulancia', 'ref_tiposTraslados']),
  },
  watch: {
    dialog: {
      handler(val) {
        if (val) {
          this.open();
        }
      },
      inmediate: false,
    },
  },
  methods: {
    open() {
      if (this.referencia) {
        setTimeout(() => {
          if (this.$refs.buscadoripsOrigen) this.$refs.buscadoripsOrigen.assign(this.referencia.codigo_prestador_origen)
          if (this.$refs.buscadoripsrepsDestino) this.$refs.buscadoripsrepsDestino.assign(this.referencia.presentaciones.find(x => x.id === this.id).codigo_prestador_presentacion)
        }, 600)
        this.item = this.clone(this.itemModel);
        this.item.fecha = this.moment().format("YYYY-MM-DD");
        this.item.hora = this.moment().format("HH:mm");
        this.item.codigo_prestador_origen = this.referencia.codigo_prestador_origen;
        this.item.codigo_prestador_destino = this.referencia.presentaciones.find(x => x.id === this.id).codigo_prestador_presentacion;
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
      this.$refs.formItem.validate().then(async (result) => {
        if (result) {
          this.loading = true;
          let itemCopia = this.clone(this.item);
          itemCopia.fecha_solicitud = `${itemCopia.fecha} ${itemCopia.hora}`;
          this.axios
            .post(`seleccionar-transporte/${this.referencia.id}`, itemCopia)
            .then(() => {
              this.$emit("guardado", this.referencia.id);
              this.$store.commit("snackbar", {
                color: "success",
                message: `${this.accion.accion} se guardo correctamente.`,
              });
              this.close();
            })
            .catch((error) => {
              this.loading = false;
              this.$store.commit("snackbar", {
                color: "error",
                message: `al guardar ${this.accion.accion}.`,
                error: error,
              });
            });
        }
      });
    },
  },
};
</script>

<style>
</style>
