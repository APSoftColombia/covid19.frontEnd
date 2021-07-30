<template>
  <seguimiento
      ref="seguimientoG"
      @change="actualizaGlobal"
  ></seguimiento>
</template>

<script>
import {mapGetters} from 'vuex'
const Seguimiento = () => import('Views/covid19/tamizaje/Seguimiento')
export default {
  name: 'SeguimientoGlobal',
  components: {
    Seguimiento
  },
  computed: {
    ...mapGetters([
      'enSeguimientoGlobal'
    ])
  },
  watch: {
    enSeguimientoGlobal: {
      handler (val) {
        if (val) this.open(this.$store.state.settings.tamizajeIdSeleccionado)
      },
      immediate: false
    }
  },
  methods: {
    open(id) {
      this.$refs.seguimientoG.open(id)
    },
    actualizaGlobal() {
      this.$store.commit('actualizaGlobal')
    }
  }
}
</script>

<style scoped>

</style>