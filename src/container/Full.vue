<!-- App Main Structure -->
<template>
  <div class="app-default-layout">
    <template v-if="loading">
      <rotate-square2></rotate-square2>
    </template>
    <template v-else>
      <!-- App Header -->
      <app-header></app-header>
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
              <v-col class="grow py-0" v-if="esMovil">Se requiere cerrar y abrir el navegador, luego realizar la
                descarga de ajustes generales.
              </v-col>
              <v-col class="grow py-0" v-else>Se requiere comando CTRL+F5 y realizar la descarga de ajustes generales.
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
        <!-- App Router -->
        <transition name="router-anim" :enter-active-class="`animated ${selectedRouterAnimation}`">
          <router-view></router-view>
        </transition>
      </v-content>
      <!-- app customizer -->
      <!--			<app-customizer></app-customizer>-->
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Header from 'Components/Header/Header.vue'
import {store} from '../store/store'

export default {
  data() {
    return {
      constF5: false,
      loading: true
    }
  },
  components: {
    appHeader: Header
  },
  computed: {
    ...mapGetters([
      'selectedRouterAnimation',
      'reloadComplementos',
      'rF5',
      'datosEmpresa'
    ])
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
    }
  },
  beforeCreate() {
    store.dispatch('getReloadFirebase')
    store.dispatch('reloadOnline')
    store.dispatch('getDatosEmpresa').then(response => {
      if (response) {
        store.dispatch('getAjustesGenerales')
        if (this.datosEmpresa.aps_activo === '1') {
          console.log('this.datosEmpresa', this.datosEmpresa)
          store.dispatch('getComplementosRCV')
        }
      }
    })
    store.commit('assignEncuestaEnCurso', false)
  },
  created() {
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 2000)
  },
  methods: {
    getComplementos() {
      this.$store.dispatch('reloadStorage')
    }
  }
}
</script>

<style scoped>
.app-default-layout {
  height: 100vh
}
</style>
