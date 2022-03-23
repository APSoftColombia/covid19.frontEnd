<template>
  <v-dialog
      max-width="400"
      scrollable
      persistent
      eager
      v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <c-tooltip
          tooltip="Alerta de solicitudes pendientes"
          left
      >
        <v-badge
            overlap
            offset-x="25"
            offset-y="25"
            color="warning darken-2"
            :content="news.length"
            :value="!!news.length"
            class="badgeok"
        >
          <v-btn
              :color="color"
              v-bind="attrs"
              v-on="on"
              icon
              x-large
          >
            <v-icon :class="notificar ? 'bell' : ''" large>mdi-bell-{{notificar ? 'ring' : 'alert'}}</v-icon>
          </v-btn>
        </v-badge>
      </c-tooltip>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar
            :color="color"
            dark
            class="title"
        >
          <v-icon class="mr-2" :class="notificar ? 'bell' : ''" large>mdi-bell-{{notificar ? 'ring' : 'alert'}}</v-icon>
          solicitudes pendientes
        </v-toolbar>
        <v-card-text>
          <h3 class="px-4 pt-6 text-center">
            {{ notificar ? 'Hay nuevos registros pendientes por atención.' : 'No hay nuevos registros.'}}
          </h3>
          <alerta-solicitudes-content
              :news="news"
              :news-notificar="newsNotificar"
              :notificar="notificar"
              @seleccionar="val => $emit('seleccionar', val)"
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
              @click="close"
          >
            Cerrar
          </v-btn>
          <v-btn
              v-if="notificar"
              color="primary"
              @click="aceptar"
          >Notificado</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import {mapState} from 'vuex'
import AlertaSolicitudesContent from './AlertaSolicitudesContent'
var intervalo
export default {
  name: 'AlertaSolicitudes',
  components: {AlertaSolicitudesContent},
  data:() => ({
    click: false,
    dialog: false,
    color: 'grey lighten-1'
  }),
  computed: {
    ...mapState({
      news: state => state.centroReguladorPersist.ref_nuevasRerefencias,
      notificar: state => state.centroReguladorPersist.ref_showAlert,
      newsNotificar: state => state.centroReguladorPersist.ref_nuevasNotificar
    })
  },
  watch: {
    news: {
      handler(val) {
        if(val && val.length) {
          this.color = 'warning'
        } else {
          this.color = 'grey lighten-1'
        }
      },
      immediate: true
    },
    'newsNotificar.length': {
      handler(val) {
        console.log('val entra ', val)
        if(!val) {
          this.aceptar()
        }
      },
      immediate: false
    },
    notificar: {
      handler(val) {
        if(val) {
          this.$emit('notificar')
          this.dialog = true
        }
      },
      immediate: true
    },
  },
  created() {
    this.getNews()
    intervalo = setInterval(() => {
      this.getNews()
    }, 10000)
  },
  destroyed() {
    clearInterval(intervalo)
  },
  methods: {
    aceptar() {
      this.$store.commit('notificadoNuevasReferencias')
    },
    close() {
      this.dialog = false
    },
    getNews() {
      this.$store.dispatch('getNuevasReferencias')
    }
  }
}
</script>

<style>
.badgeok>.v-badge__wrapper>.v-badge__badge {
  z-index: -10!important;
}
</style>

<style scoped lang="scss">
.bell{
  display:block;
  width: 40px;
  height: 40px;
  font-size: 40px;
  //margin:50px auto 0;
  color: #9e9e9e;
  -webkit-animation: ring 5s .7s ease-in-out infinite;
  -webkit-transform-origin: 50% 4px;
  -moz-animation: ring 5s .7s ease-in-out infinite;
  -moz-transform-origin: 50% 4px;
  animation: ring 5s .7s ease-in-out infinite;
  transform-origin: 50% 4px;
}

@-webkit-keyframes ring {
  0% { -webkit-transform: rotateZ(0); }
  1% { -webkit-transform: rotateZ(30deg); }
  3% { -webkit-transform: rotateZ(-28deg); }
  5% { -webkit-transform: rotateZ(34deg); }
  7% { -webkit-transform: rotateZ(-32deg); }
  9% { -webkit-transform: rotateZ(30deg); }
  11% { -webkit-transform: rotateZ(-28deg); }
  13% { -webkit-transform: rotateZ(26deg); }
  15% { -webkit-transform: rotateZ(-24deg); }
  17% { -webkit-transform: rotateZ(22deg); }
  19% { -webkit-transform: rotateZ(-20deg); }
  21% { -webkit-transform: rotateZ(18deg); }
  23% { -webkit-transform: rotateZ(-16deg); }
  25% { -webkit-transform: rotateZ(14deg); }
  27% { -webkit-transform: rotateZ(-12deg); }
  29% { -webkit-transform: rotateZ(10deg); }
  31% { -webkit-transform: rotateZ(-8deg); }
  33% { -webkit-transform: rotateZ(6deg); }
  35% { -webkit-transform: rotateZ(-4deg); }
  37% { -webkit-transform: rotateZ(2deg); }
  39% { -webkit-transform: rotateZ(-1deg); }
  41% { -webkit-transform: rotateZ(1deg); }

  43% { -webkit-transform: rotateZ(0); }
  100% { -webkit-transform: rotateZ(0); }
}

@-moz-keyframes ring {
  0% { -moz-transform: rotate(0); }
  1% { -moz-transform: rotate(30deg); }
  3% { -moz-transform: rotate(-28deg); }
  5% { -moz-transform: rotate(34deg); }
  7% { -moz-transform: rotate(-32deg); }
  9% { -moz-transform: rotate(30deg); }
  11% { -moz-transform: rotate(-28deg); }
  13% { -moz-transform: rotate(26deg); }
  15% { -moz-transform: rotate(-24deg); }
  17% { -moz-transform: rotate(22deg); }
  19% { -moz-transform: rotate(-20deg); }
  21% { -moz-transform: rotate(18deg); }
  23% { -moz-transform: rotate(-16deg); }
  25% { -moz-transform: rotate(14deg); }
  27% { -moz-transform: rotate(-12deg); }
  29% { -moz-transform: rotate(10deg); }
  31% { -moz-transform: rotate(-8deg); }
  33% { -moz-transform: rotate(6deg); }
  35% { -moz-transform: rotate(-4deg); }
  37% { -moz-transform: rotate(2deg); }
  39% { -moz-transform: rotate(-1deg); }
  41% { -moz-transform: rotate(1deg); }

  43% { -moz-transform: rotate(0); }
  100% { -moz-transform: rotate(0); }
}

@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(30deg); }
  3% { transform: rotate(-28deg); }
  5% { transform: rotate(34deg); }
  7% { transform: rotate(-32deg); }
  9% { transform: rotate(30deg); }
  11% { transform: rotate(-28deg); }
  13% { transform: rotate(26deg); }
  15% { transform: rotate(-24deg); }
  17% { transform: rotate(22deg); }
  19% { transform: rotate(-20deg); }
  21% { transform: rotate(18deg); }
  23% { transform: rotate(-16deg); }
  25% { transform: rotate(14deg); }
  27% { transform: rotate(-12deg); }
  29% { transform: rotate(10deg); }
  31% { transform: rotate(-8deg); }
  33% { transform: rotate(6deg); }
  35% { transform: rotate(-4deg); }
  37% { transform: rotate(2deg); }
  39% { transform: rotate(-1deg); }
  41% { transform: rotate(1deg); }

  43% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
</style>