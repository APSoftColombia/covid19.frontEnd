<template>
  <v-container fluid>
    <page-title-bar title="Formularios">
      <template slot="actions">
        <v-btn
            color="primary"
            @click="$router.push({name: 'NuevoFormulario'})"
        >
          <v-icon left>mdi-plus</v-icon>
          Crear Formulario
        </v-btn>
      </template>
    </page-title-bar>
    <v-row>
      <template v-for="(formulario, indexForm) in formularios">
        <v-col
            :key="indexForm"
            cols="12"
            sm="6"
            md="4"
            lg="3"
        >
          <v-card>
            <v-tooltip top v-if="onLine">
              <template v-slot:activator="{ on }">
                <v-btn
                    absolute
                    dark
                    fab
                    right
                    small
                    color="error"
                    v-on="on"
                    class="mt-3"
                    @click.stop="eliminarFormulario(formulario)"
                >
                  <v-icon>mdi-delete-forever</v-icon>
                </v-btn>
              </template>
              <span>Eliminar formulario</span>
            </v-tooltip>
            <v-img
                class="white--text align-end"
                height="200px"
                src="data:image/jpeg;base64,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"
            >
              <div style="background-color: rgba(0, 0, 0, 0.3)">
                <div class="text-center display-1">{{ formulario.nombre }}</div>
                <div class="text-center title">{{ formulario.tipo }}</div>
              </div>
            </v-img>
            <v-card-subtitle class="pb-0">
              Inicio: {{ formulario.fecha_inicio }} - Fin: {{ formulario.fecha_fin }}
            </v-card-subtitle>
            <v-card-text class="text--primary">
              <div>{{ formulario.estado }}</div>
            </v-card-text>
            <v-divider class="ma-0"/>
            <v-card-actions>
              <v-btn
                  color="primary"
                  text
                  block
                  :to="{name: 'EditarFormulario', params: {uuid: formulario.uuid }}"
              >
                <v-icon left>far fa-edit</v-icon>
                Editar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <app-section-loader :status="loading"/>
    <confirmation-dialog
        ref="confirmation"
        :heading="dialog.heading"
        :message="dialog.message"
        :loading="dialog.loading"
        color-confirm="error"
        @confirm="confirmDelete"
    />
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Formularios',
  components: {},
  data: () => ({
    loading: false,
    dialog: {
      heading: '',
      message: '',
      loading: false,
      registro: null
    }
  }),
  computed: {
    permisos() {
      return this.$store.getters.getPermissionModule('formulario')
    },
    ...mapGetters([
      'formularios',
      'onLine'
    ])
  },
  created() {
    this.permisos.index && this.getFormularios()
  },
  methods: {
    eliminarFormulario(formulario) {
      this.dialog.heading = 'Eliminar formulario'
      this.dialog.registro = this.clone(formulario)
      this.dialog.message = `El formulario <strong>${this.dialog.registro.nombre}</strong> será eliminado.`
      this.$refs.confirmation.open()
    },
    confirmDelete() {
      this.dialog.loading = true
      this.$store.dispatch('eliminarFormulario', this.dialog.registro.uuid).then(() => {
        this.dialog.loading = false
        this.$refs.confirmation.close()
      })
    },
    getFormularios() {
      this.loading = true
      this.$store.dispatch('getFormularios').then(response => {
        this.loading = false
        if (!response) this.$router.go(-1)
      })
    }
  }
}
</script>
