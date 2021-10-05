<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card>
      <template>
        <v-toolbar dark color="primary">
          <v-icon left>fas fa-file-medical</v-icon>
          <v-toolbar-title v-if="item && item.length && item[0].identificacion">
            {{ `Detalle General No. ${item[0].identificacion}` }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row v-if="item && item.length" no-gutters>
            <v-col lg="10" md="12" sm="12" class="mx-auto">
              <v-row dense>
                <v-col cols="12" md="4">
                  <v-card>
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-right
                      "
                      >Informacion basica
                    </v-list-item-subtitle>
                    <v-list-item class="py-0">
                      <v-icon large class="mr-2">{{
                        item[0].sexo === "M" ? "mdi mdi-face" : "mdi mdi-face-woman"
                      }}</v-icon>
                      <v-list-item-content class="pb-0">
                        <v-list-item-title class="font-weight-bold grey--text">
                          {{
                            [
                              item[0].nombre1,
                              item[0].nombre2,
                              item[0].apellido1,
                              item[0].apellido2,
                            ]
                              .filter((x) => x)
                              .join(" ")
                          }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            [
                              item[0].tipo_identificacion,
                              item[0].identificacion,
                            ]
                              .filter((x) => x)
                              .join(" ")
                          }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-if="item[0].fecha_nacimiento">
                          {{ calculaEdad(item[0].fecha_nacimiento).stringDate }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="py-0 mh-30 mt-3" v-if="item[0].telefono_contacto">
                      <v-icon small class="mr-1">mdi-cellphone</v-icon>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="body-2">
                          {{ item[0].telefono_contacto }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pb-2 mh-30" v-if="item[0].email">
                      <v-icon small class="mr-1">mdi-email</v-icon>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="body-2">
                          {{ item[0].email }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="py-0 mh-30">
                      <v-icon small class="mr-1">fas fa-map-signs</v-icon>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="body-2">
                          {{ item[0].direccion }} <br>
                          {{
                              municipiosTotal && municipiosTotal.length &&
                              parseInt(item[0].cod_mpio) && municipiosTotal.find(x => x.codigo ===
                              parseInt(item[0].cod_mpio)) ? `${municipiosTotal.find(x => x.codigo ===
                              parseInt(item[0].cod_mpio)).nombre}, ${municipiosTotal.find(x => x.codigo
                              === parseInt(item[0].cod_mpio)).departamento.nombre}` : ''
                          }} <br>
                          {{ item[0].zona }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="pt-0 pb-2 mh-30 mt-2" v-if="item[0].regimen_persona">
                      <v-icon small class="mr-1">fas fa-clinic-medical</v-icon>
                      <v-list-item-content class="pa-0">
                        <v-list-item-subtitle class="body-2">
                          {{ item[0].regimen_persona.nombre }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-if="item[0].estado_adres"
                          class="body-2"
                        >
                          Estado: {{ item[0].estado_adres }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                  <v-card class="mt-2">
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-right
                      "
                      >Informacion acudiente
                    </v-list-item-subtitle>
                    <v-list-item class="py-2" v-if="item[0].necesita_acudiente && item[0].necesita_acudiente === 'SI'">
                      <v-list-item-content class="pb-0">

                        <v-list-item-title class="font-weight-bold grey--text">
                            {{
                              [
                                item[0].nombre1_acud,
                                item[0].nombre2_acud,
                                item[0].apellido1_acud,
                                item[0].apellido2_acud,
                              ]
                                .filter((x) => x)
                                .join(" ")
                            }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              [
                                item[0].tipo_ident_acud
                                  ? this.tiposDocumentoIdentidad.find(
                                      (x) => x.id == item[0].tipo_ident_acud
                                    ).tipo
                                  : null
                                ,
                                item[0].identificacion_acud,
                              ]
                                .filter((x) => x)
                                .join(" ")
                            }}
                          </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item class="py-2" v-else>
                      <v-list-item-content class="pb-0">
                        <v-list-item-title class="font-weight-bold grey--text">
                            No registra acudiente
                          </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
                <v-col cols="12" md="8">
                  <v-card>
                    <v-list-item-subtitle
                      class="
                        font-weight-bold
                        grey--text
                        mx-4
                        pt-2
                        text-left
                      "
                      >Vacunas
                      <v-tooltip top v-if="item.filter(x => !x.acepta_vacuna).length">
                        <template v-slot:activator="{ on }">
                          <v-btn elevation="0" icon class="ml-3" v-on="on" @click="fallidas">
                            <v-icon color="orange">mdi mdi-alert-box-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Dosis Fallidas</span>
                      </v-tooltip>
                    </v-list-item-subtitle>
                    <v-card-text>
                        <v-list v-if="item.filter(x => x.acepta_vacuna).length">
                          <template v-for="(vacuna, index) in item">
                            <v-card
                              v-if="vacuna.acepta_vacuna"
                              :key="index"
                              class="mt-2 mx-auto"
                              outlined
                            >
                              <v-list-item three-line>
                                <v-list-item-content v-if="vacuna.acepta_vacuna">
                                  <div class="text-overline mb-0">
                                    <b>{{ vacuna.biologico_persona ? vacuna.biologico_persona.nombre : ''}}</b>
                                  </div>
                                  <v-list-item-subtitle class="text-h5 pb-3">
                                    <b>Lote: </b> {{ `${vacuna.lote_biologico ? vacuna.lote_biologico : ''}` }}
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle>
                                    <b>Poblacion: </b>{{ vacuna.poblacion ? `${vacuna.poblacion.codigo} ${vacuna.poblacion.descripcion}` : '' }}
                                  </v-list-item-subtitle>
                                  <v-row>
                                    <v-col cols="6" sm="12" md="6">
                                      <v-list-item-subtitle>
                                        <b>Fecha aplicacion: </b>{{ `${vacuna.fecha_aplicacion ? vacuna.fecha_aplicacion : ''}` }}
                                      </v-list-item-subtitle>

                                    </v-col>
                                    <v-col cols="6" sm="12" md="6">
                                      <v-list-item-subtitle>
                                        <b>Etapa: </b>{{ `${vacuna.etapa ? vacuna.etapa : ''}` }}
                                      </v-list-item-subtitle>

                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="6" sm="12" md="6">
                                      <v-list-item-subtitle>
                                        <b>Tipo dosis: </b>{{ `${vacuna.tipo_dosis_persona ? vacuna.tipo_dosis_persona.nombre : ''}` }}
                                      </v-list-item-subtitle>

                                    </v-col>
                                    <v-col cols="6" sm="12" md="6">
                                      <v-list-item-subtitle>
                                        <b>Estrategia: </b>{{ `${vacuna.estrategia_vacunacion ? vacuna.estrategia_vacunacion : ''}` }}
                                      </v-list-item-subtitle>
                                    </v-col>
                                  </v-row>
                                  <v-list-item-subtitle class="pb-3">
                                    <b>Eventos atribuidos: </b>{{ `${vacuna.eventos_atribuidos ? vacuna.eventos_atribuidos : ''}` }}
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle>
                                    <b>Observaciones: </b>{{ `${vacuna.observacion ? vacuna.observacion : ''}` }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-content v-else>
                                  <v-list-item-subtitle class="pb-5">
                                    <b>No acepta Vacuna</b>
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle>
                                    <b>Motivo desistimiento: </b>{{ `${vacuna.motivo_disistimiento ? vacuna.motivo_disistimiento : ''}` }}
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle>
                                    <b>Observaciones: </b>{{ `${vacuna.observacion ? vacuna.observacion : ''}` }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-avatar>
                                  <v-icon :color="vacuna.acepta_vacuna ? 'green' : 'red'">fas fa-syringe</v-icon>
                                </v-list-item-avatar>
                              </v-list-item>
                              <v-row class="mx-2" align="center" justify="end">
                                <span class="caption grey--text">Fecha creacion: {{ vacuna.created_at ? moment(vacuna.created_at).format('DD/MM/YYYY HH:mm') : '-' }}</span>
                              </v-row>
                              <v-row class="mx-2" align="center" justify="end">
                                <span class="caption grey--text">Fecha actualizacion: {{ vacuna.updated_at ? moment(vacuna.updated_at).format('DD/MM/YYYY HH:mm') : '-' }}</span>
                              </v-row>
                            </v-card>
                          </template>
                        </v-list>
                        <span v-else>No registra vacunas efectivas</span>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <app-section-loader :status="loading" />
      <vacunas-fallidas
          ref="vacunasFallidas"
      ></vacunas-fallidas>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import models from "Views/covid19/vacunacionSucre/models";
const vacunasFallidas = () => import("./VacunasFallidasComponent")

export default {
  name: "DetalleReferencia",
  components: {
    vacunasFallidas
  },
  data: () => ({
    loading: false,
    dialog: false,
    item: [],
    loadingButton: false,
    loadingButton1: false,
  }),
  computed: {
    ...mapGetters(["municipiosTotal", "tiposDocumentoIdentidad"]),
  },
  methods: {
    fallidas(){
      this.$refs.vacunasFallidas.open(this.item.filter(x => !x.acepta_vacuna))
    },
    open(item = null) {
      this.dialog = true;
      if (item) {
        this.getItem(item.identificacion);
      } else {
        this.item = this.clone(models.vacunacionSucre);
      }
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.$emit("close");
      this.item = [];
    },
    getItem(identificacion) {
      this.loading = true;
      this.axios
        .get(`dosis-aplicadas-persona/${identificacion}`)
        .then((response) => {
          this.item = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$store.commit("snackbar", {
            color: "error",
            message: `al recuperar el registro de la referencia.`,
            error: error,
          });
        });
    },
  },
};
</script>

<style>
.mh-30 {
  min-height: 30px !important;
}
</style>