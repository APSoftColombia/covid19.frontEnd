<template>
  <v-tooltip
      v-if="obj"
      top
  >
    <template v-slot:activator="{on}">
      <v-btn
          v-on="on"
          :color="color"
          :class="`${textColor}--text`"
          @click="$emit('click', obj)"
      >
        {{ obj.text }}
      </v-btn>
    </template>
    <span>{{ obj.nombre }}</span>
  </v-tooltip>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'BotonClasificacion',
  props: {
    clasificacion: {
      type: String,
      Default: null
    },
    version: {
      type: Number,
      Default: 1
    },
    confirmado: {
      type: Number,
      Default: 0
    },
    color: {
      type: String,
      Default: undefined
    },
    textColor: {
      type: String,
      Default: 'white'
    }
  },
  computed: {
    ...mapGetters([
      'clasificacionesCovid'
    ])
  },
  data: () => ({
    obj: null
  }),
  watch: {
    'clasificacion': {
      handler(val) {
        val && this.searchClasificacion()
      },
      immediate: true
    },
    'version': {
      handler(val) {
        val && this.searchClasificacion()
      },
      immediate: true
    },
    'confirmado': {
      handler(val) {
        val && this.searchClasificacion()
      },
      immediate: true
    }
  },
  methods: {
    searchClasificacion() {
      if (this.clasificacionesCovid) {
        if (this.clasificacion === '6') {
          this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion)
        } else if (this.version === 1) {
          this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion && x.version === this.version)
        } else if (this.version === 2) {
          this.obj = this.clasificacionesCovid.find(x => x.id === this.clasificacion && x.version === this.version && x.text.includes(this.confirmado ? 'CC' : 'CP'))
        }
      }
    }
  }
}
</script>
