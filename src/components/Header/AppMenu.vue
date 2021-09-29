<template>
	<div>
		<v-dialog v-model="dialogMenu" fullscreen hide-overlay transition="dialog-bottom-transition">
			<template v-slot:activator="{ on }">
				<v-btn icon large @click.stop="dialogMenu = true" class="mx-2 v-step-1">
					<!--				<i class="zmdi grey&#45;&#45;text zmdi-hc-fw font-lg zmdi-apps"></i>-->
					<v-icon class="grey--text">mdi-apps</v-icon>
				</v-btn>
			</template>
			<v-card>
				<v-toolbar>
					<v-toolbar-title>MENÚ</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogMenu = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-toolbar>
        <template v-if="itemsMenu && itemsMenu.length">
          <template v-if="datosEmpresa && [datosEmpresa.covid_activo === '1', datosEmpresa.aps_activo === '1', datosEmpresa.demanda_inducida_activo === '1'].filter(x => x).length > 1">
            <v-card-text v-if="datosEmpresa.covid_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'covid').length">
              <v-subheader class="font-weight-bold">ESTRATEGIA PRASS COVID-19</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'covid')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.covid_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'reportesIndicadoresCovid').length">
              <v-subheader class="font-weight-bold">REPORTES E INDICADORES PRASS COVID-19</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'reportesIndicadoresCovid')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.laboratorio_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'labSP').length">
              <v-subheader class="font-weight-bold">LABORATORIO DEPARTAMENTAL DE SALUD PÚBLICA</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'labSP')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.aps_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'aps').length">
              <v-subheader class="font-weight-bold">RIESGO CARDIOVASCULAR</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'aps')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.centro_regulador === '1' && itemsMenu.filter(x => x.typeRoute === 'centroRegulador').length">
              <v-subheader class="font-weight-bold">CENTRO REGULADOR</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'centroRegulador')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.aps_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'reportesIndicadoresRCV').length">
              <v-subheader class="font-weight-bold">REPORTES E INDICADORES RIESGO CARDIO VASCULAR</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'reportesIndicadoresRCV')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="datosEmpresa.demanda_inducida_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'demandaInducida').length">
              <v-subheader class="font-weight-bold">DEMANDA INDUCIDA</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'demandaInducida')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
			<v-card-text v-if="datosEmpresa.powerbi_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'powerbi').length">
              <v-subheader class="font-weight-bold">POWER BI</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'powerbi')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
			<v-card-text v-if="datosEmpresa.importadores_activo === '1' && itemsMenu.filter(x => x.typeRoute === 'importadores').length">
              <v-subheader class="font-weight-bold">IMPORTADORES</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'importadores')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'seguridad').length">
              <v-subheader class="font-weight-bold">SEGURIDAD</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'seguridad')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'general').length">
              <v-subheader class="font-weight-bold">GENERAL</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'general')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
          </template>
          <template v-else>
            <cards
                :items-menu="itemsMenu.filter(x => x.typeRoute === (datosEmpresa.covid_activo === '1' ? 'covid' : datosEmpresa.aps_activo === '1' ? 'aps' : 'demandaInducida') || x.typeRoute === 'general')"
                @clickitem="dialogMenu = false"
                @goruta="val => goRuta(val)"
            />
          </template>
        </template>
			</v-card>
		</v-dialog>
		<confirmation-dialog
				ref="confirmation"
				:heading="dialog.heading"
				:message="dialog.message"
				:loading="dialog.loading"
				:color-confirm="''"
				color-cancel="error"
				@confirm="confirmCerrar"
		></confirmation-dialog>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
  import CardsList from './appMenu/CardsList'
  import Cards from './appMenu/Cards'
  export default {
  name: 'algo',
  data: () => ({
			dialogMenu: false,
			dialog: {
				heading: '',
				message: '',
				loading: false,
				registro: null,
				btnColor: 'warning'
			}
		}),
    components: {
    CardsList,
      Cards
    },
		computed: {
			...mapGetters([
					'itemsMenu',
					'encuestaEnCurso',
          'datosEmpresa'
			])
		},
		methods: {
			goRuta (item) {
				if (this.encuestaEnCurso) {
					this.dialog.heading = 'Cerrar encuesta en curso'
					this.dialog.message = `La encuesta se cerrará y los datos no guardados se perderan.`
					this.dialog.registro = this.clone(item)
					this.$refs.confirmation.open()
				}
			},
			confirmCerrar () {
				this.$router.push({name: this.dialog.registro.routeName})
				this.dialogMenu = false
				this.$refs.confirmation.close()
				this.$store.commit('assignEncuestaEnCurso', false)
			}
		}
	}
</script>