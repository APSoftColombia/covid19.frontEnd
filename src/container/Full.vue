<!-- App Main Structure -->
<template>
  <div class="app-default-layout">
    <template v-if="loading">
      <rotate-square2/>
    </template>
    <template v-else>
      <!-- App Header -->
<!--      <app-header/>-->
      <!-- App Main Content -->
      <v-content>
        <v-expand-transition>
          <v-alert
              v-if="reloadComplementos"
              dense
              prominent
              tile
              type="error"
              style="z-index: 1 !important;"
              class="mb-0"
          >
            <v-row align="center">
              <v-col class="grow py-0">
                Se requiere realizar la descarga de ajustes generales.
              </v-col>
              <v-col class="shrink my-0 py-0">
                <v-btn @click="getComplementos">
                  <v-icon left>fas fa-download</v-icon>
                  Descargar ahora
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-expand-transition>
        <v-expand-transition>
          <v-alert class="mt-4" dense color="error" v-if="(user && user.change_password_needed) || (user && user.password_will_expired_on !== null)">
            <v-row align="center" class="white--text">
              <v-col cols="8">
                <v-icon left>fas fa-exclamation-triangle</v-icon>
                {{ user.password_will_expired_on !== null ? user.password_will_expired_on : 'Para inciar a usar el sistema, por favor, cambie su contraseña.' }}
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="shrink">
                <v-btn
                    class="black white--text"
                    @click="$refs.dialogChangePassword.open(true)"
                >Cambiar contraseña</v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-expand-transition>
        <v-expand-transition>
          <v-alert
              v-if="message && moment().format('YYYY-MM-DD') === '2020-12-03'"
              color="primary"
              icon="mdi-medal"
              border="bottom"
              dark
              prominent
          >
            <v-list-item class="pa-0">
              <v-list-item-content class="pa-0">
                <v-list-item-title class="title">
                  Feliz día del Médico, por su dedicación, sacrificio y heroísmo, Gracias.
                </v-list-item-title>
                <v-list-item-subtitle class="title">
                  Son los deseos de la familia Sosalud-Apsoft
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                    icon
                    @click="message = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-alert>
        </v-expand-transition>
        <!-- App Router -->
        <transition name="router-anim" :enter-active-class="`animated ${selectedRouterAnimation}`">
          <router-view></router-view>
        </transition>
      </v-content>
    </template>
    <v-dialog v-model="inactividad" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Aviso
        </v-card-title>
        <v-card-text>Sera redireccionado a la pagina de inicio de sesion, debido a inactividad por un periodo de tiempo.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="logoutUser">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <change-password ref="dialogChangePassword"/>
    <seguimiento-global/>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
// import Header from 'Components/Header/Header.vue'
import {store} from '../store/store'

export default {
  data() {
    return {
      message: true,
      constF5: false,
      loading: true,
      inactividad: false,
    }
  },
  components: {
    // appHeader: Header,
    SeguimientoGlobal: () => import('Views/covid19/tamizaje/SeguimientoGlobal'),
    ChangePassword: () => import('../components/Header/ChangePassword.vue')
  },
  computed: {
    ...mapGetters([
      'selectedRouterAnimation',
      'reloadComplementos',
      'rF5',
      'datosEmpresa'
    ]),
    isIdle() {
			return this.$store.state.idleVue.isIdle
		},
    ...mapState({
      user: state => state.auth.user
    })
  },
  watch: {
    'reloadComplementos': {
      handler(val) {
        if (val) {
          this.$store.dispatch('getReloadFirebase')
        }
      },
      immediate: false
    },
    'rF5': {
      handler(val) {
        console.log('this.getF5 watch xxxx', val)
      },
      immediate: true
    },
    isIdle: {
      handler(val){
        if(val) {
          this.$store.commit('InactivitylogoutUser', this.$router)
          this.inactividad = true
        }
      }
    }
  },
  beforeCreate() {
    store.dispatch('getDatosEmpresa').then(response => {
      if (response) {
        store.dispatch('getReloadFirebase')
        store.dispatch('reloadOnline')
        store.dispatch('getAjustesGenerales')
        if (this.datosEmpresa.aps_activo === '1') {
          store.dispatch('getComplementosRCV')
        }
      }
    })
    store.commit('assignEncuestaEnCurso', false)
    store.dispatch('reloadUsuario')
  },
  created() {
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  methods: {
    getComplementos() {
      this.$store.dispatch('reloadStorage')
    },
    logoutUser() {
      this.inactividad = false
      this.$router.push({name: 'Login'})
    }
  }
}
</script>

<style>
.app-default-layout {
  height: 100vh
}

.white-space-normal {
  white-space: normal !important;
}
</style>
