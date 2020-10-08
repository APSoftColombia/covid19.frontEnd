<template>
	<v-container fluid>
		<page-title-bar title="Complementos"></page-title-bar>
		<v-row>
      <v-col cols="12" v-if="esSuperAdmin">
        <v-card>
          <v-list two-line>
            <v-list-item @click="flag = false">
              <v-list-item-avatar color="red">
                <v-icon color="white">mdi-alert-plus</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Alerta de Actualizaciones</v-list-item-title>
                <v-list-item-subtitle>Lanzamiento de alerta de actualización de datos y/o desarrollo, para todos los usuarios del proyecto.</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon x-large color="primary" @click.stop="setAlerta" v-on="on" :loading="loadingAlerta">
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
			<v-col cols="12">
				<v-card>
					<v-list two-line>
						<v-list-item @click="flag = false">
							<v-list-item-avatar color="warning">
								<v-icon color="white">mdi-format-list-bulleted-square</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Ajustes generales</v-list-item-title>
								<v-list-item-subtitle>Descarga de departamentos y municipios, Tipos de ERP, Tipos de documento de identidad, tipos de evolución, listado de clasificiones, listado de ordenes médicas</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-tooltip left>
									<template v-slot:activator="{ on }">
										<v-btn icon x-large color="primary" @click.stop="getAjustesGenerales" v-on="on" :loading="loadingGenerales">
											<v-icon>fas fa-download</v-icon>
										</v-btn>
									</template>
									<span>Descargar ajustes generales</span>
								</v-tooltip>
							</v-list-item-action>
						</v-list-item>
					</v-list>
				</v-card>
			</v-col>
			<v-col cols="12" v-if="esSuperAdmin || esCovidAdmin">
				<v-card>
					<v-list two-line>
						<v-list-item @click="flag = false">
							<v-list-item-avatar color="green">
								<v-icon color="white">fas fa-file-csv</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Carga Masiva de Registros</v-list-item-title>
								<v-list-item-subtitle>Carga masiva de registros para la generación de estadísticas mediante archivo plano.</v-list-item-subtitle>
							</v-list-item-content>
							<v-tooltip left>
								<template v-slot:activator="{ on }">
									<v-btn icon x-large color="green" :href="`/static/files/Plantilla_cargue_masivo_pruebas.xlsx`" v-on="on">
										<v-icon>mdi-file-table</v-icon>
									</v-btn>
								</template>
								<span>Descargar plantilla</span>
							</v-tooltip>
							<cargador-seguimientos></cargador-seguimientos>
						</v-list-item>
					</v-list>
				</v-card>
			</v-col>
      <v-col cols="12" v-if="esSuperAdmin || esCovidAdmin">
        <v-card>
          <v-list two-line>
            <v-list-item @click="flag = false">
              <v-list-item-avatar color="green">
                <v-icon color="white">fas fa-file-csv</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">Carga Masiva de Registros</v-list-item-title>
                <v-list-item-subtitle>Carga masiva de registros SIVIGILA.</v-list-item-subtitle>
              </v-list-item-content>
              <cargador-seguimientos-sivigila></cargador-seguimientos-sivigila>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
		</v-row>
	</v-container>
</template>

<script>
	const CargadorSeguimientos = () => import('Views/complementos/CargadorSeguimientos')
  const CargadorSeguimientosSivigila = () => import('Views/complementos/CargadorRegistrosSIVIGILA')
	export default {
		components: {
			CargadorSeguimientos,
      CargadorSeguimientosSivigila
		},
		data: () => ({
      loadingAlerta: false,
			loadingGenerales: false
		}),
		methods: {
			getAjustesGenerales () {
				this.loadingGenerales = true
				this.$store.dispatch('reloadStorage')
			},
      setAlerta () {
				this.loadingAlerta = true
				this.$store.dispatch('setVersionFirebase').then(() => {
          this.loadingAlerta = false
        })
			}
		}
	}
</script>