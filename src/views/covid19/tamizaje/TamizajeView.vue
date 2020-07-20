<template>
	<v-container fluid>
		<page-title-bar title="Encuestas de Riesgo Poblacional"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<tamizajes-light v-if="isCaller"></tamizajes-light>
					<tamizajes v-else></tamizajes>
				</v-card>
			</v-col>
		</v-row>
		<app-section-loader :status="loading"></app-section-loader>
	</v-container>
</template>

<script>
	const Tamizajes = () => import('Views/covid19/tamizaje/Tamizajes')
	const TamizajesLight = () => import('Views/covid19/tamizaje/TamizajesLight')
	export default {
		components: {
			Tamizajes,
			TamizajesLight
		},
		data: () => ({
			loading: false
		})
	}
</script>

<style>

</style>