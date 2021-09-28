<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
    <v-card>
      <v-toolbar dark color="primary" v-if="vacunacion">
        <v-icon left> {{ vacunacion.id ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
        <span class="title">Registro de Vacunación No {{vacunacion && vacunacion.id}}</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid v-if="vacunacion">
        <datos-personales :vacunacion="vacunacion"/>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-list dense>
                <v-list-item @click="click = false">
                  <v-list-item-avatar size="42" style="line-height: 12px !important;" class="white--text subtitle-2" :color="vacunacion.discapacidad ? 'teal' : 'grey lighten-2'">
                    <v-icon>mdi-wheelchair-accessibility</v-icon>
                    {{ vacunacion.discapacidad || '' }}
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="title py-1">Tiene Discapacidad</v-list-item-title>
                    <p class="ma-0 subtitle-1">{{ vacunacion.cual_discapacidad }}</p>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = false">
                  <v-list-item-avatar size="42" style="line-height: 12px !important;" class="white--text subtitle-2" :color="vacunacion.puede_desplazarse ? 'teal' : 'grey lighten-2'">
                    <v-icon>mdi-walk</v-icon>
                    {{ vacunacion.puede_desplazarse || '' }}
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="title py-1">Puede Desplazarse a la ESE/IPS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="click = false">
                  <v-list-item-avatar size="42" style="line-height: 12px !important;" class="white--text subtitle-2" :color="vacunacion.intencion_vacuna ? 'teal' : 'grey lighten-2'">
                    <v-icon>mdi-check</v-icon>
                    {{ vacunacion.intencion_vacuna || '' }}
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="title py-1">Tiene Intención de Vacunarse</v-list-item-title>
                    <p class="ma-0 subtitle-1">{{ vacunacion.porque_no_vacuna }}</p>
                  </v-list-item-content>
                </v-list-item>
<!--                <v-list-item @click="click = false">-->
<!--                  <v-list-item-avatar size="42" style="line-height: 12px !important;" class="white&#45;&#45;text subtitle-2" :color="vacunacion.mivacuna ? 'teal' : 'grey lighten-2'">-->
<!--                    {{ vacunacion.mivacuna || '' }}-->
<!--                  </v-list-item-avatar>-->
<!--                  <v-list-item-content>-->
<!--                    <v-list-item-title class="title py-1">Está Registrado en MiVacuna</v-list-item-title>-->
<!--                  </v-list-item-content>-->
<!--                </v-list-item>-->
              </v-list>
            </v-card>
          </v-col>
<!--          <v-col cols="12">-->
<!--            <asignaciones-mivacuna-->
<!--                :vacunacion="vacunacion"-->
<!--                @actualizado="changeVacunacion"-->
<!--            />-->
<!--          </v-col>-->
          <v-col cols="12">
            <v-tabs
              class="mt-3"
              id="tabsSeguimiento"
              v-model="tab"
              fixed-tabs
              center-active
              icons-and-text
              show-arrows
              :color="tab === 'tab-1' ? 'primary' : tab === 'tab-2' ? 'warning' : tab === 'tab-3' ? 'error' : tab === 'tab-4' ? 'deep-purple' : tab === 'tab-5' ? 'indigo' : 'teal'"
            >
              <v-tabs-slider></v-tabs-slider>
              <v-tab
                  href="#tab-1"
              >
                Dosis Aplicadas
                <v-icon>mdi-needle</v-icon>
              </v-tab>
              <v-tab
                  href="#tab-2"
              >
                Seguimientos
                <v-icon>fas fa-notes-medical</v-icon>
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="mt-2" touchless>
              <v-tab-item
                  value="tab-1"
              >
                <v-card>
                  <v-card-title>
                    <v-avatar color="primary" size="40" class="mr-2">
                      <v-icon class="white--text">mdi-needle</v-icon>
                    </v-avatar>
                    Dosis aplicadas
                    <v-tooltip top v-if="vacunacion.novacunados && vacunacion.novacunados.length">
                      <template v-slot:activator="{ on }">
                        <v-btn elevation="0" icon class="ml-3" v-on="on" @click="fallidas">
                          <v-icon color="blue">mdi mdi-alert-box-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Dosis Fallidas</span>
                    </v-tooltip>
                    <v-spacer/>
                    <v-tooltip
                        v-if="permisos.vacunar && (vacunacion && vacunacion.dosis && vacunacion.dosis.length)"
                        left
                    >
                      <template v-slot:activator="{on}">
                        <v-btn
                            v-on="on"
                            fab
                            small
                            color="primary"
                            @click.stop="vacunar"
                            class="white--text"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Registrar Dosis</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-container fluid>
                    <template v-if="vacunacion && vacunacion.dosis && vacunacion.dosis.length">
                      <v-row>
                        <v-col cols="12">
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                              <tr>
                                <th>Fecha</th>
                                <th>IPS/Vacunador</th>
                                <th>Vacuna</th>
                                <th>Usuario</th>
                                <th>Observaciones</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr
                                  v-for="(dosis, indexSeguimiento) in vacunacion.dosis"
                                  :key="`dosis${indexSeguimiento}`"
                              >
                                <td>
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title v-if="dosis.fecha">{{moment(dosis.fecha).format('DD/MM/YYYY')}}</v-list-item-title>
                                    <v-list-item-subtitle v-if="dosis.hora">{{dosis.hora}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <v-list-item-content class="pa-0" v-if="dosis.ips">
                                    <v-list-item-title>{{dosis.ips.nombre}}</v-list-item-title>
                                    <v-list-item-subtitle v-if="dosis.vacunador">{{dosis.vacunador}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <v-list-item-content class="pa-0" v-if="dosis.vacuna">
                                    <v-list-item-title>{{dosis.vacuna.nombre}}</v-list-item-title>
                                    <v-list-item-subtitle>{{dosis.vacuna.laboratorio}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <v-list-item-content class="pa-0" v-if="dosis.user">
                                    <v-list-item-title>{{dosis.user.name}}</v-list-item-title>
                                    <v-list-item-subtitle>{{dosis.user.email}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <div style="white-space: initial !important;">
                                    {{dosis.observaciones}}
                                  </div>
                                </td>
                              </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-else>
                      <v-row justify="center">
                        <div class="subtitle-2 grey--text mb-4">No registra Dosis aplicadas</div>
                      </v-row>
                      <v-row justify="center">
                        <v-tooltip
                            v-if="permisos.vacunar"
                            bottom
                        >
                          <template v-slot:activator="{on}">
                            <v-btn
                                v-on="on"
                                fab
                                large
                                color="primary"
                                @click.stop="vacunar"
                                class="white--text"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>Registrar Dosis</span>
                        </v-tooltip>
                      </v-row>
                    </template>
                  </v-container>
                </v-card>
              </v-tab-item>
              <v-tab-item
                  value="tab-2"
              >
                <v-card>
                  <v-card-title>
                    <v-avatar color="warning" size="40" class="mr-2">
                      <v-icon class="white--text">fas fa-notes-medical</v-icon>
                    </v-avatar>
                    Seguimientos vacunación
                    <v-spacer/>
                    <v-tooltip
                      v-if="permisos.vacunar && (vacunacion && vacunacion.dosis && vacunacion.dosis.length)"
                      left
                    >
                      <template v-slot:activator="{on}">
                        <v-btn
                            v-on="on"
                            fab
                            small
                            color="success"
                            @click.stop="seguimiento"
                            class="white--text"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Registrar Seguimiento</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-container fluid>
                    <template v-if="vacunacion && vacunacion.seguimientos && vacunacion.seguimientos.length">
                      <v-row>
                        <v-col cols="12">
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                              <tr>
                                <th>Vacunacion Efectiva</th>
                                <th>Agendo 2da Dosis</th>
                                <th>Fecha 2da Dosis</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr
                                  v-for="(seguimiento, indexSeguimiento) in vacunacion.seguimientos"
                                  :key="`seguimiento${indexSeguimiento}`"
                              >
                                <td>
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title>{{seguimiento.fue_vacunado ? 'SI' : 'NO'}}</v-list-item-title>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title>{{seguimiento.agen_2da_dosis ? 'SI' : 'NO'}}</v-list-item-title>
                                  </v-list-item-content>
                                </td>
                                <td>
                                  <v-list-item-content class="pa-0">
                                    <v-list-item-title v-if="seguimiento.fecha_2da_dosis">{{moment(seguimiento.fecha_2da_dosis).format('DD/MM/YYYY')}}</v-list-item-title>
                                    <v-list-item-title v-else>Sin fecha definida</v-list-item-title>
                                  </v-list-item-content>
                                </td>
                              </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-else>
                      <v-row justify="center">
                        <div class="subtitle-2 grey--text mb-4">No registra ningun seguimiento</div>
                      </v-row>
                      <v-row justify="center">
                        <v-tooltip
                            v-if="permisos.seguimiento"
                            bottom
                        >
                          <template v-slot:activator="{on}">
                            <v-btn
                                v-on="on"
                                fab
                                large
                                color="primary"
                                @click.stop="vacunar"
                                class="white--text"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>Registrar Seguimiento</span>
                        </v-tooltip>
                      </v-row>
                    </template>
                  </v-container>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
      <registro-vacuna
          :vacunacion="vacunacion"
          ref="registroVacuna"
          @guardado="changeVacunacion"
      />
      <registro-seguimiento
          :vacunacion="vacunacion"
          ref="registroSeguimiento"
          @guardadoSeguimiento="changeSeguimiento"
      />
      <vacunas-fallidas
          ref="vacunasFallidas"
      ></vacunas-fallidas>
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
const DatosPersonales = () => import('Views/covid19/vacunacion/components/DatosPersonales')
// import AsignacionesMivacuna from 'Views/covid19/vacunacion/components/detalleVacunacion/AsignacionesMivacuna'
import RegistroVacuna from 'Views/covid19/vacunacion/components/RegistroVacuna'
import RegistroSeguimiento from 'Views/covid19/vacunacion/components/RegistroSeguimiento'
import VacunasFallidas from 'Views/covid19/vacunacion/components/VacunasFallidas'
export default {
  name: 'DetalleVacunacion',
  components: {
    // AsignacionesMivacuna,
    DatosPersonales,
    RegistroVacuna,
    VacunasFallidas,
    RegistroSeguimiento
  },
  data: () => ({
    click: false,
    dialog: false,
    loading: false,
    vacunacion: null,
    tab: null
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('covidVacunacion')
    }
  },
  methods: {
    open(vacunacion = null) {
      if (vacunacion) {
        this.getVacunacion(vacunacion.id)
        this.dialog = true
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.loading = false
        this.vacunacion = null
      }, 500)
    },
    changeSeguimiento() {
      this.getVacunacion(this.vacunacion.id)
      this.$store.commit('reloadTable', 'tablaVacunacion')
    },
    changeVacunacion() {
      this.getVacunacion(this.vacunacion.id)
      this.$store.commit('reloadTable', 'tablaVacunacion')
    },
    seguimiento() {
      this.$refs.registroSeguimiento.open()
    },
    vacunar() {
      this.$refs.registroVacuna.open()
    },
    fallidas(){
      this.$refs.vacunasFallidas.open(this.vacunacion.novacunados)
    },
    getVacunacion(id) {
      this.loading = true
      this.axios.get(`vacunaciones/${id}`).then(response => {
        this.vacunacion = response.data
        this.loading = false
      }).catch(error => {
        this.$store.commit('snackbar', {
          color: 'error',
          message: `al recuperar el registro de vacunación`,
          error: error
        })
        this.close()
      })
    }
  }
}
</script>

<style scoped>

</style>