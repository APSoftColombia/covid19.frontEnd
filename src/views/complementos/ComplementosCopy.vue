<template>
	<v-container fluid>
		<page-title-bar title="Complementos"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-list two-line>
						<v-list-item @click="flag = false">
							<v-list-item-avatar color="warning">
								<v-icon color="white">mdi-format-list-bulleted-square</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Ajustes generales</v-list-item-title>
								<v-list-item-subtitle>Centros poblados, Tipos de sangre, Tipos de documento, estados civiles, causales de visitas fallidas</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-tooltip left>
									<template v-slot:activator="{ on }">
										<v-btn icon large color="primary" @click.stop="getAjustesGenerales" v-on="on">
											<v-icon large>mdi-download-multiple</v-icon>
										</v-btn>
									</template>
									<span>Descargar ajustes generales</span>
								</v-tooltip>
							</v-list-item-action>
						</v-list-item>
						<v-divider class="ma-0 pa-0"></v-divider>
						<v-list-item @click="flag = false">
							<v-list-item-avatar color="success">
								<v-icon color="white">mdi-account-group</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Afiliados</v-list-item-title>
								<v-list-item-subtitle>Listado de afiliados</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-tooltip left>
									<template v-slot:activator="{ on }">
										<v-btn icon large color="primary" @click.stop="getAfiliados" v-on="on">
											<v-icon large>mdi-download-multiple</v-icon>
										</v-btn>
									</template>
									<span>Descargar afiliados</span>
								</v-tooltip>
							</v-list-item-action>
						</v-list-item>
						<v-divider class="ma-0 pa-0"></v-divider>
						<v-list-item @click="flag = false">
							<v-list-item-avatar color="error">
								<v-icon color="white">mdi-newspaper</v-icon>
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-title class="font-weight-bold">Formularios</v-list-item-title>
								<v-list-item-subtitle>Formularios habilitados</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-tooltip left>
									<template v-slot:activator="{ on }">
										<v-btn icon large color="primary" @click.stop="getFormularios" v-on="on">
											<v-icon large>mdi-download-multiple</v-icon>
										</v-btn>
									</template>
									<span>Descargar formularios</span>
								</v-tooltip>
							</v-list-item-action>
						</v-list-item>
						<v-divider class="ma-0 pa-0"></v-divider>
					</v-list>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
	export default {
		data: () => ({
			flag: false,
			loading: false
		}),
		methods: {
			getAfiliados () {
				this.loading = true
				this.$store.dispatch('getAllAfiliados', true).then(() => {
					this.loading = false
				})
			},
			getFuentesDatos () {
				this.loading = true
				this.$store.dispatch('getFuentesDatos').then(response => {
					this.loading = false
					if (!response) this.$router.go(-1)
				})
			},
			getAjustesGenerales () {
				this.loading = true
				this.$store.dispatch('getDatosEmpresa').then(response => {
					if (response) {
						this.$store.dispatch('getAjustesGenerales', true).then(() => {
							this.loading = false
						})
					} else {
						this.loading = false
					}
				})
			},
			getFormularios () {
				this.loading = true
				this.$store.dispatch('getFormularios').then(() => {
					this.loading = false
				})
			}
		}
	}
</script>