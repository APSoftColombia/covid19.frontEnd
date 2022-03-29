<template>
  <v-tooltip top v-if="show">
    <template v-slot:activator="{on}">
      <v-btn
          :loading="videollamada.loading"
          v-on="on"
          dark
          :block="block"
          color="grey"
          @click.stop="generarEnlace()"
      >
        <template>
          <v-icon left>fas fa-video-slash</v-icon>
          Enviar enlace de Videollamada
          <v-icon right>fas fa-paper-plane</v-icon>
        </template>
      </v-btn>
    </template>
    <span>Enviar Enlace de Videollamada</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'JitsiMeetButton',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    block: {
      type: Boolean,
      default: false
    },
    tamizaje: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    videollamada: {
      loading: false,
      link: null,
      room: null,
      confirmado: false
    }
  }),
  methods: {
    generarEnlace () {
      if (!this.videollamada.confirmado) {
        this.videollamada.loading = true
        this.videollamada.room =  this.tamizaje.id + this.$uuid.v1()
        this.videollamada.link =  'https://meet.jit.si/' + this.videollamada.room
        this.axios.post(`send-videocall-link/${this.tamizaje.id}`, {link: this.videollamada.link})
            .then(() => {
              this.videollamada.confirmado = true
              this.videollamada.loading = false
              this.$emit('enlinea', this.videollamada)
            })
            .catch(error => {
              this.videollamada.loading = false
              this.$store.commit('snackbar', {color: 'error', message: `al enviar la invitación para la videollamada.`, error: error})
            })
      } else {
        this.$emit('enlinea', this.videollamada)
      }
    }
  }
}
</script>
