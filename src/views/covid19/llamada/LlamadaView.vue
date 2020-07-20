<template>
	<v-container fluid>
		<page-title-bar title="Llamadas"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<llamadas></llamadas>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>

	import {mapGetters} from 'vuex'

	const Llamadas = () => import('Views/covid19/llamada/Llamadas')
	export default {
		components: {
			Llamadas
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