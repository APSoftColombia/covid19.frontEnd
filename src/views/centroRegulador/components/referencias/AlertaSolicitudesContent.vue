<template>
  <div>
    <v-subheader>Pacientes</v-subheader>
    <v-list dense>
      <v-list-item
          v-for="(paciente, indexNew) in news"
          :key="`paciente${indexNew}`"
          @click="click = false"
      >
        <v-list-item-content>
          <v-list-item-subtitle>
            <v-chip
                color="primary"
                label
                small
            >
              {{ paciente.id }}
            </v-chip>
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
// audio.setAttribute('autoplay',true)
// audio.setAttribute('muted',true)


const button = document.createElement('button')
button.addEventListener('click', function(){
  audio.muted = false
}, false)


import push from 'push.js'
export default {
  name: 'AlertaSolicitudesContent',
  props: {
    news: {
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
        console.log('se crea notificar', val)
        if(val) {
          // audio.play()
        } else {
          // audio.play()
        }
        console.log('se crea watch', audio)
      },
      immediate: true
    }
  },
  mounted() {
    console.log('se crea 1', audio)
    // audio.play()
    // audio.setAttribute('muted',false)
    console.log('se crea2', audio)
    push.create(
        'Nuevas Solicitudes',
        {
          body: `Hay ${this.news.length} solicitudes de referencia pendientes por atención.`,
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/1024px-OOjs_UI_icon_alert-yellow.svg.png'
        }
    )
  },
  methods: {
    disparar() {
      button.click()
    }
  }
}
</script>
