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
                                  v-for="(dosis, indexDosis) in vacunacion.dosis"
                                  :key="`dosis${indexDosis}`"
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
                <span>Seguimientos</span>
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
      <app-section-loader :status="loading"></app-section-loader>
    </v-card>
  </v-dialog>
</template>

<script>
const DatosPersonales = () => import('Views/covid19/vacunacion/components/DatosPersonales')
import RegistroVacuna from 'Views/covid19/vacunacion/components/RegistroVacuna'
export default {
  name: 'DetalleVacunacion',
  components: {
    DatosPersonales,
    RegistroVacuna
  },
  data: () => ({
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
    changeVacunacion() {
      this.getVacunacion(this.vacunacion.id)
      this.$store.commit('reloadTable', 'tablaVacunacion')
    },
    vacunar() {
      this.$refs.registroVacuna.open()
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