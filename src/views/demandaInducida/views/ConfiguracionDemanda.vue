<template>
  <v-container fluid>
    <page-title-bar title="Ajustes Demanda Inducida"/>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-list two-line>
            <v-list-item @click="flag = false">
              <v-list-item-avatar color="green">
                <v-icon color="white">mdi-folder-plus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Nueva campaña</v-list-item-title>
                <v-list-item-subtitle>
                  Importar nueva informacion de afiliados para Demanda inducida como parte de una nueva Campaña
                </v-list-item-subtitle>
              </v-list-item-content>
              <cargador-nueva-campania/>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-list two-line>
            <v-list-item @click="flag = false">
              <v-list-item-avatar color="purple">
                <v-icon color="white">mdi-folder-upload</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Asignar Registros a Gestores</v-list-item-title>
                <v-list-item-subtitle>
                  Importacion de asignacion de afiliados para Demanda inducida a Gestores
                </v-list-item-subtitle>
              </v-list-item-content>
              <cargador-asignacion-gestores/>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-list two-line>
            <v-list-item @click="flag = false">
              <v-list-item-avatar color="orange">
                <v-icon color="white">mdi-checkbox-multiple-marked</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Actualizacion de inasistentes</v-list-item-title>
                <v-list-item-subtitle>
                  Importacion de informacion actualizada de afiliados inasistentes.
                </v-list-item-subtitle>
              </v-list-item-content>
              <cargador-actualizacion-inasistentes/>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const CargadorActualizacionInasistentes = () => import('../components/CargadorActualizacionInasistentes')
const CargadorAsignacionGestores = () => import('../components/CargadorAsignacionGestores')
const CargadorNuevaCampania = () => import('../components/CargadorNuevaCampania')

export default {
  name: 'ConfiguracionDemanda',
  components: {
    CargadorActualizacionInasistentes,
    CargadorAsignacionGestores,
    CargadorNuevaCampania
  }
}
</script>
