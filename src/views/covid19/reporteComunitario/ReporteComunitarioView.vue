<template>
	<v-container fluid>
		<page-title-bar title="Reportes Comunitarios"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<reportes-comunitarios></reportes-comunitarios>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>

	import {mapGetters} from 'vuex'

	const ReportesComunitarios = () => import('Views/covid19/reporteComunitario/ReportesComunitarios')
	export default {
		components: {
			ReportesComunitarios
		},
		computed: {
			...mapGetters([
				'roles'
			]),
			permisos () {
				return this.$store.getters.getPermissionModule('covid')
			}
		},
		data: () => ({
			loading: false
		})
	}
</script>

<style>

</style>