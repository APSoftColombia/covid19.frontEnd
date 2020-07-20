<template>
	<v-container fluid>
		<page-title-bar title="Covid-19">
			<template slot="actions">
				<v-menu offset-y origin="right top" left content-class="notification-dropdown" close-on-click transition="slide-y-transition" nudge-top="0">
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" color="deep-purple" class="white--text">
							<v-icon left>fas fa-download</v-icon>
							Complementos
						</v-btn>
					</template>
					<div class="dropdown-content">
						<v-list class="dropdown-list">
							<v-list-item @click="getAjustes">
								<v-icon left color="warning">fas fa-cogs</v-icon>
								<span>Ajustes Generales</span>
							</v-list-item>
<!--							<v-list-item @click="getAfiliados">-->
<!--								<v-icon left color="success">mdi-account-group</v-icon>-->
<!--								<span>Afiliados</span>-->
<!--							</v-list-item>-->
						</v-list>
					</div>
				</v-menu>
			</template>
		</page-title-bar>
		<v-row>
			<v-col cols="12" v-if="permisos.tamizajeVer || permisos.reporteComunitarioVer || permisos.llamadaVer || permisos.vehiculoVer">
				<v-card>
					<v-tabs
							id="tabsCovid19"
							v-model="tab"
							fixed-tabs
							right
							background-color="transparent"
							icons-and-text
							show-arrows
					>
						<v-tabs-slider></v-tabs-slider>
						<v-tab
								v-if="permisos.tamizajeVer"
								href="#tab-1"
								:class="$vuetify.breakpoint.mdAndDown ? 'caption' : ''"
						>
							<template v-if="$vuetify.breakpoint.mdAndUp">ERP - Encuestas de Riesgo Poblacional</template>
							<v-tooltip top v-else>
								<template v-slot:activator="{on}">
									<span v-on="on" class="border-bottom-1">ERP</span>
								</template>
								<span>Encuestas de Riesgo Poblacional</span>
							</v-tooltip>
							<v-icon>fas fa-file-medical</v-icon>
						</v-tab>
						<v-tab
								v-if="permisos.reporteComunitarioVer"
								href="#tab-2"
						>
							Reportes {{$vuetify.breakpoint.smAndUp ? 'Comunitarios' : ''}}
							<v-icon>fas fa-file-prescription</v-icon>
						</v-tab>
						<v-tab
								v-if="permisos.autopsiaVer"
								href="#tab-5"
						>
							Autopsias
							<icon-base
									width="30"
									height="30"
									view-box="0 0 528.000000 518.000000"
									icon-name="autopsia"
							>
								<autopsia
										:fill="tab === 'tab-5' ? '#5d92f4' : 'rgba(0, 0, 0, 0.54)'"
										translatex="-100.00000"
										translatey="510.00000"
								></autopsia>
							</icon-base>
						</v-tab>
						<v-tab
								v-if="permisos.llamadaVer"
								href="#tab-3"
						>
							Llamadas
							<v-icon>fas fa-phone-alt</v-icon>
						</v-tab>
						<v-tab
								v-if="permisos.vehiculoVer"
								href="#tab-4"
						>
							Vehiculos
							<v-icon>mdi-car-multiple</v-icon>
						</v-tab>
					</v-tabs>
					<v-divider class="mt-0"></v-divider>
					<v-tabs-items v-model="tab" touchless>
						<v-tab-item
								v-if="permisos.tamizajeVer"
								value="tab-1"
						>
							<v-card flat>
								<tamizajes-light v-if="vistaLight"></tamizajes-light>
								<tamizajes v-else></tamizajes>
							</v-card>
						</v-tab-item>
						<v-tab-item
								v-if="permisos.reporteComunitarioVer"
								value="tab-2"
						>
							<v-card flat>
								<reportes-comunitarios></reportes-comunitarios>
							</v-card>
						</v-tab-item>
						<v-tab-item
								v-if="permisos.autopsiaVer"
								value="tab-5"
						>
							<v-card flat>
								<autopsias></autopsias>
							</v-card>
						</v-tab-item>
						<v-tab-item
								v-if="permisos.llamadaVer"
								value="tab-3"
						>
							<v-card flat>
								<llamadas></llamadas>
							</v-card>
						</v-tab-item>
						<v-tab-item
								v-if="permisos.vehiculoVer"
								value="tab-4"
						>
							<v-card flat>
								<vehiculos></vehiculos>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>

	import {mapGetters} from "vuex";

	const Tamizajes = () => import('./tamizaje/Tamizajes')
	const TamizajesLight = () => import('./tamizaje/TamizajesLight')
	const ReportesComunitarios = () => import('./reporteComunitario/ReportesComunitarios')
	const Llamadas = () => import('./llamada/Llamadas')
	const Vehiculos = () => import('./vehiculo/Vehiculos')
	const Autopsias = () => import('./autopsia/Autopsias')
	export default {
		components: {
			Tamizajes,
			TamizajesLight,
			ReportesComunitarios,
			Llamadas,
			Vehiculos,
			Autopsias
		},
		computed: {
			...mapGetters([
				'roles'
			]),
			permisos () {
				return this.$store.getters.getPermissionModule('covid')
			},
			vistaLight () {
				return this && this.roles && this.roles.length && [5,6].find(x => this.roles.find(z => z.id === x))
			}
		},
		data: () => ({
			tab: null,
			loading: false
		}),
		methods: {
			getAjustes () {
				this.$store.dispatch('reloadStorage')
				// window.open(window.location, '_blank');
				// this.loading = true
				// this.$store.dispatch('getAjustesGenerales', true).then(() => {
				// 	this.loading = false
				// })
			}
			// getAfiliados () {
			// 	this.loading = true
			// 	this.$store.dispatch('getAllAfiliados', true).then(() => {
			// 		this.loading = false
			// 	})
			// }
		}
	}
</script>

<style>

</style>