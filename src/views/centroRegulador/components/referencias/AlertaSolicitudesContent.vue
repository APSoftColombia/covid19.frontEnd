<template>
  <div v-if="news && news.length">
    <v-subheader>Pacientes</v-subheader>
    <v-list dense>
      <v-list-item
          v-for="(paciente, indexNew) in news"
          :key="`paciente${indexNew}`"
          @click="$emit('seleccionar', paciente.id)"
      >
        <v-list-item-content>
          <v-list-item-subtitle>
            <v-badge
                overlap
                offset-x="10"
                offset-y="10"
                color="error"
                dot
                :value="!!newsNotificar.find(x => x === paciente.id)"
            >
              <v-chip
                  color="primary"
                  label
                  small
              >
                {{ paciente.id }}
              </v-chip>
            </v-badge>
            {{ paciente.paciente }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
const audio = new Audio(`${process.env.BASE_URL}files/sounds/telephone.mp3`)
audio.setAttribute('loop',true)

import push from 'push.js'
export default {
  name: 'AlertaSolicitudesContent',
  props: {
    news: {
      type: Array,
      default: () => []
    },
    newsNotificar: {
      type: Array,
      default: () => []
    },
    notificar: {
      type: Boolean,
      default: false
    }
  },
  data:() => ({
    click: false,
    dialog: false,
    color: 'grey lighten-1'
  }),
  watch: {
    notificar: {
      handler(val) {
        if(val) {
          audio.play()
          push.create(
              'Nuevas Solicitudes en centro de referencia',
              {
                body: `Hay ${this.news.length} solicitudes de referencia pendientes por atención.`,
                icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/1024px-OOjs_UI_icon_alert-yellow.svg.png',
                onClick: function () {
                  this.close()
                }
              }
          )
        } else {
          audio.load()
        }
      },
      immediate: true
    }
  },
  destroyed() {
    audio.load()
  },
}
</script>
