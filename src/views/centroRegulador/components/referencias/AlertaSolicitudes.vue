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
        <v-btn
            :color="color"
            v-bind="attrs"
            v-on="on"
            icon
            x-large
        >
          <v-icon large>mdi-bell-alert</v-icon>
        </v-btn>
      </c-tooltip>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar
            :color="color"
            dark
            class="title"
        >
          <v-icon class="mr-2" large>mdi-bell-alert</v-icon>
          solicitudes pendientes
        </v-toolbar>
        <v-card-text>
          <h3 class="px-4 pt-6 text-center">
            {{ notificar ? 'Hay nuevos registros pendientes por atención.' : 'No hay nuevos registros.'}}
          </h3>
          <alerta-solicitudes-content
              v-if="dialog && news && news.length"
              :news="news"
              :notificar="notificar"
          />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
              color="primary"
              @click="aceptar"
          >Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import {mapState} from 'vuex'
import AlertaSolicitudesContent from './AlertaSolicitudesContent'

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
      notificar: state => state.centroReguladorPersist.ref_showAlert
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
    notificar: {
      handler(val) {
        if(val) {
          this.$emit('notificar')
          this.dialog= true
        }
      },
      immediate: true
    },
  },
  created() {
    this.getNews()
    setInterval(() => {
      this.getNews()
    }, 10000)
  },
  methods: {
    aceptar() {
      this.$store.commit('notificadoNuevasReferencias')
      this.dialog = false
      audio.load()
    },
    getNews() {
      this.$store.dispatch('getNuevasReferencias')
    }
  }
}
</script>
