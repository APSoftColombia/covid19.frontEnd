<template>
	<v-container fluid>
		<page-title-bar title="Hogares"></page-title-bar>
		<v-row>
			<v-col cols="12">
				<v-card>
					<hogares></hogares>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	const Hogares = () => import('Views/covid19/hogar/Hogares')
	export default {
		components: {
			Hogares
		}
	}
</script>

<style>

</style>