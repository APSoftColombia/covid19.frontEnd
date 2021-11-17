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
        <v-toolbar-title>{{ bodega && bodega.id ? `Edicion Bodega No. ${bodega.id}` : "Nuevo Registro de Bodega" }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-row no-gutters>
          <v-col md="10" offset-md="1">
            <ValidationObserver
              v-if="bodega"
              ref="formBodega"
              v-slot="{ invalid, validated, passes, validate }"
              autocomplete="off"
            >
              <v-row>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-texto
                    v-model="bodega.nombre"
                    label="Nombre Bodega"
                    name="nombre_bodega"
                    upper-case
                    rules="required"
                  >
                  </c-texto>
                </v-col>
                <!-- <v-col class="pb-0" cols="12" sm="6" md="6">
                  <c-select-complete
                    v-model="bodega.tipo"
                    label="Tipo de Bodega"
                    rules="required"
                    name="tipo_bodega"
                    :items="tipoBodega"
                    item-text="text"
                    item-value="id"
                  >
                  </c-select-complete>
                </v-col> -->
                <v-col class="pb-0" cols="12" sm="12" md="12">
                    <ValidationProvider name="Bodega de IPS" rules="" v-slot="{ errors }">
                        <v-autocomplete
                            label="Bodega de IPS"
                            v-model="bodega.codigo_ips"
                            item-value="codigohabilitacion"
                            :items="prestadores"
                            :filter="filterIPS"
                            placeholder="Buscar por código de habilitación, NIT o nombre"
                            no-data-text="No hay registros para mostrar"
                            outlined
                            :error-messages="errors"
                            persistent-hint
                            clearable
                            :hint="ipsSeleccionada ? [ipsSeleccionada.telefono ? `Tel.${ipsSeleccionada.telefono}`: null, `${ipsSeleccionada.direccion} ${ipsSeleccionada.nompio}, ${ipsSeleccionada.nomdepto}`].filter(x => x).join(' | '): null"
                        >
                            <template v-slot:selection="data">
                            <v-list-item class="pa-0" style="width: 100% !important;">
                                <v-list-item-content class="pa-0">
                                <v-list-item-title class="body-2 text-truncate">
                                    {{ data.item.nombre }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="caption text-truncate">Código de
                                    Habilitación:{{ data.item.codigohabilitacion }}
                                </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            </template>
                            <template v-slot:item="data">
                            <div style="width: 100% !important;">
                                <v-list-item class="pa-0">
                                <v-list-item-content class="text-truncate pa-0">
                                    <v-list-item-title class="body-2">
                                    {{ data.item.nombre }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="caption">Código de
                                    Habilitación:{{ data.item.codigohabilitacion }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                </v-list-item>
                                <v-divider class="ma-0"></v-divider>
                            </div>
                            </template>
                        </v-autocomplete>
                    </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider name="Responsable asignado" rules="required" v-slot="{ errors }">
                    <v-autocomplete
                        :label="bodega.responsable_id ? 'Responsable' : 'Seleccionar Responsable'"
                        v-model="bodega.responsable_id"
                        :items="responsables"
                        outlined
                        :error-messages="errors"
                        :filter="filterResponsables"
                        item-value="id"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-list-item class="pa-0" style="width: 100% !important;">
                          <v-list-item-content class="pa-0">
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <template v-slot:item="{ item, index }">
                        <template>
                          <v-list-item-content class="pa-0">
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{tiposDocumentoIdentidad && item.tipo_documento_identidad_id ? tiposDocumentoIdentidad.find(x => x.id === item.tipo_documento_identidad_id).tipo : ''}} {{item.numero_documento_identidad}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12" sm="12" md="12">
                  <c-text-area
                    v-model="bodega.descripcion"
                    label="Observaciones"
                    name="observaciones"
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

import {mapGetters} from 'vuex'

export default {
  name: "RegistroNuevaBodega",
  components: {
  },
  data: () => ({
    dialog: false,
    loading: false,
    bodega: null,
    bodegaModel: {
        id: null,
        nombre: null,
        codigo_ips: null,
        descripcion: null,
        responsable_id: null,
        tipo: null
    },
    prestadores: [],
    tipoBodega: [],
    responsables: [],
    filterResponsables (item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.numero_documento_identidad + ' ' + item.name)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    },
    filterIPS (item, queryText) {
      const hasValue = val => val != null ? val : ''
      const text = hasValue(item.codigohabilitacion + ' ' + item.nombre)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }),
  computed: {
    ...mapGetters([
      'tiposDocumentoIdentidad'
    ]),
    ipsSeleccionada() {
        return (this && this.prestadores && this.bodega.codigo_ips && this.prestadores.find(x => x.codigohabilitacion === this.bodega.codigo_ips)) || null
    },
  },
  /* watch: {
    'bodega.codigo_ips': {
      handler () {
        this.bodega.responsable_id = null
      },
      immediate: false
    }
  }, */
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
      this.$refs.formBodega.validate().then((result) => {
        if (result) {
          this.loading = true;
          let copiaData = this.clone(this.bodega);
          let request = copiaData.id
            ? this.axios.put(`bodegas/${copiaData.id}`, copiaData)
            : this.axios.post(`bodegas`, copiaData);
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
    getResponsables() {
      this.axios.get(`users-role?role=Médico`)
          .then(response => {
            this.responsables = response.data
          })
          .catch(error => {
            this.$store.commit('snackbar', {
              color: 'error',
              message: `al recuperar los registros de los responsables de bodega.`,
              error: error
            })
          })
    },
    getBodega(id) {
        this.axios
        .get(`bodegas/${id}`)
        .then((response) => {
          this.bodega = response.data;
        })
        .catch((error) => {
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar la info de la bodega`,
            error: error,
          });
          this.close();
        });
    },
    open(id = null) {
      if (id) {
        this.getBodega(id);
      } else {
        this.bodega = this.clone(this.bodegaModel);
      }
      this.getResponsables()
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.loading = false;
        this.bodega = this.clone(this.bodegaModel);
        this.$refs.formBodega.reset();
      }, 400);
    },
  },
};
</script>

<style scoped>
</style>