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


const button = document.createElement('button')
button.addEventListener('click', function(){
  audio.play()
}, false)



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
  mounted() {
    console.log('se crea')
    audio.play()
  },
  methods: {
    disparar() {
      button.click()
    }
  }
}
</script>
