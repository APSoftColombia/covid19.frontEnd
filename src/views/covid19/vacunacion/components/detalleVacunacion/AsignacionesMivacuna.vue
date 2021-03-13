<template>
  <div>
    <v-card>
      <v-card-title>
        <v-avatar color="primary" size="40" class="mr-2">
          <v-icon class="white--text" small>fas fa-hospital-user</v-icon>
        </v-avatar>
        Asignación MiVacuna
        <v-spacer/>
        <v-tooltip
            v-if="permisos.gestionarMivacuna && vacunacion.eps_id && getUser.eps_id && (getUser.eps_id === vacunacion.eps_id) && !vacunacion.asignacion"
            left
        >
          <template v-slot:activator="{on}">
            <v-btn
                v-on="on"
                fab
                small
                color="primary"
                @click.stop="asignarMivacuna"
                class="white--text"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Asignar IPS MiVacuna</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text
          class="py-0"
          v-if="!permisos.gestionarMivacuna || !vacunacion.eps_id || !getUser.eps_id || !(getUser.eps_id === vacunacion.eps_id)"
      >
        <v-alert
            :value="true"
            color="warning"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-alert"
        >
          <span>
            {{!permisos.gestionarMivacuna
              ? 'No tiene permisos para gestionar las asignaciones en MiVacuna'
              : !vacunacion.eps_id
                  ? 'La persona no está vinculada a una EPS.'
                  : !getUser.eps_id
                      ? 'El usuario no está vinculado a una EPS.'
                      : !(getUser.eps_id === vacunacion.eps_id)
                          ? 'La Eps de la persona no corresponde a la EPS del usuario.' : ''}}
          </span>
        </v-alert>
      </v-card-text>
      <v-container fluid class="pt-0">
        <template v-if="vacunacion && vacunacion.asignacion">
          <v-row>
            <v-col cols="12">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Prestador</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(asignacion, indexAsignacion) in [vacunacion.asignacion]"
                      :key="`asignacion${indexAsignacion}`"
                  >
                    <td>
                      {{asignacion.ID}}
                    </td>
                    <td>
                      <span v-if="asignacion.FechaRegistro">{{moment(asignacion.FechaRegistro).format('DD/MM/YYYY')}}</span>
                    </td>
                    <td>
                      <v-list-item-content class="pa-0" v-if="asignacion.prestador">
                        <v-list-item-title>{{asignacion.prestador.nombre}}</v-list-item-title>
                        <v-list-item-subtitle>Cód H: {{asignacion.prestador.codigohabilitacion}}</v-list-item-subtitle>
                        <v-list-item-subtitle><v-icon small color="primary">mdi-email</v-icon>{{asignacion.prestador.email}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </td>
                    <td>
                      <v-tooltip
                          v-if="permisos.gestionarMivacuna"
                          left
                      >
                        <template v-slot:activator="{on}">
                          <v-btn
                              v-on="on"
                              fab
                              small
                              color="error"
                              depressed
                              @click.stop="preAnularMivacuna(asignacion)"
                              class="white--text"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </template>
                        <span>Anular Asignación</span>
                      </v-tooltip>
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
            <div class="subtitle-2 grey--text">No registra Asignación en <strong>MiVacuna</strong></div>
          </v-row>
<!--          <v-row justify="center">-->
<!--            <v-tooltip-->
<!--                v-if="permisos.gestionarMivacuna && vacunacion.eps_id && getUser.eps_id && (getUser.eps_id === vacunacion.eps_id)"-->
<!--                bottom-->
<!--            >-->
<!--              <template v-slot:activator="{on}">-->
<!--                <v-btn-->
<!--                    v-on="on"-->
<!--                    fab-->
<!--                    large-->
<!--                    color="primary"-->
<!--                    @click.stop="asignarMivacuna"-->
<!--                    class="white&#45;&#45;text"-->
<!--                >-->
<!--                  <v-icon>mdi-plus</v-icon>-->
<!--                </v-btn>-->
<!--              </template>-->
<!--              <span>Asignar IPS MiVacuna</span>-->
<!--            </v-tooltip>-->
<!--          </v-row>-->
        </template>
      </v-container>
    </v-card>
    <asignacion-mivacuna
        ref="asignacionMivacuna"
        @guardado="val => $emit('actualizado', val)"
    />
    <c-dialog
        ref="cdialog"
        @save="anularMivacuna"
        text-confirm="Anular"
        title="Anular Registro"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import AsignacionMivacuna from 'Views/covid19/vacunacion/components/AsignacionMivacuna'
export default {
name: 'AsignacionesMivacuna',
  props: {
    vacunacion: {
      type: Object,
      default: null
    }
  },
  components: {
    AsignacionMivacuna
  },
  data: () => ({
    seleccionado: null
  }),
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    permisos() {
      return this.$store.getters.getPermissionModule('covidVacunacion')
    }
  },
  methods: {
    asignarMivacuna() {
      this.$refs.asignacionMivacuna.open(this.vacunacion)
    },
    preAnularMivacuna(registro) {
      this.seleccionado = registro
      this.$refs.cdialog.open(`¿Está seguro de anular el registro de asignación en <strong>MiVacuna</strong>?`)
    },
    anularMivacuna() {
      this.axios.delete(`asignacion-mivacuna/${this.seleccionado.id_interno}`).then((response) => {
        this.$refs.cdialog.close()
        this.$store.commit('snackbar', {
          color: 'success',
          message: response.data.message
        })
        this.$emit('actualizado', response.data)
      }).catch(error => {
        this.$refs.cdialog.loading = false
        if(error && error.response && error.response.data && error.response.data.type === 'external-api') {
          let mensaje = `<strong>Error MiVacuna</strong></br>`
          mensaje = mensaje + `${error.response.data.message}.`
          if(error.response.data.errors && error.response.data.errors.length) {
            mensaje = mensaje + '</br></br>'
            error.response.data.errors.forEach((x, i) => {
              mensaje = mensaje + `${i + 1}. ${x}.</br>`
            })
          }
          this.$store.commit('snackbar', {
            color: 'error',
            message: mensaje
          })
        } else {
          this.$store.commit('snackbar', {
            color: 'error',
            message: `al anular el registro en MiVacuna`,
            error: error
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>