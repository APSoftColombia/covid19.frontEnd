<template>
  <div>
    <div>
      <div id="mydiv" style="position: fixed !important;">
        <div>
          <div id="mydivheader">
            <v-icon left>mdi-arrow-all</v-icon>
            Mover Ventana
          </div>
          <v-toolbar dense color="green" dark>
            <v-toolbar-title>
              <v-icon left>fas fa-video</v-icon>
              Videollamada en Linea
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn
                    icon
                    class="mr-2"
                    :loading="loading"
                    v-on="on"
                    dark
                    @click.stop="abrirPestaña()"
                >
                  <template>
                    <v-icon>fas fa-external-link-alt</v-icon>
                  </template>
                </v-btn>
              </template>
              <span>Abrir en Pestaña Independiente</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-btn
                    icon
                    :loading="loading"
                    v-on="on"
                    dark
                    @click.stop="cerrarVideo()"
                >
                  <template>
                    <v-icon>mdi-close</v-icon>
                  </template>
                </v-btn>
              </template>
              <span>Cerrar Videollamada</span>
            </v-tooltip>
          </v-toolbar>
          <div
              style="resize: both !important; overflow: hidden !important; min-width: 400px !important; width: 500px !important;">
            <vue-jitsi-meet
                v-if="enlinea && !esMovil && !loading"
                ref="jitsiRef"
                domain="meet.jit.si"
                :options="jitsiOptions"
            ></vue-jitsi-meet>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {JitsiMeet} from '@mycure/vue-jitsi-meet'
import {mapState} from 'vuex'

export default {
  mounted() {
    dragElement(document.getElementById("mydiv"));

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  },
  name: 'JitsiMeet',
  props: {
    enlinea: {
      type: Object,
      default: null
    }
  },
  components: {
    VueJitsiMeet: JitsiMeet
  },
  data: (vm) => ({
    loading: true,
    jitsiOptions: {
      roomName: null,
      noSSL: false,
      userInfo: {
        email: null,
        displayName: null,
      },
      configOverwrite: {
        enableNoisyMicDetection: true
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_CHROME_EXTENSION_BANNER: false
      },
      onload: vm.onIFrameLoad
    }
  }),
  created() {
    this.jitsiOptions.roomName = this.enlinea.room
    this.jitsiOptions.userInfo.email = this.user.email
    this.jitsiOptions.userInfo.displayName = this.user.name
    if (this.esMovil) {
      this.abrirPestaña()
    }
    this.loading = false
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    })
  },
  methods: {
    onIFrameLoad() {
      this.$emit('cargado', true)
    },
    abrirPestaña() {
      let win = window.open(this.enlinea.link,'_blank')
      win.focus()
      this.cerrarVideo()
    },
    cerrarVideo () {
      if (this.$refs && this.$refs.jitsiRef) this.$refs.jitsiRef.$destroy()
      this.$emit('cerrar', true)
    }
  }
}
</script>

<style>
#mydiv {
  position: absolute;
  z-index: 9;
  background-color: #f1f1f1;
  text-align: center;
  border: 1px solid #d3d3d3;
}

#mydivheader {
  padding: 10px;
  cursor: move;
  z-index: 10;
  background-color: #2196F3;
  color: #fff;
}
</style>