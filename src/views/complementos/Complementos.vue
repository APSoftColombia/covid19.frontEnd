<template>
	<v-container fluid>
		<page-title-bar title="Complementos"></page-title-bar>
		<v-row>
      <v-col cols="12" v-if="esSuperAdmin">
        <v-card>
          <v-list two-line>
            <v-list-item>
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
						<v-list-item>
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
						<v-list-item>
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
      <!--
      <v-col cols="12" v-if="esSuperAdmin || esCovidAdmin">
        <v-card>
          <v-list two-line>
            <v-list-item>
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
      -->
      <v-col cols="12" v-if="datosEmpresa && datosEmpresa.url_pwa">
        <v-card>
          <v-list two-line>
            <v-list-item>
              <v-list-item-avatar color="warning">
                <v-icon color="white">mdi-application</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">APSOFT PWA</v-list-item-title>
                <v-list-item-subtitle>Aplicación PWA para Trabajo OffLine</v-list-item-subtitle>
              </v-list-item-content>
              <p id="linkpwa" v-show="false">{{ datosEmpresa.url_pwa }}</p>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn icon x-large color="primary" v-on="on" @click.stop="copiarEnlace">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <span>Copiar Enlace</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn icon x-large color="primary" v-on="on" :href="datosEmpresa.url_pwa" target="_blank">
                    <v-icon>mdi-application-import</v-icon>
                  </v-btn>
                </template>
                <span>Ingresar</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
          <v-snackbar
              :timeout="700"
              v-model="enlaceCopiado"
              absolute
              rounded="pill"
              bottom
          >
            <span class="text-center">Enlace Copiado</span>
          </v-snackbar>
        </v-card>
      </v-col>

      <v-col cols="12">
				<v-card>
					<v-list two-line>
						<v-list-item>
							<v-list-item-avatar color="primary">
								<v-icon color="white">mdi-auto-fix</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Creacion y Configuracion de cargadores</v-list-item-title>
								<v-list-item-subtitle>Crea y configura los elementos necesarios para un Cargador masivo de informacion</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-tooltip left>
									<template v-slot:activator="{ on }">
										<v-btn icon x-large color="primary" @click.stop="openConfigCargador" v-on="on">
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
      <configuracion-cargador ref="configCargador"></configuracion-cargador>
		</v-row>
	</v-container>
</template>

<script>
	import { mapGetters } from 'vuex'
  const CargadorSeguimientos = () => import('Views/complementos/CargadorSeguimientos')
  const CargadorSeguimientosSivigila = () => import('Views/complementos/CargadorRegistrosSIVIGILA')
  const ConfiguracionCargador = () => import('Views/complementos/ConfiguracionCargador')
	export default {
		components: {
			CargadorSeguimientos,
      CargadorSeguimientosSivigila,
      ConfiguracionCargador
		},
		data: () => ({
      enlaceCopiado: false,
      loadingAlerta: false,
			loadingGenerales: false
		}),
    computed: {
      ...mapGetters([
        'datosEmpresa'
      ])
    },
    methods: {
      copiarEnlace () {
        const aux = document.createElement('input')
        aux.setAttribute("value", document.getElementById('linkpwa').innerHTML);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand('copy')
        document.body.removeChild(aux)
        this.enlaceCopiado = true
      },
			getAjustesGenerales () {
				this.loadingGenerales = true
				this.$store.dispatch('reloadStorage')
			},
      setAlerta () {
				this.loadingAlerta = true
				this.$store.dispatch('setVersionFirebase').then(() => {
          this.loadingAlerta = false
        })
      },
      openConfigCargador() {
        this.$refs.configCargador.open();
      }
		}
	}
</script>