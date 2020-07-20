<template>
	<v-container fluid>
		<page-title-bar title="Autopsias"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<autopsias></autopsias>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>

	import {mapGetters} from 'vuex'
	const Autopsias = () => import('Views/covid19/autopsia/Autopsias')
	export default {
		components: {
			Autopsias
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