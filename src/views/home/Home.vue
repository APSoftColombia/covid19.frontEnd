<template>
  <v-container
      fluid
      class="py-0"
      style="height: 100% !important; background-color: white"
  >
    <v-row
        style="height: 100% !important;"
        justify="center"
        align="center"
    >
      <v-card
          flat
          class="transparent"
      >
        <v-responsive :aspect-ratio="16/9">
          <v-img
              v-if="url"
              :src="url"
          />
        </v-responsive>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  data: () => ({
    loading: false,
    url: null
  }),
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapGetters([
      'datosEmpresa'
    ])
  },
  mounted() {
    if (this.datosEmpresa) {
      this.url = this.datosEmpresa?.imagen_inicio === 'logoSucre.png'
          ? `/static/logos/aspect16-9/${this.user?.tipo_cliente_id}${this.datosEmpresa?.imagen_inicio}`
          : `/static/logos/aspect16-9/${this.datosEmpresa?.imagen_inicio}`
    }
  }
}
</script>
