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
          <template v-if="datosEmpresa && datosEmpresa.covid_activo === '1' && datosEmpresa.aps_activo === '1'">
            <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'covid').length">
              <v-subheader class="font-weight-bold">COVID-19</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'covid')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'aps').length">
              <v-subheader class="font-weight-bold">APS</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'aps')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
            <v-card-text v-if="itemsMenu.filter(x => x.typeRoute === 'general').length">
              <v-subheader class="font-weight-bold">GENERAL</v-subheader>
              <cards-list  :items-menu="itemsMenu.filter(x => x.typeRoute === 'general')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards-list>
            </v-card-text>
          </template>
          <template v-else>
            <cards :items-menu="itemsMenu.filter(x => x.typeRoute === (datosEmpresa.covid_activo === '1' ? 'covid' : 'aps') || x.typeRoute === 'general')" @clickitem="dialogMenu = false" @goruta="val => goRuta(val)"></cards>
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