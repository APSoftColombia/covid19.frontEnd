<template>
  <v-container fluid>
    <page-title-bar title="Herramientas de Gestión"/>
    <v-row>
      <v-col
          v-if="permisos.herramientasGestion.lanzarAlertaActualizacion"
          cols="12"
      >
        <v-card>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar color="red">
                <v-icon color="white">mdi-alert-circle-check</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Alerta de Actualizaciones</v-list-item-title>
                <v-list-item-subtitle>
                  Lanzamiento de alerta de actualización de datos y/o desarrollo, para todos los usuarios del proyecto.
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        x-large
                        color="primary"
                        @click.stop="setAlerta"
                        v-on="on"
                        :loading="loadingAlerta"
                    >
                      <v-icon x-large>mdi-reload-alert</v-icon>
                    </v-btn>
                  </template>
                  <span>Lanzar Alerta</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col
          cols="12"
          v-if="permisos.importadores.crear"
      >
        <v-card>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar color="primary">
                <v-icon color="white">mdi-auto-fix</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Creacion y Configuracion de cargadores</v-list-item-title>
                <v-list-item-subtitle>
                  Crea y configura los elementos necesarios para un Cargador masivo de informacion
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        x-large
                        color="primary"
                        @click.stop="openConfigCargador"
                        v-on="on"
                    >
                      <v-icon>mdi-hexagon-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Explorar</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <configuracion-cargador ref="configCargador"/>
    </v-row>
  </v-container>
</template>

<script>
const ConfiguracionCargador = () => import('Views/herramientasGestion/ConfiguracionCargador')
export default {
  name: 'HerramientasGestion',
  components: {
    ConfiguracionCargador
  },
  data: () => ({
    loadingAlerta: false,
  }),
  computed: {
    permisos() {
      return {
        importadores: this.$store.getters.getPermissionModule('importadores'),
        herramientasGestion: this.$store.getters.getPermissionModule('herramientasGestion')
      }
    }
  },
  methods: {
    setAlerta() {
      this.loadingAlerta = true
      this.$store.dispatch('setVersionFirebase').then(() => {
        this.loadingAlerta = false
      })
    },
    openConfigCargador() {
      this.$refs.configCargador.open()
    }
  }
}
</script>