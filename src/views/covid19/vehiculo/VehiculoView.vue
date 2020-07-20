<template>
	<v-container fluid>
		<page-title-bar title="Vehículos"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<vehiculos></vehiculos>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>

	import {mapGetters} from 'vuex'

	const Vehiculos = () => import('Views/covid19/vehiculo/Vehiculos')
	export default {
		components: {
			Vehiculos
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