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
				<v-row no-gutters>
					<template v-for="(item, index) in itemsMenu">
						<v-col
								cols="12"
								sm="6"
								md="4"
								lg="3"
								xl="2"
								:key="index"
						>
							<v-hover v-slot:default="{ hover }">
								<v-card
										:to="encuestaEnCurso ? null : {name: item.routeName}"
										@click.stop="encuestaEnCurso ? goRuta(item) : dialogMenu = false"
										tile
										:color="item.color"
										:elevation="hover ? 20 : 1"
										:class="{ 'on-hover': hover }"
								>
									<v-card-text class="text-center title white--text" style="min-height: 226px !important; max-height: 226px !important;">
										<v-icon size="140" v-if="!item.personalIcon">{{item.icon}}</v-icon>
										<template v-else>
											<icon-base
													v-if="item.personalIcon === 'Autopsias'"
													width="131"
													height="131"
													view-box="0 0 528.000000 518.000000"
													icon-name="autopsia"
											>
												<autopsia
														:fill="'rgba(255, 255, 255, 1)'"
														translatex="-100.00000"
														translatey="510.00000"
												></autopsia>
											</icon-base>
										</template>
										<br/>
										<div :class="item.subtitle ? '' : 'mt-4 mb-1'">{{item.title}}</div>
										<div class="caption">{{item.subtitle}}</div>
									</v-card-text>
								</v-card>
							</v-hover>
						</v-col>
					</template>
				</v-row>
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
	export default {
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
		computed: {
			...mapGetters([
					'itemsMenu',
					'encuestaEnCurso'
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
			},
		}
	}
</script>